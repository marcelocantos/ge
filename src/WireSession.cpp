#define ASIO_STANDALONE
#include <asio.hpp>

#include <sq/WireSession.h>
#include <sq/Audio.h>
#include <sq/DeltaTimer.h>
#include <sq/Protocol.h>
#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>
#include <dawn/dawn_proc.h>
#include <dawn/wire/WireClient.h>
#include <webgpu/webgpu_cpp.h>

#include "DaemonSink.h"
#include "DashboardSink.h"
#include "HttpServer.h"
#include "WebSocketSerializer.h"

#include <fstream>

#include <qrcodegen.hpp>

#define STB_IMAGE_WRITE_IMPLEMENTATION
#include <stb_image_write.h>

#include <atomic>
#include <chrono>
#include <cmath>
#include <csignal>
#include <cstdlib>
#include <queue>
#include <stdexcept>
#include <string>
#include <sys/socket.h>
#include <unordered_map>
#include <optional>
#include <vector>

namespace {

std::atomic<bool> g_stopRequested{false};
std::shared_ptr<DashboardSink> g_dashSink;

// ---------------------------------------------------------------------------
// PreviewBroadcast — WebSocket broadcaster for live phone preview.
// Binary messages carry JPEG frame data; text messages carry JSON accelerometer.
// ---------------------------------------------------------------------------
class PreviewBroadcast {
public:
    sq::WsAcceptHandler handler() {
        return [this](std::shared_ptr<sq::WsConnection> conn) {
            conn->setSendTimeout(2000);
            // Send current device info and orientation to new client
            char buf[128];
            if (deviceW_ > 0 && deviceH_ > 0) {
                snprintf(buf, sizeof(buf),
                    R"({"type":"device","w":%d,"h":%d,"pr":%d})",
                    deviceW_, deviceH_, pixelRatio_);
                conn->sendText(std::string(buf));
            }
            snprintf(buf, sizeof(buf), R"({"type":"orient","o":%d})", orientation_);
            conn->sendText(std::string(buf));
            std::lock_guard lock(mtx_);
            clients_.push_back(std::move(conn));
        };
    }

    void setDeviceSize(int w, int h, int pixelRatio) {
        deviceW_ = w;
        deviceH_ = h;
        pixelRatio_ = pixelRatio;
        // Infer initial orientation from dimensions (precise orientation
        // events will override once SDL_EVENT_DISPLAY_ORIENTATION fires).
        orientation_ = (w > h) ? 1 : 0;
        // Broadcast to existing clients
        char buf[128];
        snprintf(buf, sizeof(buf),
            R"({"type":"device","w":%d,"h":%d,"pr":%d})", w, h, pixelRatio);
        std::string text(buf);
        char obuf[64];
        snprintf(obuf, sizeof(obuf), R"({"type":"orient","o":%d})", orientation_);
        std::string otext(obuf);
        std::lock_guard lock(mtx_);
        for (auto& c : clients_) {
            if (c->isOpen()) {
                c->sendText(text);
                c->sendText(otext);
            }
        }
    }

    bool hasClients() {
        std::lock_guard lock(mtx_);
        pruneClients();
        return !clients_.empty();
    }

    void sendFrame(const void* data, size_t len) {
        std::lock_guard lock(mtx_);
        auto it = clients_.begin();
        while (it != clients_.end()) {
            if ((*it)->isOpen()) {
                (*it)->sendBinary(data, len);
                ++it;
            } else {
                it = clients_.erase(it);
            }
        }
    }

