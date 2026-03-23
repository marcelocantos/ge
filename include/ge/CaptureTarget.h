#pragma once

#include <webgpu/webgpu_cpp.h>
#include <ge/WgpuResource.h>
#include <vector>
#include <cstdint>

namespace ge {

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

    // Async two-phase readback: submitCopy issues the GPU copy command,
    // collectPixels maps and reads the result. Call submitCopy after render,
    // then collectPixels on the NEXT frame (gives the GPU time to complete).
    void submitCopy(wgpu::Device device, wgpu::Queue queue);
    std::vector<uint8_t> collectPixels(wgpu::Device device);

private:
    WgpuTexture colorTexture_;
    WgpuTextureView colorView_;
    wgpu::Buffer stagingBuffers_[2];  // Ping-pong staging buffers
    int currentStaging_ = 0;
    size_t stagingSize_ = 0;
    uint32_t alignedBytesPerRow_ = 0;
    wgpu::TextureFormat format_ = wgpu::TextureFormat::RGBA8Unorm;
    int width_ = 0;
    int height_ = 0;
};

} // namespace ge
