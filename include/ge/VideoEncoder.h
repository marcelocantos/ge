// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <cstdint>
#include <cstddef>
#include <functional>
#include <memory>

namespace ge {

// H.264 video encoder using VideoToolbox (macOS/iOS).
// Encodes BGRA frames to H.264. Output is complete encoded frames
// (not individual NAL units) — the callback receives the full
// CMSampleBuffer data for each frame.
class VideoEncoder {
public:
    struct Frame {
        const uint8_t* data;
        size_t size;
        bool isKeyframe;
    };
    using FrameCallback = std::function<void(Frame)>;

    VideoEncoder(int width, int height, int fps, FrameCallback onFrame);
    ~VideoEncoder();

    void encode(const uint8_t* bgraPixels, size_t bytesPerRow);
    void flush();
    void resize(int width, int height);

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace ge
