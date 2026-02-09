// Receiver — shared wire rendering receiver implementation.
// Platform-specific entry points: receiver.cpp (desktop), ios/main.mm (iOS).

#define ASIO_STANDALONE
#include <asio.hpp>

#include "Receiver.h"
#include "receiver_platform.h"

#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>
#include <dawn/native/DawnNative.h>
#include <dawn/dawn_proc.h>
#include <dawn/wire/WireServer.h>
#include <webgpu/webgpu_cpp.h>

#include <sq/Protocol.h>

#include <filesystem>
#include <fstream>
#include <memory>
#include <string>
#include <unordered_map>
#include <vector>

namespace {

enum class ConnectionResult { Quit, Disconnected };

// Dawn wire command constants for observing texture/view/bind group creation.
// Values from WireCmd_autogen.h — must match the Dawn version in sq/vendor/dawn.
namespace wire_obs {
constexpr size_t kCmdHeaderSize = 8;   // CmdHeader: uint64_t commandSize
constexpr size_t kWireCmdSize = 4;     // WireCmd: uint32_t
constexpr size_t kMinCmdBytes = kCmdHeaderSize + kWireCmdSize;

// WireCmd enum values
constexpr uint32_t kTextureCreateView = 143;
constexpr uint32_t kDeviceCreateBindGroup = 41;
constexpr uint32_t kRenderPassEncoderSetBindGroup = 117;

// TextureCreateViewTransfer offsets
constexpr size_t kCreateViewSelfOffset = 12;       // ObjectId of the texture
constexpr size_t kCreateViewHasDescOffset = 16;    // WGPUBool has_descriptor
constexpr size_t kCreateViewResultIdOffset = 20;   // result.id (ObjectId)
constexpr size_t kCreateViewResultGenOffset = 24;  // result.generation
// WGPUTextureViewDescriptorTransfer starts at wire-aligned offset 32
constexpr size_t kCreateViewBaseMipOffset = 64;    // baseMipLevel in descriptor
constexpr size_t kCreateViewMipCountOffset = 68;   // mipLevelCount in descriptor

// DeviceCreateBindGroupTransfer offsets (24 bytes total, wire-aligned)
constexpr size_t kCreateBindGroupResultIdOffset = 16;
constexpr size_t kCreateBindGroupResultGenOffset = 20;
// WGPUBindGroupDescriptorTransfer starts at offset 24
constexpr size_t kBindGroupDescHasChainOffset = 24;    // hasNextInChain (uint32_t)
constexpr size_t kBindGroupDescLabelHasDataOffset = 32; // label.has_data (bool)
constexpr size_t kBindGroupDescLabelLengthOffset = 40;  // label.length (uint64_t)
constexpr size_t kBindGroupDescEntryCountOffset = 56;   // entryCount (uint64_t)
constexpr size_t kBindGroupDescSize = 64;              // start of extra data (no chain, no label)
// WGPUBindGroupEntryTransfer: 40 bytes each, textureView ObjectId at offset 36
constexpr size_t kBindGroupEntrySize = 40;
constexpr size_t kBindGroupEntryTextureViewOffset = 36;

// RenderPassEncoderSetBindGroupTransfer offsets
constexpr size_t kSetBindGroupGroupOffset = 20;  // group ObjectId
} // namespace wire_obs

// Tracking state for deferred mip delivery.
// Built by scanning wire command batches, used to fabricate views and bind groups.
struct ViewInfo {
    uint32_t textureId;
    uint32_t baseMipLevel;
    uint32_t mipLevelCount;
    std::vector<char> cmdBytes; // full TextureCreateView command for cloning
};

struct BindGroupInfo {
    std::vector<char> cmdBytes;             // full DeviceCreateBindGroup command
    std::vector<uint32_t> referencedViews;  // viewIds that reference tracked textures
    // Byte offsets within cmdBytes where each referenced view's ObjectId lives,
    // so we can patch them when fabricating new bind groups
    std::vector<size_t> viewIdOffsets;
};

struct MipTracker {
    // Views with baseMipLevel > 0 (truncated textures)
    std::unordered_map<uint32_t, ViewInfo> views;       // viewId → info
    // Bind groups that reference tracked views
    std::unordered_map<uint32_t, BindGroupInfo> bindGroups; // bindGroupId → info
    // Rewrite table: original client bindGroupId → latest fabricated bindGroupId
    std::unordered_map<uint32_t, uint32_t> bindGroupRewrites;

