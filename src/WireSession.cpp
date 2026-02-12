#define ASIO_STANDALONE
#include <asio.hpp>

#include <sq/WireSession.h>
#include <sq/DeltaTimer.h>
#include <sq/Protocol.h>
#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>
#include <dawn/dawn_proc.h>
#include <dawn/wire/WireClient.h>
#include <webgpu/webgpu_cpp.h>

#include "DashboardSink.h"
#include "HttpServer.h"
#include "WebSocketSerializer.h"

#include <fstream>

#include <qrcodegen.hpp>

#define STB_IMAGE_WRITE_IMPLEMENTATION
#include <stb_image_write.h>

#include <chrono>
#include <csignal>
#include <cstdlib>
#include <queue>
#include <stdexcept>
#include <string>
#include <sys/socket.h>
#include <unordered_map>
#include <vector>

namespace {

// Dawn wire command constants for filtering large texture uploads.
// Values from WireCmd_autogen.h — must match the Dawn version in sq/vendor/dawn.
namespace wire_filter {
constexpr size_t kCmdHeaderSize = 8;   // CmdHeader: uint64_t commandSize
constexpr size_t kWireCmdSize = 4;     // WireCmd: uint32_t
constexpr size_t kMinCmdBytes = kCmdHeaderSize + kWireCmdSize;
constexpr size_t kDataSizeOffset = 16; // QueueWriteTextureTransfer::dataSize offset

// QueueWriteTextureTransfer: after CmdHeader(8)+cmdId(4)+queueId(4)+dataSize(8),
// then WGPUTexelCopyTextureInfoTransfer starts at offset 24:
//   textureObjectId(4) + mipLevel(4) + origin(12) + aspect(4)
constexpr size_t kWriteTexTextureIdOffset = 24; // ObjectId of the texture
constexpr size_t kWriteTexMipLevelOffset = 28;  // mipLevel being written

// QueueWriteTextureXlTransfer has 2 extra uint64_t fields
// (writeHandleCreateInfoLength, writeDataUpdateInfoLength) pushing
// WGPUTexelCopyTextureInfo from offset 24 to offset 40.
constexpr size_t kWriteTexXlTextureIdOffset = 40;
constexpr size_t kWriteTexXlMipLevelOffset = 44;

// TextureCreateViewTransfer layout:
//   CmdHeader(8) + cmdId(4) + self(4) + has_descriptor(4) + result(8) = 28 → aligned 32
// WGPUTextureViewDescriptorTransfer starts at offset 32:
//   hasNextInChain(4) + pad(4) + label(16) + format(4) + dimension(4)
//   + baseMipLevel(4) + mipLevelCount(4) + ...
constexpr size_t kCreateViewSelfOffset = 12;         // ObjectId of the texture
constexpr size_t kCreateViewHasDescOffset = 16;       // WGPUBool has_descriptor
constexpr size_t kCreateViewBaseMipOffset = 64;       // baseMipLevel in descriptor
constexpr size_t kCreateViewMipCountOffset = 68;      // mipLevelCount in descriptor

// WireCmd enum values (from WireCmd_autogen.h)
constexpr uint32_t kQueueWriteTexture = 86;
constexpr uint32_t kQueueWriteTextureXl = 87;
constexpr uint32_t kTextureCreateView = 143;

constexpr size_t kThreshold = 4 * 1024; // 4 KB — defer WriteTexture cmds above this
} // namespace wire_filter

// CommandSerializer that sends wire commands over WebSocket with deferred-mip filtering.
class WsServerSerializer : public sq::WebSocketSerializer {
public:
    explicit WsServerSerializer(std::shared_ptr<sq::WsConnection> conn)
        : WebSocketSerializer(std::move(conn), wire::kWireCommandMagic) {}

