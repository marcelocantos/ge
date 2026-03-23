// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/SharedTexture.h>

#ifdef __APPLE__

#import <IOSurface/IOSurface.h>
#import <CoreVideo/CoreVideo.h>
#include <dawn/native/DawnNative.h>
#include <spdlog/spdlog.h>

namespace ge {

struct SharedTexture::M {
    IOSurfaceRef ioSurface = nullptr;
    CVPixelBufferRef pixelBuffer = nullptr;
    wgpu::SharedTextureMemory sharedMem = nullptr;
    wgpu::Texture texture = nullptr;
    wgpu::TextureView textureView = nullptr;
    int width = 0;
    int height = 0;

    ~M() {
        // End access before releasing texture
        if (sharedMem && texture) {
            wgpu::SharedTextureMemoryEndAccessState endState{};
            sharedMem.EndAccess(texture, &endState);
            wgpuSharedTextureMemoryEndAccessStateFreeMembers(
                *reinterpret_cast<WGPUSharedTextureMemoryEndAccessState*>(&endState));
        }
        textureView = nullptr;
        texture = nullptr;
        sharedMem = nullptr;
        if (pixelBuffer) {
            CVPixelBufferRelease(pixelBuffer);
        }
        if (ioSurface) {
            CFRelease(ioSurface);
        }
    }
};

SharedTexture::SharedTexture(wgpu::Device device, int width, int height)
    : m(std::make_unique<M>()) {
    m->width = width;
    m->height = height;

    // 1. Create IOSurface
    NSDictionary* props = @{
        (id)kIOSurfaceWidth: @(width),
        (id)kIOSurfaceHeight: @(height),
        (id)kIOSurfaceBytesPerElement: @(4),
        (id)kIOSurfaceBytesPerRow: @(width * 4),
        (id)kIOSurfacePixelFormat: @(kCVPixelFormatType_32BGRA),
    };
    m->ioSurface = IOSurfaceCreate((__bridge CFDictionaryRef)props);
    if (!m->ioSurface) {
        throw std::runtime_error("SharedTexture: IOSurfaceCreate failed");
    }

    // 2. Import IOSurface into Dawn via SharedTextureMemory
    wgpu::SharedTextureMemoryIOSurfaceDescriptor ioSurfaceDesc{};
    ioSurfaceDesc.ioSurface = m->ioSurface;

    wgpu::SharedTextureMemoryDescriptor memDesc{};
    memDesc.nextInChain = &ioSurfaceDesc;
    memDesc.label = "SharedTexture";

    m->sharedMem = device.ImportSharedTextureMemory(&memDesc);
    if (!m->sharedMem) {
        throw std::runtime_error("SharedTexture: ImportSharedTextureMemory failed");
    }

    // 3. Create texture from shared memory with RenderAttachment usage
    wgpu::TextureDescriptor texDesc{};
    texDesc.label = "SharedTexture::colorTexture";
    texDesc.usage = wgpu::TextureUsage::RenderAttachment | wgpu::TextureUsage::TextureBinding;
    texDesc.size = {static_cast<uint32_t>(width), static_cast<uint32_t>(height), 1};
    texDesc.format = wgpu::TextureFormat::BGRA8Unorm;
    texDesc.dimension = wgpu::TextureDimension::e2D;
    texDesc.mipLevelCount = 1;
    texDesc.sampleCount = 1;

    m->texture = m->sharedMem.CreateTexture(&texDesc);
    if (!m->texture) {
        throw std::runtime_error("SharedTexture: CreateTexture failed");
    }

    // 4. Begin access — marks the texture as in-use by Dawn
    wgpu::SharedTextureMemoryBeginAccessDescriptor beginDesc{};
    beginDesc.initialized = true;  // IOSurface content is valid (or will be after first render)
    beginDesc.fenceCount = 0;

    auto status = m->sharedMem.BeginAccess(m->texture, &beginDesc);
    if (status != wgpu::Status::Success) {
        throw std::runtime_error("SharedTexture: BeginAccess failed");
    }

    // 5. Create texture view for render attachment
    m->textureView = m->texture.CreateView();

    // 6. Create CVPixelBuffer from the same IOSurface (zero-copy)
    OSStatus cvErr = CVPixelBufferCreateWithIOSurface(
        nullptr, m->ioSurface, nullptr, &m->pixelBuffer);
    if (cvErr != noErr || !m->pixelBuffer) {
        throw std::runtime_error("SharedTexture: CVPixelBufferCreateWithIOSurface failed: " +
                                 std::to_string(cvErr));
    }

    SPDLOG_INFO("SharedTexture: created {}x{} IOSurface-backed texture (zero-copy)", width, height);
}

SharedTexture::~SharedTexture() = default;

SharedTexture::SharedTexture(SharedTexture&&) noexcept = default;
SharedTexture& SharedTexture::operator=(SharedTexture&&) noexcept = default;

wgpu::TextureView SharedTexture::colorView() const {
    return m->textureView;
}

CVPixelBufferRef SharedTexture::pixelBuffer() const {
    return m->pixelBuffer;
}

int SharedTexture::width() const { return m->width; }
int SharedTexture::height() const { return m->height; }

} // namespace ge

#endif // __APPLE__
