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
}

wgpu::TextureView CaptureTarget::colorView() const {
    return colorView_.get();
}

std::vector<uint8_t> CaptureTarget::readPixels(wgpu::Device device, wgpu::Queue queue) {
    uint32_t bytesPerRow = width_ * 4;
    // WebGPU requires bytesPerRow to be aligned to 256
    uint32_t alignedBytesPerRow = (bytesPerRow + 255) & ~255;
    size_t bufferSize = alignedBytesPerRow * height_;

    // Create staging buffer
    wgpu::BufferDescriptor bufDesc{
        .usage = wgpu::BufferUsage::CopyDst | wgpu::BufferUsage::MapRead,
        .size = bufferSize,
    };
    wgpu::Buffer stagingBuffer = device.CreateBuffer(&bufDesc);

    // Copy texture to buffer
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
            .bytesPerRow = alignedBytesPerRow,
            .rowsPerImage = static_cast<uint32_t>(height_),
        },
        .buffer = stagingBuffer,
    };
    wgpu::Extent3D extent{static_cast<uint32_t>(width_), static_cast<uint32_t>(height_), 1};
    encoder.CopyTextureToBuffer(&src, &dst, &extent);

    wgpu::CommandBuffer commands = encoder.Finish();
    queue.Submit(1, &commands);

    // Wait for GPU work to complete
    bool workDone = false;
    queue.OnSubmittedWorkDone(
        wgpu::CallbackMode::AllowSpontaneous,
        [&](wgpu::QueueWorkDoneStatus, const char*) { workDone = true; });

    for (int i = 0; i < 100000 && !workDone; ++i) {
        device.Tick();
    }

    // Map buffer
    stagingBuffer.MapAsync(
        wgpu::MapMode::Read, 0, bufferSize,
        wgpu::CallbackMode::AllowSpontaneous,
        [](wgpu::MapAsyncStatus, wgpu::StringView) {});

    // Poll until buffer is mapped
    for (int i = 0; i < 100000; ++i) {
        device.Tick();
        if (stagingBuffer.GetMapState() == wgpu::BufferMapState::Mapped) {
            break;
        }
    }

    if (stagingBuffer.GetMapState() != wgpu::BufferMapState::Mapped) {
        throw std::runtime_error("Failed to map staging buffer");
    }

    // Copy data, removing row padding
    const uint8_t* mapped = static_cast<const uint8_t*>(stagingBuffer.GetConstMappedRange(0, bufferSize));

    std::vector<uint8_t> pixels(width_ * height_ * 4);
    for (int y = 0; y < height_; ++y) {
        std::memcpy(
            pixels.data() + y * width_ * 4,
            mapped + y * alignedBytesPerRow,
            width_ * 4
        );
    }

    stagingBuffer.Unmap();

    // Convert BGRA → RGBA if needed so callers always get RGBA
    if (format_ == wgpu::TextureFormat::BGRA8Unorm) {
        for (size_t i = 0; i < pixels.size(); i += 4) {
            std::swap(pixels[i], pixels[i + 2]);
        }
    }

    return pixels;
}

} // namespace ge
