#include <ge/CaptureTarget.h>
#include <stdexcept>
#include <cstring>

namespace ge {

CaptureTarget::CaptureTarget(wgpu::Device device, int width, int height,
                             wgpu::TextureFormat format)
    : format_(format), width_(width), height_(height) {

    wgpu::TextureDescriptor texDesc{
        .usage = wgpu::TextureUsage::RenderAttachment | wgpu::TextureUsage::CopySrc,
        .dimension = wgpu::TextureDimension::e2D,
        .size = {static_cast<uint32_t>(width), static_cast<uint32_t>(height), 1},
        .format = format,
        .mipLevelCount = 1,
        .sampleCount = 1,
    };
    wgpu::Texture tex = device.CreateTexture(&texDesc);
    if (!tex) {
        throw std::runtime_error("Failed to create capture texture");
    }

    colorTexture_ = WgpuTexture(std::move(tex));

    wgpu::TextureViewDescriptor viewDesc{
        .format = format,
        .dimension = wgpu::TextureViewDimension::e2D,
        .baseMipLevel = 0,
        .mipLevelCount = 1,
        .baseArrayLayer = 0,
        .arrayLayerCount = 1,
    };
    colorView_ = WgpuTextureView(colorTexture_.get().CreateView(&viewDesc));

    // Pre-allocate two staging buffers for ping-pong readPixels
    uint32_t bytesPerRow = width * 4;
    alignedBytesPerRow_ = (bytesPerRow + 255) & ~255;
    stagingSize_ = alignedBytesPerRow_ * height;

    for (int i = 0; i < 2; i++) {
        wgpu::BufferDescriptor bufDesc{
            .usage = wgpu::BufferUsage::CopyDst | wgpu::BufferUsage::MapRead,
            .size = stagingSize_,
        };
        stagingBuffers_[i] = device.CreateBuffer(&bufDesc);
    }
}

wgpu::TextureView CaptureTarget::colorView() const {
    return colorView_.get();
}

std::vector<uint8_t> CaptureTarget::readPixels(wgpu::Device device, wgpu::Queue queue) {
    // Ping-pong: use current buffer for the copy, alternate each call.
    auto& buf = stagingBuffers_[currentStaging_];
    currentStaging_ = 1 - currentStaging_;

    // Ensure buffer is unmapped before use as copy destination.
    // (It may still be mapped from a previous readPixels call.)
    if (buf.GetMapState() == wgpu::BufferMapState::Mapped) {
        buf.Unmap();
    }

    // Copy texture to staging buffer
    wgpu::CommandEncoder encoder = device.CreateCommandEncoder();
    wgpu::TexelCopyTextureInfo src{
        .texture = colorTexture_.get(),
        .mipLevel = 0,
        .origin = {0, 0, 0},
        .aspect = wgpu::TextureAspect::All,
    };
    wgpu::TexelCopyBufferInfo dst{
        .layout = {
            .offset = 0,
            .bytesPerRow = alignedBytesPerRow_,
            .rowsPerImage = static_cast<uint32_t>(height_),
        },
        .buffer = buf,
    };
    wgpu::Extent3D extent{static_cast<uint32_t>(width_), static_cast<uint32_t>(height_), 1};
    encoder.CopyTextureToBuffer(&src, &dst, &extent);

    wgpu::CommandBuffer commands = encoder.Finish();
    queue.Submit(1, &commands);

    // Wait for the copy to complete before mapping
    bool workDone = false;
    queue.OnSubmittedWorkDone(
        wgpu::CallbackMode::AllowSpontaneous,
        [&](wgpu::QueueWorkDoneStatus, const char*) { workDone = true; });
    for (int i = 0; i < 1000000 && !workDone; ++i) {
        device.Tick();
    }

    // Map the buffer
    buf.MapAsync(
        wgpu::MapMode::Read, 0, stagingSize_,
        wgpu::CallbackMode::AllowSpontaneous,
        [](wgpu::MapAsyncStatus, wgpu::StringView) {});

    for (int i = 0; i < 100000; ++i) {
        device.Tick();
        if (buf.GetMapState() == wgpu::BufferMapState::Mapped) {
            break;
        }
    }

    if (buf.GetMapState() != wgpu::BufferMapState::Mapped) {
        throw std::runtime_error("Failed to map staging buffer");
    }

    // Copy data, removing row padding
    const uint8_t* mapped = static_cast<const uint8_t*>(
        buf.GetConstMappedRange(0, stagingSize_));

    std::vector<uint8_t> pixels(width_ * height_ * 4);
    for (int y = 0; y < height_; ++y) {
        std::memcpy(
            pixels.data() + y * width_ * 4,
            mapped + y * alignedBytesPerRow_,
            width_ * 4
        );
    }

    buf.Unmap();

    // Convert BGRA → RGBA if needed so callers always get RGBA
    if (format_ == wgpu::TextureFormat::BGRA8Unorm) {
        for (size_t i = 0; i < pixels.size(); i += 4) {
            std::swap(pixels[i], pixels[i + 2]);
        }
    }

    return pixels;
}

void CaptureTarget::submitCopy(wgpu::Device device, wgpu::Queue queue) {
    auto& buf = stagingBuffers_[currentStaging_];

    if (buf.GetMapState() == wgpu::BufferMapState::Mapped) {
        buf.Unmap();
    }

    wgpu::CommandEncoder encoder = device.CreateCommandEncoder();
    wgpu::TexelCopyTextureInfo src{
        .texture = colorTexture_.get(),
        .mipLevel = 0,
        .origin = {0, 0, 0},
        .aspect = wgpu::TextureAspect::All,
    };
    wgpu::TexelCopyBufferInfo dst{
        .layout = {
            .offset = 0,
            .bytesPerRow = alignedBytesPerRow_,
            .rowsPerImage = static_cast<uint32_t>(height_),
        },
        .buffer = buf,
    };
    wgpu::Extent3D extent{static_cast<uint32_t>(width_), static_cast<uint32_t>(height_), 1};
    encoder.CopyTextureToBuffer(&src, &dst, &extent);

    wgpu::CommandBuffer commands = encoder.Finish();
    queue.Submit(1, &commands);

    // Start async map — will complete by the time collectPixels is called
    buf.MapAsync(
        wgpu::MapMode::Read, 0, stagingSize_,
        wgpu::CallbackMode::AllowSpontaneous,
        [](wgpu::MapAsyncStatus, wgpu::StringView) {});
}

std::vector<uint8_t> CaptureTarget::collectPixels(wgpu::Device device) {
    auto& buf = stagingBuffers_[currentStaging_];
    currentStaging_ = 1 - currentStaging_;

    // Check if mapped — should already be done since present() processes
    // callbacks. No device.Tick() here to avoid interfering with the
    // render pipeline's resource lifecycle.
    if (buf.GetMapState() != wgpu::BufferMapState::Mapped) {
        // Not ready yet — try one Tick and check again
        device.Tick();
    }

    if (buf.GetMapState() != wgpu::BufferMapState::Mapped) {
        return {};  // Not ready — skip this frame
    }

    const uint8_t* mapped = static_cast<const uint8_t*>(
        buf.GetConstMappedRange(0, stagingSize_));

    std::vector<uint8_t> pixels(width_ * height_ * 4);
    for (int y = 0; y < height_; ++y) {
        std::memcpy(
            pixels.data() + y * width_ * 4,
            mapped + y * alignedBytesPerRow_,
            width_ * 4
        );
    }

    buf.Unmap();

    if (format_ == wgpu::TextureFormat::BGRA8Unorm) {
        for (size_t i = 0; i < pixels.size(); i += 4) {
            std::swap(pixels[i], pixels[i + 2]);
        }
    }

    return pixels;
}

} // namespace ge
