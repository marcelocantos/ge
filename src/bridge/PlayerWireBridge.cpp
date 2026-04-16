// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/PlayerWireBridge.h>
#include <ge/VideoDecoder.h>
#include <ge/WebSocketClient.h>

#include <spdlog/spdlog.h>

#include <cstring>
#include <mutex>
#include <vector>

namespace ge {

namespace {

// Parse AVCC-format NAL units from encoded frame data.
// AVCC format: [4-byte big-endian length][NAL body] repeated.
// For keyframes the encoder prepends SPS and PPS NAL units.
// NAL type is (first byte of NAL body) & 0x1F:
//   7 = SPS, 8 = PPS, 5 = IDR (keyframe), 1 = non-IDR (P-frame)
struct AVCCParser {
    std::vector<uint8_t> sps, pps;
    bool paramsDirty = false;

    std::vector<std::pair<const uint8_t*, size_t>>
    parse(const uint8_t* data, size_t size) {
        std::vector<std::pair<const uint8_t*, size_t>> frameNals;
        size_t offset = 0;
        while (offset + 4 <= size) {
            uint32_t nalLen = (uint32_t(data[offset]) << 24)
                            | (uint32_t(data[offset+1]) << 16)
                            | (uint32_t(data[offset+2]) << 8)
                            | uint32_t(data[offset+3]);
            offset += 4;
            if (nalLen == 0 || offset + nalLen > size) break;

            const uint8_t* nalBody = data + offset;
            uint8_t nalType = nalBody[0] & 0x1F;

            if (nalType == 7) {
                if (sps.size() != nalLen || std::memcmp(sps.data(), nalBody, nalLen) != 0) {
                    sps.assign(nalBody, nalBody + nalLen);
                    paramsDirty = true;
                }
            } else if (nalType == 8) {
                if (pps.size() != nalLen || std::memcmp(pps.data(), nalBody, nalLen) != 0) {
                    pps.assign(nalBody, nalBody + nalLen);
                    paramsDirty = true;
                }
            } else {
                frameNals.emplace_back(nalBody, nalLen);
            }
            offset += nalLen;
        }
        return frameNals;
    }

    bool hasParams() const { return !sps.empty() && !pps.empty(); }
};

} // namespace

struct PlayerWireBridge::Impl {
    Config cfg;
    std::shared_ptr<WsConnection> conn;
    std::unique_ptr<VideoDecoder> decoder;
    AVCCParser avcc;

    // Frame buffer, written from decoder callback (VT thread), read from pump.
    std::mutex frameMutex;
    DecodedFrame pending;
    bool pendingReady = false;

