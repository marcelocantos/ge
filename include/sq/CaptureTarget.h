#pragma once

#include <sq/BgfxResource.h>

namespace sq {

// RAII offscreen render target: framebuffer + color texture for readback.
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
        framebuffer = FrameBufferHandle(bgfx::createFrameBuffer(2, textures, true));
        colorTexture = colorTex;
    }
};

} // namespace sq
