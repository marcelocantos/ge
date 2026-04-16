// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include "DirectRenderHost.h"

#include <ge/Signal.h>

#include <bgfx/bgfx.h>
#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>

#include <algorithm>

namespace ge {

struct DirectRenderHost::Impl {
    int width;
    int height;
    std::unique_ptr<BgfxContext> bgfxCtx;
    std::function<void(const SDL_Event&)> eventHandler;
    bool quit = false;

    // ⌥-mouse accelerometer synthesis state.
    bool altDown = false;
    float tiltX = 0.f, tiltY = 0.f;
    float tiltMax;
};

DirectRenderHost::DirectRenderHost(const SessionHostConfig& config)
    : i_(std::make_unique<Impl>()) {
    i_->width  = config.width  > 0 ? config.width  : 1280;
    i_->height = config.height > 0 ? config.height : 800;
    i_->tiltMax = float(std::min(i_->width, i_->height)) * 0.3f;

    // Initial screen-saver policy — must be set before SDL_Init
    // (BgfxContext does that). Games can toggle at runtime.
    SDL_SetHint(SDL_HINT_VIDEO_ALLOW_SCREENSAVER,
                config.disableScreenSaver ? "0" : "1");

    i_->bgfxCtx = std::make_unique<BgfxContext>(
        BgfxConfig{i_->width, i_->height, /*headless=*/false, config.appName});

    SPDLOG_INFO("DirectRenderHost: {}x{}", i_->width, i_->height);
}

DirectRenderHost::~DirectRenderHost() = default;

int DirectRenderHost::width() const  { return i_->width; }
int DirectRenderHost::height() const { return i_->height; }
DeviceClass DirectRenderHost::deviceClass() const { return DeviceClass::Desktop; }

void DirectRenderHost::send(const wire::SessionConfig&) {
    // Direct mode applies orientation/sensor hints in-process; for now
    // we don't act on them (desktop has no orientation lock). Real
    // implementation would forward to SDL hints / window config here.
}

void DirectRenderHost::setEventHandler(std::function<void(const SDL_Event&)> h) {
    i_->eventHandler = std::move(h);
}

void DirectRenderHost::pumpEvents() {
    constexpr float kG = 9.81f;
    SDL_Event e;
    while (SDL_PollEvent(&e)) {
        if (e.type == SDL_EVENT_QUIT) {
            i_->quit = true;
            continue;
        }

        // Alt key toggles tilt capture (cursor lock + ⌥-mouse synthesis).
        if ((e.type == SDL_EVENT_KEY_DOWN || e.type == SDL_EVENT_KEY_UP)
            && (e.key.scancode == SDL_SCANCODE_LALT ||
                e.key.scancode == SDL_SCANCODE_RALT)) {
            bool newAlt = (e.type == SDL_EVENT_KEY_DOWN);
            if (newAlt != i_->altDown) {
                i_->altDown = newAlt;
                SDL_SetWindowRelativeMouseMode(i_->bgfxCtx->window(), i_->altDown);
                i_->tiltX = i_->tiltY = 0.f;
                if (!i_->altDown && i_->eventHandler) {
                    SDL_Event se{};
                    se.type = SDL_EVENT_SENSOR_UPDATE;
                    se.sensor.data[0] = 0.f;
                    se.sensor.data[1] = 0.f;
                    i_->eventHandler(se);
                }
            }
            continue;  // don't forward ⌥ itself
        }

        // Mouse motion while ⌥ held = tilt.
        if (e.type == SDL_EVENT_MOUSE_MOTION && i_->altDown) {
            i_->tiltX += e.motion.xrel;
            i_->tiltY += e.motion.yrel;
            if (i_->tiltX >  i_->tiltMax) i_->tiltX =  i_->tiltMax;
            if (i_->tiltX < -i_->tiltMax) i_->tiltX = -i_->tiltMax;
            if (i_->tiltY >  i_->tiltMax) i_->tiltY =  i_->tiltMax;
            if (i_->tiltY < -i_->tiltMax) i_->tiltY = -i_->tiltMax;
            if (i_->eventHandler) {
                SDL_Event se{};
                se.type = SDL_EVENT_SENSOR_UPDATE;
                se.sensor.data[0] =  (i_->tiltX / i_->tiltMax) * kG;
                se.sensor.data[1] = -(i_->tiltY / i_->tiltMax) * kG;
                i_->eventHandler(se);
            }
            continue;
        }

        if (i_->eventHandler) i_->eventHandler(e);
    }
}

void DirectRenderHost::beginFrame() {
    // Direct mode: bgfx already draws to the swap chain. Just set the
    // viewport for view 0.
    bgfx::setViewRect(0, 0, 0, uint16_t(i_->width), uint16_t(i_->height));
}

void DirectRenderHost::endFrame(uint32_t /*bgfxFrameNumber*/) {
    // Nothing to do — bgfx::frame() already presented to the window.
}

bool DirectRenderHost::shouldQuit() const {
    return i_->quit || ge::shouldQuit();
}

} // namespace ge
