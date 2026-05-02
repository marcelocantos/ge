// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Owns bgfx init/shutdown and the underlying native surface.
#pragma once

#include <memory>

struct SDL_Window;

namespace ge {

struct BgfxConfig {
    int width  = 820;
    int height = 1180;
    bool headless = false;
    const char* title = nullptr;  // window title (non-headless only)
};

class BgfxContext {
public:
    explicit BgfxContext(const BgfxConfig& config);
    ~BgfxContext();

    int width() const;
    int height() const;
    bool shouldQuit() const;
    SDL_Window* window() const;

    // Android-only lifecycle: when the activity moves to background the
    // SurfaceView's ANativeWindow becomes invalid; on foreground a NEW
    // one is allocated. Call onBackground() in response to
    // SDL_EVENT_DID_ENTER_BACKGROUND to pause rendering, and onForeground()
    // in response to SDL_EVENT_DID_ENTER_FOREGROUND to re-acquire the new
    // native window and rebuild the swap chain. No-op on Apple platforms,
    // where the CAMetalLayer survives backgrounding.
    void onBackground();
    void onForeground();

    // True between onBackground() and onForeground(); host should skip
    // beginFrame/endFrame work while paused.
    bool paused() const;

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace ge