    bool Flush() override {
        if (buffer_.empty()) return true;

        // Pass 1: scan for large WriteTexture commands, track which textures
        // had mip levels dropped and what the lowest surviving mip level is.
        std::unordered_map<uint32_t, uint32_t> firstSurvivingMip; // textureId → min surviving level
        size_t pos = 0;

        while (pos + wire_filter::kMinCmdBytes <= buffer_.size()) {
            uint64_t cmdSize;
            std::memcpy(&cmdSize, buffer_.data() + pos, sizeof(cmdSize));
            if (cmdSize < wire_filter::kMinCmdBytes || pos + cmdSize > buffer_.size())
                break;

            uint32_t cmdId;
            std::memcpy(&cmdId, buffer_.data() + pos + wire_filter::kCmdHeaderSize,
                        sizeof(cmdId));

            if (cmdId == wire_filter::kQueueWriteTexture ||
                cmdId == wire_filter::kQueueWriteTextureXl) {
                bool isXl = (cmdId == wire_filter::kQueueWriteTextureXl);
                size_t texIdOff = isXl ? wire_filter::kWriteTexXlTextureIdOffset
                                       : wire_filter::kWriteTexTextureIdOffset;
                size_t mipOff = isXl ? wire_filter::kWriteTexXlMipLevelOffset
                                     : wire_filter::kWriteTexMipLevelOffset;
                if (cmdSize < mipOff + sizeof(uint32_t)) { pos += cmdSize; continue; }

                uint64_t dataSize;
                std::memcpy(&dataSize,
                            buffer_.data() + pos + wire_filter::kDataSizeOffset,
                            sizeof(dataSize));

                uint32_t texId;
                std::memcpy(&texId, buffer_.data() + pos + texIdOff, sizeof(texId));
                uint32_t mipLevel;
                std::memcpy(&mipLevel, buffer_.data() + pos + mipOff, sizeof(mipLevel));

                if (dataSize > wire_filter::kThreshold) {
                    // Track that this texture had a mip level dropped
                    auto it = firstSurvivingMip.find(texId);
                    if (it == firstSurvivingMip.end()) {
                        firstSurvivingMip[texId] = mipLevel + 1;
                    } else {
                        it->second = std::max(it->second, mipLevel + 1);
                    }
                }
            }

            pos += cmdSize;
        }

        // Pass 2: build output buffer, skipping large WriteTexture cmds
        // and rewriting TextureCreateView for textures with dropped mips.
        std::vector<char> output;
        output.reserve(buffer_.size());
        pos = 0;
        size_t droppedBytes = 0;

        while (pos + wire_filter::kMinCmdBytes <= buffer_.size()) {
            uint64_t cmdSize;
            std::memcpy(&cmdSize, buffer_.data() + pos, sizeof(cmdSize));
            if (cmdSize < wire_filter::kMinCmdBytes || pos + cmdSize > buffer_.size())
                break;

            uint32_t cmdId;
            std::memcpy(&cmdId, buffer_.data() + pos + wire_filter::kCmdHeaderSize,
                        sizeof(cmdId));

            bool skip = false;

            if ((cmdId == wire_filter::kQueueWriteTexture ||
                 cmdId == wire_filter::kQueueWriteTextureXl) &&
                cmdSize >= wire_filter::kDataSizeOffset + sizeof(uint64_t)) {
                uint64_t dataSize;
                std::memcpy(&dataSize,
                            buffer_.data() + pos + wire_filter::kDataSizeOffset,
                            sizeof(dataSize));
                if (dataSize > wire_filter::kThreshold) {
                    skip = true;
                    droppedBytes += cmdSize;
                }
            }

            // Rewrite TextureCreateView: adjust baseMipLevel and mipLevelCount
            // for textures that had large mip levels dropped.
            if (cmdId == wire_filter::kTextureCreateView &&
                cmdSize >= wire_filter::kCreateViewMipCountOffset + sizeof(uint32_t)) {
                uint32_t hasDesc;
                std::memcpy(&hasDesc,
                            buffer_.data() + pos + wire_filter::kCreateViewHasDescOffset,
                            sizeof(hasDesc));
                if (hasDesc) {
                    uint32_t texId;
                    std::memcpy(&texId,
                                buffer_.data() + pos + wire_filter::kCreateViewSelfOffset,
                                sizeof(texId));
                    auto it = firstSurvivingMip.find(texId);
                    if (it != firstSurvivingMip.end()) {
                        uint32_t newBase = it->second;
                        uint32_t oldCount;
                        std::memcpy(&oldCount,
                                    buffer_.data() + pos + wire_filter::kCreateViewMipCountOffset,
                                    sizeof(oldCount));
                        uint32_t newCount = (oldCount > newBase) ? oldCount - newBase : 1;

                        // Modify in-place (buffer_ is ours, not yet sent)
                        std::memcpy(buffer_.data() + pos + wire_filter::kCreateViewBaseMipOffset,
                                    &newBase, sizeof(newBase));
                        std::memcpy(buffer_.data() + pos + wire_filter::kCreateViewMipCountOffset,
                                    &newCount, sizeof(newCount));

                        SPDLOG_INFO("Wire filter: TextureCreateView tex={} baseMip {} → {}, count {} → {}",
                                    texId, 0, newBase, oldCount, newCount);
                    }
                }
            }

            if (skip) {
                // Save the dropped command for deferred streaming
                bool isXl = (cmdId == wire_filter::kQueueWriteTextureXl);
                size_t texIdOff = isXl ? wire_filter::kWriteTexXlTextureIdOffset
                                       : wire_filter::kWriteTexTextureIdOffset;
                size_t mipOff = isXl ? wire_filter::kWriteTexXlMipLevelOffset
                                     : wire_filter::kWriteTexMipLevelOffset;
                uint32_t texId;
                std::memcpy(&texId, buffer_.data() + pos + texIdOff, sizeof(texId));
                uint32_t mipLevel;
                std::memcpy(&mipLevel, buffer_.data() + pos + mipOff, sizeof(mipLevel));
                {
                    DeferredMip dm;
                    dm.textureId = texId;
                    dm.mipLevel = mipLevel;
                    std::memset(dm.head, 0, sizeof(dm.head));
                    size_t headBytes = std::min(static_cast<size_t>(cmdSize),
                                                wire::kMipHeadSize);
                    std::memcpy(dm.head, buffer_.data() + pos, headBytes);
                    if (cmdSize > wire::kMipHeadSize) {
                        dm.tail.assign(
                            buffer_.data() + pos + wire::kMipHeadSize,
                            buffer_.data() + pos + static_cast<size_t>(cmdSize));
                        dm.tailHash = wire::fnv1a64(dm.tail.data(), dm.tail.size());
                    }
                    dm.hashOnly = true;
                    deferredMips_.push(std::move(dm));
                }
            } else {
                // Copy command to output
                output.insert(output.end(),
                              buffer_.data() + pos,
                              buffer_.data() + pos + cmdSize);
            }

            pos += cmdSize;
        }

        // Append any trailing bytes
        if (pos < buffer_.size()) {
            output.insert(output.end(), buffer_.data() + pos, buffer_.data() + buffer_.size());
        }

        if (droppedBytes > 0) {
            SPDLOG_INFO("Wire filter: deferred {:.1f} MB of texture data ({} mip commands)",
                        droppedBytes / (1024.0 * 1024.0), deferredMips_.size());
        }

        // Send as one WebSocket binary frame
        if (!output.empty()) {
            sendMessage(wire::kWireCommandMagic, output.data(), output.size());
        }

        buffer_.clear();
        return true;
    }