    // Map SDL_DisplayOrientation to our 4-cardinal scheme:
    // 0=portrait up, 1=landscape left, 2=portrait down, 3=landscape right
    void setOrientation(int sdlOrientation) {
        // SDL: 1=LANDSCAPE (right side up), 2=LANDSCAPE_FLIPPED,
        //      3=PORTRAIT, 4=PORTRAIT_FLIPPED
        int mapped;
        switch (sdlOrientation) {
            case 1: mapped = 1; break;  // SDL_ORIENTATION_LANDSCAPE → landscape left
            case 2: mapped = 3; break;  // SDL_ORIENTATION_LANDSCAPE_FLIPPED → landscape right
            case 3: mapped = 0; break;  // SDL_ORIENTATION_PORTRAIT → portrait up
            case 4: mapped = 2; break;  // SDL_ORIENTATION_PORTRAIT_FLIPPED → portrait down
            default: return;            // unknown — ignore
        }
        if (mapped == orientation_) return;
        orientation_ = mapped;

        static constexpr const char* kOrientNames[] = {
            "portrait", "landscape-left", "portrait-down", "landscape-right"
        };
        SPDLOG_INFO("Orientation: {}", kOrientNames[mapped]);

        char buf[64];
        snprintf(buf, sizeof(buf), R"({"type":"orient","o":%d})", orientation_);
        std::string text(buf);
        std::lock_guard lock(mtx_);
        auto it = clients_.begin();
        while (it != clients_.end()) {
            if ((*it)->isOpen()) {
                (*it)->sendText(text);
                ++it;
            } else {
                it = clients_.erase(it);
            }
        }
    }

    void sendAccel(float x, float y, float z) {
        char buf[160];
        snprintf(buf, sizeof(buf),
                 R"({"type":"accel","x":%.4f,"y":%.4f,"z":%.4f,"o":%d})",
                 x, y, z, orientation_);
        std::string text(buf);
        std::lock_guard lock(mtx_);
        auto it = clients_.begin();
        while (it != clients_.end()) {
            if ((*it)->isOpen()) {
                (*it)->sendText(text);
                ++it;
            } else {
                it = clients_.erase(it);
            }
        }
    }

    int orientation() const { return orientation_; }

private:
    void pruneClients() {
        clients_.erase(
            std::remove_if(clients_.begin(), clients_.end(),
                [](auto& c) { return !c->isOpen(); }),
            clients_.end());
    }

