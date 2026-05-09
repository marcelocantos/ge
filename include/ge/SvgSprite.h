// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include <bgfx/bgfx.h>

#include <cstdint>
#include <string_view>

namespace ge {

// A bgfx texture paired with the source pixel dimensions it was rasterized
// at. Travelling together lets the draw helpers preserve aspect ratio
// without forcing the caller to encode it in their model matrix.
struct SvgSprite {
    bgfx::TextureHandle tex = BGFX_INVALID_HANDLE;
    int width  = 0;
    int height = 0;

    bool isNull() const { return !bgfx::isValid(tex); }
};

// Rasterize an SVG and pair the resulting bgfx texture with its pixel
// dimensions. `targetW` / `targetH` of -1 use the SVG's intrinsic size.
// Empty sprite (null tex) on failure with a logged error.
//
// Caller owns the returned sprite and must call bgfx::destroy(sprite.tex)
// when done with it.
SvgSprite rasterizeSvgSprite(std::string_view svg, int targetW = -1, int targetH = -1);

// Push a textured-quad submit on `view`. Geometry spans
// (-halfW, -halfH) .. (halfW, halfH) in model space, centred on origin so
// rotation is around the visual centre. UVs map +Y in model space to the
// SVG's TOP edge — i.e. y-up world coords show the SVG the right way up.
//
// Caller's bgfx::setTransform(...) places / rotates / scales the quad.
// Premultiplied-alpha blend state is set automatically.
//
// `tex` must be valid. The textured-quad program is lazy-initialised on
// first call from the engine's existing ge_compose_{vs,fs}.bin shaders.
void drawTexturedQuad(bgfx::ViewId view, bgfx::TextureHandle tex,
                      float halfW = 0.5f, float halfH = 0.5f);

// Draw a sprite at unit-pixel scale: model-space extent is
// (-sprite.width/2, -sprite.height/2) .. (+sprite.width/2, +sprite.height/2).
// Caller's bgfx::setTransform(...) does the pixel→world mapping.
//
// Use this overload when you want to compose with a custom transform —
// rotation, non-axis-aligned placement, etc.
void drawSprite(bgfx::ViewId view, const SvgSprite& sprite);

// Draw a sprite into the axis-aligned world rect (l, t)..(r, b),
// where t/b are the sprite's TOP / BOTTOM edges in y-up world coords
// (i.e. usually `t > b`). The helper builds the pixel→world model
// matrix internally and calls drawSprite(view, sprite).
//
// Use this for static placement when you don't need rotation.
void drawSprite(bgfx::ViewId view, const SvgSprite& sprite,
                float l, float t, float r, float b);

} // namespace ge