    // Sequential IDs per object type (must equal mKnown.size() for Dawn's Allocate)
    uint32_t nextViewId = 1;  // next TextureView ObjectId
    uint32_t nextBgId = 1;    // next BindGroup ObjectId

    // Scan a wire command batch and update tracking tables
    void scanCommands(const char* data, size_t size);

    // Process a deferred mip: fabricate new views and bind groups as needed.
    // Returns the number of bind groups updated.
    int processDeferredMip(uint32_t textureId, uint32_t mipLevel,
                           dawn::wire::WireServer& wireServer,
                           dawn::wire::CommandSerializer& serializer);

    // Rewrite SetBindGroup commands in a frame command buffer (in-place)
    void rewriteSetBindGroups(char* data, size_t size);
};

class SocketSerializer : public dawn::wire::CommandSerializer {
public:
    explicit SocketSerializer(asio::ip::tcp::socket& socket)
        : socket_(socket) {
        buffer_.reserve(64 * 1024);
    }

    void* GetCmdSpace(size_t size) override {
        if (size > wire::kMaxMessageSize) {
            return nullptr;
        }
        size_t offset = buffer_.size();
        buffer_.resize(offset + size);
        return buffer_.data() + offset;
    }

    bool Flush() override {
        if (buffer_.empty()) return true;

        try {
            wire::MessageHeader header{wire::kWireResponseMagic, static_cast<uint32_t>(buffer_.size())};
            asio::write(socket_, asio::buffer(&header, sizeof(header)));
            asio::write(socket_, asio::buffer(buffer_));
            buffer_.clear();
            return true;
        } catch (const std::exception& e) {
            SPDLOG_ERROR("SocketSerializer::Flush failed: {}", e.what());
            buffer_.clear();
            return false;
        }
    }

