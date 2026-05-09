// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include <bgfx/bgfx.h>

#include <cstdint>
#include <string_view>
#include <vector>

namespace ge {

// CPU-side raster output: width * height * 4 bytes of RGBA8 with
// premultiplied alpha. `rgba` is empty on failure (parse error, OOM,
// zero-area target). Errors are logged via spdlog at the point of failure.
struct SvgPixels {
    std::vector<uint8_t> rgba;
    int width  = 0;
    int height = 0;

    bool isNull() const { return rgba.empty(); }
};

// Rasterize an SVG document to RGBA8 premultiplied pixels at the requested
// pixel dimensions. `targetW` / `targetH` of -1 mean "use the SVG's intrinsic
// size". Background is fully transparent.
SvgPixels rasterizeSvgToPixels(std::string_view svg, int targetW = -1, int targetH = -1);

// Rasterize and upload to a bgfx texture in one call. Returns
// `BGFX_INVALID_HANDLE` on failure. The texture is RGBA8 with premultiplied
// alpha and no mips. Caller owns the returned handle and must destroy it.
//
// bgfx must be initialized before calling this (via ge::run or BgfxContext).
bgfx::TextureHandle rasterizeSvg(std::string_view svg, int targetW = -1, int targetH = -1);

} // namespace ge
