// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <cstdint>
#include <cstddef>
#include <functional>
#include <memory>

namespace ge {

// AV1 video decoder using VideoToolbox (macOS/iOS, M1+ for hardware decode).
// Receives raw AV1 frame data from the encoder, decodes to BGRA pixels.
class VideoDecoder {
public:
    using FrameCallback = std::function<void(const uint8_t* bgraPixels,
                                              int width, int height,
                                              size_t bytesPerRow)>;

    VideoDecoder(int width, int height, FrameCallback onFrame);
    ~VideoDecoder();

    // Decode a single AV1 frame (raw data from encoder output).
    void decode(const uint8_t* data, size_t size, bool isKeyframe);

    // Flush pending frames.
    void flush();

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace ge
