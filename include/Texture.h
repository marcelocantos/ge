#pragma once

#include <bgfx/bgfx.h>

// Pure asset class for textures - no rendering knowledge
class Texture {
public:
    // Load texture from image file (PNG, etc.)
    static Texture fromFile(const char* path);

    Texture() = default;
    ~Texture();

    // Move only
    Texture(Texture&& other) noexcept;
    Texture& operator=(Texture&& other) noexcept;
    Texture(const Texture&) = delete;
    Texture& operator=(const Texture&) = delete;

    bool isValid() const { return bgfx::isValid(handle_); }
    bgfx::TextureHandle handle() const { return handle_; }
    int width() const { return width_; }
    int height() const { return height_; }

private:
    Texture(bgfx::TextureHandle handle, int width, int height);

    bgfx::TextureHandle handle_ = BGFX_INVALID_HANDLE;
    int width_ = 0;
    int height_ = 0;
};
