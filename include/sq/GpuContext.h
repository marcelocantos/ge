#pragma once

#include <linalg.h>
#include <webgpu/webgpu_cpp.h>
#include <memory>

namespace sq {

// RAII wrapper for WebGPU lifecycle (device, queue, surface/swapchain).
// Uses whatever procs are set via dawnProcSetProcs() - call that in main()
// before creating GpuContext to choose native vs wire rendering.
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
    void resize(linalg::vec<int,2> size);

    int width() const;
    int height() const;

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace sq
