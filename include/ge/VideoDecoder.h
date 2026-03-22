// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <cstdint>
#include <cstddef>
#include <functional>
#include <memory>

namespace ge {

class VideoDecoder {
public:
    using FrameCallback = std::function<void(const uint8_t* bgraPixels, int width, int height, size_t bytesPerRow)>;

    explicit VideoDecoder(FrameCallback onFrame);
    ~VideoDecoder();

    // Set SPS and PPS parameter sets (must be called before first decode).
    // Creates the decompression session from the provided parameters.
    void setParameterSets(const uint8_t* sps, size_t spsSize,
                          const uint8_t* pps, size_t ppsSize);

    // Decode a single NAL unit (Annex B format with 0x00000001 start code).
    void decode(const uint8_t* nalData, size_t nalSize);

    // Flush pending frames.
    void flush();

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace ge