    std::mutex mtx_;
    std::vector<std::shared_ptr<sq::WsConnection>> clients_;
    int orientation_ = 0;
    int deviceW_ = 0, deviceH_ = 0, pixelRatio_ = 1;
};

std::shared_ptr<PreviewBroadcast> g_previewBroadcast;

// ---------------------------------------------------------------------------
// Minimal sRGB ICC v2 profile for JPEG embedding (~444 bytes).
// Matrix/TRC profile with sRGB primaries (Bradford-adapted to D50) and
// a gamma 2.2 curve (close approximation of the sRGB transfer function).
// ---------------------------------------------------------------------------
static const std::vector<uint8_t>& srgbIccProfile() {
    static const auto prof = [] {
        constexpr int SZ = 444;
        std::vector<uint8_t> p(SZ, 0);

        auto w32 = [&](int o, uint32_t v) {
            p[o]=(v>>24)&0xff; p[o+1]=(v>>16)&0xff;
            p[o+2]=(v>>8)&0xff; p[o+3]=v&0xff;
        };
        auto w16 = [&](int o, uint16_t v) { p[o]=(v>>8)&0xff; p[o+1]=v&0xff; };
        auto f16 = [&](int o, double v) { w32(o,(uint32_t)(int32_t)lround(v*65536.0)); };
        auto tag = [&](int o, const char* s) { memcpy(&p[o],s,4); };

        // Header (128 bytes)
        w32(0, SZ);             // profile size
        w32(8, 0x02100000);     // version 2.1.0
        tag(12, "mntr");        // display device
        tag(16, "RGB ");        // color space
        tag(20, "XYZ ");        // PCS
        w16(24, 2024); w16(26, 1); w16(28, 1); // date
        tag(36, "acsp");        // file signature
        tag(40, "APPL");        // platform
        f16(68, 0.9642); f16(72, 1.0); f16(76, 0.8249); // PCS illuminant D50

        // Tag directory (9 tags at offset 128)
        w32(128, 9);
        tag(132,"desc"); w32(136,240); w32(140,95);
        tag(144,"cprt"); w32(148,336); w32(152,12);
        tag(156,"wtpt"); w32(160,348); w32(164,20);
        tag(168,"rXYZ"); w32(172,368); w32(176,20);
        tag(180,"gXYZ"); w32(184,388); w32(188,20);
        tag(192,"bXYZ"); w32(196,408); w32(200,20);
        tag(204,"rTRC"); w32(208,428); w32(212,14);
        tag(216,"gTRC"); w32(220,428); w32(224,14);  // shares TRC data
        tag(228,"bTRC"); w32(232,428); w32(236,14);  // shares TRC data

        // desc at 240 (textDescriptionType, 95 bytes)
        tag(240,"desc");
        w32(248, 5);                    // ASCII count (incl. null)
        memcpy(&p[252], "sRGB", 5);    // "sRGB\0"

        // cprt at 336 (textType, 12 bytes)
        tag(336,"text");
        memcpy(&p[344], "CC0", 4);     // "CC0\0"

        // wtpt at 348 (XYZType) — D50
        tag(348,"XYZ ");
        f16(356, 0.9642); f16(360, 1.0); f16(364, 0.8249);

        // rXYZ at 368 — sRGB red primary (Bradford-adapted to D50)
        tag(368,"XYZ ");
        f16(376, 0.4361); f16(380, 0.2225); f16(384, 0.0139);

        // gXYZ at 388
        tag(388,"XYZ ");
        f16(396, 0.3851); f16(400, 0.7169); f16(404, 0.0971);

        // bXYZ at 408
        tag(408,"XYZ ");
        f16(416, 0.1431); f16(420, 0.0606); f16(424, 0.7141);

        // Shared TRC at 428 (curveType, gamma ≈ 2.2, 14 bytes)
        tag(428,"curv");
        w32(436, 1);     // count = 1 → gamma mode
        w16(440, 563);   // u8Fixed8: 2.2 × 256 ≈ 563 (0x0233)

        return p;
    }();
    return prof;
}

// Embed sRGB ICC profile into JPEG as APP2 ICC_PROFILE marker.
static void embedSrgbProfile(std::vector<uint8_t>& jpg) {
    const auto& icc = srgbIccProfile();
    uint16_t len = 2 + 12 + 1 + 1 + (uint16_t)icc.size();
    std::vector<uint8_t> marker;
    marker.reserve(2 + len);
    marker.push_back(0xFF);
    marker.push_back(0xE2);     // APP2
    marker.push_back((len >> 8) & 0xFF);
    marker.push_back(len & 0xFF);
    const char sig[] = "ICC_PROFILE";
    marker.insert(marker.end(), sig, sig + 12); // 11 chars + null
    marker.push_back(1);        // chunk 1
    marker.push_back(1);        // of 1
    marker.insert(marker.end(), icc.begin(), icc.end());
    jpg.insert(jpg.begin() + 2, marker.begin(), marker.end());
}

// ---------------------------------------------------------------------------
// PreviewCapture — async readback state machine for thumbnail capture.
// Renders to a small offscreen texture, copies to a staging buffer, and
// JPEG-encodes the result. Progress is driven by the existing
// processResponses/ProcessEvents calls in the render loop.
// ---------------------------------------------------------------------------
class PreviewCapture {
    enum State { Idle, CopySubmitted, MappingRequested };

