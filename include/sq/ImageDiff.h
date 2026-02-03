#pragma once
// Image difference computation utilities

#include <algorithm>
#include <cmath>
#include <cstdint>

namespace imgdiff {

// Result of image comparison
struct Result {
    float rms;          // Root mean squared difference [0, 1]
    float maxDiff;      // Maximum per-pixel difference [0, 1]
    bool valid;         // True if comparison succeeded
};

// CPU-based image comparison
inline Result compareCPU(const uint8_t* dataA, const uint8_t* dataB,
                         uint32_t width, uint32_t height, uint32_t channels = 4) {
    if (!dataA || !dataB || width == 0 || height == 0) {
        return {0, 0, false};
    }

    double sumSq = 0;
    float maxDiff = 0;
    const uint32_t total = width * height * channels;

    for (uint32_t i = 0; i < total; ++i) {
        float d = (static_cast<float>(dataA[i]) - static_cast<float>(dataB[i])) / 255.0f;
        sumSq += d * d;
        maxDiff = std::max(maxDiff, std::abs(d));
    }

    float rms = static_cast<float>(std::sqrt(sumSq / total));
    return {rms, maxDiff, true};
}

} // namespace imgdiff