    size_t GetMaximumAllocationSize() const override {
        return wire::kMaxMessageSize;
    }

private:
    asio::ip::tcp::socket& socket_;
    std::vector<char> buffer_;
};

void sendEvent(asio::ip::tcp::socket& socket, const SDL_Event& event) {
    wire::MessageHeader header{wire::kSdlEventMagic, sizeof(SDL_Event)};
    asio::write(socket, asio::buffer(&header, sizeof(header)));
    asio::write(socket, asio::buffer(&event, sizeof(event)));
}

void sendMipCacheHit(asio::ip::tcp::socket& socket, uint32_t texId, uint32_t mipLevel) {
    wire::MipCacheResponse resp{texId, mipLevel};
    wire::MessageHeader header{wire::kMipCacheHitMagic, sizeof(resp)};
    asio::write(socket, asio::buffer(&header, sizeof(header)));
    asio::write(socket, asio::buffer(&resp, sizeof(resp)));
}

void sendMipCacheMiss(asio::ip::tcp::socket& socket, uint32_t texId, uint32_t mipLevel) {
    wire::MipCacheResponse resp{texId, mipLevel};
    wire::MessageHeader header{wire::kMipCacheMissMagic, sizeof(resp)};
    asio::write(socket, asio::buffer(&header, sizeof(header)));
    asio::write(socket, asio::buffer(&resp, sizeof(resp)));
}

// Round up to next multiple of 8 (wire buffer alignment)
inline size_t wireAlign(size_t n) { return (n + 7) & ~size_t(7); }

// Filesystem cache for deferred mip command bytes.
// Persists WriteTexture wire commands to disk so subsequent connections
// can replay them immediately without waiting for server streaming.
namespace fs = std::filesystem;

fs::path mipCacheDir(const std::string& host, uint16_t port) {
    const char* home = std::getenv("HOME");
    if (!home) home = "/tmp";
    return fs::path(home) / ".cache" / "sq" / "mips"
        / (host + "_" + std::to_string(port));
}

// Content-addressable cache: filename is the hex hash of the tail bytes.
// Lookup is O(1) — just check if the file exists. No hash recomputation.

fs::path mipCachePath(const fs::path& dir, uint64_t hash) {
    char hex[17];
    std::snprintf(hex, sizeof(hex), "%016llx", static_cast<unsigned long long>(hash));
    return dir / (std::string(hex) + ".bin");
}

void saveMipToCache(const fs::path& dir, const char* tail, size_t tailSize) {
    std::error_code ec;
    fs::create_directories(dir, ec);
    if (ec) return;
    uint64_t hash = wire::fnv1a64(tail, tailSize);
    auto path = mipCachePath(dir, hash);
    if (fs::exists(path)) return; // already cached
    std::ofstream f(path, std::ios::binary);
    if (f) f.write(tail, tailSize);
}

std::vector<char> loadMipFromCache(const fs::path& dir, uint64_t hash) {
    auto path = mipCachePath(dir, hash);
    std::ifstream f(path, std::ios::binary | std::ios::ate);
    if (!f) return {};
    auto size = static_cast<std::streamoff>(f.tellg());
    if (size <= 0) return {};
    f.seekg(0);
    std::vector<char> tail(static_cast<size_t>(size));
    if (!f.read(tail.data(), size)) return {};
    return tail;
}

void MipTracker::scanCommands(const char* data, size_t size) {
    using namespace wire_obs;
    size_t pos = 0;

    while (pos + kMinCmdBytes <= size) {
        uint64_t cmdSize;
        std::memcpy(&cmdSize, data + pos, sizeof(cmdSize));
        if (cmdSize < kMinCmdBytes || pos + cmdSize > size)
            break;

        uint32_t cmdId;
        std::memcpy(&cmdId, data + pos + kCmdHeaderSize, sizeof(cmdId));

        // Track TextureCreateView: always update nextViewId; track truncated views (baseMip > 0)
        if (cmdId == kTextureCreateView &&
            cmdSize >= kCreateViewResultIdOffset + sizeof(uint32_t)) {
            uint32_t viewId;
            std::memcpy(&viewId, data + pos + kCreateViewResultIdOffset, sizeof(viewId));
            nextViewId = std::max(nextViewId, viewId + 1);

            if (cmdSize >= kCreateViewMipCountOffset + sizeof(uint32_t)) {
                uint32_t hasDesc;
                std::memcpy(&hasDesc, data + pos + kCreateViewHasDescOffset, sizeof(hasDesc));
                if (hasDesc) {
                    uint32_t baseMip, mipCount, texId;
                    std::memcpy(&baseMip, data + pos + kCreateViewBaseMipOffset, sizeof(baseMip));
                    std::memcpy(&mipCount, data + pos + kCreateViewMipCountOffset, sizeof(mipCount));
                    std::memcpy(&texId, data + pos + kCreateViewSelfOffset, sizeof(texId));

                    if (baseMip > 0) {
                        views[viewId] = {texId, baseMip, mipCount,
                                         {data + pos, data + pos + cmdSize}};
                        SPDLOG_INFO("MipTracker: view={} tex={} baseMip={} mipCount={}",
                                    viewId, texId, baseMip, mipCount);
                    }
                }
            }
        }

        // Track DeviceCreateBindGroup: save command bytes and find referenced views
        if (cmdId == kDeviceCreateBindGroup && cmdSize >= kBindGroupDescSize) {
            uint32_t bgId;
            std::memcpy(&bgId, data + pos + kCreateBindGroupResultIdOffset, sizeof(bgId));
            nextBgId = std::max(nextBgId, bgId + 1);

            // Check if this bind group has chain extensions (skip if so — our game doesn't use them)
            uint32_t hasChain;
            std::memcpy(&hasChain, data + pos + kBindGroupDescHasChainOffset, sizeof(hasChain));
            if (!hasChain) {
                // Compute entry array offset: after descriptor, skip label string data
                size_t entriesOffset = kBindGroupDescSize;

                bool hasLabel;
                std::memcpy(&hasLabel, data + pos + kBindGroupDescLabelHasDataOffset, sizeof(hasLabel));
                if (hasLabel) {
                    uint64_t labelLen;
                    std::memcpy(&labelLen, data + pos + kBindGroupDescLabelLengthOffset, sizeof(labelLen));
                    entriesOffset += wireAlign(labelLen);
                }

                uint64_t entryCount;
                std::memcpy(&entryCount, data + pos + kBindGroupDescEntryCountOffset, sizeof(entryCount));

                // Scan entries for tracked view IDs
                std::vector<uint32_t> refViews;
                std::vector<size_t> viewOffsets;

                for (uint64_t i = 0; i < entryCount; ++i) {
                    size_t entryStart = entriesOffset + i * kBindGroupEntrySize;
                    size_t viewFieldOffset = entryStart + kBindGroupEntryTextureViewOffset;
                    if (viewFieldOffset + sizeof(uint32_t) > cmdSize) break;

                    uint32_t viewId;
                    std::memcpy(&viewId, data + pos + viewFieldOffset, sizeof(viewId));

                    if (views.count(viewId)) {
                        refViews.push_back(viewId);
                        viewOffsets.push_back(viewFieldOffset);
                    }
                }

                if (!refViews.empty()) {
                    bindGroups[bgId] = {{data + pos, data + pos + cmdSize},
                                        std::move(refViews), std::move(viewOffsets)};
                    SPDLOG_INFO("MipTracker: bindGroup={} references {} tracked view(s)",
                                bgId, bindGroups[bgId].referencedViews.size());
                }
            }
        }

        pos += cmdSize;
    }
}

int MipTracker::processDeferredMip(uint32_t textureId, uint32_t mipLevel,
                                    dawn::wire::WireServer& wireServer,
                                    dawn::wire::CommandSerializer& serializer) {
    using namespace wire_obs;
    int updatedBindGroups = 0;

    // Find views referencing this texture
    for (auto& [viewId, view] : views) {
        if (view.textureId != textureId) continue;
        if (mipLevel >= view.baseMipLevel) continue; // not extending the range

        uint32_t oldBase = view.baseMipLevel;
        uint32_t totalMips = view.baseMipLevel + view.mipLevelCount;
        uint32_t newBase = mipLevel;
        uint32_t newCount = totalMips - newBase;

        // Fabricate a new TextureCreateView with updated baseMipLevel
        std::vector<char> viewCmd = view.cmdBytes; // copy
        uint32_t newViewId = nextViewId++;
        uint32_t newViewGen = 0;

        std::memcpy(viewCmd.data() + kCreateViewResultIdOffset, &newViewId, sizeof(newViewId));
        std::memcpy(viewCmd.data() + kCreateViewResultGenOffset, &newViewGen, sizeof(newViewGen));
        std::memcpy(viewCmd.data() + kCreateViewBaseMipOffset, &newBase, sizeof(newBase));
        std::memcpy(viewCmd.data() + kCreateViewMipCountOffset, &newCount, sizeof(newCount));

        const volatile char* result = wireServer.HandleCommands(viewCmd.data(), viewCmd.size());
        if (result == nullptr) {
            SPDLOG_ERROR("Failed to fabricate TextureView: tex={} view={} → {}",
                        textureId, viewId, newViewId);
            continue;
        }
        serializer.Flush();

        SPDLOG_INFO("Fabricated TextureView: id={} tex={} baseMip {} → {}, count {} → {}",
                    newViewId, textureId, oldBase, newBase, view.mipLevelCount, newCount);

        // Update view tracking
        view.baseMipLevel = newBase;
        view.mipLevelCount = newCount;
        // Update saved command bytes to reflect new state (for future fabrications)
        view.cmdBytes = std::move(viewCmd);

        // Fabricate new bind groups referencing the new view
        for (auto& [bgId, bg] : bindGroups) {
            bool affected = false;
            for (size_t i = 0; i < bg.referencedViews.size(); ++i) {
                if (bg.referencedViews[i] == viewId) {
                    affected = true;
                    break;
                }
            }
            if (!affected) continue;

            std::vector<char> bgCmd = bg.cmdBytes; // copy
            uint32_t newBgId = nextBgId++;
            uint32_t newBgGen = 0;

            // Patch result handle
            std::memcpy(bgCmd.data() + kCreateBindGroupResultIdOffset, &newBgId, sizeof(newBgId));
            std::memcpy(bgCmd.data() + kCreateBindGroupResultGenOffset, &newBgGen, sizeof(newBgGen));

            // Patch view handle in entries
            for (size_t i = 0; i < bg.referencedViews.size(); ++i) {
                if (bg.referencedViews[i] == viewId) {
                    std::memcpy(bgCmd.data() + bg.viewIdOffsets[i], &newViewId, sizeof(newViewId));
                }
            }

            const volatile char* bgResult = wireServer.HandleCommands(bgCmd.data(), bgCmd.size());
            if (bgResult == nullptr) {
                SPDLOG_ERROR("Failed to fabricate BindGroup: bg={} → {}", bgId, newBgId);
                continue;
            }
            serializer.Flush();

            SPDLOG_INFO("Fabricated BindGroup: {} → {} (new view={})", bgId, newBgId, newViewId);

            // Update rewrite table: map original client bgId → latest fabricated bgId
            // Find the original ID (walk back any existing rewrite chain)
            uint32_t originalBgId = bgId;
            for (auto& [orig, latest] : bindGroupRewrites) {
                if (latest == bgId) {
                    originalBgId = orig;
                    break;
                }
            }
            bindGroupRewrites[originalBgId] = newBgId;

            // Update bind group tracking with new command bytes and view references
            bg.cmdBytes = std::move(bgCmd);
            // Update the referenced view IDs to point to the new view
            for (size_t i = 0; i < bg.referencedViews.size(); ++i) {
                if (bg.referencedViews[i] == viewId) {
                    bg.referencedViews[i] = newViewId;
                }
            }

            updatedBindGroups++;
        }

        // Update view ID in the tracking map (old viewId → newViewId)
        // We need to update bind groups' referencedViews that point to this view
        ViewInfo updatedView = std::move(views[viewId]);
        views.erase(viewId);
        views[newViewId] = std::move(updatedView);

        // Update bind groups' referencedViews to point to new view ID
        for (auto& [bgId2, bg2] : bindGroups) {
            for (auto& ref : bg2.referencedViews) {
                if (ref == viewId) ref = newViewId;
            }
        }

        // Only one view per texture in our setup, but break to avoid iterator invalidation
        break;
    }

    return updatedBindGroups;
}

void MipTracker::rewriteSetBindGroups(char* data, size_t size) {
    using namespace wire_obs;
    if (bindGroupRewrites.empty()) return;

    size_t pos = 0;
    while (pos + kMinCmdBytes <= size) {
        uint64_t cmdSize;
        std::memcpy(&cmdSize, data + pos, sizeof(cmdSize));
        if (cmdSize < kMinCmdBytes || pos + cmdSize > size)
            break;

        uint32_t cmdId;
        std::memcpy(&cmdId, data + pos + kCmdHeaderSize, sizeof(cmdId));

        if (cmdId == kRenderPassEncoderSetBindGroup &&
            cmdSize >= kSetBindGroupGroupOffset + sizeof(uint32_t)) {
            uint32_t groupId;
            std::memcpy(&groupId, data + pos + kSetBindGroupGroupOffset, sizeof(groupId));

            auto it = bindGroupRewrites.find(groupId);
            if (it != bindGroupRewrites.end()) {
                std::memcpy(data + pos + kSetBindGroupGroupOffset,
                            &it->second, sizeof(it->second));
            }
        }

        pos += cmdSize;
    }
}

} // namespace

