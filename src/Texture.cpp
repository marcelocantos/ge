#include "Texture.h"
#include <SDL3_image/SDL_image.h>
#include <spdlog/spdlog.h>

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

    TextureHandle handle(bgfx::createTexture2D(
        width, height, false, 1,
        bgfx::TextureFormat::RGBA8,
        BGFX_SAMPLER_U_CLAMP | BGFX_SAMPLER_V_CLAMP,
        mem
    ));

    if (!handle.isValid()) {
        spdlog::error("Failed to create bgfx texture: {}", path);
        return Texture();
    }

    return Texture(std::move(handle), width, height);
}

Texture::Texture(TextureHandle handle, int width, int height)
    : handle_(std::move(handle)), width_(width), height_(height) {}
