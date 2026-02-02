#include "SdlContext.h"
#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>

struct SdlContext::M {
    bool initialized = false;
    SDL_Window* window = nullptr;
    void* nativeHandle = nullptr;
};

SdlContext::SdlContext(const char* windowTitle, int width, int height)
    : m(std::make_unique<M>()) {

    if (!SDL_Init(SDL_INIT_VIDEO)) {
        spdlog::error("SDL_Init failed: {}", SDL_GetError());
        return;
    }

    spdlog::info("SDL3 initialized");

    m->window = SDL_CreateWindow(windowTitle, width, height, SDL_WINDOW_RESIZABLE);
    if (!m->window) {
        spdlog::error("SDL_CreateWindow failed: {}", SDL_GetError());
        SDL_Quit();
        return;
    }

    spdlog::info("Window created");

    // Get native window handle for bgfx
    SDL_PropertiesID props = SDL_GetWindowProperties(m->window);
    m->nativeHandle = SDL_GetPointerProperty(props, SDL_PROP_WINDOW_COCOA_WINDOW_POINTER, nullptr);

    spdlog::info("Got native window: {}", m->nativeHandle);

    m->initialized = true;
}

SdlContext::~SdlContext() {
    if (m) {
        if (m->window) {
            SDL_DestroyWindow(m->window);
        }
        if (m->initialized) {
            SDL_Quit();
        }
    }
}

bool SdlContext::isValid() const { return m->initialized; }
SDL_Window* SdlContext::window() const { return m->window; }
void* SdlContext::nativeWindowHandle() const { return m->nativeHandle; }
