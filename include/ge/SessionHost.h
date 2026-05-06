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

// Pixel rectangle on the render surface ({x, y} = top-left, {w, h} = size).
struct Rect {
    int x = 0;
    int y = 0;
    int w = 0;
    int h = 0;
};

// Per-edge insets (pixels) of a safe-area-style boundary within the
// render surface. Engine-internal struct — used to populate the rect
// accessors below; apps consume the rects directly.
struct SafeAreaInsets {
    int top    = 0;
    int bottom = 0;
    int left   = 0;
    int right  = 0;
};

// Platform context provided to the game by ge::run() — once at session
// start (passed to the factory) and once per frame (passed to onRender).
// Cheaply copyable (shared_ptr internals); accessors below return live
// values that the engine updates each frame, so apps that capture a
// Context by value still see current state through the same shared M.
//
// Three rect accessors: each game must consciously choose which one
// suits the work it's about to draw or place. There is no `rect()`
// shortcut — the API forces the question rather than picking a default
// that's wrong half the time.
class Context {
public:
    Context(int surfaceWidth, int surfaceHeight, DeviceClass deviceClass,
            const std::string& dbPath,
            const std::string& schemaDdl = {});

    // The largest rectangle on the surface that no device chrome will
    // physically obscure — excludes only display cutouts (camera
    // notch, Dynamic Island, status bar when visible). Use for
    // **visuals**: the maze, the playfield, art that should be
    // entirely seen by the user. Visuals here can extend into gesture
    // zones — a glow that paints under a swipe-up area is fine, since
    // glows don't take input.
    Rect drawSafeRect() const;
    // The largest rectangle in which interactive UI is safe — excludes
    // display cutouts AND OS-reserved gesture / tappable zones (back-
    // swipe, recent-apps, status pull, etc). Use for **buttons,
    // sliders, drag handles**: anything that takes input. Smaller
    // than drawSafeRect on devices with system gestures.
    Rect uiSafeRect() const;
    // The full bgfx backbuffer rectangle — origin (0,0), full surface
    // size. Use when you genuinely want to bleed past every safe area
    // (full-surface backgrounds, decorative imagery that surrounds
    // chrome). On desktop this is identical to the other two rects.
    Rect fullRect() const;

    DeviceClass deviceClass() const;

    // The engine-provided database.
    std::shared_ptr<sqlpipe::Database> db() const;

    // Engine-internal: refresh per-frame state. Apps should not call
    // these — the run loop wires them up before each onUpdate /
    // onRender pair so accessors above always read live values.
    void setDimensions(int surfaceWidth, int surfaceHeight);
    void setDrawSafeInsets(SafeAreaInsets);
    void setUiSafeInsets(SafeAreaInsets);

private:
    struct M;
    std::shared_ptr<M> m;
};

// Render loop callbacks — the game's only interface with the engine.
//
// onRender receives the same Context the factory was given; the engine
// has refreshed its width / height / safeArea before each call so apps
// can pull whatever per-frame state they need without capturing extra
// values themselves. Future per-frame fields (parallax delta, tilt,
// frame index, …) join Context here, not the signature.
struct RunConfig {
    std::function<void(float dt)> onUpdate;
    std::function<void(const Context&)> onRender;
    std::function<void(const SDL_Event&)> onEvent;
    std::function<void()> onShutdown;
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

    // Schema DDL for the engine-provided database.
    // Passed to sqlpipe::Database; sqlift diffs against existing
    // schema and auto-migrates. Leave empty to skip schema setup.
    std::string schemaDdl;

    // Session requirements — sent to the player on attachment, BEFORE
    // DeviceInfo, so the player can apply orientation/sensor hints before
    // creating its window. Game-wide, not per-session.
    uint8_t sensors = 0;      // Bitmask: wire::kSensorAccelerometer
    uint8_t orientation = 0;  // wire::kOrientation* value, 0 = no lock

    // Initial screen-saver policy. Default: false (let the device sleep
    // normally, per OS convention). Set true for games where the primary
    // input is the accelerometer — otherwise the device may sleep
    // mid-play because the screen isn't being touched. Games that need
    // per-state control (e.g. saver enabled in menus, disabled during
    // play) should leave this false and call SDL_DisableScreenSaver /
    // SDL_EnableScreenSaver at the appropriate moments.
    bool disableScreenSaver = false;

    // Take the entire screen — hide system chrome (status bar, gesture
    // / navigation bar) so the game owns the full surface. Reduces
    // safe-area insets to display cutouts only (camera notch, Dynamic
    // Island), exposing the largest meaningful Context::rect() the
    // device can offer.
    //
    // Platform support:
    //   * Android — applied at runtime via WindowInsetsController
    //     (immersive sticky). Brief flicker on launch as bars hide.
    //   * iOS — partial; iPhone landscape already auto-hides the
    //     status bar. iPad Split View / Slide Over additionally
    //     requires `UIRequiresFullScreen` in the app's Info.plist
    //     (read by iOS at launch; cannot be toggled at runtime).
    //   * Desktop — no-op.
    bool immersive = false;
};

// Factory receives platform context and returns render loop callbacks.
using Factory = std::function<RunConfig(Context)>;

// Blocks until SIGINT or all sessions end.
void run(Factory factory, const SessionHostConfig& config = {});

} // namespace ge
