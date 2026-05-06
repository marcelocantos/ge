// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <ge/SessionHost.h>

#include <memory>

namespace tiltbuggy {

class Scene;  // from Scene.h — written by a parallel agent

class Renderer {
public:
    Renderer();
    ~Renderer();
    Renderer(const Renderer&) = delete;
    Renderer& operator=(const Renderer&) = delete;

    // Called once after bgfx is initialised. `shaderDir` is the directory
    // containing compiled `.bin` files (e.g. "build/shaders").
    void init(const char* shaderDir);

    // Clear + draw the scene. Call per frame under bgfx view 0
    // covering the full surface. The playfield is placed at
    // `c.drawSafeRect()` (display-cutout-safe — visuals here aren't
    // physically obscured) and the renderer is free to draw anywhere
    // on `c.fullRect()` for effects that bleed past it.
    // `tiltX` / `tiltY` are normalised (~[-1, +1]) device tilt; the
    // host's composite pass applies viewport tilt when synthesised
    // tilt is non-zero. Pass (0, 0) for a flat top-down view.
    void drawFrame(const Scene& scene, const ge::Context& c,
                   float tiltX = 0.f, float tiltY = 0.f);

private:
    struct Impl;
    std::unique_ptr<Impl> i_;
};

} // namespace tiltbuggy