    bool hasDeferredMips() const {
        return !deferredMips_.empty();
    }

    bool hasPendingMips() const {
        return !deferredMips_.empty() || !pendingMips_.empty();
    }

    // Sends the next deferred mip (hash probe or full data) to the player.
    // Returns true when all mips are fully resolved (queue and pending both empty).
    bool streamNextDeferredMip() {
        if (deferredMips_.empty()) return pendingMips_.empty();

        // Move top element out of priority queue
        DeferredMip mip = std::move(const_cast<DeferredMip&>(deferredMips_.top()));
        deferredMips_.pop();

        wire::DeferredMipHeader dh{};
        dh.textureId = mip.textureId;
        dh.mipLevel = mip.mipLevel;

        if (mip.hashOnly) {
            // Hash probe: send head[128] + hash[8]
            uint64_t hash = mip.tailHash;
            dh.commandSize = static_cast<uint32_t>(wire::kMipHeadSize + sizeof(hash));
            dh.hashOnly = 1;

            // Assemble: MessageHeader + DeferredMipHeader + head + hash
            uint32_t payloadSize = static_cast<uint32_t>(sizeof(dh) + dh.commandSize);
            std::vector<char> frame(sizeof(wire::MessageHeader) + payloadSize);
            wire::MessageHeader hdr{wire::kDeferredMipMagic, payloadSize};
            size_t off = 0;
            std::memcpy(frame.data() + off, &hdr, sizeof(hdr)); off += sizeof(hdr);
            std::memcpy(frame.data() + off, &dh, sizeof(dh)); off += sizeof(dh);
            std::memcpy(frame.data() + off, mip.head, wire::kMipHeadSize); off += wire::kMipHeadSize;
            std::memcpy(frame.data() + off, &hash, sizeof(hash));
            conn_->sendBinary(frame.data(), frame.size());

            SPDLOG_INFO("Mip probe: tex={} level={} hash={:016x} ({:.1f} KB held)",
                        mip.textureId, mip.mipLevel, hash, mip.tail.size() / 1024.0);

            uint64_t key = (static_cast<uint64_t>(mip.textureId) << 32) | mip.mipLevel;
            pendingMips_[key] = std::move(mip);
        } else {
            // Full data: send head[128] + tail[]
            dh.commandSize = static_cast<uint32_t>(wire::kMipHeadSize + mip.tail.size());
            dh.hashOnly = 0;

            uint32_t payloadSize = static_cast<uint32_t>(sizeof(dh) + dh.commandSize);
            std::vector<char> frame(sizeof(wire::MessageHeader) + payloadSize);
            wire::MessageHeader hdr{wire::kDeferredMipMagic, payloadSize};
            size_t off = 0;
            std::memcpy(frame.data() + off, &hdr, sizeof(hdr)); off += sizeof(hdr);
            std::memcpy(frame.data() + off, &dh, sizeof(dh)); off += sizeof(dh);
            std::memcpy(frame.data() + off, mip.head, wire::kMipHeadSize); off += wire::kMipHeadSize;
            if (!mip.tail.empty()) {
                std::memcpy(frame.data() + off, mip.tail.data(), mip.tail.size());
            }
            conn_->sendBinary(frame.data(), frame.size());

            SPDLOG_INFO("Streamed deferred mip: tex={} level={} ({:.1f} KB)",
                        mip.textureId, mip.mipLevel,
                        (wire::kMipHeadSize + mip.tail.size()) / 1024.0);
        }

        return deferredMips_.empty() && pendingMips_.empty();
    }