struct Receiver::M {
    std::string host;
    uint16_t port;
    int width;
    int height;
    int pixelWidth = 0;
    int pixelHeight = 0;
    int backoffMs = 10;
    bool maximized = false;

    SDL_Window* window = nullptr;

    std::unique_ptr<dawn::native::Instance> dawnInstance;
    wgpu::Adapter adapter;
    wgpu::Device device;
    wgpu::Queue queue;
    wgpu::Surface surface;
    wgpu::TextureFormat swapChainFormat = wgpu::TextureFormat::BGRA8Unorm;

    void initWindow();
    void initGpu();
    ConnectionResult connectAndRun();
};

Receiver::Receiver(std::string host, uint16_t port, int width, int height,
                   bool maximized)
    : m(std::make_unique<M>()) {
    m->host = std::move(host);
    m->port = port;
    m->width = width;
    m->height = height;
    m->maximized = maximized;
}

Receiver::~Receiver() = default;

int Receiver::run() {
    try {
        m->initWindow();
        m->initGpu();

        while (true) {
            auto result = m->connectAndRun();
            if (result == ConnectionResult::Quit)
                break;

            SPDLOG_INFO("Reconnecting in {}ms...", m->backoffMs);
            SDL_Delay(m->backoffMs);
            m->backoffMs = std::min(m->backoffMs * 2, 2000);

            SDL_Event event;
            while (SDL_PollEvent(&event)) {
                if (event.type == SDL_EVENT_QUIT)
                    return 0;
                if (event.type == SDL_EVENT_KEY_DOWN && event.key.key == SDLK_Q)
                    return 0;
            }
        }
        return 0;
    } catch (const std::exception& e) {
        SPDLOG_ERROR("Fatal error: {}", e.what());
        return 1;
    }
}

