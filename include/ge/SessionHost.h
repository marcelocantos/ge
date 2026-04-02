// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Manages the server lifecycle: bgfx context, ged sideband connection,
// H.264 encode pipeline, and per-session state. The game provides a
// factory that creates session state and returns render loop callbacks.
#pragma once

#include <ge/Db.h>

#include <SDL3/SDL_events.h>
#include <cstdint>
#include <functional>
#include <memory>

namespace ge {

enum class DeviceClass : uint8_t {
    Unknown = 0,
    Phone   = 1,
    Tablet  = 2,
    Desktop = 3,
};

// Platform context provided to the game factory by ge::run().
// Cheaply copyable (shared_ptr internals). Capture by value in lambdas.
class Context {
public:
    Context(int width, int height, DeviceClass deviceClass, sqlite3* dbHandle);

    int width() const;
    int height() const;
    DeviceClass deviceClass() const;

    // The engine-provided database.
    Db db() const;

private:
    struct M;
    std::shared_ptr<M> m;
};

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

    // App identity for persistent DB path (via SDL_GetPrefPath).
    // Bundled (non-headless) mode opens a persistent file; headless
    // (server) mode always uses :memory: — persistence is owned by
    // the player and synced via sqlpipe.
    const char* orgName = nullptr;
    const char* appName = nullptr;
};

// Factory receives platform context and returns render loop callbacks.
using Factory = std::function<RunConfig(Context)>;

// Blocks until SIGINT or all sessions end.
void run(Factory factory, const SessionHostConfig& config = {});

} // namespace ge
