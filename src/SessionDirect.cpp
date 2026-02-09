#include <sq/Session.h>
#include <sq/SdlContext.h>
#include <sq/DeltaTimer.h>
#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>

namespace sq {

struct Session::M {
    SdlContext sdl;
    GpuContext gpu;
    int pixelRatio = 1;

    M() : sdl("sq", 1280, 720),
          gpu(sdl.nativeSurface(),
              getPixelSize(sdl.window()).first,
              getPixelSize(sdl.window()).second) {
        int pw, ph, ww, wh;
        SDL_GetWindowSizeInPixels(sdl.window(), &pw, &ph);
        SDL_GetWindowSize(sdl.window(), &ww, &wh);
        pixelRatio = (ww > 0) ? pw / ww : 1;
        SPDLOG_INFO("Direct session: {}x{} pixels, {}x ratio",
                    pw, ph, pixelRatio);
    }

    static std::pair<int,int> getPixelSize(SDL_Window* w) {
        int pw, ph;
        SDL_GetWindowSizeInPixels(w, &pw, &ph);
        return {pw, ph};
    }
};

Session::Session() : m(std::make_unique<M>()) {}
Session::~Session() = default;

GpuContext& Session::gpu() { return m->gpu; }
int Session::pixelRatio() const { return m->pixelRatio; }
void Session::flush() { /* no-op: Application calls present() directly */ }

bool Session::run(std::function<void(float dt)> onFrame,
                  std::function<void(const SDL_Event&)> onEvent) {
    DeltaTimer timer;

    auto resizeWatch = m->sdl.addEventWatch([&](const SDL_Event& e) -> bool {
        if (e.type == SDL_EVENT_WINDOW_PIXEL_SIZE_CHANGED) {
            m->gpu.resize({e.window.data1, e.window.data2});
            onFrame(timer.tick());
        }
        return true;
    });

    for (;;) {
        SDL_Event e;
        while (SDL_PollEvent(&e)) {
            if (e.type == SDL_EVENT_QUIT) return false;
            if (e.type == SDL_EVENT_WINDOW_PIXEL_SIZE_CHANGED)
                m->gpu.resize({e.window.data1, e.window.data2});
            if (onEvent) onEvent(e);
        }

        onFrame(timer.tick());
    }
}

} // namespace sq
