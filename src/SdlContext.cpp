#include <sq/SdlContext.h>
#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>
#include <format>
#include <stdexcept>

struct SdlContext::M {
    SDL_Window* window = nullptr;
    void* nativeHandle = nullptr;
};

SdlContext::SdlContext(const char* windowTitle, int width, int height)
    : m(std::make_unique<M>()) {

    if (!SDL_Init(SDL_INIT_VIDEO)) {
        throw std::runtime_error(std::format("SDL_Init failed: {}", SDL_GetError()));
    }

    SPDLOG_INFO("SDL3 initialized");

    m->window = SDL_CreateWindow(windowTitle, width, height, SDL_WINDOW_RESIZABLE);
    if (!m->window) {
        SDL_Quit();
        throw std::runtime_error(std::format("SDL_CreateWindow failed: {}", SDL_GetError()));
    }

    SPDLOG_INFO("Window created");

    // Get native window handle for bgfx
    SDL_PropertiesID props = SDL_GetWindowProperties(m->window);
    m->nativeHandle = SDL_GetPointerProperty(props, SDL_PROP_WINDOW_COCOA_WINDOW_POINTER, nullptr);

    SPDLOG_INFO("Got native window: {}", m->nativeHandle);
}

SdlContext::~SdlContext() {
    if (m) {
        SDL_DestroyWindow(m->window);
        SDL_Quit();
    }
}

SDL_Window* SdlContext::window() const { return m->window; }
void* SdlContext::nativeWindowHandle() const { return m->nativeHandle; }
