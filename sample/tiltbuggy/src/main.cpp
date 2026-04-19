// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// TiltBuggy — a ge sample driving a 2D buggy with tilt gravity.
// Stage 2: Box2D physics + bgfx rendering. On a real device the
// accelerometer drives gravity. On desktop/simulator/emulator the
// player synthesises accelerometer events from ⌥WASD when the game
// requests the sensor — no special key handling needed here.

#include "Renderer.h"
#include "Scene.h"

#include <ge/Protocol.h>
#include <ge/Resource.h>
#include <ge/SessionHost.h>
#include <SDL3/SDL.h>
#include <SDL3/SDL_main.h>  // required on iOS/Android; no-op on desktop
#include <spdlog/spdlog.h>

#include <cstring>
#include <memory>

namespace {

constexpr float kWorldHalfExtent = 10.0f;

struct State {
    std::unique_ptr<tiltbuggy::Scene> scene;
    std::unique_ptr<tiltbuggy::Renderer> renderer;
    b2Vec2 gravity{0, 0};
    bool rendererInited = false;
};

} // namespace

int main(int argc, char* argv[]) {
    bool brokered = false;  // default: direct/distribution modality
    for (int i = 1; i < argc; i++) {
        if (std::strcmp(argv[i], "--brokered") == 0) brokered = true;
    }

    State state;

    ge::run([&](ge::Context ctx) -> ge::RunConfig {
        state.scene = std::make_unique<tiltbuggy::Scene>(kWorldHalfExtent);
        state.renderer = std::make_unique<tiltbuggy::Renderer>();
        state.rendererInited = false;

        return {
            .onUpdate = [&](float dt) {
                state.scene->step(dt, state.gravity);
                static int frame = 0;
                if (++frame % 60 == 0) {
                    auto p = state.scene->buggyPose();
                    SPDLOG_INFO("tick: dt={:.4f} g=[{:.2f},{:.2f}] pose=[{:.2f},{:.2f},{:.2f}]",
                                dt, state.gravity.x, state.gravity.y, p.x, p.y, p.angle);
                }
            },
            .onRender = [&](int w, int h) {
                if (!state.rendererInited) {
                    state.renderer->init(ge::resource("build/shaders").c_str());
                    state.rendererInited = true;
                }
                state.renderer->drawFrame(*state.scene, w, h);
            },
            .onEvent = [&](const SDL_Event& e) {
                SPDLOG_INFO("onEvent type=0x{:x}", e.type);
                if (e.type == SDL_EVENT_SENSOR_UPDATE) {
                    state.gravity.x = e.sensor.data[0];
                    state.gravity.y = e.sensor.data[1];
                    SPDLOG_INFO("  → gravity=[{:.2f},{:.2f}]",
                                state.gravity.x, state.gravity.y);
                }
            },
            .onShutdown = [&] {
                state.scene.reset();
                state.renderer.reset();
                SPDLOG_INFO("TiltBuggy shutdown");
            },
        };
    }, {
        .width = brokered ? 0 : 1024,
        .height = brokered ? 0 : 768,
        .headless = brokered,
        .appName = "tiltbuggy",
        .sensors = wire::kSensorAccelerometer,
        .disableScreenSaver = true,
    });
}
