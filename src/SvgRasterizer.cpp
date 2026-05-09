// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/SvgRasterizer.h>

#include <bgfx/bgfx.h>
#include <lunasvg.h>
#include <spdlog/spdlog.h>

#include <cstdint>
#include <cstring>

namespace ge {

SvgPixels rasterizeSvgToPixels(std::string_view svg, int targetW, int targetH) {
    SvgPixels out;

    auto doc = lunasvg::Document::loadFromData(svg.data(), svg.size());
    if (!doc) {
        spdlog::error("ge::rasterizeSvgToPixels: failed to parse SVG ({} bytes)", svg.size());
        return out;
    }

    auto bm = doc->renderToBitmap(targetW, targetH);
    if (bm.isNull()) {
        spdlog::error("ge::rasterizeSvgToPixels: renderToBitmap returned null ({}x{})", targetW, targetH);
        return out;
    }

    // lunasvg returns ARGB32 premultiplied. On little-endian (the only target
    // ge supports) that's bytes B,G,R,A per pixel in memory. bgfx::TextureFormat::RGBA8
    // expects R,G,B,A. Swap byte 0 and byte 2 in each pixel; keep premultiplication.
    const int w = bm.width();
    const int h = bm.height();
    const int stride = bm.stride();
    out.width  = w;
    out.height = h;
    out.rgba.resize(static_cast<size_t>(w) * static_cast<size_t>(h) * 4);

    const uint8_t* src = bm.data();
    uint8_t*       dst = out.rgba.data();
    for (int y = 0; y < h; ++y) {
        const uint8_t* sRow = src + static_cast<size_t>(y) * stride;
        uint8_t*       dRow = dst + static_cast<size_t>(y) * w * 4;
        for (int x = 0; x < w; ++x) {
            dRow[x * 4 + 0] = sRow[x * 4 + 2];
            dRow[x * 4 + 1] = sRow[x * 4 + 1];
            dRow[x * 4 + 2] = sRow[x * 4 + 0];
            dRow[x * 4 + 3] = sRow[x * 4 + 3];
        }
    }

    return out;
}

bgfx::TextureHandle rasterizeSvg(std::string_view svg, int targetW, int targetH) {
    auto pixels = rasterizeSvgToPixels(svg, targetW, targetH);
    if (pixels.isNull()) {
        return BGFX_INVALID_HANDLE;
    }
    const bgfx::Memory* mem = bgfx::copy(
        pixels.rgba.data(),
        static_cast<uint32_t>(pixels.rgba.size()));
    return bgfx::createTexture2D(
        static_cast<uint16_t>(pixels.width),
        static_cast<uint16_t>(pixels.height),
        false, 1,
        bgfx::TextureFormat::RGBA8,
        BGFX_TEXTURE_NONE,
        mem);
}

} // namespace ge
