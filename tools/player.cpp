// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

// H.264 video player — receives encoded frames from ged, decodes via
// VideoToolbox, and renders to an SDL3 window.

#include <SDL3/SDL.h>
#include <SDL3/SDL_main.h>
#include <spdlog/spdlog.h>

#include <ge/Protocol.h>
#include <ge/VideoDecoder.h>
#include <ge/WebSocketClient.h>

#include <atomic>
#include <cstring>
#include <mutex>
#include <vector>

// Parse AVCC-format NAL units from encoded frame data.
// AVCC format: [4-byte big-endian length][NAL body] repeated.
// For keyframes the encoder prepends SPS and PPS NAL units.
// NAL type is (first byte of NAL body) & 0x1F:
//   7 = SPS, 8 = PPS, 5 = IDR (keyframe), 1 = non-IDR (P-frame)
struct AVCCParser {
    std::vector<uint8_t> sps, pps;
    bool paramsDirty = false;

    // Parse all NAL units from an AVCC stream. Returns frame NALs
    // (non-parameter-set NALs) as (pointer, size) pairs into the
    // original data.
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

            if (nalType == 7) { // SPS
                if (sps.size() != nalLen || std::memcmp(sps.data(), nalBody, nalLen) != 0) {
                    sps.assign(nalBody, nalBody + nalLen);
                    paramsDirty = true;
                }
            } else if (nalType == 8) { // PPS
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

int main(int, char*[]) {
    SPDLOG_INFO("H.264 player starting");

    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SPDLOG_ERROR("SDL_Init failed: {}", SDL_GetError());
        return 1;
    }

    // Window sized to match server render (820x1180) — will be resizable
    int winW = 820, winH = 1180;
    SDL_Window* window = SDL_CreateWindow(
        "GE Player", winW, winH,
        SDL_WINDOW_RESIZABLE);
    if (!window) {
        SPDLOG_ERROR("SDL_CreateWindow failed: {}", SDL_GetError());
        return 1;
    }

    SDL_Renderer* renderer = SDL_CreateRenderer(window, nullptr);
    if (!renderer) {
        SPDLOG_ERROR("SDL_CreateRenderer failed: {}", SDL_GetError());
        return 1;
    }

    // Texture for decoded video frames (created on first decoded frame)
    SDL_Texture* videoTex = nullptr;
    int texW = 0, texH = 0;

    // Decoded frame buffer (written by decoder callback, read by render loop)
    std::mutex frameMutex;
    std::vector<uint8_t> decodedFrame;
    int frameW = 0, frameH = 0;
    size_t frameBytesPerRow = 0;
    bool frameReady = false;

    ge::VideoDecoder decoder([&](const uint8_t* bgra, int w, int h, size_t bpr) {
        std::lock_guard<std::mutex> lock(frameMutex);
        size_t totalBytes = bpr * h;
        decodedFrame.resize(totalBytes);
        std::memcpy(decodedFrame.data(), bgra, totalBytes);
        frameW = w;
        frameH = h;
        frameBytesPerRow = bpr;
        frameReady = true;
    });

    AVCCParser avccParser;

    // Connect to ged as a player
    auto conn = ge::connectWebSocket("localhost", 42069, "/ws/wire?name=yourworld", 2000);
    if (!conn || !conn->isOpen()) {
        SPDLOG_ERROR("Failed to connect to ged");
        SDL_DestroyRenderer(renderer);
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }
    SPDLOG_INFO("Connected to ged");

    // Send DeviceInfo: [MessageHeader][DeviceInfo struct]
    // ged expects this exact layout as the first binary frame.
    wire::MessageHeader hdr{};
    hdr.magic = wire::kDeviceInfoMagic;
    hdr.length = sizeof(wire::DeviceInfo);
    wire::DeviceInfo devInfo{};
    devInfo.width = winW;
    devInfo.height = winH;
    devInfo.pixelRatio = 1;
    devInfo.deviceClass = 3; // desktop

    std::vector<uint8_t> devInfoMsg(sizeof(hdr) + sizeof(devInfo));
    std::memcpy(devInfoMsg.data(), &hdr, sizeof(hdr));
    std::memcpy(devInfoMsg.data() + sizeof(hdr), &devInfo, sizeof(devInfo));
    conn->sendBinary(devInfoMsg.data(), devInfoMsg.size());
    SPDLOG_INFO("DeviceInfo sent ({}x{})", winW, winH);

    uint64_t frameCount = 0;
    bool running = true;

    while (running) {
        // Process SDL events
        SDL_Event e;
        while (SDL_PollEvent(&e)) {
            if (e.type == SDL_EVENT_QUIT) {
                running = false;
            }
        }

        // Receive messages from ged (non-blocking)
        while (conn->isOpen() && conn->available() > 0) {
            std::vector<char> data;
            if (!conn->recvBinary(data) || data.size() < 8) break;

            // Parse message header
            uint32_t magic = 0;
            std::memcpy(&magic, data.data(), 4);

            if (magic == wire::kVideoStreamMagic) {
                uint32_t length = 0;
                std::memcpy(&length, data.data() + 4, 4);

                if (data.size() < 8 + length) {
                    SPDLOG_WARN("Truncated video frame: {} < {}", data.size(), 8 + length);
                    continue;
                }

                // flags: bit 0 = keyframe (informational, decoder detects from NAL type)
                (void)data[8];
                const uint8_t* avccData = reinterpret_cast<const uint8_t*>(data.data()) + 9;
                size_t avccSize = length - 1;

                // Parse AVCC NAL units
                auto frameNals = avccParser.parse(avccData, avccSize);

                // Initialize decoder with SPS/PPS if new params arrived
                if (avccParser.paramsDirty && avccParser.hasParams()) {
                    decoder.setParameterSets(
                        avccParser.sps.data(), avccParser.sps.size(),
                        avccParser.pps.data(), avccParser.pps.size());
                    avccParser.paramsDirty = false;
                    SPDLOG_INFO("Decoder initialized with SPS/PPS");
                }

                // Decode each frame NAL (as Annex B: prepend start code)
                static const uint8_t startCode[] = {0x00, 0x00, 0x00, 0x01};
                for (auto& [nalBody, nalSize] : frameNals) {
                    uint8_t nalType = nalBody[0] & 0x1F;
                    // Skip non-VCL NALs (SEI, AUD, etc.) — only decode slices
                    if (nalType != 1 && nalType != 5) continue;
                    // Build Annex B NAL: start code + body
                    std::vector<uint8_t> annexB(4 + nalSize);
                    std::memcpy(annexB.data(), startCode, 4);
                    std::memcpy(annexB.data() + 4, nalBody, nalSize);
                    decoder.decode(annexB.data(), annexB.size());
                }

                frameCount++;
                if (frameCount % 300 == 0) {
                    SPDLOG_INFO("Decoded {} frames", frameCount);
                }
            } else if (magic == wire::kServerAssignedMagic) {
                SPDLOG_INFO("Server assigned");
            } else if (magic == wire::kSessionEndMagic) {
                SPDLOG_INFO("Session ended");
            }
        }

        // Render the latest decoded frame
        {
            std::lock_guard<std::mutex> lock(frameMutex);
            if (frameReady) {
                // (Re)create texture if dimensions changed
                if (!videoTex || texW != frameW || texH != frameH) {
                    if (videoTex) SDL_DestroyTexture(videoTex);
                    videoTex = SDL_CreateTexture(renderer,
                        SDL_PIXELFORMAT_BGRA32,
                        SDL_TEXTUREACCESS_STREAMING,
                        frameW, frameH);
                    texW = frameW;
                    texH = frameH;
                    SPDLOG_INFO("Video texture created: {}x{}", texW, texH);
                }

                // Upload decoded pixels
                SDL_UpdateTexture(videoTex, nullptr,
                    decodedFrame.data(),
                    static_cast<int>(frameBytesPerRow));
                frameReady = false;
            }
        }

        SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
        SDL_RenderClear(renderer);
        if (videoTex) {
            // Scale to fit window while preserving aspect ratio
            int ww, wh;
            SDL_GetWindowSize(window, &ww, &wh);
            float scaleX = float(ww) / float(texW);
            float scaleY = float(wh) / float(texH);
            float scale = std::min(scaleX, scaleY);
            float dstW = texW * scale;
            float dstH = texH * scale;
            SDL_FRect dst = {
                (ww - dstW) / 2.0f,
                (wh - dstH) / 2.0f,
                dstW, dstH
            };
            SDL_RenderTexture(renderer, videoTex, nullptr, &dst);
        }
        SDL_RenderPresent(renderer);
    }

    decoder.flush();
    if (conn) conn->close();
    if (videoTex) SDL_DestroyTexture(videoTex);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    SPDLOG_INFO("Player exited ({} frames decoded)", frameCount);
    return 0;
}
