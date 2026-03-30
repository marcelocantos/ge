// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <cstdint>
#include <cstddef>
#include <functional>
#include <memory>

// Forward declare CoreVideo type to avoid importing ObjC headers
typedef struct __CVBuffer* CVPixelBufferRef;

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

    // Encode from raw CPU pixels (copies data into CVPixelBuffer).
    void encode(const uint8_t* bgraPixels, size_t bytesPerRow);

    // Encode from CVPixelBuffer directly — zero-copy when backed by IOSurface.
    void encode(CVPixelBufferRef pixelBuffer);

    void flush();
    void resize(int width, int height);

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace ge
