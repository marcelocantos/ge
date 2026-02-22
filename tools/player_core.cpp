// Player — shared wire rendering player implementation.
// Platform-specific entry points: player.cpp (desktop), ios/main.mm (iOS).

#include "Player.h"
#include "AudioPlayer.h"
#include "QRScanner.h"
#include "player_platform.h"

#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>
#include <dawn/native/DawnNative.h>
#include <dawn/dawn_proc.h>
#include <dawn/wire/WireServer.h>
#include <webgpu/webgpu_cpp.h>

#include <ge/Protocol.h>

// Engine headers for WebSocket
#include "../src/WebSocketClient.h"
#include "../src/WebSocketSerializer.h"

#include <filesystem>
#include <fstream>
#include <memory>
#include <string>
#include <unordered_map>
#include <vector>

namespace {

enum class ConnectionResult { Quit, Disconnected };

// Dawn wire command constants for observing texture/view/bind group creation.
// Values from WireCmd_autogen.h — must match the Dawn version in ge/vendor/dawn.
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

// UnregisterObject command layout (wire-aligned to 24 bytes):
//   CmdHeader (8) + WireCmd (4) + ObjectType (4) + ObjectId (4) + pad (4)
// The struct inherits from CmdHeader (uint64_t) so alignment is 8, and
// sizeof(UnregisterObjectTransfer) = 24 (20 bytes data, 4 bytes padding).
// Values from WireCmd_autogen.h / ObjectType_autogen.h — Dawn commit 4764cd21.
constexpr uint32_t kWireCmdUnregisterObject = 149;
constexpr size_t kUnregisterObjectCmdSize = 24;      // wire-aligned sizeof
constexpr size_t kUnregisterObjectTypeOffset = 12;   // ObjectType after CmdHeader + WireCmd
constexpr size_t kUnregisterObjectIdOffset = 16;     // ObjectId after ObjectType

// ObjectType enum values (from ObjectType_autogen.h)
constexpr uint32_t kObjectTypeDevice = 6;
constexpr uint32_t kObjectTypeSurface = 17;
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

// Round up to next multiple of 8 (wire buffer alignment)
inline size_t wireAlign(size_t n) { return (n + 7) & ~size_t(7); }

// Filesystem cache for deferred mip command bytes.
// Persists WriteTexture wire commands to disk so subsequent connections
// can replay them immediately without waiting for server streaming.
namespace fs = std::filesystem;

fs::path mipCacheDir(const std::string& host, uint16_t port) {
    const char* home = std::getenv("HOME");
    if (!home) home = "/tmp";
    return fs::path(home) / ".cache" / "ge" / "mips"
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

// Build a synthetic UnregisterObject wire command for a single object.
std::array<char, wire_obs::kUnregisterObjectCmdSize>
buildUnregisterObjectCmd(uint32_t objectType, uint32_t objectId) {
    using namespace wire_obs;
    std::array<char, kUnregisterObjectCmdSize> buf{};
    uint64_t cmdSize = kUnregisterObjectCmdSize;
    uint32_t wireCmd = kWireCmdUnregisterObject;
    std::memcpy(buf.data(), &cmdSize, sizeof(cmdSize));
    std::memcpy(buf.data() + kCmdHeaderSize, &wireCmd, sizeof(wireCmd));
    std::memcpy(buf.data() + kUnregisterObjectTypeOffset, &objectType, sizeof(objectType));
    std::memcpy(buf.data() + kUnregisterObjectIdOffset, &objectId, sizeof(objectId));
    return buf;
}

// Filter out UnregisterObject(Device) commands from a wire command buffer.
// The server's WireClient destructor sends UnregisterObject for all objects.
// If the Device is unregistered, its FencedDeleter is nulled while the
// surface's swapchain still holds UniqueVkHandle references — causing a
// crash on Vulkan (Android) when the surface is recycled.
// Returns the filtered buffer. If no Device UnregisterObjects are found,
// returns an empty vector (caller should use the original buffer).
std::vector<char> filterDeviceUnregister(const char* data, size_t size) {
    using namespace wire_obs;

    // Quick scan: is there any UnregisterObject(Device) in this buffer?
    bool found = false;
    size_t pos = 0;
    while (pos + kMinCmdBytes <= size) {
        uint64_t cmdSize;
        std::memcpy(&cmdSize, data + pos, sizeof(cmdSize));
        if (cmdSize < kMinCmdBytes || pos + cmdSize > size) break;

        if (cmdSize == kUnregisterObjectCmdSize) {
            uint32_t objectType;
            std::memcpy(&objectType, data + pos + kUnregisterObjectTypeOffset,
                        sizeof(objectType));
            if (objectType == kObjectTypeDevice) {
                found = true;
                break;
            }
        }
        pos += static_cast<size_t>(cmdSize);
    }

    if (!found) return {};  // nothing to filter

    // Rebuild the buffer without UnregisterObject(Device) commands.
    std::vector<char> filtered;
    filtered.reserve(size);
    pos = 0;
    while (pos + kMinCmdBytes <= size) {
        uint64_t cmdSize;
        std::memcpy(&cmdSize, data + pos, sizeof(cmdSize));
        if (cmdSize < kMinCmdBytes || pos + cmdSize > size) break;

        bool skip = false;
        if (cmdSize == kUnregisterObjectCmdSize) {
            uint32_t objectType;
            std::memcpy(&objectType, data + pos + kUnregisterObjectTypeOffset,
                        sizeof(objectType));
            if (objectType == kObjectTypeDevice) {
                SPDLOG_INFO("Filtered UnregisterObject(Device) — keeping device "
                            "alive for surface recycling");
                skip = true;
            }
        }

        if (!skip) {
            filtered.insert(filtered.end(), data + pos,
                            data + pos + static_cast<size_t>(cmdSize));
        }
        pos += static_cast<size_t>(cmdSize);
    }
    return filtered;
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

struct Player::M {
    std::string host;
    uint16_t port;
    int width;
    int height;
    int pixelWidth = 0;
    int pixelHeight = 0;
    int backoffMs = 10;
    bool maximized = false;
    bool headless = false;
    int maxRetries = -1;  // -1 = unlimited

    SDL_Window* window = nullptr;

    std::unique_ptr<dawn::native::Instance> dawnInstance;
    wgpu::Adapter adapter;
    wgpu::Device device;
    wgpu::Queue queue;
    wgpu::Surface surface;
    wgpu::TextureFormat swapChainFormat = wgpu::TextureFormat::BGRA8Unorm;

    ~M() {
        // Surface cleanup happens in connectAndRun() while the wire device is
        // still alive (see recycleSurface). By the time ~M() runs the surface
        // is either already clean or was never configured, so a normal release
        // is safe.
        surface = {};
        device = {};
        queue = {};
        adapter = {};
        dawnInstance.reset();
        if (window) {
            SDL_DestroyWindow(window);
            window = nullptr;
        }
        // Balance the SDL_Init(SDL_INIT_VIDEO) in initWindow() so that the
        // subsystem ref count doesn't accumulate across playerLoop iterations.
        SDL_QuitSubSystem(SDL_INIT_VIDEO);
    }

    // Destroy the surface (releasing its swapchain's VkSurfaceKHR via the
    // wire-created device's FencedDeleter) and recreate it from the same
    // window.  MUST be called while the WireServer is still alive so the
    // native device can flush the deletion.
    void recycleSurface() {
        surface.Unconfigure();
        surface = {};  // destructor → DetachFromSurface → queues VkSurfaceKHR deletion
        surface = wgpu::Surface::Acquire(
            platform::createSurface(dawnInstance->Get(), window));
    }

    void initWindow();
    void initGpu();
    // Poll events while attempting WebSocket connection in background.
    // Returns the connection (nullptr on failure), or sets quit=true if user quit.
    std::shared_ptr<ge::WsConnection> connectWithUI(bool& quit);
    ConnectionResult connectAndRun();
};

Player::Player(std::string host, uint16_t port, int width, int height,
                   bool maximized, int maxRetries, bool headless)
    : m(std::make_unique<M>()) {
    m->host = std::move(host);
    m->port = port;
    m->width = width;
    m->height = height;
    m->maximized = maximized;
    m->headless = headless;
    m->maxRetries = maxRetries;
}

Player::~Player() = default;

int Player::run() {
    try {
        m->initWindow();
        m->initGpu();

        int retries = 0;
        while (true) {
            auto result = m->connectAndRun();
            if (result == ConnectionResult::Quit)
                break;

            ++retries;
            if (m->maxRetries >= 0 && retries > m->maxRetries) {
                SPDLOG_INFO("Max retries ({}) exceeded, giving up", m->maxRetries);
                break;
            }

            // Backoff is handled inside connectWithUI() on the next iteration
            m->backoffMs = std::min(m->backoffMs * 2, 2000);
        }
        return 0;
    } catch (const std::exception& e) {
        SPDLOG_ERROR("Fatal error: {}", e.what());
        return 1;
    }
}

void Player::M::initWindow() {
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        throw std::runtime_error(std::string("SDL_Init failed: ") + SDL_GetError());
    }

    SPDLOG_INFO("SDL3 initialized");

    // Allow all orientations on mobile so the player can rotate freely
    SDL_SetHint(SDL_HINT_ORIENTATIONS, "Portrait LandscapeLeft LandscapeRight PortraitUpsideDown");

    SDL_WindowFlags flags = platform::windowFlags();
    if (maximized) flags |= SDL_WINDOW_MAXIMIZED | SDL_WINDOW_RESIZABLE;
    if (headless) flags |= SDL_WINDOW_HIDDEN;
    flags |= SDL_WINDOW_RESIZABLE;
    window = SDL_CreateWindow("Squz Player", width, height, flags);
    if (!window) {
        SDL_Quit();
        throw std::runtime_error(std::string("SDL_CreateWindow failed: ") + SDL_GetError());
    }

    // Activate after SDL_Init + window creation so NSApp exists on macOS
    platform::activateApp();

    SDL_GetWindowSizeInPixels(window, &pixelWidth, &pixelHeight);
    SPDLOG_INFO("Window created: {}x{} ({}x{} pixels)", width, height, pixelWidth, pixelHeight);
}

void Player::M::initGpu() {
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

std::shared_ptr<ge::WsConnection> Player::M::connectWithUI(bool& quit) {
    quit = false;

    // Show connecting status in window title (no GPU rendering — surface
    // stays unconfigured so the wire session gets a pristine surface).
    std::string title = "Squz Player \xe2\x80\x94 Connecting to " + host + ":" + std::to_string(port) + "...";
    SDL_SetWindowTitle(window, title.c_str());

    // Backoff delay: poll events while waiting before next attempt
    if (backoffMs > 10) {
        SPDLOG_INFO("Reconnecting in {}ms...", backoffMs);
        auto waitUntil = SDL_GetTicks() + backoffMs;
        while (SDL_GetTicks() < waitUntil) {
            SDL_Event ev;
            while (SDL_PollEvent(&ev)) {
                if (ev.type == SDL_EVENT_QUIT ||
                    (ev.type == SDL_EVENT_KEY_DOWN && ev.key.key == SDLK_Q)) {
                    SDL_SetWindowTitle(window, "Squz Player");
                    quit = true;
                    return nullptr;
                }
                if (ev.type == SDL_EVENT_WINDOW_PIXEL_SIZE_CHANGED)
                    SDL_GetWindowSizeInPixels(window, &pixelWidth, &pixelHeight);
            }
            SDL_Delay(16);
        }
    }

    // Launch connection in background thread
    std::shared_ptr<ge::WsConnection> result;
    std::atomic<bool> done{false};
    std::thread connThread([&] {
        result = ge::connectWebSocket(host, port, "/ws/wire");
        done.store(true, std::memory_order_release);
    });

    // Poll events while waiting for connection
    while (!done.load(std::memory_order_acquire)) {
        SDL_Event ev;
        while (SDL_PollEvent(&ev)) {
            if (ev.type == SDL_EVENT_QUIT ||
                (ev.type == SDL_EVENT_KEY_DOWN && ev.key.key == SDLK_Q)) {
                connThread.join();
                SDL_SetWindowTitle(window, "Squz Player");
                quit = true;
                return nullptr;
            }
            if (ev.type == SDL_EVENT_WINDOW_PIXEL_SIZE_CHANGED)
                SDL_GetWindowSizeInPixels(window, &pixelWidth, &pixelHeight);
        }
        SDL_Delay(16);
    }

    connThread.join();

    if (result) {
        SPDLOG_INFO("Connected via WebSocket");
        backoffMs = 10;
    }
    return result;
}

ConnectionResult Player::M::connectAndRun() {
    SPDLOG_INFO("Connecting to {}:{}...", host, port);

    bool quit = false;
    auto wsConn = connectWithUI(quit);
    if (quit) return ConnectionResult::Quit;
    if (!wsConn) {
        SPDLOG_WARN("WebSocket connection failed");
        return ConnectionResult::Disconnected;
    }

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

    // Create serializer for sending responses back to the server
    auto serializer = std::make_unique<ge::WebSocketSerializer>(
        wsConn, wire::kWireResponseMagic);

    // Send DeviceInfo as a protocol message
    serializer->sendMessage(wire::kDeviceInfoMagic, &deviceInfo, sizeof(deviceInfo));
    SPDLOG_INFO("Sent DeviceInfo");

    // Wait for SessionInit (surface stays unconfigured — title bar shows status).
    SDL_SetWindowTitle(window, ("Squz Player \xe2\x80\x94 Waiting for " + host + "...").c_str());
    wire::MessageHeader initHdr{};
    std::vector<char> initPayload;
    auto sessionWaitStart = SDL_GetTicks();
    while (true) {
        if (!wsConn->isOpen()) {
            SPDLOG_WARN("Connection lost waiting for SessionInit");
            SDL_SetWindowTitle(window, "Squz Player");
            return ConnectionResult::Disconnected;
        }
        // Timeout: if no SessionInit within 5s, reconnect.
        if (SDL_GetTicks() - sessionWaitStart > 5000) {
            SPDLOG_WARN("SessionInit timeout — reconnecting");
            SDL_SetWindowTitle(window, "Squz Player");
            return ConnectionResult::Disconnected;
        }
        if (wsConn->available() > 0) {
            if (!serializer->recvMessage(initHdr, initPayload)) {
                SPDLOG_WARN("Failed to read SessionInit");
                SDL_SetWindowTitle(window, "Squz Player");
                return ConnectionResult::Disconnected;
            }
            if (initHdr.magic == wire::kSessionEndMagic) {
                SPDLOG_INFO("Server session ended while waiting for SessionInit");
                SDL_SetWindowTitle(window, "Squz Player");
                return ConnectionResult::Disconnected;
            }
            if (initPayload.size() < sizeof(wire::SessionInit)) {
                SPDLOG_WARN("SessionInit too small");
                SDL_SetWindowTitle(window, "Squz Player");
                return ConnectionResult::Disconnected;
            }
            break;
        }
        SDL_Event ev;
        while (SDL_PollEvent(&ev)) {
            if (ev.type == SDL_EVENT_QUIT ||
                (ev.type == SDL_EVENT_KEY_DOWN && ev.key.key == SDLK_Q)) {
                SDL_SetWindowTitle(window, "Squz Player");
                return ConnectionResult::Quit;
            }
            if (ev.type == SDL_EVENT_WINDOW_PIXEL_SIZE_CHANGED)
                SDL_GetWindowSizeInPixels(window, &pixelWidth, &pixelHeight);
        }
        SDL_Delay(16);
    }
    SDL_SetWindowTitle(window, "Squz Player");

    wire::SessionInit sessionInit{};
    std::memcpy(&sessionInit, initPayload.data(), sizeof(sessionInit));
    if (sessionInit.magic != wire::kSessionInitMagic) {
        SPDLOG_WARN("Invalid SessionInit magic");
        return ConnectionResult::Disconnected;
    }
    SPDLOG_INFO("Received SessionInit with instance handle={{id={}, gen={}}}",
                sessionInit.instanceHandle.id, sessionInit.instanceHandle.generation);

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

    // Send SessionReady
    wire::SessionReady sessionReady{};
    serializer->sendMessage(wire::kSessionReadyMagic, &sessionReady, sizeof(sessionReady));
    SPDLOG_INFO("Sent SessionReady, entering render loop");

    backoffMs = 10;

    SPDLOG_INFO("Starting render loop...");

    // On Android, SDL blocks the native thread when the app is backgrounded
    // (SDL_HINT_ANDROID_BLOCK_ON_PAUSE defaults to true). Lifecycle events are
    // delivered via event watchers, not queued for SDL_PollEvent. We use a flag
    // set by an event watcher; after SDL_PollEvent unblocks on resume, we check
    // it and return to the QR scan screen.
    bool wasBackgrounded = false;
    SDL_EventFilter bgWatcher = [](void* ud, SDL_Event* ev) -> bool {
        if (ev->type == SDL_EVENT_DID_ENTER_BACKGROUND)
            *static_cast<bool*>(ud) = true;
        return true;
    };
    SDL_AddEventWatch(bgWatcher, &wasBackgrounded);
    struct WatcherGuard {
        SDL_EventFilter fn; void* ud;
        ~WatcherGuard() { SDL_RemoveEventWatch(fn, ud); }
    } watcherGuard{bgWatcher, &wasBackgrounded};

    AudioPlayer audioPlayer;
    bool firstFrameLogged = false;

    std::vector<char> commandBuffer;
    commandBuffer.reserve(64 * 1024);
    MipTracker mipTracker;
    auto cacheDir = mipCacheDir(host, port);
    SDL_Sensor* openSensors[7] = {};  // indexed by SDL_SensorType (up to SDL_SENSOR_COUNT)
    struct SensorGuard {
        SDL_Sensor** s; int n;
        ~SensorGuard() {
            for (int i = 0; i < n; i++) if (s[i]) SDL_CloseSensor(s[i]);
            if (SDL_WasInit(SDL_INIT_SENSOR))
                SDL_QuitSubSystem(SDL_INIT_SENSOR);
        }
    } sensorGuard{openSensors, 7};

    // All render loop exits set this and break out of the outer loop.
    // We must call recycleSurface() while the wireServer is still alive
    // (so the wire-created device can flush VkSurfaceKHR deletion).
    ConnectionResult exitResult = ConnectionResult::Disconnected;
    bool exitLoop = false;
    bool serverSentCleanup = false;  // set when we process UnregisterObject commands

    while (!exitLoop) {
        SDL_Event event;
        while (SDL_PollEvent(&event)) {
            switch (event.type) {
                case SDL_EVENT_QUIT:
                    exitResult = ConnectionResult::Quit;
                    exitLoop = true;
                    break;
                case SDL_EVENT_KEY_DOWN:
                    if (event.key.key == SDLK_Q) {
                        exitResult = ConnectionResult::Quit;
                        exitLoop = true;
                        break;
                    }
                    [[fallthrough]];
                case SDL_EVENT_KEY_UP:
                case SDL_EVENT_WINDOW_PIXEL_SIZE_CHANGED:
                case SDL_EVENT_MOUSE_BUTTON_DOWN:
                case SDL_EVENT_MOUSE_BUTTON_UP:
                case SDL_EVENT_MOUSE_MOTION:
                case SDL_EVENT_FINGER_DOWN:
                case SDL_EVENT_FINGER_MOTION:
                case SDL_EVENT_FINGER_UP:
                case SDL_EVENT_SENSOR_UPDATE:
                case SDL_EVENT_DISPLAY_ORIENTATION:
                    try {
                        serializer->sendMessage(wire::kSdlEventMagic, &event, sizeof(event));
                    } catch (const std::exception&) {
                        SPDLOG_WARN("Connection lost (event send)");
                        exitLoop = true;
                    }
                    break;
            }
            if (exitLoop) break;
        }
        if (exitLoop) break;

        if (wasBackgrounded) {
            SPDLOG_INFO("App was backgrounded, returning to QR scan");
            break;
        }

        if (!wsConn->isOpen()) {
            SPDLOG_WARN("Connection closed by server");
            break;
        }

        while (wsConn->available() > 0) {
            wire::MessageHeader header{};
            std::vector<char> payload;
            if (!serializer->recvMessage(header, payload)) {
                SPDLOG_WARN("Connection lost (message read)");
                exitLoop = true;
                break;
            }

            if (header.magic == wire::kWireCommandMagic) {
                if (header.length > wire::kMaxMessageSize) {
                    SPDLOG_WARN("Message too large: {} bytes", header.length);
                    exitLoop = true;
                    break;
                }

                // Filter out UnregisterObject(Device) to keep the device
                // alive for surface recycling on Vulkan (Android).
                auto filtered = filterDeviceUnregister(
                    payload.data(), payload.size());
                if (!filtered.empty()) serverSentCleanup = true;
                char* cmdData = filtered.empty()
                    ? payload.data() : filtered.data();
                size_t cmdSize = filtered.empty()
                    ? payload.size() : filtered.size();

                // Track texture views and bind groups for deferred mip delivery
                mipTracker.scanCommands(cmdData, cmdSize);

                // Rewrite SetBindGroup commands to use fabricated bind groups
                mipTracker.rewriteSetBindGroups(cmdData, cmdSize);

                if (cmdSize > 0) {
                    const volatile char* cmdResult =
                        wireServer->HandleCommands(cmdData, cmdSize);
                    if (cmdResult == nullptr) {
                        SPDLOG_ERROR("WireServer failed to handle commands");
                    }
                }

                serializer->Flush();
            } else if (header.magic == wire::kDeferredMipMagic) {
                if (payload.size() < sizeof(wire::DeferredMipHeader)) {
                    SPDLOG_WARN("Deferred mip message too small");
                    exitLoop = true;
                    break;
                }

                wire::DeferredMipHeader dh{};
                std::memcpy(&dh, payload.data(), sizeof(dh));
                const char* mipData = payload.data() + sizeof(dh);
                size_t mipDataSize = payload.size() - sizeof(dh);

                if (mipDataSize < dh.commandSize) {
                    SPDLOG_WARN("Deferred mip data truncated");
                    exitLoop = true;
                    break;
                }

                commandBuffer.assign(mipData, mipData + dh.commandSize);

                if (dh.hashOnly) {
                    // Hash probe: commandBuffer = head[128] + hash[8]
                    if (dh.commandSize < wire::kMipHeadSize + sizeof(uint64_t)) {
                        SPDLOG_WARN("Mip probe too small");
                        wire::MipCacheResponse resp{dh.textureId, dh.mipLevel};
                        try { serializer->sendMessage(wire::kMipCacheMissMagic, &resp, sizeof(resp)); } catch (...) {}
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

                            const volatile char* cmdResult = wireServer->HandleCommands(
                                fullCmd.data(), fullCmd.size());
                            if (cmdResult == nullptr) {
                                SPDLOG_WARN("Cached mip rejected: tex={} level={}, sending MISS",
                                            dh.textureId, dh.mipLevel);
                                std::error_code fsec;
                                fs::remove(mipCachePath(cacheDir, serverHash), fsec);
                                wire::MipCacheResponse resp{dh.textureId, dh.mipLevel};
                                try { serializer->sendMessage(wire::kMipCacheMissMagic, &resp, sizeof(resp)); } catch (...) {}
                            } else {
                                SPDLOG_INFO("Mip cache HIT: tex={} level={} ({:.1f} KB)",
                                            dh.textureId, dh.mipLevel,
                                            (wire::kMipHeadSize + cachedTail.size()) / 1024.0);
                                mipTracker.processDeferredMip(dh.textureId, dh.mipLevel,
                                                               *wireServer, *serializer);
                                wire::MipCacheResponse resp{dh.textureId, dh.mipLevel};
                                try { serializer->sendMessage(wire::kMipCacheHitMagic, &resp, sizeof(resp)); } catch (...) {}
                            }
                        } else {
                            SPDLOG_INFO("Mip cache MISS: tex={} level={}", dh.textureId, dh.mipLevel);
                            wire::MipCacheResponse resp{dh.textureId, dh.mipLevel};
                            try { serializer->sendMessage(wire::kMipCacheMissMagic, &resp, sizeof(resp)); } catch (...) {}
                        }
                    }
                } else {
                    // Full data: commandBuffer = head[128] + tail[]
                    const volatile char* cmdResult = wireServer->HandleCommands(
                        commandBuffer.data(), commandBuffer.size());
                    if (cmdResult == nullptr) {
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
            } else if (header.magic == wire::kSensorConfigMagic) {
                if (payload.size() >= sizeof(wire::SensorConfig)) {
                    wire::SensorConfig sc{};
                    std::memcpy(&sc, payload.data(), sizeof(sc));
                    if (sc.sensorType > 0 && sc.sensorType < 7) {
                        if (sc.enabled && !openSensors[sc.sensorType]) {
                            if (!SDL_WasInit(SDL_INIT_SENSOR)) {
                                if (!SDL_InitSubSystem(SDL_INIT_SENSOR))
                                    SPDLOG_WARN("SDL_InitSubSystem(SENSOR) failed: {}", SDL_GetError());
                            }
                            int count = 0;
                            SDL_SensorID* ids = SDL_GetSensors(&count);
                            SPDLOG_INFO("SDL_GetSensors: {} sensor(s) found", count);
                            if (ids) {
                                for (int i = 0; i < count; i++) {
                                    if (SDL_GetSensorTypeForID(ids[i]) == static_cast<SDL_SensorType>(sc.sensorType)) {
                                        openSensors[sc.sensorType] = SDL_OpenSensor(ids[i]);
                                        if (openSensors[sc.sensorType])
                                            SPDLOG_INFO("Opened sensor type {}", sc.sensorType);
                                        else
                                            SPDLOG_WARN("Failed to open sensor type {}: {}", sc.sensorType, SDL_GetError());
                                        break;
                                    }
                                }
                                SDL_free(ids);
                            }
                        } else if (!sc.enabled && openSensors[sc.sensorType]) {
                            SDL_CloseSensor(openSensors[sc.sensorType]);
                            openSensors[sc.sensorType] = nullptr;
                            SPDLOG_INFO("Closed sensor type {}", sc.sensorType);
                        }
                    }
                }
            } else if (header.magic == wire::kAudioDataMagic) {
                if (payload.size() >= sizeof(wire::AudioData)) {
                    wire::AudioData ad{};
                    std::memcpy(&ad, payload.data(), sizeof(ad));
                    const void* audioBytes = payload.data() + sizeof(ad);
                    size_t audioSize = payload.size() - sizeof(ad);
                    if (audioSize >= ad.dataLength) {
                        audioPlayer.loadClip(ad.audioId, ad.format, ad.flags,
                                             audioBytes, ad.dataLength);
                    }
                }
            } else if (header.magic == wire::kAudioCommandMagic) {
                if (payload.size() >= sizeof(wire::AudioCommand)) {
                    wire::AudioCommand ac{};
                    std::memcpy(&ac, payload.data(), sizeof(ac));
                    audioPlayer.handleCommand(ac.command, ac.audioId, ac.volume);
                }
            } else if (header.magic == wire::kFrameEndMagic) {
                if (!firstFrameLogged) {
                    SPDLOG_INFO("First frame rendered — streaming video");
                    firstFrameLogged = true;
                }
                serializer->sendMessage(wire::kFrameReadyMagic);
                break; // yield to SDL event polling
            } else if (header.magic == wire::kSessionEndMagic) {
                SPDLOG_INFO("Server session ended (ged sent SessionEnd)");
                exitLoop = true;
                break;
            } else {
                SPDLOG_WARN("Unknown message magic: 0x{:08X}", header.magic);
                exitLoop = true;
                break;
            }
        }

        SDL_Delay(1);
    }

    // The surface's Vulkan swapchain holds a VkSurfaceKHR whose cleanup
    // requires the wire-created device's FencedDeleter.  Dawn's WireServer
    // destructor (DestroyAllObjects) releases devices BEFORE surfaces, so
    // if the surface still has a configured swapchain when the WireServer
    // destructs, DetachFromSurface will dereference a null FencedDeleter.
    //
    // Clean shutdown (serverSentCleanup=true):
    //   Our filter removed UnregisterObject(Device) but let
    //   UnregisterObject(Surface) through, so the WireServer no longer
    //   holds an InjectSurface ref.  recycleSurface() drops the sole
    //   remaining ref → ~Surface → DetachFromSurface with device alive.
    //
    // Abrupt disconnect (serverSentCleanup=false):
    //   No cleanup commands received.  The WireServer still holds the
    //   InjectSurface AddRef.  We can't safely let DestroyAllObjects
    //   run (it would release the device first, then crash on the
    //   surface).  Instead, manually drop the InjectSurface ref so
    //   recycleSurface fully destroys the surface while the device is
    //   alive, then leak the WireServer to prevent DestroyAllObjects.
    if (!serverSentCleanup) {
        // Abrupt disconnect: the WireServer still holds the InjectSurface
        // AddRef on our surface.  Dawn's DestroyAllObjects releases devices
        // BEFORE surfaces — if the surface's swapchain still exists when
        // the device dies, DetachFromSurface will crash (null FencedDeleter).
        //
        // Fix: feed a synthetic UnregisterObject(Surface) to the WireServer.
        // This removes the surface from KnownObjects and drops the
        // InjectSurface ref, so our recycleSurface drops the sole remaining
        // ref → ~Surface → DetachFromSurface with the device still alive.
        SPDLOG_INFO("Abrupt disconnect — sending synthetic UnregisterObject(Surface, id={})",
                    surfaceHandle.id);
        auto cmd = buildUnregisterObjectCmd(
            wire_obs::kObjectTypeSurface, surfaceHandle.id);
        auto* result = wireServer->HandleCommands(cmd.data(), cmd.size());
        if (result) {
            SPDLOG_INFO("Synthetic UnregisterObject(Surface) accepted");
        } else {
            SPDLOG_ERROR("Synthetic UnregisterObject(Surface) REJECTED by HandleCommands");
        }
    }

    // In both cases (clean and abrupt), the surface is now at refcount 1
    // (our wgpu::Surface) and removed from WireServer's KnownObjects.
    // The device is alive (we filtered UnregisterObject(Device) in the clean
    // case; in the abrupt case it was never unregistered).  recycleSurface
    // destroys the old surface (DetachFromSurface safe) and creates a new one.
    recycleSurface();

    // Flush the device's FencedDeleter so the VkSurfaceKHR is actually freed
    // before the new surface tries to use the same ANativeWindow.
    dawn::native::InstanceProcessEvents(dawnInstance->Get());

    return exitResult;
}

int playerLoop(std::function<ge::ScanResult()> discover) {
    for (;;) {
        auto addr = discover();
        if (addr.host.empty()) {
            SPDLOG_INFO("Discovery cancelled, retrying...");
            continue;
        }
        uint16_t port = addr.port ? addr.port : kDefaultPort;
        SPDLOG_INFO("Target: {}:{}", addr.host, port);

        Player player(addr.host, port, kDefaultWidth, kDefaultHeight, false, 0);
        int result = player.run();
        if (result != 0) return result;

        SPDLOG_INFO("Disconnected, returning to discovery...");
    }
}
