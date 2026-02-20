#include <ge/Session.h>
#include <ge/Audio.h>
#include <ge/SdlContext.h>
#include <ge/DeltaTimer.h>
#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>

namespace ge {

struct Session::M {
    SdlContext sdl;
    GpuContext gpu;
    Audio audio;
    int pixelRatio = 1;

    M() : sdl("ge", 1280, 720),
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

HttpServer& Session::http() {
    static_assert(sizeof(HttpServer*) > 0, "HttpServer not available in direct mode");
    SPDLOG_ERROR("http() not available in direct mode");
    std::abort();
}
void Session::connect() { /* no-op in direct mode */ }
GpuContext& Session::gpu() { return m->gpu; }
Audio& Session::audio() { return m->audio; }
int Session::pixelRatio() const { return m->pixelRatio; }
void Session::flush() { /* no-op: Application calls present() directly */ }

bool Session::run(RunConfig config) {
    DeltaTimer timer;

    auto resizeWatch = m->sdl.addEventWatch([&](const SDL_Event& e) -> bool {
        if (e.type == SDL_EVENT_WINDOW_PIXEL_SIZE_CHANGED) {
            int w = e.window.data1, h = e.window.data2;
            m->gpu.resize({w, h});
            if (config.onResize) config.onResize(w, h);
            if (config.onUpdate) config.onUpdate(timer.tick());
            if (config.onRender) {
                auto view = m->gpu.currentFrameView();
                if (view) {
                    config.onRender(view, w, h);
                    m->gpu.present();
                }
            }
        }
        return true;
    });

    for (;;) {
        SDL_Event e;
        while (SDL_PollEvent(&e)) {
            if (e.type == SDL_EVENT_QUIT) return false;
            if (e.type == SDL_EVENT_WINDOW_PIXEL_SIZE_CHANGED) {
                int w = e.window.data1, h = e.window.data2;
                m->gpu.resize({w, h});
                if (config.onResize) config.onResize(w, h);
            }
            if (config.onEvent) config.onEvent(e);
        }

        if (config.onUpdate) config.onUpdate(timer.tick());
        if (config.onRender) {
            auto view = m->gpu.currentFrameView();
            if (view) {
                config.onRender(view, m->gpu.width(), m->gpu.height());
                m->gpu.present();
            }
        }
    }
}

} // namespace ge