void Receiver::M::initWindow() {
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        throw std::runtime_error(std::string("SDL_Init failed: ") + SDL_GetError());
    }

    SPDLOG_INFO("SDL3 initialized");

    SDL_WindowFlags flags = platform::windowFlags();
    if (maximized) flags |= SDL_WINDOW_MAXIMIZED | SDL_WINDOW_RESIZABLE;
    window = SDL_CreateWindow("Wire Receiver", width, height, flags);
    if (!window) {
        SDL_Quit();
        throw std::runtime_error(std::string("SDL_CreateWindow failed: ") + SDL_GetError());
    }

    SDL_GetWindowSizeInPixels(window, &pixelWidth, &pixelHeight);
    SPDLOG_INFO("Window created: {}x{} ({}x{} pixels)", width, height, pixelWidth, pixelHeight);
}

void Receiver::M::initGpu() {
    SPDLOG_INFO("Initializing native WebGPU...");

    dawnProcSetProcs(&dawn::native::GetProcs());

    wgpu::InstanceDescriptor instanceDesc{};
    dawnInstance = std::make_unique<dawn::native::Instance>(&instanceDesc);

    auto rawSurface = platform::createSurface(dawnInstance->Get(), window);
    if (!rawSurface) {
        throw std::runtime_error("Failed to create WebGPU surface");
    }
    surface = wgpu::Surface::Acquire(rawSurface);

    wgpu::RequestAdapterOptions adapterOpts{
        .powerPreference = wgpu::PowerPreference::HighPerformance,
        .compatibleSurface = surface,
    };
    auto adapters = dawnInstance->EnumerateAdapters(&adapterOpts);
    if (adapters.empty()) {
        throw std::runtime_error("No WebGPU adapters found");
    }
    adapter = wgpu::Adapter(adapters[0].Get());

    wgpu::AdapterInfo info{};
    adapter.GetInfo(&info);
    SPDLOG_INFO("WebGPU adapter: {} ({})",
                std::string_view(info.device.data, info.device.length),
                std::string_view(info.description.data, info.description.length));

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

    device = adapter.CreateDevice(&deviceDesc);
    if (!device) {
        throw std::runtime_error("Failed to create WebGPU device");
    }

    queue = device.GetQueue();

    wgpu::SurfaceCapabilities caps{};
    surface.GetCapabilities(adapter, &caps);
    swapChainFormat = caps.formatCount > 0 ? caps.formats[0] : wgpu::TextureFormat::BGRA8Unorm;

    SPDLOG_INFO("WebGPU initialized: format={}", static_cast<int>(swapChainFormat));
}