    void sendFrameEnd() {
        sendMessage(wire::kFrameEndMagic);
    }

    int frameReadyCount = 2; // initial credits = pipeline depth (double-buffer)

    void processResponses(dawn::wire::WireClient& client,
                           const std::function<void(const SDL_Event&)>& onEvent) {
        while (conn_->available() > 0) {
            wire::MessageHeader header{};
            std::vector<char> payload;
            if (!recvMessage(header, payload)) {
                throw std::runtime_error("player disconnected");
            }

            if (header.magic == wire::kWireResponseMagic) {
                const volatile char* result = client.HandleCommands(
                    payload.data(), payload.size());
                if (result == nullptr) {
                    SPDLOG_ERROR("WireClient failed to handle responses");
                }
            } else if (header.magic == wire::kSdlEventMagic) {
                if (payload.size() >= sizeof(SDL_Event)) {
                    SDL_Event event{};
                    std::memcpy(&event, payload.data(), sizeof(event));
                    if (onEvent) {
                        onEvent(event);
                    }
                }
            } else if (header.magic == wire::kFrameReadyMagic) {
                ++frameReadyCount;
            } else if (header.magic == wire::kMipCacheHitMagic) {
                if (payload.size() >= sizeof(wire::MipCacheResponse)) {
                    wire::MipCacheResponse resp{};
                    std::memcpy(&resp, payload.data(), sizeof(resp));
                    uint64_t key = (static_cast<uint64_t>(resp.textureId) << 32) | resp.mipLevel;
                    auto it = pendingMips_.find(key);
                    if (it != pendingMips_.end()) {
                        SPDLOG_INFO("Mip cache HIT: tex={} level={} ({:.1f} KB saved)",
                                    resp.textureId, resp.mipLevel,
                                    it->second.tail.size() / 1024.0);
                        pendingMips_.erase(it);
                    }
                }
            } else if (header.magic == wire::kMipCacheMissMagic) {
                if (payload.size() >= sizeof(wire::MipCacheResponse)) {
                    wire::MipCacheResponse resp{};
                    std::memcpy(&resp, payload.data(), sizeof(resp));
                    uint64_t key = (static_cast<uint64_t>(resp.textureId) << 32) | resp.mipLevel;
                    auto it = pendingMips_.find(key);
                    if (it != pendingMips_.end()) {
                        SPDLOG_INFO("Mip cache MISS: tex={} level={}, requeueing ({:.1f} KB)",
                                    resp.textureId, resp.mipLevel,
                                    it->second.tail.size() / 1024.0);
                        it->second.hashOnly = false;
                        deferredMips_.push(std::move(it->second));
                        pendingMips_.erase(it);
                    }
                }
            } else {
                SPDLOG_ERROR("Unknown message magic: 0x{:08X}", header.magic);
            }
        }

        // Detect disconnect when idle
        if (!conn_->isOpen()) {
            throw std::runtime_error("player disconnected");
        }
    }

private:
    struct DeferredMip {
        uint32_t textureId;
        uint32_t mipLevel;
        char head[wire::kMipHeadSize];   // non-deterministic wire framing
        std::vector<char> tail;          // deterministic pixel data
        uint64_t tailHash = 0;           // precomputed fnv1a64 of tail
        bool hashOnly = true;            // true = send hash probe, false = send full