    State state_ = Idle;
    wgpu::Texture texture_;
    wgpu::TextureView textureView_;
    wgpu::Buffer stagingBuffer_;
    wgpu::TextureFormat format_ = wgpu::TextureFormat::RGBA8Unorm;
    uint32_t alignedBytesPerRow_ = 0;
    int width_ = 0;
    int height_ = 0;
    bool initialized_ = false;
    bool workDone_ = false;

public:
    void init(wgpu::Device device, int w, int h, wgpu::TextureFormat fmt) {
        width_ = w;
        height_ = h;
        format_ = fmt;

        wgpu::TextureDescriptor texDesc{
            .usage = wgpu::TextureUsage::RenderAttachment |
                     wgpu::TextureUsage::CopySrc,
            .dimension = wgpu::TextureDimension::e2D,
            .size = {(uint32_t)w, (uint32_t)h, 1},
            .format = fmt,
            .mipLevelCount = 1,
            .sampleCount = 1,
        };
        texture_ = device.CreateTexture(&texDesc);
        textureView_ = texture_.CreateView();

        uint32_t bytesPerRow = w * 4;
        alignedBytesPerRow_ = (bytesPerRow + 255) & ~255;

        wgpu::BufferDescriptor bufDesc{
            .usage = wgpu::BufferUsage::CopyDst | wgpu::BufferUsage::MapRead,
            .size = (size_t)alignedBytesPerRow_ * h,
        };
        stagingBuffer_ = device.CreateBuffer(&bufDesc);
        initialized_ = true;
    }

    bool isIdle() const { return state_ == Idle; }
    bool isInitialized() const { return initialized_; }
    wgpu::TextureView colorView() const { return textureView_; }

    void beginCapture(wgpu::Device device, wgpu::Queue queue) {
        workDone_ = false;

        wgpu::CommandEncoder encoder = device.CreateCommandEncoder();
        wgpu::TexelCopyTextureInfo src{
            .texture = texture_,
            .mipLevel = 0,
            .origin = {0, 0, 0},
        };
        wgpu::TexelCopyBufferInfo dst{
            .layout = {
                .offset = 0,
                .bytesPerRow = alignedBytesPerRow_,
                .rowsPerImage = (uint32_t)height_,
            },
            .buffer = stagingBuffer_,
        };
        wgpu::Extent3D extent{(uint32_t)width_, (uint32_t)height_, 1};
        encoder.CopyTextureToBuffer(&src, &dst, &extent);

        wgpu::CommandBuffer commands = encoder.Finish();
        queue.Submit(1, &commands);

        queue.OnSubmittedWorkDone(
            wgpu::CallbackMode::AllowSpontaneous,
            [this](wgpu::QueueWorkDoneStatus, const char*) {
                workDone_ = true;
            });

        state_ = CopySubmitted;
    }

    // Call after processResponses/ProcessEvents. Returns JPEG data if ready.
    std::optional<std::vector<uint8_t>> poll() {
        if (state_ == CopySubmitted && workDone_) {
            size_t bufSize = (size_t)alignedBytesPerRow_ * height_;
            stagingBuffer_.MapAsync(
                wgpu::MapMode::Read, 0, bufSize,
                wgpu::CallbackMode::AllowSpontaneous,
                [](wgpu::MapAsyncStatus, wgpu::StringView) {});
            state_ = MappingRequested;
        }

        if (state_ == MappingRequested &&
            stagingBuffer_.GetMapState() == wgpu::BufferMapState::Mapped) {
            size_t bufSize = (size_t)alignedBytesPerRow_ * height_;
            const uint8_t* mapped = static_cast<const uint8_t*>(
                stagingBuffer_.GetConstMappedRange(0, bufSize));

            bool isBGRA = (format_ == wgpu::TextureFormat::BGRA8Unorm);

            // Convert to RGB for JPEG encoding
            std::vector<uint8_t> rgb(width_ * height_ * 3);
            for (int y = 0; y < height_; y++) {
                const uint8_t* row = mapped + y * alignedBytesPerRow_;
                for (int x = 0; x < width_; x++) {
                    int si = x * 4;
                    int di = (y * width_ + x) * 3;
                    if (isBGRA) {
                        rgb[di + 0] = row[si + 2];
                        rgb[di + 1] = row[si + 1];
                        rgb[di + 2] = row[si + 0];
                    } else {
                        rgb[di + 0] = row[si + 0];
                        rgb[di + 1] = row[si + 1];
                        rgb[di + 2] = row[si + 2];
                    }
                }
            }

            stagingBuffer_.Unmap();

            std::vector<uint8_t> jpg;
            stbi_write_jpg_to_func(
                [](void* ctx, void* data, int size) {
                    auto* out = static_cast<std::vector<uint8_t>*>(ctx);
                    auto* bytes = static_cast<const uint8_t*>(data);
                    out->insert(out->end(), bytes, bytes + size);
                },
                &jpg, width_, height_, 3, rgb.data(), 70);
            embedSrgbProfile(jpg);

            state_ = Idle;
            return jpg;
        }

        return std::nullopt;
    }
};

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
    std::unique_ptr<HttpServer> httpServer;  // standalone mode only
    std::shared_ptr<WsConnection> wsConn;
    std::unique_ptr<WsServerSerializer> serializer;
    std::unique_ptr<dawn::wire::WireClient> wireClient;
    wgpu::Instance instance;
    std::unique_ptr<GpuContext> gfx;
    std::function<void(const SDL_Event&)> onEvent;
    int pixelRatio = 1;
    std::string qrUrl;
    bool connected = false;
    Audio audio;