ConnectionResult Receiver::M::connectAndRun() {
    asio::io_context io;
    asio::ip::tcp::socket socket(io);

    SPDLOG_INFO("Connecting to {}:{}...", host, port);
    try {
        asio::ip::tcp::resolver resolver(io);
        auto endpoints = resolver.resolve(host, std::to_string(port));
        asio::connect(socket, endpoints);
    } catch (const std::exception& e) {
        SPDLOG_WARN("Connection failed: {}", e.what());
        return ConnectionResult::Disconnected;
    }
    SPDLOG_INFO("Connected to game server");

    // Sync the GPU layer's drawable size with the window — on iOS the
    // CAMetalLayer may not auto-resize after rotation.
    platform::syncDrawableSize(window, &pixelWidth, &pixelHeight);
    SDL_GetWindowSize(window, &width, &height);
    SPDLOG_INFO("DeviceInfo: {}x{} pixels ({}x{} points)", pixelWidth, pixelHeight, width, height);

    wire::DeviceInfo deviceInfo{};
    deviceInfo.width = static_cast<uint16_t>(pixelWidth);
    deviceInfo.height = static_cast<uint16_t>(pixelHeight);
    deviceInfo.pixelRatio = static_cast<uint16_t>(width > 0 ? pixelWidth / width : 2);
    deviceInfo.preferredFormat = static_cast<uint32_t>(swapChainFormat);

    try {
        asio::write(socket, asio::buffer(&deviceInfo, sizeof(deviceInfo)));
    } catch (const std::exception& e) {
        SPDLOG_WARN("Failed to send DeviceInfo: {}", e.what());
        return ConnectionResult::Disconnected;
    }
    SPDLOG_INFO("Sent DeviceInfo");

    wire::SessionInit sessionInit{};
    try {
        asio::read(socket, asio::buffer(&sessionInit, sizeof(sessionInit)));
    } catch (const std::exception& e) {
        SPDLOG_WARN("Failed to read SessionInit: {}", e.what());
        return ConnectionResult::Disconnected;
    }
    if (sessionInit.magic != wire::kSessionInitMagic) {
        SPDLOG_WARN("Invalid SessionInit magic");
        return ConnectionResult::Disconnected;
    }
    SPDLOG_INFO("Received SessionInit with instance handle={{id={}, gen={}}}",
                sessionInit.instanceHandle.id, sessionInit.instanceHandle.generation);

    auto serializer = std::make_unique<SocketSerializer>(socket);
    dawn::wire::WireServerDescriptor serverDesc{
        .procs = &dawn::native::GetProcs(),
        .serializer = serializer.get(),
    };
    auto wireServer = std::make_unique<dawn::wire::WireServer>(serverDesc);

    dawn::wire::Handle instanceHandle{sessionInit.instanceHandle.id, sessionInit.instanceHandle.generation};
    if (!wireServer->InjectInstance(dawnInstance->Get(), instanceHandle)) {
        SPDLOG_WARN("Failed to inject instance");
        return ConnectionResult::Disconnected;
    }
    SPDLOG_INFO("Injected native instance");

    dawn::wire::Handle surfaceHandle{sessionInit.surfaceHandle.id, sessionInit.surfaceHandle.generation};
    if (!wireServer->InjectSurface(surface.Get(), surfaceHandle, instanceHandle)) {
        SPDLOG_WARN("Failed to inject surface");
        return ConnectionResult::Disconnected;
    }
    SPDLOG_INFO("Injected native surface");

    wire::SessionReady sessionReady{};
    try {
        asio::write(socket, asio::buffer(&sessionReady, sizeof(sessionReady)));
    } catch (const std::exception& e) {
        SPDLOG_WARN("Failed to send SessionReady: {}", e.what());
        return ConnectionResult::Disconnected;
    }
    SPDLOG_INFO("Sent SessionReady, entering render loop");

    backoffMs = 10;

    SPDLOG_INFO("Starting render loop...");
    std::vector<char> commandBuffer;
    commandBuffer.reserve(64 * 1024);
    MipTracker mipTracker;
    auto cacheDir = mipCacheDir(host, port);

    while (true) {
        SDL_Event event;
        while (SDL_PollEvent(&event)) {
            switch (event.type) {
                case SDL_EVENT_QUIT:
                    return ConnectionResult::Quit;
                case SDL_EVENT_KEY_DOWN:
                    if (event.key.key == SDLK_Q)
                        return ConnectionResult::Quit;
                    break;
                case SDL_EVENT_WINDOW_PIXEL_SIZE_CHANGED:
                case SDL_EVENT_MOUSE_BUTTON_DOWN:
                case SDL_EVENT_MOUSE_BUTTON_UP:
                case SDL_EVENT_MOUSE_MOTION:
                case SDL_EVENT_FINGER_DOWN:
                case SDL_EVENT_FINGER_MOTION:
                case SDL_EVENT_FINGER_UP:
                    try {
                        sendEvent(socket, event);
                    } catch (const std::exception&) {
                        SPDLOG_WARN("Connection lost (event send)");
                        return ConnectionResult::Disconnected;
                    }
                    break;
            }
        }

        io.poll();

        if (socket.is_open()) {
            asio::error_code availEc;
            size_t avail = socket.available(availEc);
            if (availEc) {
                SPDLOG_WARN("Connection lost (available check): {}", availEc.message());
                return ConnectionResult::Disconnected;
            }
            if (avail == 0) {
                char peekBuf;
                socket.non_blocking(true);
                asio::error_code peekEc;
                socket.receive(asio::buffer(&peekBuf, 1), asio::ip::tcp::socket::message_peek, peekEc);
                socket.non_blocking(false);
                if (peekEc == asio::error::eof) {
                    SPDLOG_WARN("Connection closed by server");
                    return ConnectionResult::Disconnected;
                }
            }
        }

        while (socket.is_open() && socket.available() > 0) {
            wire::MessageHeader header{};
            asio::error_code ec;
            asio::read(socket, asio::buffer(&header, sizeof(header)), ec);

            if (ec) {
                SPDLOG_WARN("Connection lost (header read): {}", ec.message());
                return ConnectionResult::Disconnected;
            }

            if (header.magic == wire::kWireCommandMagic) {
                if (header.length > wire::kMaxMessageSize) {
                    SPDLOG_WARN("Message too large: {} bytes", header.length);
                    return ConnectionResult::Disconnected;
                }

                commandBuffer.resize(header.length);
                asio::read(socket, asio::buffer(commandBuffer.data(), header.length), ec);

                if (ec) {
                    SPDLOG_WARN("Connection lost (payload read): {}", ec.message());
                    return ConnectionResult::Disconnected;
                }

                // Track texture views and bind groups for deferred mip delivery
                mipTracker.scanCommands(commandBuffer.data(), commandBuffer.size());

                // Rewrite SetBindGroup commands to use fabricated bind groups
                mipTracker.rewriteSetBindGroups(commandBuffer.data(), commandBuffer.size());

                const volatile char* result = wireServer->HandleCommands(
                    commandBuffer.data(), commandBuffer.size());
                if (result == nullptr) {
                    SPDLOG_ERROR("WireServer failed to handle commands");
                }

                serializer->Flush();
            } else if (header.magic == wire::kDeferredMipMagic) {
                if (header.length < sizeof(wire::DeferredMipHeader)) {
                    SPDLOG_WARN("Deferred mip message too small");
                    return ConnectionResult::Disconnected;
                }

                wire::DeferredMipHeader dh{};
                asio::read(socket, asio::buffer(&dh, sizeof(dh)), ec);
                if (ec) {
                    SPDLOG_WARN("Connection lost (deferred mip header): {}", ec.message());
                    return ConnectionResult::Disconnected;
                }

                commandBuffer.resize(dh.commandSize);
                asio::read(socket, asio::buffer(commandBuffer.data(), dh.commandSize), ec);
                if (ec) {
                    SPDLOG_WARN("Connection lost (deferred mip data): {}", ec.message());
                    return ConnectionResult::Disconnected;
                }

                if (dh.hashOnly) {
                    // Hash probe: commandBuffer = head[128] + hash[8]
                    if (dh.commandSize < wire::kMipHeadSize + sizeof(uint64_t)) {
                        SPDLOG_WARN("Mip probe too small");
                        try { sendMipCacheMiss(socket, dh.textureId, dh.mipLevel); } catch (...) {}
                    } else {
                        uint64_t serverHash;
                        std::memcpy(&serverHash, commandBuffer.data() + wire::kMipHeadSize,
                                    sizeof(serverHash));

                        auto cachedTail = loadMipFromCache(cacheDir, serverHash);

                        if (!cachedTail.empty()) {
                            // Reconstruct full command: head + cached tail
                            std::vector<char> fullCmd(wire::kMipHeadSize + cachedTail.size());
                            std::memcpy(fullCmd.data(), commandBuffer.data(), wire::kMipHeadSize);
                            std::memcpy(fullCmd.data() + wire::kMipHeadSize,
                                        cachedTail.data(), cachedTail.size());

                            const volatile char* result = wireServer->HandleCommands(
                                fullCmd.data(), fullCmd.size());
                            if (result == nullptr) {
                                SPDLOG_WARN("Cached mip rejected: tex={} level={}, sending MISS",
                                            dh.textureId, dh.mipLevel);
                                std::error_code fsec;
                                fs::remove(mipCachePath(cacheDir, serverHash), fsec);
                                try { sendMipCacheMiss(socket, dh.textureId, dh.mipLevel); } catch (...) {}
                            } else {
                                SPDLOG_INFO("Mip cache HIT: tex={} level={} ({:.1f} KB)",
                                            dh.textureId, dh.mipLevel,
                                            (wire::kMipHeadSize + cachedTail.size()) / 1024.0);
                                mipTracker.processDeferredMip(dh.textureId, dh.mipLevel,
                                                               *wireServer, *serializer);
                                try { sendMipCacheHit(socket, dh.textureId, dh.mipLevel); } catch (...) {}
                            }
                        } else {
                            SPDLOG_INFO("Mip cache MISS: tex={} level={}", dh.textureId, dh.mipLevel);
                            try { sendMipCacheMiss(socket, dh.textureId, dh.mipLevel); } catch (...) {}
                        }
                    }
                } else {
                    // Full data: commandBuffer = head[128] + tail[]
                    const volatile char* result = wireServer->HandleCommands(
                        commandBuffer.data(), commandBuffer.size());
                    if (result == nullptr) {
                        SPDLOG_ERROR("Deferred mip HandleCommands failed: tex={} level={}",
                                    dh.textureId, dh.mipLevel);
                    } else {
                        SPDLOG_INFO("Deferred mip uploaded: tex={} level={} ({:.1f} KB)",
                                    dh.textureId, dh.mipLevel, dh.commandSize / 1024.0);
                        mipTracker.processDeferredMip(dh.textureId, dh.mipLevel,
                                                       *wireServer, *serializer);
                        // Cache only the tail (deterministic pixel data)
                        if (dh.commandSize > wire::kMipHeadSize) {
                            saveMipToCache(cacheDir,
                                           commandBuffer.data() + wire::kMipHeadSize,
                                           dh.commandSize - wire::kMipHeadSize);
                        }
                    }
                }

                serializer->Flush();
                break; // yield so a frame can render with updated quality
            } else if (header.magic == wire::kFrameEndMagic) {
                wire::MessageHeader ready{wire::kFrameReadyMagic, 0};
                asio::write(socket, asio::buffer(&ready, sizeof(ready)));
                break; // yield to SDL event polling
            } else {
                SPDLOG_WARN("Unknown message magic: 0x{:08X}", header.magic);
                return ConnectionResult::Disconnected;
            }
        }

        SDL_Delay(1);
    }
}
