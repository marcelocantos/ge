// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include "DirectRenderHost.h"
#include "AccelSynth.h"

#include <ge/Protocol.h>
#include <ge/Signal.h>

#include <bgfx/bgfx.h>
#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>

#include <optional>

namespace ge {

struct DirectRenderHost::Impl {
    int width;
    int height;
    std::unique_ptr<BgfxContext> bgfxCtx;
    std::function<void(const SDL_Event&)> eventHandler;
    bool quit = false;

    // ⌥-mouse synthesis (only when no real sensor is available).
    std::optional<AccelSynth> synth;
};

DirectRenderHost::DirectRenderHost(const SessionHostConfig& config)
    : i_(std::make_unique<Impl>()) {
    i_->width  = config.width  > 0 ? config.width  : 1280;
    i_->height = config.height > 0 ? config.height : 800;

    // Initial screen-saver policy — must be set before SDL_Init
    // (BgfxContext does that). Games can toggle at runtime.
    SDL_SetHint(SDL_HINT_VIDEO_ALLOW_SCREENSAVER,
                config.disableScreenSaver ? "0" : "1");

    i_->bgfxCtx = std::make_unique<BgfxContext>(
        BgfxConfig{i_->width, i_->height, /*headless=*/false, config.appName});

    // Wire ⌥-mouse synthesis if the host has no real accelerometer
    // and the game requested sensor input.
    if ((config.sensors & wire::kSensorAccelerometer) &&
        !AccelSynth::realSensorAvailable()) {
        i_->synth.emplace(i_->width, i_->height);
        i_->synth->setWindow(i_->bgfxCtx->window());
        SPDLOG_INFO("DirectRenderHost: ⌥-mouse accelerometer synthesis enabled");
    }

    SPDLOG_INFO("DirectRenderHost: {}x{}", i_->width, i_->height);
}

DirectRenderHost::~DirectRenderHost() = default;

int DirectRenderHost::width() const  { return i_->width; }
int DirectRenderHost::height() const { return i_->height; }
DeviceClass DirectRenderHost::deviceClass() const { return DeviceClass::Desktop; }

void DirectRenderHost::send(const wire::SessionConfig&) {
    // Direct mode applies orientation/sensor hints in-process; for now
    // we don't act on them (desktop has no orientation lock).
}

void DirectRenderHost::setEventHandler(std::function<void(const SDL_Event&)> h) {
    i_->eventHandler = h;
    if (i_->synth) i_->synth->setEmit(h);
}

void DirectRenderHost::pumpEvents() {
    SDL_Event e;
    while (SDL_PollEvent(&e)) {
        if (e.type == SDL_EVENT_QUIT) {
            i_->quit = true;
            continue;
        }
        if (i_->synth && i_->synth->handle(e)) continue;
        if (i_->eventHandler) i_->eventHandler(e);
    }
}

void DirectRenderHost::beginFrame() {
    bgfx::setViewRect(0, 0, 0, uint16_t(i_->width), uint16_t(i_->height));
}

void DirectRenderHost::endFrame(uint32_t /*bgfxFrameNumber*/) {
    // Nothing to do — bgfx::frame() already presented to the window.
}

bool DirectRenderHost::shouldQuit() const {
    return i_->quit || ge::shouldQuit();
}

} // namespace ge
