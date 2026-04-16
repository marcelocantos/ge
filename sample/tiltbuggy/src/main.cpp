// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// TiltBuggy — a minimal ge sample that draws a buggy driven by device tilt.
// Stage 1: ge::run() boilerplate + bgfx clear. No physics yet.

#include <ge/SessionHost.h>
#include <bgfx/bgfx.h>
#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>

namespace {

struct State {
    float t = 0;
};

} // namespace

int main() {
    State state;

    ge::run([&](ge::Context ctx) -> ge::RunConfig {
        const bgfx::ViewId kMainView = 0;

        return {
            .onUpdate = [&](float dt) {
                state.t += dt;
            },
            .onRender = [&, ctx](int w, int h) {
                const float cycle = 0.5f + 0.5f * SDL_sinf(state.t);
                const uint8_t grey = static_cast<uint8_t>(30 + cycle * 40);
                const uint32_t rgba =
                    (uint32_t(grey) << 24) | (uint32_t(grey) << 16) |
                    (uint32_t(grey) <<  8) | 0xffu;
                bgfx::setViewClear(kMainView, BGFX_CLEAR_COLOR | BGFX_CLEAR_DEPTH, rgba, 1.0f, 0);
                bgfx::setViewRect(kMainView, 0, 0, uint16_t(w), uint16_t(h));
                bgfx::touch(kMainView);
            },
            .onEvent = [&](const SDL_Event& e) {
                if (e.type == SDL_EVENT_KEY_DOWN) {
                    SPDLOG_INFO("key: {}", int(e.key.key));
                }
            },
            .onShutdown = [&] {
                SPDLOG_INFO("TiltBuggy shutdown, final t={:.2f}", state.t);
            },
        };
    }, {
        .appName = "tiltbuggy",
        // Tilt is the primary input — keep the screen awake.
        .disableScreenSaver = true,
    });
}
