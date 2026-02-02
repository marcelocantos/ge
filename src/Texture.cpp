#include "Texture.h"
#include <SDL3_image/SDL_image.h>
#include <format>
#include <stdexcept>

Texture Texture::fromFile(const char* path) {
    try {
        SDL_Surface* surface = IMG_Load(path);
        if (!surface) {
            throw std::runtime_error(SDL_GetError());
        }

        int width = surface->w;
        int height = surface->h;

        // Convert to RGBA if needed
        if (surface->format != SDL_PIXELFORMAT_RGBA32) {
            SDL_Surface* converted = SDL_ConvertSurface(surface, SDL_PIXELFORMAT_RGBA32);
            SDL_DestroySurface(surface);
            if (!converted) {
                throw std::runtime_error(SDL_GetError());
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
        return Texture(std::move(handle), width, height);
    } catch (const std::exception& e) {
        throw std::runtime_error(
            std::format("Failed to load texture {}: {}", path, e.what()));
    }
}

Texture::Texture(TextureHandle handle, int width, int height)
    : handle_(std::move(handle)), width_(width), height_(height) {}
