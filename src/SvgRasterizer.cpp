// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/SvgRasterizer.h>

#include <ge/FontLoader.h>

#include <bgfx/bgfx.h>
#include <lunasvg.h>
#include <spdlog/spdlog.h>

#include <cstdint>
#include <cstring>
#include <mutex>

namespace ge {

namespace {

// Register one of the platform's logical font URIs (e.g. "system:sans-serif")
// with lunasvg's font cache as the named family. Best-effort — if resolveFont
// returns no candidate, log a warning and move on; the SVG will still rasterize
// minus the missing family.
void registerPlatformFont(const char* family, bool bold, bool italic, const char* uri) {
    auto ref = resolveFont(uri);
    if (ref.path.empty()) {
        spdlog::warn("ge::rasterizeSvg: resolveFont(\"{}\") returned no path; "
                     "SVG <text font-family=\"{}\"> may render unstyled", uri, family);
        return;
    }
    if (!lunasvg_add_font_face_from_file(family, bold, italic, ref.path.c_str())) {
        spdlog::warn("ge::rasterizeSvg: lunasvg rejected font file {} for family {}",
                     ref.path, family);
    }
}

// Lazy-register default sans-serif / serif / monospace via ge::resolveFont
// on first call into the rasterizer. Apps that need other faces (or want to
// override the defaults) should call registerSvgFontFace.
//
// std::call_once gives us thread-safe lazy init in case rasterizeSvgToPixels
// is invoked concurrently — pure CPU code that has no other reason to be
// thread-confined.
void ensureDefaultFonts() {
    static std::once_flag flag;
    std::call_once(flag, []{
        registerPlatformFont("sans-serif", false, false, "system:sans-serif");
        registerPlatformFont("sans-serif", true,  false, "system:sans-serif-bold");
        registerPlatformFont("serif",      false, false, "system:serif");
        registerPlatformFont("serif",      true,  false, "system:serif-bold");
        registerPlatformFont("monospace",  false, false, "system:monospace");
        registerPlatformFont("monospace",  true,  false, "system:monospace-bold");
    });
}

} // namespace

bool registerSvgFontFace(const std::string& family, bool bold, bool italic,
                         const FontRef& ref) {
    if (ref.path.empty()) return false;
    return lunasvg_add_font_face_from_file(family.c_str(), bold, italic, ref.path.c_str());
}

SvgPixels rasterizeSvgToPixels(std::string_view svg, int targetW, int targetH) {
    SvgPixels out;

    ensureDefaultFonts();

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