        // Smallest-first: priority_queue (max-heap) pops the "largest" element,
        // so invert the comparison to make the smallest tail the top.
        bool operator<(const DeferredMip& o) const {
            return tail.size() > o.tail.size();
        }
    };

    std::vector<char> responseBuffer_;
    std::priority_queue<DeferredMip> deferredMips_;
    std::unordered_map<uint64_t, DeferredMip> pendingMips_; // awaiting HIT/MISS
};

void parseListenAddr(const std::string& listenAddr, std::string& address, uint16_t& port) {
    auto colonPos = listenAddr.rfind(':');
    if (colonPos != std::string::npos) {
        address = listenAddr.substr(0, colonPos);
        port = static_cast<uint16_t>(std::stoi(listenAddr.substr(colonPos + 1)));
    } else {
        port = static_cast<uint16_t>(std::stoi(listenAddr));
    }
}

std::string resolveListenAddr() {
    const char* env = std::getenv("SQ_WIRE_ADDR");
    if (env && env[0]) return env;
    return "0";  // OS-assigned port by default
}

// Get the first non-loopback IPv4 address by connecting a UDP socket
// to a public address (no packets are actually sent).
std::string getLanAddress() {
    try {
        asio::io_context io;
        asio::ip::udp::socket sock(io, asio::ip::udp::v4());
        sock.connect(asio::ip::udp::endpoint(asio::ip::make_address("8.8.8.8"), 80));
        auto addr = sock.local_endpoint().address();
        sock.close();
        if (!addr.is_loopback()) {
            return addr.to_string();
        }
    } catch (...) {}
    return "127.0.0.1";
}

void printQrCode(const std::string& url) {
    auto qr = qrcodegen::QrCode::encodeText(url.c_str(), qrcodegen::QrCode::Ecc::LOW);
    int size = qr.getSize();

    // Use Unicode block elements: two rows per character line
    // Upper half = top row, lower half = bottom row
    std::string out("\n");
    for (int y = -1; y < size + 1; y += 2) {
        out += "  ";
        for (int x = -1; x < size + 1; x++) {
            bool top = (y >= 0 && y < size) ? qr.getModule(x, y) : false;
            bool bot = (y + 1 >= 0 && y + 1 < size) ? qr.getModule(x, y + 1) : false;
            if (top && bot)        out += "\u2588";
            else if (top && !bot)  out += "\u2580";
            else if (!top && bot)  out += "\u2584";
            else                   out += " ";
        }
        out += "\n";
    }
    out += "  " + url + "\n";
    fprintf(stderr, "%s", out.c_str());
}

// Generate QR code PNG in memory.
std::vector<char> generateQrPng(const std::string& url) {
    auto qr = qrcodegen::QrCode::encodeText(url.c_str(), qrcodegen::QrCode::Ecc::LOW);
    int size = qr.getSize();
    int scale = 8;
    int border = 2;
    int imgSize = (size + border * 2) * scale;

    // Render as grayscale pixels
    std::vector<uint8_t> pixels(imgSize * imgSize, 255);
    for (int y = 0; y < size; y++) {
        for (int x = 0; x < size; x++) {
            if (qr.getModule(x, y)) {
                for (int dy = 0; dy < scale; dy++) {
                    for (int dx = 0; dx < scale; dx++) {
                        int px = (x + border) * scale + dx;
                        int py = (y + border) * scale + dy;
                        pixels[py * imgSize + px] = 0;
                    }
                }
            }
        }
    }

    // Encode as PNG to memory
    std::vector<char> pngData;
    stbi_write_png_to_func(
        [](void* ctx, void* data, int size) {
            auto* out = static_cast<std::vector<char>*>(ctx);
            auto* bytes = static_cast<const char*>(data);
            out->insert(out->end(), bytes, bytes + size);
        },
        &pngData, imgSize, imgSize, 1, pixels.data(), imgSize);

    return pngData;
}

} // namespace

