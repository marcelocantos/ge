#pragma once

#include "BgfxResource.h"

// Pure asset class for textures - no rendering knowledge
class Texture {
public:
    // Load texture from image file (PNG, etc.)
    static Texture fromFile(const char* path);

    Texture() = default;

    bool isValid() const { return handle_.isValid(); }
    bgfx::TextureHandle handle() const { return handle_; }
    int width() const { return width_; }
    int height() const { return height_; }

private:
    Texture(TextureHandle handle, int width, int height);

    TextureHandle handle_;
    int width_ = 0;
    int height_ = 0;
};
