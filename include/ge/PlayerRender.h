// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// PlayerRender — the render half of the player (brokered modality).
//
// Counterpart to DirectRenderHost, but for the player: owns the SDL
// window + SDL_Renderer, uploads decoded video frames to a texture,
// translates local input events into server-space, and applies the
// viewport-tilt composite when Shift-mouse accelerometer synthesis is
// active (symmetric with DirectRenderHost's composite pass).
//
// No bgfx — the player just blits a decoded video texture, optionally
// through a subdivided-mesh perspective pass via SDL_RenderGeometry.
// This keeps mobile player builds small and avoids a bgfx port there.
#pragma once

#include <SDL3/SDL.h>

#include <cstddef>
#include <cstdint>
#include <memory>
#include <vector>

namespace ge {

class PlayerRender {
public:
    struct Config {
        int initialW = 820;
        int initialH = 1180;
        bool borderless = false;   // true on iOS / Android
        uint8_t orientation = 0;   // wire::kOrientation* — 0 = no lock
    };

    explicit PlayerRender(const Config&);
    ~PlayerRender();

    PlayerRender(const PlayerRender&) = delete;
    PlayerRender& operator=(const PlayerRender&) = delete;

    // Open the SDL_Sensor if present (called after receiving SessionConfig
    // with kSensorAccelerometer). If no real sensor is found AND the
    // server asked for one, enable Shift-mouse accelerometer synthesis.
    void enableAccelerometer();

    // Current window/display dimensions and pixel ratio for DeviceInfo.
    // Accounts for requested orientation (portrait/landscape swap).
    void getDeviceDimensions(int& w, int& h, int& pixelRatio) const;

    // Replace the video texture with a newly decoded BGRA frame.
    // (Re)allocates the texture if dimensions change.
    void updateVideoTexture(const uint8_t* bgra, int w, int h, size_t bytesPerRow);

    // Drain SDL events. Returns:
    //   quit           — SDL_EVENT_QUIT received
    //   upstreamEvents — events the caller should forward to the server
    //                    (already coordinate-mapped, Shift-synth expanded)
    struct PumpResult {
        bool quit = false;
        std::vector<SDL_Event> upstreamEvents;
    };
    PumpResult pumpEvents();

    // Render a frame (clears, draws the video texture with optional
    // tilt composite, presents).
    struct RenderStats {
        float drainMs = 0.f;
        float renderMs = 0.f;
    };
    RenderStats render();

    SDL_Window* window() const;

private:
    struct Impl;
    std::unique_ptr<Impl> i_;
};

} // namespace ge
