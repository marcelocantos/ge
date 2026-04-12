// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Manages the server lifecycle: bgfx context, ged sideband connection,
// H.264 encode pipeline, and per-session state. The game provides a
// factory that creates session state and returns render loop callbacks.
#pragma once

#include <sqlpipe.h>

#include <SDL3/SDL_events.h>
#include <cstdint>
#include <functional>
#include <memory>
#include <string>

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
    Context(int width, int height, DeviceClass deviceClass,
            const std::string& dbPath);

    int width() const;
    int height() const;
    DeviceClass deviceClass() const;

    // The engine-provided database.
    std::shared_ptr<sqlpipe::Database> db() const;

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

    // Session requirements — sent to the player after setup.
    uint8_t sensors = 0;      // Bitmask: wire::kSensorAccelerometer
    uint8_t orientation = 0;  // SDL_ORIENTATION_* to lock, 0 = no lock
};

// Configuration for the session host.
struct SessionHostConfig {
    // Render dimensions. In headless mode, 0×0 means "wait for the
    // player's DeviceInfo and adopt its dimensions (halved)".
    int width  = 0;
    int height = 0;
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
