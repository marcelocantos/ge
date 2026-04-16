// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
#pragma once

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

    // Clear + draw the scene. Call per frame under bgfx view 0.
    // `tiltX` / `tiltY` are normalised (~[-1, +1]) device tilt; the
    // renderer uses them to apply a perspective camera tilt so the
    // visible viewport leans with the synthesised tilt input. Pass
    // (0, 0) for a flat top-down view.
    void drawFrame(const Scene& scene, int width, int height,
                   float tiltX = 0.f, float tiltY = 0.f);

private:
    struct Impl;
    std::unique_ptr<Impl> i_;
};

} // namespace tiltbuggy
