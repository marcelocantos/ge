#pragma once

#include <bgfx/bgfx.h>

namespace sq {

// RAII offscreen render target: framebuffer + color texture for readback.
// Constructor allocates RGBA8 color + D24S8 depth; check isValid() after.
struct CaptureTarget {
    bgfx::FrameBufferHandle framebuffer = BGFX_INVALID_HANDLE;
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
            framebuffer = fb;
            colorTexture = colorTex;
        }
    }

    ~CaptureTarget() {
        if (bgfx::isValid(framebuffer)) {
            bgfx::destroy(framebuffer);
        }
    }

    // Move semantics
    CaptureTarget(CaptureTarget&& other) noexcept
        : framebuffer(other.framebuffer), colorTexture(other.colorTexture) {
        other.framebuffer = BGFX_INVALID_HANDLE;
        other.colorTexture = BGFX_INVALID_HANDLE;
    }

    CaptureTarget& operator=(CaptureTarget&& other) noexcept {
        if (this != &other) {
            if (bgfx::isValid(framebuffer)) {
                bgfx::destroy(framebuffer);
            }
            framebuffer = other.framebuffer;
            colorTexture = other.colorTexture;
            other.framebuffer = BGFX_INVALID_HANDLE;
            other.colorTexture = BGFX_INVALID_HANDLE;
        }
        return *this;
    }

    // No copies
    CaptureTarget(const CaptureTarget&) = delete;
    CaptureTarget& operator=(const CaptureTarget&) = delete;

    bool isValid() const { return bgfx::isValid(framebuffer); }
};

} // namespace sq
