// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Manages the server lifecycle: bgfx context, ged sideband connection,
// H.264 encode pipeline, and per-session state. The game provides a
// factory that creates session state and returns render loop callbacks.
#pragma once

#include <SDL3/SDL_events.h>
#include <cstdint>
#include <functional>
#include <memory>

struct sqlite3;  // Forward declaration — engine provides DB handle

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
    Context(int width, int height, DeviceClass deviceClass, sqlite3* db);

    int width() const;
    int height() const;
    DeviceClass deviceClass() const;

    // Returns the engine-provided database handle and releases ownership.
    // The caller takes ownership (must close via sqlite3_close or wrap in
    // an RAII type like GameDb). Returns nullptr on second call.
    sqlite3* takeDb();

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
    // When both are set and headless=false, engine opens a persistent file.
    // Otherwise engine uses an in-memory database.
    const char* orgName = nullptr;
    const char* appName = nullptr;
};

// Factory receives platform context and returns render loop callbacks.
using Factory = std::function<RunConfig(Context)>;

// Blocks until SIGINT or all sessions end.
void run(Factory factory, const SessionHostConfig& config = {});

} // namespace ge
