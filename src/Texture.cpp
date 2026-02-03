#include "TextureInternal.h"
#include <SDL3_image/SDL_image.h>
#include <bgfx/bgfx.h>
#include <format>
#include <stdexcept>

Texture::Texture() : m(std::make_unique<M>()) {}
Texture::~Texture() = default;
Texture::Texture(Texture&&) noexcept = default;
Texture& Texture::operator=(Texture&&) noexcept = default;

Texture::Texture(std::unique_ptr<M> impl) : m(std::move(impl)) {}

bool Texture::isValid() const { return m && m->handle.isValid(); }
int Texture::width() const { return m ? m->width : 0; }
int Texture::height() const { return m ? m->height : 0; }

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

        auto impl = std::make_unique<M>();
        impl->handle = TextureHandle(bgfx::createTexture2D(
            width, height, false, 1,
            bgfx::TextureFormat::RGBA8,
            BGFX_SAMPLER_U_CLAMP | BGFX_SAMPLER_V_CLAMP,
            mem
        ));
        impl->width = width;
        impl->height = height;
        return Texture(std::move(impl));
    } catch (const std::exception& e) {
        throw std::runtime_error(
            std::format("Failed to load texture {}: {}", path, e.what()));
    }
}
