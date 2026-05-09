// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include <ge/FontLoader.h>

#include <bgfx/bgfx.h>

#include <cstdint>
#include <string>
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

// ─────────────────────────────────────────────────────────────────────
// SVG font registration
// ─────────────────────────────────────────────────────────────────────
//
// SVGs that use <text> elements need fonts registered in lunasvg's font
// cache before rasterizeSvg* runs. ge handles this in two layers:
//
// 1. **Lazy default registration.** On the first call into rasterizeSvg /
//    rasterizeSvgToPixels in a process, ge registers system defaults for
//    sans-serif / serif / monospace (regular and bold) by calling
//    ge::resolveFont("system:sans-serif") etc. and feeding the returned
//    paths to lunasvg. This is best-effort — if resolveFont can't find a
//    candidate, the family is just unregistered and SVGs that reference
//    it will fall back to lunasvg's last-resort behaviour.
//
// 2. **App overrides.** Apps that ship their own typography call
//    registerSvgFontFace before (or alongside) the first rasterize. This
//    is the path most polished games take — ship your custom face, point
//    SVG <text font-family="..."> at it, render.
//
// **Apple TTC limitation:** Apple system fonts (Helvetica, SF Pro, etc.)
// ship as `.ttc` collections where each weight is a separate face inside
// one file. lunasvg's public C API drops the TTC face index and always
// loads face 0 (Regular), so requesting bold on an Apple system font
// produces lunasvg's synthetic "faux-bold" rendering rather than the
// designed Bold cut. Custom fonts (separate `.ttf` per weight) and
// non-Apple platforms are unaffected. Treat as dev-time only; ship
// custom fonts for production.

// Register a font face with lunasvg's font cache. `family` is the CSS
// font-family name SVG <text> elements will reference. Returns true on
// success; false if the FontRef path is empty or lunasvg failed to parse
// the font file.
bool registerSvgFontFace(const std::string& family, bool bold, bool italic,
                         const FontRef& ref);

} // namespace ge
