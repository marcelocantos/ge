#include <sq/SdlContext.h>
#include <SDL3/SDL.h>
#include <SDL3/SDL_metal.h>
#include <spdlog/spdlog.h>
#include <stdexcept>
#include <string>

struct SdlContext::M {
    SDL_Window* window = nullptr;
    SDL_MetalView metalView = nullptr;
};

SdlContext::SdlContext(const char* windowTitle, int width, int height)
    : m(std::make_unique<M>()) {

    if (!SDL_Init(SDL_INIT_VIDEO)) {
        throw std::runtime_error(std::string("SDL_Init failed: ") + SDL_GetError());
    }

    SPDLOG_INFO("SDL3 initialized");

    // Create window with Metal support
    m->window = SDL_CreateWindow(windowTitle, width, height,
                                  SDL_WINDOW_RESIZABLE | SDL_WINDOW_METAL);
    if (!m->window) {
        SDL_Quit();
        throw std::runtime_error(std::string("SDL_CreateWindow failed: ") + SDL_GetError());
    }

    SPDLOG_INFO("Window created");

    // Create Metal view for WebGPU
    m->metalView = SDL_Metal_CreateView(m->window);
    if (!m->metalView) {
        SDL_DestroyWindow(m->window);
        SDL_Quit();
        throw std::runtime_error(std::string("SDL_Metal_CreateView failed: ") + SDL_GetError());
    }

    SPDLOG_INFO("Metal view created");
}

SdlContext::~SdlContext() {
    if (m) {
        if (m->metalView) {
            SDL_Metal_DestroyView(m->metalView);
        }
        SDL_DestroyWindow(m->window);
        SDL_Quit();
    }
}

SDL_Window* SdlContext::window() const { return m->window; }

void* SdlContext::metalLayer() const {
    return m->metalView ? SDL_Metal_GetLayer(m->metalView) : nullptr;
}
