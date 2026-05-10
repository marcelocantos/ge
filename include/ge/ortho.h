// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Orthographic projection builders for 2D layouts.
//
// `letterbox(content, screen)` builds a projection matrix that maps a
// content rect (0..content.x, 0..content.y) onto clip space such that
// content's aspect ratio is preserved and the dominant-axis fits the
// screen. The opposite axis is *extended* to fill the rest — drawing
// outside (0..content.x, 0..content.y) lands in the letterbox /
// pillarbox bars (useful for backdrop art that bleeds past the
// nominal content rect; consumers that want hard black bars simply
// don't draw outside the nominal rect).
//
// `pixelOrtho(w, h)` is the no-aspect-correction variant: maps
// (0..w, 0..h) directly to clip space, top-left origin, +Y down.
// Suitable for chrome (bars, dialogs) that should be specified in
// physical screen pixels.
//
// `screenToContent(p, content, screen)` is the inverse of
// `letterbox` — converts a screen-space point (e.g. an SDL_Event
// coordinate) back into content-space for hit-testing under a
// letterboxed projection.
//
// All three are constexpr. Top-left origin / +Y down convention
// matches bgfx clip-space when the renderer is HLSL / Metal / Vulkan
// (the default for ge's targets).

#pragma once

#include <ge/Linalg.h>
#include <ge/SessionHost.h>  // ge::Rect

namespace ge::ortho {

namespace detail {

// The content-space rect that maps to the *full* clip-space [-1, 1]²
// under `letterbox(content, screen)`. The visible nominal content
// rect (0..content.x, 0..content.y) sits centered inside this; the
// extension beyond (negative coords or beyond content's width/height)
// is the letterbox / pillarbox region.
constexpr Rect contentVisible(la::float2 content, la::float2 screen) {
    // Cross-multiply to avoid the divisions in aspect ratios.
    if (screen.x * content.y > screen.y * content.x) {
        // Screen is wider than content → pillarbox (extend horizontally).
        const float extra = (screen.x * content.y - screen.y * content.x)
                          / (2.0f * screen.y);
        return Rect{-extra, 0.0f, content.x + 2.0f * extra, content.y};
    }
    // Screen is taller than content → letterbox (extend vertically).
    const float extra = (screen.y * content.x - screen.x * content.y)
                      / (2.0f * screen.x);
    return Rect{0.0f, -extra, content.x, content.y + 2.0f * extra};
}

} // namespace detail

constexpr la::float4x4 letterbox(la::float2 content, la::float2 screen) {
    const Rect v = detail::contentVisible(content, screen);
    const float l = v.x, t = v.y, r = v.x + v.w, b = v.y + v.h;
    return {{ 2.0f / (r - l), 0.0f, 0.0f, 0.0f },
            { 0.0f, 2.0f / (t - b), 0.0f, 0.0f },
            { 0.0f, 0.0f,           1.0f, 0.0f },
            { -(r + l) / (r - l), -(t + b) / (t - b), 0.0f, 1.0f }};
}

constexpr la::float4x4 pixelOrtho(float w, float h) {
    return {{  2.0f / w, 0.0f,     0.0f, 0.0f },
            {  0.0f,    -2.0f / h, 0.0f, 0.0f },
            {  0.0f,     0.0f,     1.0f, 0.0f },
            { -1.0f,     1.0f,     0.0f, 1.0f }};
}

constexpr la::float2 screenToContent(la::float2 screenPt,
                                      la::float2 content,
                                      la::float2 screen) {
    const Rect v = detail::contentVisible(content, screen);
    return {v.x + (screenPt.x / screen.x) * v.w,
            v.y + (screenPt.y / screen.y) * v.h};
}

} // namespace ge::ortho
