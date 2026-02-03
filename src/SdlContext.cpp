#include <sq/SdlContext.h>
#include <SDL3/SDL.h>
#include <SDL3/SDL_metal.h>
#include <spdlog/spdlog.h>
#include <stdexcept>
#include <string>

// Context for event watch - stored in handle, used as userdata for SDL callback
struct EventWatchContext {
    SdlContext::EventFilter filter;
};

// EventWatchHandle implementation uses EventWatchContext
struct EventWatchHandle::M {
    EventWatchContext ctx;
};

// SDL event watch callback - forwards to user's event filter
static bool eventWatch(void* userdata, SDL_Event* event) {
    auto* ctx = static_cast<EventWatchContext*>(userdata);
    if (ctx->filter) {
        return ctx->filter(*event);
    }
    return true;
}

// EventWatchHandle implementation
EventWatchHandle::EventWatchHandle(std::unique_ptr<M> impl) : impl_(std::move(impl)) {}

EventWatchHandle::~EventWatchHandle() {
    if (impl_) {
        SDL_RemoveEventWatch(eventWatch, &impl_->ctx);
    }
}

EventWatchHandle::EventWatchHandle(EventWatchHandle&& other) noexcept = default;
EventWatchHandle& EventWatchHandle::operator=(EventWatchHandle&& other) noexcept {
    if (this != &other) {
        if (impl_) {
            SDL_RemoveEventWatch(eventWatch, &impl_->ctx);
        }
        impl_ = std::move(other.impl_);
    }
    return *this;
}

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

EventWatchHandle SdlContext::addEventWatch(EventFilter filter) {
    auto impl = std::make_unique<EventWatchHandle::M>();
    impl->ctx.filter = std::move(filter);
    SDL_AddEventWatch(eventWatch, &impl->ctx);
    return EventWatchHandle(std::move(impl));
}
