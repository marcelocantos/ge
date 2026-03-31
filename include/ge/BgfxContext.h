// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Owns bgfx init/shutdown and the underlying native surface (SDL window
// or headless Metal layer). Automatically sets the right presentation
// flags (vsync for windowed, none for headless).
#pragma once

#include <memory>

struct SDL_Window;

namespace ge {

struct BgfxConfig {
    int width  = 820;
    int height = 1180;
    bool headless = false;  // true = bare Metal layer (server), false = SDL window
};

class BgfxContext {
public:
    explicit BgfxContext(const BgfxConfig& config);
    ~BgfxContext();

    int width() const;
    int height() const;

    // True when the context should shut down (signal received, or
    // window closed in windowed mode).
    bool shouldQuit() const;

    // SDL window (null if headless).
    SDL_Window* window() const;

    // Native layer/view handle (CAMetalLayer* or SDL metal view).
    // Usable for frame capture, etc.
    void* nativeHandle() const;

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace ge
