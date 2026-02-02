#include "Texture.h"
#include <SDL3_image/SDL_image.h>
#include <spdlog/spdlog.h>
#include <stdexcept>

Texture Texture::fromFile(const char* path) {
    SDL_Surface* surface = IMG_Load(path);
    if (!surface) {
        spdlog::error("Failed to load texture: {} - {}", path, SDL_GetError());
        return Texture();
    }

    int width = surface->w;
    int height = surface->h;

    // Convert to RGBA if needed
    if (surface->format != SDL_PIXELFORMAT_RGBA32) {
        SDL_Surface* converted = SDL_ConvertSurface(surface, SDL_PIXELFORMAT_RGBA32);
        SDL_DestroySurface(surface);
        if (!converted) {
            spdlog::error("Failed to convert texture: {}", SDL_GetError());
            return Texture();
        }
        surface = converted;
    }

    // Create bgfx texture
    const bgfx::Memory* mem = bgfx::copy(surface->pixels, width * height * 4);
    SDL_DestroySurface(surface);

    try {
        TextureHandle handle(bgfx::createTexture2D(
            width, height, false, 1,
            bgfx::TextureFormat::RGBA8,
            BGFX_SAMPLER_U_CLAMP | BGFX_SAMPLER_V_CLAMP,
            mem
        ));
        return Texture(std::move(handle), width, height);
    } catch (const std::exception& e) {
        throw std::runtime_error(
            fmt::format("Failed to create texture {}: {}", path, e.what()));
    }
}

Texture::Texture(TextureHandle handle, int width, int height)
    : handle_(std::move(handle)), width_(width), height_(height) {}
