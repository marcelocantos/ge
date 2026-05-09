// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Manages the server lifecycle: bgfx context, ged sideband connection,
// H.264 encode pipeline, and per-session state. The game provides a
// factory that creates session state and returns render loop callbacks.
#pragma once

#include <sqlpipe.h>

#include <ge/Linalg.h>
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

// OS memory-pressure level forwarded to RunConfig::onMemoryWarning.
// iOS sends a single warning (mapped to Critical); Android grades into
// five buckets which the engine collapses to three:
//
//   Low      ↔ TRIM_MEMORY_RUNNING_MODERATE
//   Moderate ↔ TRIM_MEMORY_RUNNING_LOW + TRIM_MEMORY_BACKGROUND
//   Critical ↔ TRIM_MEMORY_RUNNING_CRITICAL + TRIM_MEMORY_COMPLETE +
//              UIApplicationDidReceiveMemoryWarningNotification
enum class MemoryPressureLevel : uint8_t {
    Low      = 0,
    Moderate = 1,
    Critical = 2,
};

// Pixel rectangle on the render surface ({x, y} = top-left, {w, h} = size).
//
// Float fields, even though the surface is integer-sized at the
// framebuffer boundary. Game logic — layout math, animation,
// transforms, physics — is float-native, and forcing apps to cast
// every read/write back to their float pipeline costs more than the
// engine pays to convert once at the SDL/bgfx boundary. The integer
// values are preserved exactly (a 1080-pixel surface stores 1080.0f).
//
// Corner accessors return la::float2 (linalg's vec<float,2>,
// re-exported in ge::la — see ge/Linalg.h) so they compose with the
// rest of the engine's vector math without an intermediate copy.
struct SafeAreaInsets;

struct Rect {
    float x = 0;
    float y = 0;
    float w = 0;
    float h = 0;

    // Corner accessors. Surface coords: x grows right, y grows down,
    // so tl is the inclusive origin and br is the exclusive far corner.
    la::float2 tl() const { return {x,     y    }; }
    la::float2 tr() const { return {x + w, y    }; }
    la::float2 bl() const { return {x,     y + h}; }
    la::float2 br() const { return {x + w, y + h}; }

    // Size and centre helpers.
    la::float2 size()   const { return {w, h}; }
    la::float2 center() const { return {x + w * 0.5f, y + h * 0.5f}; }

    // Empty when w or h is non-positive. Empty rects are "no area" —
    // they intersect nothing and are absorbed by `unioned`.
    bool empty() const { return w <= 0 || h <= 0; }

    // Half-open hit-test: includes [x, x+w) × [y, y+h). Matches SDL/bgfx
    // pixel coord convention so adjacent rects tile without overlap.
    bool contains(la::float2 p) const {
        return p.x >= x && p.x < x + w && p.y >= y && p.y < y + h;
    }
    // True when `other` is entirely inside this rect.
    bool contains(const Rect& other) const {
        return !other.empty() && !empty()
            && other.x >= x && other.y >= y
            && other.x + other.w <= x + w
            && other.y + other.h <= y + h;
    }
    // True when this and `other` overlap on a positive-area region.
    // Boundary-touching does not count as overlap.
    bool intersects(const Rect& other) const {
        return !empty() && !other.empty()
            && x < other.x + other.w && other.x < x + w
            && y < other.y + other.h && other.y < y + h;
    }
    // Overlap rect, or an empty rect if there is no overlap.
    Rect intersection(const Rect& other) const;
    // Bounding rect of the two. Treats empty rects as "nothing" — if
    // either is empty the other is returned unchanged.
    Rect unioned(const Rect& other) const;

    // Shrink (or expand, when negative) by dx on left/right and dy on
    // top/bottom. The result may be empty.
    Rect inset(float dx, float dy) const {
        return Rect{x + dx, y + dy, w - 2 * dx, h - 2 * dy};
    }
    // Shrink by per-edge safe-area insets.
    Rect inset(const SafeAreaInsets& s) const;
    // Translated copy.
    Rect translated(la::float2 d) const {
        return Rect{x + d.x, y + d.y, w, h};
    }
};

inline bool operator==(const Rect& a, const Rect& b) {
    return a.x == b.x && a.y == b.y && a.w == b.w && a.h == b.h;
}
inline bool operator!=(const Rect& a, const Rect& b) { return !(a == b); }

// Per-edge insets (pixels) of a safe-area-style boundary within the
// render surface. Engine-internal struct — used to populate the rect
// accessors below; apps consume the rects directly.
struct SafeAreaInsets {
    int top    = 0;
    int bottom = 0;
    int left   = 0;
    int right  = 0;
};

