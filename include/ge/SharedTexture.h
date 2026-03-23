// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <webgpu/webgpu_cpp.h>
#include <memory>

// Forward declare CoreVideo type to avoid importing ObjC headers
typedef struct __CVBuffer* CVPixelBufferRef;

namespace ge {

// Zero-copy shared texture between Dawn (WebGPU) and VideoToolbox.
//
// On Apple platforms, this uses an IOSurface as the backing store:
// - Dawn renders to the texture via colorView()
// - VideoToolbox reads from pixelBuffer() for H.264 encoding
// Both access the same GPU memory — no CPU readback required.
//
// Usage:
//   SharedTexture tex(device, 1920, 1080);
//   app.render(ctx, state, tex.colorView());   // GPU render
//   encoder.encode(tex.pixelBuffer());          // GPU encode (zero-copy)
class SharedTexture {
public:
    SharedTexture(wgpu::Device device, int width, int height);
    ~SharedTexture();

    // Non-copyable, movable
    SharedTexture(const SharedTexture&) = delete;
    SharedTexture& operator=(const SharedTexture&) = delete;
    SharedTexture(SharedTexture&&) noexcept;
    SharedTexture& operator=(SharedTexture&&) noexcept;

    // WebGPU texture view for use as a render attachment.
    wgpu::TextureView colorView() const;

    // CVPixelBuffer backed by the same IOSurface — zero-copy GPU access
    // for VideoToolbox encoding.
    CVPixelBufferRef pixelBuffer() const;

    int width() const;
    int height() const;

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace ge
