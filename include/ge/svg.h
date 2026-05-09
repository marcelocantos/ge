// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include <ge/FontLoader.h>
#include <ge/sprite.h>

#include <lunasvg.h>             // re-exported as part of ge's public surface

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

// Rasterize an SVG document string to RGBA8 premultiplied pixels at the
// requested pixel dimensions. `targetW` / `targetH` of -1 mean "use the
// SVG's intrinsic size". Background is fully transparent.
SvgPixels rasterizeSvgToPixels(std::string_view svg, int targetW = -1, int targetH = -1);

// Rasterize an SVG document string and upload to a bgfx texture, returning
// the result as a `Sprite`. Sprite is null on failure.
//
// `bgfx` must be initialized before calling.
Sprite rasterizeSvg(std::string_view svg, int targetW = -1, int targetH = -1);

// Render an existing `lunasvg::Document` into a Sprite. Use for the
// interactive flow: hold the Document alive, mutate via lunasvg's API
// (`applyStyleSheet`, `getElementById`, `setAttribute`, …), call this
// to re-rasterize whenever the visible state has changed. Caller owns
// the returned Sprite's texture and must destroy it before the next
// re-render to avoid leaks.
Sprite renderSvgDocument(const lunasvg::Document& doc, int targetW, int targetH);

// ─────────────────────────────────────────────────────────────────────
// SVG font registration
// ─────────────────────────────────────────────────────────────────────
//
// SVGs that use `<text>` elements need fonts registered in lunasvg's
// font cache before rasterizeSvg* runs. ge handles this in two layers:
//
// 1. Lazy default registration. On the first rasterize call, ge
//    registers system defaults for sans-serif / serif / monospace
//    (regular and bold) via `ge::resolveFont("system:...")`. Best-
//    effort — if no candidate, that family is silently unregistered.
// 2. App overrides. Call `registerSvgFontFace` before / alongside
//    rasterize to register custom faces.
//
// Apple TTC limitation: Apple system fonts ship as `.ttc` collections
// and lunasvg's public C API drops the face index, so requesting bold
// on an Apple system font produces synthetic "faux-bold" rather than
// the designed Bold cut. Custom fonts (separate `.ttf` per weight) and
// non-Apple platforms are unaffected. Dev-time only; ship custom
// fonts for production typography.
bool registerSvgFontFace(const std::string& family, bool bold, bool italic,
                         const FontRef& ref);

} // namespace ge
