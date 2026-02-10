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
    CaptureTarget(wgpu::Device device, int width, int height,
                  wgpu::TextureFormat format = wgpu::TextureFormat::RGBA8Unorm);

    wgpu::TextureView colorView() const;
    wgpu::TextureFormat format() const { return format_; }

    int width() const { return width_; }
    int height() const { return height_; }

    // Read pixels back to CPU as RGBA (synchronous, blocks until complete).
    // Automatically converts from BGRA if the texture format is BGRA8Unorm.
    std::vector<uint8_t> readPixels(wgpu::Device device, wgpu::Queue queue);

private:
    WgpuTexture colorTexture_;
    WgpuTextureView colorView_;
    wgpu::TextureFormat format_ = wgpu::TextureFormat::RGBA8Unorm;
    int width_ = 0;
    int height_ = 0;
};

} // namespace sq