namespace sq {

struct WireSession::M {
    std::unique_ptr<HttpServer> httpServer;
    std::shared_ptr<WsConnection> wsConn;
    std::unique_ptr<WsServerSerializer> serializer;
    std::unique_ptr<dawn::wire::WireClient> wireClient;
    wgpu::Instance instance;
    std::unique_ptr<GpuContext> gfx;
    std::function<void(const SDL_Event&)> onEvent;
    int pixelRatio = 1;
    std::string qrUrl;
    bool connected = false;
};

WireSession::WireSession()
    : m(std::make_unique<M>())
{
    auto addr = resolveListenAddr();

    // Parse address (default: port 0 = OS-assigned)
    std::string address = "0.0.0.0";
    uint16_t port = 0;
    parseListenAddr(addr, address, port);

    SPDLOG_INFO("Starting wire server on {}:{}...", address, port);

    // Create HTTP server (port 0 → OS picks a free port)
    m->httpServer = std::make_unique<HttpServer>(port);

    // Use actual port (may differ from requested when using port 0)
    auto actualPort = m->httpServer->port();

    auto lanIp = getLanAddress();
    m->qrUrl = "squz-remote://" + lanIp + ":" + std::to_string(actualPort);

    // Write port file for player auto-discovery
    for (auto* path : {".sqport", "/tmp/.sqport"}) {
        std::ofstream pf(path);
        if (pf) pf << actualPort;
    }

    // Dashboard: log sink (created once, shared across reconnects)
    static auto dashSink = [] {
        auto s = std::make_shared<DashboardSink>();
        spdlog::default_logger()->sinks().push_back(s);
        return s;
    }();

    // Register dashboard endpoints
    m->httpServer->get("/api/qr", [this](const HttpRequest&, HttpResponse& res) {
        auto png = generateQrPng(m->qrUrl);
        res.png(png.data(), png.size());
    });
    m->httpServer->get("/api/url", [this](const HttpRequest&, HttpResponse& res) {
        res.json("{\"url\":\"" + m->qrUrl + "\"}");
    });
    m->httpServer->get("/api/stop", [](const HttpRequest&, HttpResponse& res) {
        SPDLOG_INFO("Stop requested from dashboard");
        res.json(R"({"ok":true})");
        kill(getpid(), SIGINT);
    });
    m->httpServer->ws("/ws/logs", dashSink->handler());
    m->httpServer->serveStatic("/", "sq/web/dist");

    // Start accepting HTTP connections
    m->httpServer->start();
}

void WireSession::connect() {
    SPDLOG_INFO("Waiting for player connection...");
    static bool dashboardOpened = false;
    if (!dashboardOpened) {
        printQrCode(m->qrUrl);
        auto localUrl = "http://localhost:" + std::to_string(m->httpServer->port());
        std::string cmd = "open " + localUrl;
        if (std::system(cmd.c_str()) != 0)
            SPDLOG_WARN("Failed to open browser");
        dashboardOpened = true;
    }

    // Block until a WebSocket client connects to /ws/wire
    m->wsConn = m->httpServer->acceptWs("/ws/wire");
    SPDLOG_INFO("Player connected via WebSocket");

    // Receive DeviceInfo as first binary frame
    wire::MessageHeader devHdr{};
    std::vector<char> devPayload;
    m->serializer = std::make_unique<WsServerSerializer>(m->wsConn);

    if (!m->serializer->recvMessage(devHdr, devPayload) ||
        devPayload.size() < sizeof(wire::DeviceInfo)) {
        throw std::runtime_error("Failed to receive DeviceInfo");
    }

    wire::DeviceInfo deviceInfo{};
    std::memcpy(&deviceInfo, devPayload.data(), sizeof(deviceInfo));

    if (deviceInfo.magic != wire::kDeviceInfoMagic) {
        throw std::runtime_error("Invalid DeviceInfo magic");
    }

    SPDLOG_INFO("Player: {}x{} @ {}x, format={}",
                deviceInfo.width, deviceInfo.height,
                deviceInfo.pixelRatio, deviceInfo.preferredFormat);
    m->pixelRatio = std::max(1, (int)deviceInfo.pixelRatio);

    // Create wire client
    dawn::wire::WireClientDescriptor clientDesc{
        .serializer = m->serializer.get(),
    };
    m->wireClient = std::make_unique<dawn::wire::WireClient>(clientDesc);

    dawnProcSetProcs(&dawn::wire::client::GetProcs());

    // Reserve handles
    auto instanceReservation = m->wireClient->ReserveInstance();
    WGPUSurfaceCapabilities surfaceCaps{};
    auto surfaceReservation = m->wireClient->ReserveSurface(
        instanceReservation.instance, &surfaceCaps);

    // Send SessionInit as a WebSocket binary frame
    wire::SessionInit sessionInit{};
    sessionInit.instanceHandle = {instanceReservation.handle.id, instanceReservation.handle.generation};
    sessionInit.surfaceHandle = {surfaceReservation.handle.id, surfaceReservation.handle.generation};

    m->serializer->sendMessage(wire::kSessionInitMagic, &sessionInit, sizeof(sessionInit));
    SPDLOG_INFO("Sent SessionInit");

    // Wait for SessionReady
    wire::MessageHeader readyHdr{};
    std::vector<char> readyPayload;
    if (!m->serializer->recvMessage(readyHdr, readyPayload) ||
        readyPayload.size() < sizeof(wire::SessionReady)) {
        throw std::runtime_error("Failed to receive SessionReady");
    }

    wire::SessionReady sessionReady{};
    std::memcpy(&sessionReady, readyPayload.data(), sizeof(sessionReady));

    if (sessionReady.magic != wire::kSessionReadyMagic) {
        throw std::runtime_error("Invalid SessionReady magic");
    }

    SPDLOG_INFO("Session ready");

    m->instance = wgpu::Instance(instanceReservation.instance);

    // Request adapter through wire
    wgpu::Adapter adapter;
    bool adapterReceived = false;

    wgpu::RequestAdapterOptions adapterOpts{
        .powerPreference = wgpu::PowerPreference::HighPerformance,
    };
    m->instance.RequestAdapter(
        &adapterOpts,
        wgpu::CallbackMode::AllowProcessEvents,
        [&](wgpu::RequestAdapterStatus status, wgpu::Adapter result, wgpu::StringView message) {
            if (status == wgpu::RequestAdapterStatus::Success) {
                adapter = result;
                adapterReceived = true;
            } else {
                SPDLOG_ERROR("Failed to get adapter: {}", std::string_view(message.data, message.length));
            }
        });

    m->serializer->Flush();
    while (!adapterReceived) {
        m->serializer->processResponses(*m->wireClient, m->onEvent);
        m->instance.ProcessEvents();
    }

    if (!adapter) {
        throw std::runtime_error("No adapter received");
    }

    SPDLOG_INFO("Got adapter through wire");

    // Request device through wire
    wgpu::Device device;
    bool deviceReceived = false;

    wgpu::DeviceDescriptor deviceDesc{};
    deviceDesc.SetDeviceLostCallback(
        wgpu::CallbackMode::AllowSpontaneous,
        [](const wgpu::Device&, wgpu::DeviceLostReason reason, wgpu::StringView message) {
            if (reason != wgpu::DeviceLostReason::Destroyed) {
                SPDLOG_ERROR("Device lost: {}", std::string_view(message.data, message.length));
            }
        });
    deviceDesc.SetUncapturedErrorCallback(
        [](const wgpu::Device&, wgpu::ErrorType type, wgpu::StringView message) {
            SPDLOG_ERROR("WebGPU error: {}", std::string_view(message.data, message.length));
        });

    std::vector<wgpu::FeatureName> features;
    if (adapter.HasFeature(wgpu::FeatureName::TextureCompressionASTC)) {
        features.push_back(wgpu::FeatureName::TextureCompressionASTC);
        SPDLOG_INFO("Requesting ASTC texture compression");
    }
    if (adapter.HasFeature(wgpu::FeatureName::TextureCompressionETC2)) {
        features.push_back(wgpu::FeatureName::TextureCompressionETC2);
        SPDLOG_INFO("Requesting ETC2 texture compression");
    }
    if (!features.empty()) {
        deviceDesc.requiredFeatureCount = features.size();
        deviceDesc.requiredFeatures = features.data();
    }

    adapter.RequestDevice(
        &deviceDesc,
        wgpu::CallbackMode::AllowProcessEvents,
        [&](wgpu::RequestDeviceStatus status, wgpu::Device result, wgpu::StringView message) {
            if (status == wgpu::RequestDeviceStatus::Success) {
                device = result;
                deviceReceived = true;
            } else {
                SPDLOG_ERROR("Failed to get device: {}", std::string_view(message.data, message.length));
            }
        });

    m->serializer->Flush();
    while (!deviceReceived) {
        m->serializer->processResponses(*m->wireClient, m->onEvent);
        m->instance.ProcessEvents();
    }

    if (!device) {
        throw std::runtime_error("No device received");
    }

    wgpu::Queue queue = device.GetQueue();
    SPDLOG_INFO("Got device and queue through wire");

    // Create GpuContext with wire resources
    wgpu::Surface surface(surfaceReservation.surface);
    auto format = static_cast<wgpu::TextureFormat>(deviceInfo.preferredFormat);

    m->gfx = std::make_unique<GpuContext>(device, queue, surface, format,
                                          deviceInfo.width, deviceInfo.height);

    // Flush surface configuration commands
    flush();
    m->connected = true;
}

WireSession::~WireSession() = default;

GpuContext& WireSession::gpu() {
    if (!m->connected) connect();
    return *m->gfx;
}

int WireSession::pixelRatio() const {
    if (!m->connected) const_cast<WireSession*>(this)->connect();
    return m->pixelRatio;
}

HttpServer& WireSession::http() {
    return *m->httpServer;
}

void WireSession::flush() {
    m->serializer->processResponses(*m->wireClient, m->onEvent);
    m->instance.ProcessEvents();
    m->serializer->Flush();
}

void WireSession::run(RunConfig config) {
    if (!m->connected) connect();
    m->onEvent = [this,
                  userEvent = std::move(config.onEvent),
                  userResize = std::move(config.onResize)](const SDL_Event& e) {
        if (e.type == SDL_EVENT_WINDOW_PIXEL_SIZE_CHANGED) {
            m->gfx->resize({e.window.data1, e.window.data2});
            if (userResize) userResize(e.window.data1, e.window.data2);
        } else {
            if (userEvent) userEvent(e);
        }
    };

    // Flush any resource creation commands issued between construction and run()
    flush();

    // Send sensor configuration to player
    for (int s = 1; s < 7; ++s) {
        if (config.sensors & (1u << s)) {
            wire::SensorConfig sc{};
            sc.sensorType = static_cast<uint8_t>(s);
            sc.enabled = 1;
            m->serializer->sendMessage(wire::kSensorConfigMagic, &sc, sizeof(sc));
            SPDLOG_INFO("Requested sensor type {}", s);
        }
    }

    DeltaTimer frameTimer;

    SPDLOG_INFO("Entering render loop...");

    // Credit-based double buffering: frameReadyCount starts at 2, so the first
    // two frames send immediately (priming the pipeline). After that, each frame
    // waits for a FrameReady signal from the player before proceeding.
    for (;;) {
        while (m->serializer->frameReadyCount <= 0) {
            try {
                m->serializer->processResponses(*m->wireClient, m->onEvent);
            } catch (const std::exception& e) {
                SPDLOG_WARN("Player disconnected: {}", e.what());
                return;
            }
            m->instance.ProcessEvents();

            // Send one mip per idle iteration so frames interleave with mip
            // deliveries, giving progressive quality (blurry → sharp).
            if (m->serializer->hasDeferredMips()) {
                static const int mipDelayMs = [] {
                    const char* e = std::getenv("SQ_MIP_DELAY_MS");
                    return (e && e[0]) ? std::atoi(e) : 0;
                }();
                static auto lastMipTime = std::chrono::steady_clock::now();
                auto now = std::chrono::steady_clock::now();
                auto elapsed = std::chrono::duration_cast<std::chrono::milliseconds>(
                    now - lastMipTime).count();

                if (mipDelayMs <= 0 || elapsed >= mipDelayMs) {
                    try {
                        m->serializer->streamNextDeferredMip();
                        lastMipTime = now;
                    } catch (const std::exception& e) {
                        SPDLOG_WARN("Disconnect during mip streaming: {}", e.what());
                        return;
                    }
                }
            }

            SDL_Delay(1);
        }
        m->serializer->frameReadyCount--;

        float dt = frameTimer.tick();

        try {
            if (config.onUpdate) config.onUpdate(dt);
            auto frameView = m->gfx->currentFrameView();
            if (frameView && config.onRender) {
                config.onRender(frameView);
                m->gfx->present();
            }
            flush();
            m->serializer->sendFrameEnd();
        } catch (const std::exception& e) {
            SPDLOG_WARN("Player disconnected: {}", e.what());
            return;
        }
    }
}

} // namespace sq
