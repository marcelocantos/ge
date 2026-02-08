#pragma once

#include <cstdint>

namespace sq {

// Write texture to file. Format determined by extension:
//   .astc.sqtex → mipmapped ASTC 4x4 container
//   .png.sqtex  → mipmapped PNG container
//   .astc       → single-level ASTC 4x4
//   .png        → single-level PNG
// Input: RGBA8 pixel data (always 4 channels).
void textureToFile(const char* path, const uint8_t* pixels, int width, int height);

} // namespace sq
