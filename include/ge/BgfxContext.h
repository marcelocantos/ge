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

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace ge
