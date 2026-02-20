#pragma once

#include <cstdint>

namespace ge {

constexpr uint8_t kGeTexMagic[4] = {0x47, 0x45, 0x54, 0x58}; // "GETX"

// How mip level data is stored in a .getex file.
// The loader derives the GPU texture format from the encoding.
enum class GeTexEncoding : uint16_t {
    Astc4x4   = 0, // Raw ASTC 4x4 blocks → GPU format ASTC4x4Unorm
    Png       = 1, // PNG blob per level, decoded to RGBA8 → GPU format RGBA8Unorm
    Etc2Rgba8 = 2, // Raw ETC2 EAC RGBA8 blocks → GPU format ETC2RGBA8Unorm
};

// .getex file header — immediately followed by uint32_t levelSizes[mipCount],
// then level data contiguously (level 0 first).
struct GeTexHeader {
    uint8_t  magic[4];   // kGeTexMagic
    uint16_t encoding;   // GeTexEncoding
    uint16_t mipCount;
    uint32_t width;      // level 0 dimensions
    uint32_t height;
};
static_assert(sizeof(GeTexHeader) == 16);

} // namespace ge
