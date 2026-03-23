#pragma once

#include <linalg.h>
#include <webgpu/webgpu_cpp.h>
#include <memory>

namespace ge {

// RAII wrapper for WebGPU lifecycle (device, queue, surface/swapchain).
class GpuContext {
public:
    // Initialize WebGPU with a native Metal layer (CAMetalLayer* on macOS).
    GpuContext(void* nativeLayer, int width, int height);

    // External-resources constructor: uses pre-created device, queue, and surface
    // (e.g. obtained through the Dawn wire protocol by a wire session caller).
    GpuContext(wgpu::Device device, wgpu::Queue queue, wgpu::Surface surface,
              wgpu::TextureFormat format, int width, int height);
    ~GpuContext();

    GpuContext(const GpuContext&) = delete;
    GpuContext& operator=(const GpuContext&) = delete;

    // Accessors for rendering
    wgpu::Device device() const;
    wgpu::Queue queue() const;
    wgpu::TextureFormat swapChainFormat() const;

    // Frame management
    wgpu::TextureView currentFrameView();    // Get texture view for current frame
    wgpu::Texture currentFrameTexture();     // Get texture for current frame (for copy/blit)
    void present();                          // Submit frame to display

    // Resize handling
    void resize(linalg::vec<int,2> size);

    int width() const;
    int height() const;

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace ge
