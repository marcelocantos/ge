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

    bgfx::TextureHandle handle = bgfx::createTexture2D(
        width, height, false, 1,
        bgfx::TextureFormat::RGBA8,
        BGFX_SAMPLER_U_CLAMP | BGFX_SAMPLER_V_CLAMP,
        mem
    );

    if (!bgfx::isValid(handle)) {
        spdlog::error("Failed to create bgfx texture: {}", path);
        return Texture();
    }

    return Texture(handle, width, height);
}

Texture::Texture(bgfx::TextureHandle handle, int width, int height)
    : handle_(handle), width_(width), height_(height) {}

Texture::~Texture() {
    if (bgfx::isValid(handle_)) {
        bgfx::destroy(handle_);
    }
}

Texture::Texture(Texture&& other) noexcept
    : handle_(other.handle_), width_(other.width_), height_(other.height_) {
    other.handle_ = BGFX_INVALID_HANDLE;
    other.width_ = 0;
    other.height_ = 0;
}

Texture& Texture::operator=(Texture&& other) noexcept {
    if (this != &other) {
        if (bgfx::isValid(handle_)) {
            bgfx::destroy(handle_);
        }
        handle_ = other.handle_;
        width_ = other.width_;
        height_ = other.height_;
        other.handle_ = BGFX_INVALID_HANDLE;
        other.width_ = 0;
        other.height_ = 0;
    }
    return *this;
}