    PumpStats stats;
};

PlayerWireBridge::PlayerWireBridge(Config config)
    : i_(std::make_unique<Impl>()) {
    i_->cfg = std::move(config);
}

PlayerWireBridge::~PlayerWireBridge() = default;

bool PlayerWireBridge::connect(wire::SessionConfig& outConfig) {
    const std::string path = "/ws/wire?preference=" + i_->cfg.serverName
                           + "&name=" + i_->cfg.serverName;
    i_->conn = ge::connectWebSocket(i_->cfg.host, i_->cfg.port, path,
                                    i_->cfg.connectTimeoutMs);
    if (!i_->conn || !i_->conn->isOpen()) {
        SPDLOG_ERROR("PlayerWireBridge: failed to connect to ged");
        return false;
    }
    SPDLOG_INFO("PlayerWireBridge: connected to ged");

    // Wait for SessionConfig (skip unrelated housekeeping messages).
    while (i_->conn->isOpen()) {
        std::vector<char> msg;
        if (!i_->conn->recvBinary(msg) || msg.size() < 8) return false;
        uint32_t magic = 0;
        std::memcpy(&magic, msg.data(), 4);
        if (magic == wire::kSessionConfigMagic &&
            msg.size() >= sizeof(wire::MessageHeader) + sizeof(wire::SessionConfig)) {
            std::memcpy(&outConfig,
                        msg.data() + sizeof(wire::MessageHeader),
                        sizeof(wire::SessionConfig));
            return true;
        }
    }
    return false;
}

bool PlayerWireBridge::sendDeviceInfo(const wire::DeviceInfo& devInfo) {
    if (!i_->conn || !i_->conn->isOpen()) return false;
    wire::MessageHeader hdr{};
    hdr.magic = wire::kDeviceInfoMagic;
    hdr.length = sizeof(wire::DeviceInfo);
    std::vector<uint8_t> msg(sizeof(hdr) + sizeof(devInfo));
    std::memcpy(msg.data(), &hdr, sizeof(hdr));
    std::memcpy(msg.data() + sizeof(hdr), &devInfo, sizeof(devInfo));
    i_->conn->sendBinary(msg.data(), msg.size());

    // Lazily build the decoder on first DeviceInfo send so the frame
    // callback captures a stable `this`.
    if (!i_->decoder) {
        i_->decoder = std::make_unique<VideoDecoder>(
            [this](const uint8_t* bgra, int w, int h, size_t bpr) {
                std::lock_guard<std::mutex> lock(i_->frameMutex);
                size_t total = bpr * h;
                i_->pending.bgra.assign(bgra, bgra + total);
                i_->pending.width = w;
                i_->pending.height = h;
                i_->pending.bytesPerRow = bpr;
                i_->pendingReady = true;
            });
    }
    return true;
}

void PlayerWireBridge::sendEvent(const SDL_Event& e) {
    if (!i_->conn || !i_->conn->isOpen()) return;
    wire::MessageHeader hdr{};
    hdr.magic = wire::kSdlEventMagic;
    hdr.length = sizeof(SDL_Event);
    std::vector<uint8_t> msg(sizeof(hdr) + sizeof(SDL_Event));
    std::memcpy(msg.data(), &hdr, sizeof(hdr));
    std::memcpy(msg.data() + sizeof(hdr), &e, sizeof(SDL_Event));
    i_->conn->sendBinary(msg.data(), msg.size());
}

bool PlayerWireBridge::pump() {
    if (!i_->conn) return false;
    i_->stats = {};
    while (i_->conn->isOpen() && i_->conn->available() > 0) {
        std::vector<char> data;
        if (!i_->conn->recvBinary(data) || data.size() < 8) break;

        uint32_t magic = 0;
        std::memcpy(&magic, data.data(), 4);
        if (magic == wire::kVideoStreamMagic) {
            uint32_t length = 0;
            std::memcpy(&length, data.data() + 4, 4);
            if (data.size() < 8 + length) continue;
            uint32_t seq = 0;
            std::memcpy(&seq, data.data() + 9, 4);
            const uint8_t* avccData =
                reinterpret_cast<const uint8_t*>(data.data()) + 13;
            size_t avccSize = length - 5;

            auto frameNals = i_->avcc.parse(avccData, avccSize);
            if (i_->decoder && i_->avcc.paramsDirty && i_->avcc.hasParams()) {
                i_->decoder->setParameterSets(
                    i_->avcc.sps.data(), i_->avcc.sps.size(),
                    i_->avcc.pps.data(), i_->avcc.pps.size());
                i_->avcc.paramsDirty = false;
                SPDLOG_INFO("PlayerWireBridge: decoder initialized with SPS/PPS");
            }
            if (i_->decoder) {
                static const uint8_t startCode[] = {0x00, 0x00, 0x00, 0x01};
                for (auto& [nalBody, nalSize] : frameNals) {
                    uint8_t nalType = nalBody[0] & 0x1F;
                    if (nalType != 1 && nalType != 5) continue;
                    std::vector<uint8_t> annexB(4 + nalSize);
                    std::memcpy(annexB.data(), startCode, 4);
                    std::memcpy(annexB.data() + 4, nalBody, nalSize);
                    i_->decoder->decode(annexB.data(), annexB.size());
                }
            }
            i_->stats.framesThisTick++;
            i_->stats.lastSeq = seq;
        } else if (magic == wire::kServerAssignedMagic) {
            SPDLOG_INFO("PlayerWireBridge: server assigned");
        } else if (magic == wire::kSessionEndMagic) {
            SPDLOG_INFO("PlayerWireBridge: session ended");
        }
        // Late SessionConfig or unknown magics are ignored.
    }
    return i_->conn->isOpen();
}

bool PlayerWireBridge::pollFrame(DecodedFrame& out) {
    std::lock_guard<std::mutex> lock(i_->frameMutex);
    if (!i_->pendingReady) return false;
    out = std::move(i_->pending);
    i_->pending = {};
    i_->pendingReady = false;
    return true;
}

PlayerWireBridge::PumpStats PlayerWireBridge::lastPumpStats() const {
    return i_->stats;
}

bool PlayerWireBridge::isOpen() const {
    return i_->conn && i_->conn->isOpen();
}

void PlayerWireBridge::close() {
    if (i_->decoder) i_->decoder->flush();
    if (i_->conn) i_->conn->close();
}

} // namespace ge
