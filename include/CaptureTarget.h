#pragma once

#include "BgfxResource.h"

namespace sq {

// RAII offscreen render target: framebuffer + color texture for readback.
// Constructor allocates RGBA8 color + D24S8 depth; check isValid() after.
// The framebuffer owns both textures (destroyTextures=true); colorTexture
// is a non-owning reference kept for readback.
struct CaptureTarget {
    FrameBufferHandle framebuffer;
    bgfx::TextureHandle colorTexture = BGFX_INVALID_HANDLE;

    CaptureTarget() = default;

    CaptureTarget(int width, int height) {
        bgfx::TextureHandle colorTex = bgfx::createTexture2D(
            width, height, false, 1,
            bgfx::TextureFormat::RGBA8,
            BGFX_TEXTURE_RT | BGFX_TEXTURE_BLIT_DST
        );

        bgfx::TextureHandle depthTex = bgfx::createTexture2D(
            width, height, false, 1,
            bgfx::TextureFormat::D24S8,
            BGFX_TEXTURE_RT
        );

        bgfx::TextureHandle textures[2] = {colorTex, depthTex};
        bgfx::FrameBufferHandle fb = bgfx::createFrameBuffer(2, textures, true);

        if (bgfx::isValid(fb)) {
            framebuffer = FrameBufferHandle(fb);
            colorTexture = colorTex;
        }
    }

    bool isValid() const { return framebuffer.isValid(); }
};

} // namespace sq
