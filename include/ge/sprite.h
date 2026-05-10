// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include <ge/Linalg.h>
#include <ge/SessionHost.h>  // ge::Rect

#include <bgfx/bgfx.h>

#include <cstdint>
#include <vector>

namespace ge {

// A bgfx-backed 2D image, paired with the source pixel dimensions it was
// rasterized at. The same shape is returned by every "X to texture"
// factory in ge: rasterizeSvg (svg.h), loadImage (png.h), rasterizeText
// (text.h), renderSvgDocument (svg.h).
//
// Model space is the unit square (0..1)², source image filling it:
//   u = v = 0  →  source top-left
//   u = v = 1  →  source bottom-right
//
// Caller drives placement via `bgfx::setTransform` before calling
// `draw(view)` — typically `bgfx::setTransform(&ge::frame(rect)[0][0])`.
// For non-axis-aligned placement, compose `frame(...)` with linalg
// rotation / scaling matrices.
//
// Caller owns the texture and must call `bgfx::destroy(sprite.tex)` when
// done with it.
struct Sprite {
    bgfx::TextureHandle tex    = BGFX_INVALID_HANDLE;
    int                 width  = 0;
    int                 height = 0;

    bool isNull() const { return !bgfx::isValid(tex); }

    // Push a unit-square quad covering this sprite's image to `view`.
    // Caller has set `bgfx::setTransform` to a model-to-world matrix.
    // Premultiplied-alpha blend state is set automatically.
    void draw(bgfx::ViewId view) const;
};

// Vertex layout for sprite / quad geometry. Consumers that build their
// own transient vertex buffers against this layout should declare:
//
//   bgfx::VertexLayout layout;
//   layout.begin()
//       .add(bgfx::Attrib::Position,  3, bgfx::AttribType::Float)
//       .add(bgfx::Attrib::TexCoord0, 2, bgfx::AttribType::Float)
//       .add(bgfx::Attrib::Color0,    4, bgfx::AttribType::Uint8, /*normalized=*/true)
//       .end();
//
// Matches `ge_sprite_{vs,fs}.bin` (compiled from
// `src/render/shaders/ge_sprite_{vs,fs}.sc`).
struct SpriteVertex {
    float    x, y, z;   // position in whatever space the caller is in
    float    u, v;      // texcoord (normalized 0..1)
    uint32_t abgr;      // tint color (ABGR byte order; 0xFFFFFFFF for none)
};

// Batched sprite renderer. Each `addSprite` queues a quad transformed
// by a per-sprite model-to-world matrix; `submit(view)` flushes runs of
// same-texture sprites in one draw call per (texture, view) pair.
//
// Usage:
//   SpriteBatch batch;
//   batch.addSprite(ge::frame(worldRect), sprite);
//   batch.submit(view);
//   batch.clear();
//
// Premultiplied-alpha blend state by default; override via
// `setBlendState` before `submit`. State resets after each submit.
class SpriteBatch {
public:
    SpriteBatch();
    ~SpriteBatch();

    // Drop all queued sprites without submitting. Call at the start of
    // each frame.
    void clear();

    // Override the blend state for the next `submit` call. Resets to
    // the premultiplied-alpha default after submit.
    void setBlendState(uint64_t state);

    // Queue `sprite` transformed by `modelToWorld`. The unit-square
    // corners (0,0), (1,0), (1,1), (0,1) are mapped through
    // `modelToWorld` on the CPU and emitted as transient vertices.
    // `color` is ABGR (0xAABBGGRR); pass 0xFFFFFFFF for no tint.
    void addSprite(const la::float4x4& modelToWorld,
                   const Sprite& sprite,
                   uint32_t color = 0xFFFFFFFFu);

    // As above, but with a UV sub-rect for atlasing. `uvSubRect` is in
    // normalized UV space (0..1)²; the unit-square model corners then
    // sample from that sub-window of the source texture.
    void addSprite(const la::float4x4& modelToWorld,
                   const Sprite& sprite,
                   Rect uvSubRect,
                   uint32_t color = 0xFFFFFFFFu);

    // Flush all queued sprites to `view` using the sprite shader.
    // No-op when empty. Resets blend state to default after the call.
    void submit(bgfx::ViewId view);

    // Internal quad record — public so test helpers can inspect geometry
    // without bgfx initialization.
    struct Quad {
        bgfx::TextureHandle tex;
        SpriteVertex        verts[6];  // two triangles
    };

private:
    friend struct SpriteBatchTestAccess;

    std::vector<Quad> quads_;
    uint64_t          blendState_;

    // Lazy-initialized bgfx resources (program + sampler + layout).
    bool ensureState();
};

} // namespace ge
