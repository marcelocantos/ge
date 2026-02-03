#pragma once
// GPU-accelerated image difference computation
// Uses mipmap averaging to compute RMS difference between two textures

#include <sq/BgfxResource.h>
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

// Compare two textures on GPU
// Returns RMS difference via mipmap reduction
// Textures must be same dimensions
// Caller must have initialized bgfx
class Comparator {
public:
    // Initialize with shader paths (call once after bgfx::init)
    bool init(const char* vsPath, const char* fsPath);

    // Compare two textures, returns RMS diff in [0, 1]
    // 0 = identical, 1 = maximally different
    Result compare(bgfx::TextureHandle texA, bgfx::TextureHandle texB,
                   uint16_t width, uint16_t height);

    // Compare raw pixel data (uploads to GPU, compares, downloads result)
    Result compare(const uint8_t* dataA, const uint8_t* dataB,
                   uint16_t width, uint16_t height);

private:
    ProgramHandle m_program;
    UniformHandle m_texA;
    UniformHandle m_texB;
    bgfx::VertexLayout m_layout{};
    bool m_initialized = false;
};

// Simple CPU fallback for when GPU isn't available or for small images
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
