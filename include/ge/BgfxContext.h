// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Owns bgfx init/shutdown and the underlying native surface. In
// headless mode, provides frame capture via an offscreen bgfx
// framebuffer + async readback texture.
#pragma once

#include <cstdint>
#include <cstddef>
#include <memory>

struct SDL_Window;

namespace ge {

struct BgfxConfig {
    int width  = 820;
    int height = 1180;
    bool headless = false;
};

class BgfxContext {
public:
    explicit BgfxContext(const BgfxConfig& config);
    ~BgfxContext();

    int width() const;
    int height() const;
    bool shouldQuit() const;
    SDL_Window* window() const;

    bool isCaptureEnabled() const;
    uint16_t captureFrameBuffer() const;
    void submitCaptureBlit();
    bool readCapturedFrame(uint32_t currentFrame, uint8_t* dst, size_t dstSize);

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace ge
