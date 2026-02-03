#pragma once

#include <webgpu/webgpu_cpp.h>
#include <memory>

namespace sq {

// RAII wrapper for WebGPU lifecycle (device, queue, surface/swapchain)
class GpuContext {
public:
    // Initialize WebGPU with a native Metal layer (CAMetalLayer* on macOS)
    GpuContext(void* nativeLayer, int width, int height);
    ~GpuContext();

    GpuContext(const GpuContext&) = delete;
    GpuContext& operator=(const GpuContext&) = delete;

    // Accessors for rendering
    wgpu::Device device() const;
    wgpu::Queue queue() const;
    wgpu::TextureFormat swapChainFormat() const;

    // Frame management
    wgpu::TextureView currentFrameView();  // Get texture view for current frame
    void present();                         // Submit frame to display

    // Resize handling
    void resize(int width, int height);

    int width() const;
    int height() const;

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace sq
