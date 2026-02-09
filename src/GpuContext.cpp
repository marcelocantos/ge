#include <sq/GpuContext.h>
#include <sq/WireTransport.h>
#include "NativeSurface.h"
#include <dawn/native/DawnNative.h>
#include <dawn/dawn_proc.h>
#include <spdlog/spdlog.h>
#include <memory>
#include <stdexcept>
#include <vector>

namespace sq {

struct GpuContext::M {
    std::unique_ptr<dawn::native::Instance> dawnInstance;
    wgpu::Instance instance;
    wgpu::Adapter adapter;
    wgpu::Device device;
    wgpu::Queue queue;
    wgpu::Surface surface;
    wgpu::TextureFormat swapChainFormat = wgpu::TextureFormat::BGRA8Unorm;

    int width = 0;
    int height = 0;

    // Current frame's surface texture (acquired each frame)
    wgpu::SurfaceTexture surfaceTexture;

    // Wire transport (if using wire mode)
    WireTransport* wire = nullptr;
};

GpuContext::GpuContext(void* nativeLayer, int width, int height, WireTransport* wireTransport)
    : m(std::make_unique<M>()) {

    m->width = width;
    m->height = height;
    m->wire = wireTransport;

    SPDLOG_INFO("Initializing WebGPU (Dawn)...");

    if (!wireTransport) {
        dawnProcSetProcs(&dawn::native::GetProcs());
    }

    // Create Dawn native instance (always needed for adapter enumeration)
    wgpu::InstanceDescriptor instanceDesc{};
    m->dawnInstance = std::make_unique<dawn::native::Instance>(&instanceDesc);
    WGPUInstance nativeInstance = m->dawnInstance->Get();

    // Create surface from native window handle (platform-specific helper).
    // Surface creation requires a native window handle, can't go through wire.
    WGPUSurface nativeSurface;
    if (wireTransport) {
        // Wire mode: use native procs (global procs point to wire client)
        nativeSurface = createNativeSurface(nativeInstance, nativeLayer,
                                            &wireTransport->nativeProcs());
    } else {
        // Native mode: use global procs
        nativeSurface = createNativeSurface(nativeInstance, nativeLayer);
    }

    if (!nativeSurface) {
        throw std::runtime_error("Failed to create WebGPU surface");
    }

    if (wireTransport) {
        // Wire mode: for now, use native rendering but keep wire transport ready.
        // Full wire mode requires fixing ReserveSurface blocking issue.
        // TODO: Implement proper wire mode with surface/adapter/device injection.
        SPDLOG_INFO("Wire: using native rendering (wire transport ready for future use)");
    }

    {
        // Native mode: use direct API
        m->instance = wgpu::Instance(nativeInstance);
        m->surface = wgpu::Surface::Acquire(nativeSurface);

        wgpu::RequestAdapterOptions adapterOpts{
            .powerPreference = wgpu::PowerPreference::HighPerformance,
            .compatibleSurface = m->surface,
        };
        auto adapters = m->dawnInstance->EnumerateAdapters(&adapterOpts);
        if (adapters.empty()) {
            throw std::runtime_error("No WebGPU adapters found");
        }
        m->adapter = wgpu::Adapter(adapters[0].Get());
    }

    wgpu::AdapterInfo adapterInfo{};
    m->adapter.GetInfo(&adapterInfo);
    SPDLOG_INFO("WebGPU adapter: {} ({})",
                std::string_view(adapterInfo.device.data, adapterInfo.device.length),
                std::string_view(adapterInfo.description.data, adapterInfo.description.length));

    // Request device
    wgpu::DeviceDescriptor deviceDesc{};
    deviceDesc.SetDeviceLostCallback(
        wgpu::CallbackMode::AllowSpontaneous,
        [](const wgpu::Device&, wgpu::DeviceLostReason reason, wgpu::StringView message) {
            if (reason == wgpu::DeviceLostReason::Destroyed) {
                return;
            }
            SPDLOG_ERROR("WebGPU device lost: {} - {}",
                        static_cast<int>(reason),
                        std::string_view(message.data, message.length));
        });
    deviceDesc.SetUncapturedErrorCallback(
        [](const wgpu::Device&, wgpu::ErrorType type, wgpu::StringView message) {
            SPDLOG_ERROR("WebGPU error: {} - {}",
                        static_cast<int>(type),
                        std::string_view(message.data, message.length));
        });

    std::vector<wgpu::FeatureName> features;
    if (m->adapter.HasFeature(wgpu::FeatureName::TextureCompressionASTC)) {
        features.push_back(wgpu::FeatureName::TextureCompressionASTC);
        SPDLOG_INFO("Requesting ASTC texture compression");
    }
    if (m->adapter.HasFeature(wgpu::FeatureName::TextureCompressionETC2)) {
        features.push_back(wgpu::FeatureName::TextureCompressionETC2);
        SPDLOG_INFO("Requesting ETC2 texture compression");
    }
    if (!features.empty()) {
        deviceDesc.requiredFeatureCount = features.size();
        deviceDesc.requiredFeatures = features.data();
    }

    // Create device (synchronous for both native and wire mode with native adapter)
    m->device = m->adapter.CreateDevice(&deviceDesc);

    if (!m->device) {
        throw std::runtime_error("Failed to create WebGPU device");
    }

    m->queue = m->device.GetQueue();

    // Configure surface (swap chain)
    wgpu::SurfaceCapabilities caps{};
    m->surface.GetCapabilities(m->adapter, &caps);

    if (caps.formatCount > 0) {
        m->swapChainFormat = caps.formats[0];
    }

    wgpu::SurfaceConfiguration config{
        .device = m->device,
        .format = m->swapChainFormat,
        .width = static_cast<uint32_t>(width),
        .height = static_cast<uint32_t>(height),
        .alphaMode = wgpu::CompositeAlphaMode::Auto,
        .presentMode = wgpu::PresentMode::Fifo,
    };
    m->surface.Configure(&config);

    if (wireTransport) {
        wireTransport->flush();
    }

    SPDLOG_INFO("WebGPU initialized: {}x{}, format={}",
                width, height, static_cast<int>(m->swapChainFormat));
}

GpuContext::GpuContext(wgpu::Device device, wgpu::Queue queue, wgpu::Surface surface,
                       wgpu::TextureFormat format, int width, int height)
    : m(std::make_unique<M>()) {
    m->device = device;
    m->queue = queue;
    m->surface = surface;
    m->swapChainFormat = format;
    m->width = width;
    m->height = height;

    wgpu::SurfaceConfiguration config{
        .device = device,
        .format = format,
        .width = static_cast<uint32_t>(width),
        .height = static_cast<uint32_t>(height),
        .alphaMode = wgpu::CompositeAlphaMode::Auto,
        .presentMode = wgpu::PresentMode::Fifo,
    };
    surface.Configure(&config);

    SPDLOG_INFO("GpuContext (wire mode): {}x{}, format={}", width, height, static_cast<int>(format));
}

GpuContext::~GpuContext() {
    if (m && m->device) {
        m->device.Destroy();
    }
}

wgpu::Device GpuContext::device() const {
    return m->device;
}

wgpu::Queue GpuContext::queue() const {
    return m->queue;
}

wgpu::TextureFormat GpuContext::swapChainFormat() const {
    return m->swapChainFormat;
}

wgpu::TextureView GpuContext::currentFrameView() {
    m->surface.GetCurrentTexture(&m->surfaceTexture);

    if (m->surfaceTexture.status != wgpu::SurfaceGetCurrentTextureStatus::SuccessOptimal &&
        m->surfaceTexture.status != wgpu::SurfaceGetCurrentTextureStatus::SuccessSuboptimal) {
        SPDLOG_WARN("Failed to get current surface texture: {}",
                    static_cast<int>(m->surfaceTexture.status));
        return nullptr;
    }

    // Update cached dimensions from actual texture (handles HiDPI/resize timing issues)
    m->width = static_cast<int>(m->surfaceTexture.texture.GetWidth());
    m->height = static_cast<int>(m->surfaceTexture.texture.GetHeight());

    return m->surfaceTexture.texture.CreateView();
}

void GpuContext::present() {
    m->surface.Present();
}

void GpuContext::resize(linalg::vec<int,2> size) {
    // Reconfigure surface - don't update cached dimensions here,
    // they'll be updated from the actual texture in currentFrameView()
    wgpu::SurfaceConfiguration config{
        .device = m->device,
        .format = m->swapChainFormat,
        .width = static_cast<uint32_t>(size.x),
        .height = static_cast<uint32_t>(size.y),
        .alphaMode = wgpu::CompositeAlphaMode::Auto,
        .presentMode = wgpu::PresentMode::Fifo,
    };
    m->surface.Configure(&config);
}

int GpuContext::width() const {
    return m->width;
}

int GpuContext::height() const {
    return m->height;
}

} // namespace sq
