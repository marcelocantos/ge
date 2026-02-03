#pragma once

#include <webgpu/webgpu_cpp.h>
#include <sq/WgpuResource.h>
#include <vector>
#include <cstdint>

namespace sq {

// Offscreen render target for capturing rendered frames (useful for testing)
class CaptureTarget {
public:
    CaptureTarget() = default;
    CaptureTarget(wgpu::Device device, int width, int height);

    wgpu::TextureView colorView() const;
    wgpu::TextureFormat format() const { return wgpu::TextureFormat::RGBA8Unorm; }

    int width() const { return width_; }
    int height() const { return height_; }

    // Read pixels back to CPU (synchronous, blocks until complete)
    std::vector<uint8_t> readPixels(wgpu::Device device, wgpu::Queue queue);

private:
    WgpuTexture colorTexture_;
    WgpuTextureView colorView_;
    int width_ = 0;
    int height_ = 0;
};

} // namespace sq