    // Daemon mode
    bool daemonMode = false;
    std::string daemonHost = "localhost";
    uint16_t daemonPort = 42069;
    std::shared_ptr<WsConnection> sidebandConn;  // sideband WS to sqd
    std::shared_ptr<DaemonSink> daemonSink;
};

WireSession::WireSession()
    : m(std::make_unique<M>())
{
    // Check for daemon mode: SQ_DAEMON=1 or SQ_DAEMON_ADDR=host:port
    if (auto* env = std::getenv("SQ_DAEMON_ADDR")) {
        m->daemonMode = true;
        std::string addr(env);
        auto colon = addr.rfind(':');
        if (colon != std::string::npos) {
            m->daemonHost = addr.substr(0, colon);
            m->daemonPort = static_cast<uint16_t>(std::stoi(addr.substr(colon + 1)));
        } else {
            m->daemonHost = addr;
        }
    } else if (auto* env = std::getenv("SQ_DAEMON")) {
        if (std::string(env) == "1") m->daemonMode = true;
    }

    if (m->daemonMode) {
        // Daemon mode: connect to sqd, no local HTTP server
        SPDLOG_INFO("Daemon mode: connecting to sqd at {}:{}...",
                    m->daemonHost, m->daemonPort);

        m->sidebandConn = connectWebSocket(
            m->daemonHost, m->daemonPort, "/ws/server");
        if (!m->sidebandConn) {
            throw std::runtime_error(
                "Failed to connect to sqd at " + m->daemonHost + ":" +
                std::to_string(m->daemonPort) + " — is sqd running?");
        }

        // Send hello
        char hello[256];
        snprintf(hello, sizeof(hello),
                 R"({"type":"hello","name":"%s","pid":%d})",
                 getprogname(), getpid());
        m->sidebandConn->sendText(std::string(hello));
        SPDLOG_INFO("Registered with sqd as '{}' (pid {})", getprogname(), getpid());

        // Install daemon log sink (forwards to sideband)
        m->daemonSink = std::make_shared<DaemonSink>(m->sidebandConn);
        spdlog::default_logger()->sinks().push_back(m->daemonSink);

        // Still create preview broadcast (we'll send frames over sideband)
        if (!g_previewBroadcast) {
            g_previewBroadcast = std::make_shared<PreviewBroadcast>();
        }
    } else {
        // Standalone mode: create HTTP server, QR code, dashboard
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

        // SQ_PUBLISH_ADDR overrides the advertised address in the QR code.
        std::string pubHost;
        uint16_t pubPort = actualPort;
        if (auto* env = std::getenv("SQ_PUBLISH_ADDR")) {
            std::string pubAddr = env;
            auto colon = pubAddr.rfind(':');
            if (colon != std::string::npos) {
                pubHost = pubAddr.substr(0, colon);
                auto p = std::stoi(pubAddr.substr(colon + 1));
                if (p != 0) pubPort = static_cast<uint16_t>(p);
            } else {
                pubHost = pubAddr;
            }
        }
        if (pubHost.empty()) pubHost = getLanAddress();
        m->qrUrl = "squz-remote://" + pubHost + ":" + std::to_string(pubPort);

        // Write port file for player auto-discovery
        for (auto* path : {".sqport", "/tmp/.sqport"}) {
            std::ofstream pf(path);
            if (pf) pf << actualPort;
        }

        // Dashboard: log sink (created once, shared across reconnects)
        if (!g_dashSink) {
            g_dashSink = std::make_shared<DashboardSink>();
            spdlog::default_logger()->sinks().push_back(g_dashSink);
        }
        if (!g_previewBroadcast) {
            g_previewBroadcast = std::make_shared<PreviewBroadcast>();
        }

        // Register dashboard endpoints
        m->httpServer->get("/api/qr", [this](const HttpRequest&, HttpResponse& res) {
            auto png = generateQrPng(m->qrUrl);
            res.png(png.data(), png.size());
        });
        m->httpServer->get("/api/url", [this](const HttpRequest&, HttpResponse& res) {
            res.json("{\"url\":\"" + m->qrUrl + "\"}");
        });
        m->httpServer->get("/api/info", [](const HttpRequest&, HttpResponse& res) {
            res.json(std::string(R"({"name":")") + getprogname() + "\"}");
        });
        m->httpServer->post("/api/stop", [](const HttpRequest&, HttpResponse& res) {
            SPDLOG_INFO("Stop requested from dashboard");
            res.json(R"({"ok":true})");
            kill(getpid(), SIGINT);
        });
        m->httpServer->ws("/ws/logs", g_dashSink->handler());
        m->httpServer->ws("/ws/preview", g_previewBroadcast->handler());
        m->httpServer->serveStatic("/", "sq/web/dist");

        // Start accepting HTTP connections
        m->httpServer->start();
    }
}

