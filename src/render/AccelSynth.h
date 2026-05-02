// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// AccelSynth — synthesise SDL_EVENT_SENSOR_UPDATE events from Shift-gated
// mouse motion when no real accelerometer is available (desktop, iOS
// simulator, Android emulator).
//
// On iOS sim and Android emu, the mouse button must also be held — the
// platforms only deliver motion via touch synthesis, which requires a
// "finger down". On desktop, the button is irrelevant.
//
// Belongs to the render subsystem. Both DirectRenderHost (in-process)
// and the player binary's render loop use it. The engine subsystem
// only ever sees SDL_EVENT_SENSOR_UPDATE events; whether they originate
// from real hardware or this synthesis is invisible to the engine.
//
// Tilt model: mouse displacement from its initial press-point is the
// tilt vector. Magnitude × a fixed radians-per-pixel scale gives the
// tilt angle; the axis of rotation is perpendicular to the displacement
// in the screen plane. One rotation about one axis — no gimballing.
// No cap on displacement: let the user "flip the device upside down"
// if they want, with the physics following sin(angle) naturally.
#pragma once

#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>  // TEMP: T28.3 diagnostic

#if defined(__APPLE__)
#include <TargetConditionals.h>
#endif

#include <cmath>
#include <functional>

namespace ge {

// Radians of tilt per pixel of mouse displacement. Chosen so that ~300 px
// of displacement corresponds to ~45° tilt — a comfortable reach on a
// laptop trackpad / mouse.
constexpr float kTiltRadPerPixel = 0.0026f;  // ≈ π/4 / 300
constexpr float kG = 9.81f;

struct Tilt {
    float x = 0.f;  // mouse displacement from press-point, pixels
    float y = 0.f;
};

class AccelSynth {
public:
    AccelSynth() = default;

    void setWindow(SDL_Window* w) { window_ = w; }
    void setEmit(std::function<void(const SDL_Event&)> fn) { emit_ = std::move(fn); }

    // Current tilt vector (raw mouse displacement from the Shift-press
    // point, in pixels). Zero when Shift isn't held.
    Tilt current() const { return tilt_; }

    // Returns true if the event was consumed by the synthesis (caller
    // should NOT forward it). Returns false if the event passes through.
    bool handle(const SDL_Event& e) {
        // TEMP: T28.3 diagnostic — log key/mouse events to verify arrival
        if (e.type == SDL_EVENT_KEY_DOWN || e.type == SDL_EVENT_KEY_UP ||
            e.type == SDL_EVENT_MOUSE_MOTION || e.type == SDL_EVENT_MOUSE_BUTTON_DOWN ||
            e.type == SDL_EVENT_MOUSE_BUTTON_UP) {
            SPDLOG_INFO("AccelSynth: event type=0x{:x} shiftDown={}", e.type, shiftDown_);
        }

        if ((e.type == SDL_EVENT_KEY_DOWN || e.type == SDL_EVENT_KEY_UP)
            && (e.key.scancode == SDL_SCANCODE_LSHIFT ||
                e.key.scancode == SDL_SCANCODE_RSHIFT)) {
            const bool newShift = (e.type == SDL_EVENT_KEY_DOWN);
            if (newShift != shiftDown_) {
                shiftDown_ = newShift;
                SPDLOG_INFO("AccelSynth: shift {}", shiftDown_);  // TEMP: T28.3 diagnostic
                // Relative mouse mode pins the cursor so drag can continue
                // past the window edge (desktop). On iOS simulator it causes
                // a stuck-touch indicator when the mouse button is released,
                // and motion is delivered via touch synthesis anyway — skip.
#if !(defined(__APPLE__) && TARGET_OS_IOS)
                if (window_) {
                    SDL_SetWindowRelativeMouseMode(window_, shiftDown_);
                }
#endif
                if (shiftDown_) {
                    // Fresh capture — start from zero, no easing.
                    tilt_ = {};
                    easing_ = false;
                } else {
                    // Released — start easing tilt back to zero.
                    easing_ = true;
                    lastTickNs_ = 0;  // first update() initialises clock
                }
            }
            return true;  // consume Shift
        }

        if (e.type == SDL_EVENT_MOUSE_MOTION && shiftDown_) {
            tilt_.x += e.motion.xrel;
            tilt_.y += e.motion.yrel;
            SPDLOG_INFO("AccelSynth: motion xrel={} yrel={} tilt=({},{})",  // TEMP: T28.3 diagnostic
                        e.motion.xrel, e.motion.yrel, tilt_.x, tilt_.y);
            emitSensorFromTilt();
            return true;  // consume motion-while-tilting
        }

        return false;
    }

    // Called once per frame by the host. Drives tilt easing back to
    // zero after Shift is released. No-op while Shift is held or after the
    // tilt has fully decayed.
    void update() {
        if (!easing_) return;
        const uint64_t now = SDL_GetPerformanceCounter();
        if (lastTickNs_ == 0) {
            lastTickNs_ = now;
            return;
        }
        const uint64_t freq = SDL_GetPerformanceFrequency();
        const float dt = float(now - lastTickNs_) / float(freq);
        lastTickNs_ = now;

        constexpr float kTau = 0.08f;  // 80 ms — quick ease
        const float decay = std::exp(-dt / kTau);
        tilt_.x *= decay;
        tilt_.y *= decay;
        if (std::sqrt(tilt_.x * tilt_.x + tilt_.y * tilt_.y) < 0.5f) {
            tilt_ = {};
            easing_ = false;
        }
        emitSensorFromTilt();
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
    void emitSensorFromTilt() {
        if (!emit_) return;
        // Map displacement → gravity-along-screen-plane, i.e. g·sin(angle)
        // in the direction of the displacement. Bounded naturally by ±g.
        float mag = std::sqrt(tilt_.x * tilt_.x + tilt_.y * tilt_.y);
        float gx = 0.f, gy = 0.f;
        if (mag > 0.f) {
            float angle = mag * kTiltRadPerPixel;
            float s = std::sin(angle);
            gx =  kG * s * tilt_.x / mag;
            gy = -kG * s * tilt_.y / mag;
        }
        SPDLOG_INFO("AccelSynth: emit g=({},{})", gx, gy);  // TEMP: T28.3 diagnostic
        SDL_Event se{};
        se.type = SDL_EVENT_SENSOR_UPDATE;
        se.sensor.data[0] = gx;
        se.sensor.data[1] = gy;
        emit_(se);
    }

    Tilt tilt_;
    bool shiftDown_ = false;
    bool easing_  = false;
    uint64_t lastTickNs_ = 0;
    SDL_Window* window_ = nullptr;
    std::function<void(const SDL_Event&)> emit_;
};

} // namespace ge