inline Rect Rect::inset(const SafeAreaInsets& s) const {
    return Rect{x + float(s.left), y + float(s.top),
                w - float(s.left + s.right),
                h - float(s.top + s.bottom)};
}

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

    // Pixels per OS-style point. iPhone @3x ≈ 3.0, iPad @2x ≈ 2.0,
    // desktop @1x = 1.0. Use for fixed-physical sizing — touch
    // targets, body text, anything where the constraint is "must be
    // at least N physical mm". A 44pt button is `44 * pixelsPerPt()`
    // pixels wide.
    float pixelsPerPt() const;
    // Reciprocal of pixelsPerPt — for translating raw pixel coords
    // (touch events, bgfx viewport) back into pt for layout math.
    float ptsPerPixel() const;
    // Form-factor multiplier, sublinear in screen size: sqrt of the
    // device's short-side mm relative to a reference phone (65mm,
    // iPhone Pro Max class). 1.0 on the reference phone, ~1.55 on
    // an 11" iPad. Use for chrome icons, headlines, presentation art
    // that should grow on tablets without blowing up linearly.
    //
    // Typical use: `gear_px = 28 * pixelsPerPt() * deviceUiScale()`.
    // Returns 1.0 on desktop (form-factor scaling doesn't apply when
    // the user controls the window size), and 1.0 in wire mode until
    // the player→server pixelRatio plumbing populates it.
    float deviceUiScale() const;

    // Current parallax delta in screen-local radians: x is rotation
    // around the screen-X axis (forward/back tilt), y is rotation
    // around the screen-Y axis (left/right tilt). Already scaled by
    // SessionHostConfig.parallaxFactor and absorbed by the engine's
    // EMA baseline (sustained tilts settle to zero, so the value is
    // always small).
    //
    // Returns {0, 0} when parallaxFactor == 0, on platforms with no
    // attitude sensor (desktop), and during the first ~τ seconds of a
    // session while the baseline is converging.
    //
    // Typical use: `cameraOffset += ctx.parallax() * depth;` for a
    // 2D parallax shift, or feed straight into a small rotation matrix
    // for a 3D scene tilt.
    la::float2 parallax() const;

    // The engine-provided database.
    std::shared_ptr<sqlpipe::Database> db() const;

    // Engine-internal: refresh per-frame state. Apps should not call
    // these — the run loop wires them up before each onUpdate /
    // onRender pair so accessors above always read live values.
    void setDimensions(int surfaceWidth, int surfaceHeight);
    void setDrawSafeInsets(SafeAreaInsets);
    void setUiSafeInsets(SafeAreaInsets);
    void setPixelsPerPt(float);
    void setDeviceUiScale(float);
    void setParallax(la::float2);

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

    // System back-press (Android Back button / predictive-back gesture,
    // 🎯T44). When set, the engine consumes the gesture and runs this
    // callback on the game thread; OS default (Activity.finish) is
    // suppressed. When unset (the default), the OS handles back —
    // typically by moving the app to background. iOS is a no-op in
    // practice because the immersive flag suppresses edge-swipe-back.
    //
    // Use to surface a pause menu, confirm exit, or step back through
    // an in-game stack.
    std::function<void()> onBackPressed;

    // OS memory-pressure warning (🎯T45). Fires on the game thread
    // when the platform reports memory pressure: iOS sends a single
    // warning (always Critical); Android grades into Low / Moderate /
    // Critical (see MemoryPressureLevel). Engine drops its own caches
    // first, so by the time this fires there's no engine-internal
    // slack left — the game's response is layered on top.
    //
    // Recommended action: drop high-cost caches (texture mips, audio
    // decoders, font glyph atlases). On Critical, drop everything not
    // needed for the next few frames; on Low, only drop genuinely
    // cold caches.
    std::function<void(MemoryPressureLevel)> onMemoryWarning;
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

    // Device-tilt parallax. 0 = off (default). > 0 enables Core Motion
    // (iOS) / SensorManager TYPE_GAME_ROTATION_VECTOR (Android) and
    // scales the resulting screen-XY tilt before the engine exposes it
    // via Context::parallax(). The same float controls both opt-in and
    // sensitivity — collapsing what would otherwise be a separate bool
    // + sensitivity float into one knob.
    //
    // The engine maintains an EMA baseline (τ ≈ 1.0s) so sustained
    // tilts become the new neutral; only recent motion produces a
    // non-zero parallax. Apps multiply ctx.parallax() by their own
    // depth/sensitivity to produce camera offsets, layer shifts, or
    // scene rotations.
    //
    // Platform support:
    //   * iOS — CMMotionManager.deviceMotion.attitude (sensor-fused
    //     gyro + accel; drift-free, captures vertical-axis twist).
    //   * Android — Sensor.TYPE_GAME_ROTATION_VECTOR via JNI; same
    //     fused-quaternion semantics, no magnetometer dependency
    //     so indoor magnetic interference doesn't muddy the signal.
    //   * Desktop — no-op (Context::parallax() returns {0, 0}).
    float parallaxFactor = 0.0f;

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
