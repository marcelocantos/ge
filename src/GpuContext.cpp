#include <sq/GpuContext.h>
#include <dawn/native/DawnNative.h>
#include <spdlog/spdlog.h>
#include <memory>
#include <stdexcept>

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
};

GpuContext::GpuContext(void* nativeLayer, int width, int height)
    : m(std::make_unique<M>()) {

    m->width = width;
    m->height = height;

    SPDLOG_INFO("Initializing WebGPU (Dawn)...");

    // Create Dawn instance
    wgpu::InstanceDescriptor instanceDesc{};
    m->dawnInstance = std::make_unique<dawn::native::Instance>(&instanceDesc);
    m->instance = wgpu::Instance(m->dawnInstance->Get());

    // Create surface from Metal layer
    WGPUSurfaceSourceMetalLayer metalSource = WGPU_SURFACE_SOURCE_METAL_LAYER_INIT;
    metalSource.layer = nativeLayer;

    WGPUSurfaceDescriptor surfaceDesc{};
    surfaceDesc.nextInChain = reinterpret_cast<WGPUChainedStruct*>(&metalSource);

    m->surface = wgpu::Surface::Acquire(
        wgpuInstanceCreateSurface(m->instance.Get(), &surfaceDesc));

    if (!m->surface) {
        throw std::runtime_error("Failed to create WebGPU surface");
    }

    // Request adapter
    wgpu::RequestAdapterOptions adapterOpts{
        .powerPreference = wgpu::PowerPreference::HighPerformance,
        .compatibleSurface = m->surface,
    };
    auto adapters = m->dawnInstance->EnumerateAdapters(&adapterOpts);
    if (adapters.empty()) {
        throw std::runtime_error("No WebGPU adapters found");
    }

    // Use first compatible adapter
    m->adapter = wgpu::Adapter(adapters[0].Get());

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
            // Don't log when device is intentionally destroyed during shutdown
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

    m->device = m->adapter.CreateDevice(&deviceDesc);
    if (!m->device) {
        throw std::runtime_error("Failed to create WebGPU device");
    }

    m->queue = m->device.GetQueue();

    // Configure surface (swap chain)
    wgpu::SurfaceCapabilities caps{};
    m->surface.GetCapabilities(m->adapter, &caps);

    // Use first available format (typically BGRA8Unorm on macOS)
    if (caps.formatCount > 0) {
        m->swapChainFormat = caps.formats[0];
    }

    wgpu::SurfaceConfiguration config{
        .device = m->device,
        .format = m->swapChainFormat,
        .width = static_cast<uint32_t>(width),
        .height = static_cast<uint32_t>(height),
        .alphaMode = wgpu::CompositeAlphaMode::Opaque,
        .presentMode = wgpu::PresentMode::Fifo,  // VSync
    };
    m->surface.Configure(&config);

    SPDLOG_INFO("WebGPU initialized: {}x{}, format={}",
                width, height, static_cast<int>(m->swapChainFormat));
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
        .alphaMode = wgpu::CompositeAlphaMode::Opaque,
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
