// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// DirectRenderHost — RenderHost for in-process windowed rendering.
//
// Owns the SDL window, the bgfx swap-chain target, and the local input
// loop (SDL events + ⌥-mouse → synthetic accelerometer). Used by
// distribution / standalone builds; no ged, no wire.
#pragma once

#include <ge/BgfxContext.h>
#include <ge/RenderHost.h>

#include <memory>

namespace ge {

class DirectRenderHost : public RenderHost {
public:
    explicit DirectRenderHost(const SessionHostConfig&);
    ~DirectRenderHost() override;

    DirectRenderHost(const DirectRenderHost&) = delete;
    DirectRenderHost& operator=(const DirectRenderHost&) = delete;

    int width() const override;
    int height() const override;
    DeviceClass deviceClass() const override;
    bool paused() const override;

    void send(const wire::SessionConfig&) override;
    void setEventHandler(std::function<void(const SDL_Event&)>) override;
    void pumpEvents() override;
    void beginFrame() override;
    void endFrame(uint32_t bgfxFrameNumber) override;
    bool shouldQuit() const override;

private:
    void submitCompose(float tx, float ty);

    struct Impl;
    std::unique_ptr<Impl> i_;
};

} // namespace ge