void WireSession::connect() {
    if (m->daemonMode) {
        // Daemon mode: connect wire WS to sqd, wait for DeviceInfo
        SPDLOG_INFO("Connecting wire to sqd...");

        m->wsConn = connectWebSocket(
            m->daemonHost, m->daemonPort, "/ws/server/wire");
        if (!m->wsConn) {
            throw std::runtime_error("Failed to connect wire WS to sqd");
        }
        SPDLOG_INFO("Wire connected to sqd, waiting for player...");
    } else {
        // Standalone mode: wait for player WebSocket connection
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

        // Wait for a WebSocket client, periodically checking for dashboard disconnect.
        bool dashboardEverConnected = false;
        for (;;) {
            m->wsConn = m->httpServer->tryAcceptWs("/ws/wire", 2000);
            if (m->wsConn) break;
            if (g_stopRequested.load(std::memory_order_relaxed))
                throw std::runtime_error("Server stopped");
            if (g_dashSink) {
                auto n = g_dashSink->checkClients();
                if (n > 0) {
                    dashboardEverConnected = true;
                } else if (dashboardEverConnected) {
                    SPDLOG_INFO("Dashboard disconnected, stopping server");
                    kill(getpid(), SIGINT);
                    throw std::runtime_error("Dashboard disconnected");
                }
            }
        }
        SPDLOG_INFO("Player connected via WebSocket");
    }

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
    if (g_previewBroadcast) {
        g_previewBroadcast->setDeviceSize(
            deviceInfo.width, deviceInfo.height, (int)deviceInfo.pixelRatio);
    }
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

Audio& WireSession::audio() {
    return m->audio;
}

HttpServer* WireSession::http() {
    return m->httpServer.get();  // nullptr in daemon mode
}

void WireSession::flush() {
    m->serializer->processResponses(*m->wireClient, m->onEvent);
    m->instance.ProcessEvents();
    m->serializer->Flush();
}

bool WireSession::run(RunConfig config) {
    if (!m->connected) connect();
    auto lastAccelSend = std::chrono::steady_clock::now();
    m->onEvent = [this,
                  userEvent = std::move(config.onEvent),
                  userResize = std::move(config.onResize),
                  lastAccelSend](const SDL_Event& e) mutable {
        if (e.type == SDL_EVENT_WINDOW_PIXEL_SIZE_CHANGED) {
            m->gfx->resize({e.window.data1, e.window.data2});
            if (userResize) userResize(e.window.data1, e.window.data2);
        } else {
            if (userEvent) userEvent(e);
            // Forward display orientation to dashboard preview
            if (e.type == SDL_EVENT_DISPLAY_ORIENTATION &&
                g_previewBroadcast) {
                g_previewBroadcast->setOrientation(e.display.data1);
            }
            // Forward accelerometer data to preview clients (~20 Hz)
            if (e.type == SDL_EVENT_SENSOR_UPDATE) {
                auto now = std::chrono::steady_clock::now();
                if (now - lastAccelSend > std::chrono::milliseconds(50)) {
                    lastAccelSend = now;
                    if (m->daemonMode && m->sidebandConn && m->sidebandConn->isOpen()) {
                        // Daemon mode: send accel as sideband JSON
                        char buf[160];
                        snprintf(buf, sizeof(buf),
                            R"({"type":"accel","data":{"x":%.4f,"y":%.4f,"z":%.4f,"o":%d}})",
                            e.sensor.data[0], e.sensor.data[1], e.sensor.data[2],
                            g_previewBroadcast ? g_previewBroadcast->orientation() : 0);
                        try { m->sidebandConn->sendText(std::string(buf)); } catch (...) {}
                    }
                    if (g_previewBroadcast && g_previewBroadcast->hasClients()) {
                        g_previewBroadcast->sendAccel(
                            e.sensor.data[0], e.sensor.data[1], e.sensor.data[2]);
                    }
                }
            }
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

    // Send audio clip data to player
    for (int i = 0; i < m->audio.clipCount(); ++i) {
        size_t dataSize = m->audio.clipDataSize(i);
        if (dataSize == 0) continue;

        wire::AudioData hdr{};
        hdr.audioId = static_cast<uint32_t>(i);
        hdr.format = m->audio.clipFormat(i);
        hdr.flags = m->audio.clipLoop(i) ? 1u : 0u;
        hdr.dataLength = static_cast<uint32_t>(dataSize);

        // Send header + raw file data as one message
        std::vector<char> payload(sizeof(hdr) + dataSize);
        std::memcpy(payload.data(), &hdr, sizeof(hdr));
        std::memcpy(payload.data() + sizeof(hdr), m->audio.clipData(i), dataSize);
        m->serializer->sendMessage(wire::kAudioDataMagic, payload.data(), payload.size());

        SPDLOG_INFO("Sent audio clip {} ({:.1f} KB, fmt={}, loop={})",
                    i, dataSize / 1024.0, hdr.format, m->audio.clipLoop(i));
    }

    DeltaTimer frameTimer;

    // Install SIGINT handler to allow graceful exit with exit message
    g_stopRequested.store(false);
    struct sigaction sa{};
    sa.sa_handler = [](int) { g_stopRequested.store(true, std::memory_order_relaxed); };
    sigemptyset(&sa.sa_mask);
    struct sigaction oldSa{};
    sigaction(SIGINT, &sa, &oldSa);
    struct SigRestore {
        struct sigaction old;
        ~SigRestore() { sigaction(SIGINT, &old, nullptr); }
    } sigRestore{oldSa};

    auto sendExitAndReturn = [&]() {
        SPDLOG_INFO("Server exit requested, closing connection");
        try {
            m->wsConn->close();
        } catch (...) {}
    };

    // Preview capture: 4× downscale thumbnail for dashboard phone model
    PreviewCapture previewCapture;
    int thumbW = std::max(1, m->gfx->width() / 4);
    int thumbH = std::max(1, m->gfx->height() / 4);
    previewCapture.init(m->gfx->device(), thumbW, thumbH, m->gfx->swapChainFormat());
    SPDLOG_INFO("Preview capture: {}x{}", thumbW, thumbH);
    int frameCount = 0;

    SPDLOG_INFO("Entering render loop...");

    // Detect dashboard tab close: once a WebSocket client has connected and
    // then all clients disconnect, treat it as a stop request.
    bool dashboardEverConnected = false;
    auto lastDashCheck = std::chrono::steady_clock::now();

    // Credit-based double buffering: frameReadyCount starts at 2, so the first
    // two frames send immediately (priming the pipeline). After that, each frame
    // waits for a FrameReady signal from the player before proceeding.
    for (;;) {
        if (g_stopRequested.load(std::memory_order_relaxed)) {
            sendExitAndReturn();
            return false;
        }

        // Periodically check if dashboard tab was closed (standalone mode only)
        if (!m->daemonMode) {
            auto now = std::chrono::steady_clock::now();
            if (now - lastDashCheck > std::chrono::seconds(2)) {
                lastDashCheck = now;
                if (g_dashSink) {
                    auto n = g_dashSink->checkClients();
                    if (n > 0) {
                        dashboardEverConnected = true;
                    } else if (dashboardEverConnected) {
                        SPDLOG_INFO("Dashboard disconnected, stopping server");
                        sendExitAndReturn();
                        return false;
                    }
                }
            }
        }

        // Drain pending responses every iteration (not just when waiting for
        // credits). This ensures we detect player disconnect promptly even
        // when frameReadyCount > 0.
        try {
            m->serializer->processResponses(*m->wireClient, m->onEvent);
        } catch (const std::exception& e) {
            SPDLOG_WARN("Player disconnected: {}", e.what());
            return true;
        }
        m->instance.ProcessEvents();

        while (m->serializer->frameReadyCount <= 0) {
            try {
                m->serializer->processResponses(*m->wireClient, m->onEvent);
            } catch (const std::exception& e) {
                SPDLOG_WARN("Player disconnected: {}", e.what());
                return true;
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
                        return true;
                    }
                }
            }

            if (g_stopRequested.load(std::memory_order_relaxed)) {
                sendExitAndReturn();
                return false;
            }
            SDL_Delay(1);
        }
        m->serializer->frameReadyCount--;

        float dt = frameTimer.tick();

        try {
            // Check if a previous async capture completed
            if (auto jpg = previewCapture.poll()) {
                if (m->daemonMode && m->sidebandConn && m->sidebandConn->isOpen()) {
                    // Daemon mode: send JPEG as binary sideband frame
                    try { m->sidebandConn->sendBinary(jpg->data(), jpg->size()); } catch (...) {}
                } else if (g_previewBroadcast) {
                    g_previewBroadcast->sendFrame(jpg->data(), jpg->size());
                }
            }

            if (config.onUpdate) config.onUpdate(dt);
            auto frameView = m->gfx->currentFrameView();
            if (frameView && config.onRender) {
                config.onRender(frameView, m->gfx->width(), m->gfx->height());

                // Every 6 frames, render a thumbnail for the dashboard preview
                bool wantPreview = m->daemonMode
                    ? (m->sidebandConn && m->sidebandConn->isOpen())
                    : (g_previewBroadcast && g_previewBroadcast->hasClients());
                if (previewCapture.isIdle() && frameCount % 6 == 0 && wantPreview) {
                    int tw = std::max(1, m->gfx->width() / 4);
                    int th = std::max(1, m->gfx->height() / 4);
                    if (tw != thumbW || th != thumbH) {
                        thumbW = tw; thumbH = th;
                        previewCapture.init(m->gfx->device(), thumbW, thumbH,
                                            m->gfx->swapChainFormat());
                    }
                    config.onRender(previewCapture.colorView(), thumbW, thumbH);
                    previewCapture.beginCapture(
                        m->gfx->device(), m->gfx->queue());
                }

                m->gfx->present();
            }
            flush();

            // Send pending audio commands
            auto cmds = m->audio.drainCommands();
            for (const auto& cmd : cmds) {
                m->serializer->sendMessage(wire::kAudioCommandMagic, &cmd, sizeof(cmd));
            }

            m->serializer->sendFrameEnd();
            frameCount++;
        } catch (const std::exception& e) {
            SPDLOG_WARN("Player disconnected: {}", e.what());
            return true;
        }
    }
}

} // namespace sq
