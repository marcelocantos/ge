// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Manages the server lifecycle: bgfx context, ged sideband connection,
// H.264 encode pipeline, and per-session state. The game provides a
// factory that creates session state and returns render loop callbacks.
#pragma once

#include <SDL3/SDL_events.h>
#include <functional>

namespace ge {

// Render loop callbacks — the game's only interface with the engine.
struct RunConfig {
    std::function<void(float dt)> onUpdate;
    std::function<void(int w, int h)> onRender;
    std::function<void(const SDL_Event&)> onEvent;
    std::function<void()> onShutdown;
};

// Configuration for the session host.
struct SessionHostConfig {
    int width  = 820;
    int height = 1180;
    bool headless = true;  // true = H.264 server, false = native window
};

// Factory called per player session. Returns RunConfig for the render loop.
// The factory should create all per-session state (game DB, application, etc.).
using Factory = std::function<RunConfig()>;

// Blocks until SIGINT or all sessions end.
void run(Factory factory, const SessionHostConfig& config = {});

} // namespace ge
