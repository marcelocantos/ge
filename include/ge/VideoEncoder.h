// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <cstdint>
#include <cstddef>
#include <functional>
#include <memory>
#include <vector>

namespace ge {

class VideoEncoder {
public:
    struct NALUnit {
        const uint8_t* data;
        size_t size;
        bool isKeyframe;
    };
    using NALCallback = std::function<void(NALUnit)>;

    VideoEncoder(int width, int height, int fps, NALCallback onNAL);
    ~VideoEncoder();

    void encode(const uint8_t* bgraPixels, size_t bytesPerRow);
    const std::vector<uint8_t>& sps() const;
    const std::vector<uint8_t>& pps() const;
    void flush();
    void resize(int width, int height);

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace ge
