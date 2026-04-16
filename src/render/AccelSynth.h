// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// AccelSynth — synthesise SDL_EVENT_SENSOR_UPDATE events from ⌥-gated
// mouse motion when no real accelerometer is available (desktop, iOS
// simulator, Android emulator).
//
// Belongs to the render subsystem. Both DirectRenderHost (in-process)
// and the player binary's render loop use it. The engine subsystem
// only ever sees SDL_EVENT_SENSOR_UPDATE events; whether they originate
// from real hardware or this synthesis is invisible to the engine.
//
// Usage:
//   AccelSynth synth(windowWidth, windowHeight);
//   synth.setWindow(window);  // for SDL_SetWindowRelativeMouseMode
//   synth.setEmit([](const SDL_Event& e){ ... });
//
//   for each SDL event:
//     if (synth.handle(e)) continue;  // event was consumed
//     ... forward event normally
#pragma once

#include <SDL3/SDL.h>

#include <algorithm>
#include <functional>

namespace ge {

class AccelSynth {
public:
    AccelSynth(int windowWidth, int windowHeight)
        : tiltMax_(float(std::min(windowWidth, windowHeight)) * 0.3f) {}

    void setWindow(SDL_Window* w) { window_ = w; }
    void setEmit(std::function<void(const SDL_Event&)> fn) { emit_ = std::move(fn); }

    // Returns true if the event was consumed by the synthesis (caller
    // should NOT forward it). Returns false if the event passes through.
    bool handle(const SDL_Event& e) {
        if ((e.type == SDL_EVENT_KEY_DOWN || e.type == SDL_EVENT_KEY_UP)
            && (e.key.scancode == SDL_SCANCODE_LALT ||
                e.key.scancode == SDL_SCANCODE_RALT)) {
            const bool newAlt = (e.type == SDL_EVENT_KEY_DOWN);
            if (newAlt != altDown_) {
                altDown_ = newAlt;
                if (window_) {
                    SDL_SetWindowRelativeMouseMode(window_, altDown_);
                }
                tiltX_ = tiltY_ = 0.f;
                if (!altDown_ && emit_) {
                    SDL_Event se{};
                    se.type = SDL_EVENT_SENSOR_UPDATE;
                    se.sensor.data[0] = 0.f;
                    se.sensor.data[1] = 0.f;
                    emit_(se);
                }
            }
            return true;  // consume ⌥
        }

        if (e.type == SDL_EVENT_MOUSE_MOTION && altDown_) {
            tiltX_ += e.motion.xrel;
            tiltY_ += e.motion.yrel;
            if (tiltX_ >  tiltMax_) tiltX_ =  tiltMax_;
            if (tiltX_ < -tiltMax_) tiltX_ = -tiltMax_;
            if (tiltY_ >  tiltMax_) tiltY_ =  tiltMax_;
            if (tiltY_ < -tiltMax_) tiltY_ = -tiltMax_;
            if (emit_) {
                constexpr float kG = 9.81f;
                SDL_Event se{};
                se.type = SDL_EVENT_SENSOR_UPDATE;
                se.sensor.data[0] =  (tiltX_ / tiltMax_) * kG;
                se.sensor.data[1] = -(tiltY_ / tiltMax_) * kG;  // screen-Y is down
                emit_(se);
            }
            return true;  // consume motion-while-tilting
        }

        return false;
    }

    // True if a real accelerometer is available (synthesis should NOT
    // be active in that case). Caller should check this once at startup
    // and decide whether to wire AccelSynth in at all.
    static bool realSensorAvailable() {
        int count = 0;
        SDL_SensorID* ids = SDL_GetSensors(&count);
        if (ids) SDL_free(ids);
        return count > 0;
    }

private:
    float tiltMax_;
    float tiltX_ = 0.f, tiltY_ = 0.f;
    bool altDown_ = false;
    SDL_Window* window_ = nullptr;
    std::function<void(const SDL_Event&)> emit_;
};

} // namespace ge
