#pragma once

#include <cstdint>

namespace sq {

constexpr uint8_t kSqTexMagic[4] = {0x53, 0x51, 0x54, 0x58}; // "SQTX"

// How mip level data is stored in a .sqtex file.
// The loader derives the GPU texture format from the encoding.
enum class SqTexEncoding : uint16_t {
    Astc4x4 = 0, // Raw ASTC 4x4 blocks → GPU format ASTC4x4Unorm
    Png     = 1, // PNG blob per level, decoded to RGBA8 → GPU format RGBA8Unorm
};

// .sqtex file header — immediately followed by uint32_t levelSizes[mipCount],
// then level data contiguously (level 0 first).
struct SqTexHeader {
    uint8_t  magic[4];   // kSqTexMagic
    uint16_t encoding;   // SqTexEncoding
    uint16_t mipCount;
    uint32_t width;      // level 0 dimensions
    uint32_t height;
};
static_assert(sizeof(SqTexHeader) == 16);

} // namespace sq
