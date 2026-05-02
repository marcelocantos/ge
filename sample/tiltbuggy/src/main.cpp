// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// TiltBuggy — a ge sample driving a 2D buggy with tilt gravity.
// Stage 2: Box2D physics + bgfx rendering. On a real device the
// accelerometer drives gravity. On desktop/simulator/emulator
// AccelSynth synthesises SDL_EVENT_SENSOR_UPDATE events from
// Shift-gated mouse drag — hold Shift and drag to tilt the world.

#include "Renderer.h"
#include "Scene.h"

#include <ge/Protocol.h>
#include <ge/Resource.h>
#include <ge/SessionHost.h>
#include <SDL3/SDL.h>
#include <SDL3/SDL_main.h>  // required on iOS/Android; no-op on desktop
#include <spdlog/spdlog.h>
#include <spdlog/sinks/base_sink.h>

#ifdef GE_IOS
// TEMP: T28.3 diagnostic — route spdlog through NSLog so logs appear in
// xcrun simctl spawn log stream output.
#import <Foundation/Foundation.h>
template <typename Mutex>
class nslog_sink : public spdlog::sinks::base_sink<Mutex> {
protected:
    void sink_it_(const spdlog::details::log_msg& msg) override {
        spdlog::memory_buf_t buf;
        spdlog::sinks::base_sink<Mutex>::formatter_->format(msg, buf);
        NSString* s = [[NSString alloc] initWithBytes:buf.data()
                                               length:buf.size()
                                             encoding:NSUTF8StringEncoding];
        NSLog(@"%@", s);
    }
    void flush_() override {}
};
#endif  // GE_IOS

#ifdef __ANDROID__
// TEMP: T28.4 diagnostic — route spdlog through Android's log so logs
// appear in logcat.
#include <android/log.h>
template <typename Mutex>
class android_sink : public spdlog::sinks::base_sink<Mutex> {
protected:
    void sink_it_(const spdlog::details::log_msg& msg) override {
        spdlog::memory_buf_t buf;
        spdlog::sinks::base_sink<Mutex>::formatter_->format(msg, buf);
        std::string s(buf.data(), buf.size());
        __android_log_print(ANDROID_LOG_INFO, "tiltbuggy", "%s", s.c_str());
    }
    void flush_() override {}
};
#endif  // __ANDROID__

#include <cstring>
#include <memory>

namespace {

constexpr float kWorldHalfExtent = 0.625f;

struct State {
    std::unique_ptr<tiltbuggy::Scene> scene;
    std::unique_ptr<tiltbuggy::Renderer> renderer;
    b2Vec2 gravity{0, 0};
    bool rendererInited = false;
};

} // namespace

int main(int argc, char* argv[]) {
#ifdef GE_IOS
    // TEMP: T28.3 diagnostic — install NSLog sink so spdlog output is visible.
    {
        auto sink = std::make_shared<nslog_sink<std::mutex>>();
        auto logger = std::make_shared<spdlog::logger>("tiltbuggy", sink);
        logger->set_level(spdlog::level::info);
        spdlog::set_default_logger(logger);
    }
#endif  // GE_IOS

#ifdef __ANDROID__
    // TEMP: T28.4 diagnostic — install Android log sink so spdlog output is visible.
    {
        auto sink = std::make_shared<android_sink<std::mutex>>();
        auto logger = std::make_shared<spdlog::logger>("tiltbuggy", sink);
        logger->set_level(spdlog::level::info);
        spdlog::set_default_logger(logger);
    }
#endif  // __ANDROID__

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
                    state.renderer->init(ge::resource(ge::shaderDir()).c_str());
                    state.rendererInited = true;
                }
                state.renderer->drawFrame(*state.scene, w, h);
            },
            .onEvent = [&](const SDL_Event& e) {
                SPDLOG_INFO("onEvent type=0x{:x}", e.type);
                if (e.type == SDL_EVENT_SENSOR_UPDATE) {
                    // Engine delivers device acceleration in screen frame.
                    // The world/board accelerates in that direction, so the
                    // buggy (free on the board) experiences gravity in the
                    // opposite direction — hence the negation.
                    state.gravity.x = -e.sensor.data[0];
                    state.gravity.y = -e.sensor.data[1];
                    SPDLOG_INFO("ACCEL accel=[{:+.2f},{:+.2f},{:+.2f}] gravity=[{:+.2f},{:+.2f}]",
                                e.sensor.data[0], e.sensor.data[1], e.sensor.data[2],
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
        .orientation = wire::kOrientationLandscape,
        .disableScreenSaver = true,
    });
}
