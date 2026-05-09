// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/png.h>

#include <ge/Resource.h>

#include <bgfx/bgfx.h>
#include <SDL3/SDL_iostream.h>
#include <SDL3/SDL_pixels.h>
#include <SDL3/SDL_surface.h>
#include <SDL3_image/SDL_image.h>
#include <spdlog/spdlog.h>

#include <cstdint>

namespace ge {

Sprite loadImage(const std::string& path) {
    std::string resolved = ge::resource(path);

    SDL_IOStream* io = SDL_IOFromFile(resolved.c_str(), "rb");
    if (io == nullptr) {
        spdlog::error("ge::loadImage: cannot open \"{}\" ({})", path, SDL_GetError());
        return Sprite{};
    }

    SDL_Surface* raw = IMG_Load_IO(io, true);
    if (raw == nullptr) {
        spdlog::error("ge::loadImage: IMG_Load_IO failed for \"{}\" ({})", path, SDL_GetError());
        return Sprite{};
    }

    SDL_Surface* rgba = SDL_ConvertSurface(raw, SDL_PIXELFORMAT_RGBA32);
    SDL_DestroySurface(raw);
    if (rgba == nullptr) {
        spdlog::error("ge::loadImage: SDL_ConvertSurface failed for \"{}\" ({})", path, SDL_GetError());
        return Sprite{};
    }

    const int w = rgba->w;
    const int h = rgba->h;
    const int pitch = rgba->pitch;
    uint8_t* pixels = static_cast<uint8_t*>(rgba->pixels);

    // Premultiply alpha in-place. SDL_image does not premultiply; ge's render
    // pipeline (premultiplied-alpha blend) requires it.
    for (int y = 0; y < h; ++y) {
        uint8_t* row = pixels + static_cast<size_t>(y) * pitch;
        for (int x = 0; x < w; ++x) {
            uint8_t* p = row + x * 4;
            const uint32_t a = p[3];
            p[0] = static_cast<uint8_t>((p[0] * a + 127u) / 255u);
            p[1] = static_cast<uint8_t>((p[1] * a + 127u) / 255u);
            p[2] = static_cast<uint8_t>((p[2] * a + 127u) / 255u);
        }
    }

    const uint32_t dataSize = static_cast<uint32_t>(w) * static_cast<uint32_t>(h) * 4u;
    const bgfx::Memory* mem = bgfx::copy(pixels, dataSize);
    SDL_DestroySurface(rgba);

    Sprite out;
    out.tex = bgfx::createTexture2D(
        static_cast<uint16_t>(w),
        static_cast<uint16_t>(h),
        false, 1,
        bgfx::TextureFormat::RGBA8,
        BGFX_TEXTURE_NONE,
        mem);
    out.width  = w;
    out.height = h;
    return out;
}

} // namespace ge
