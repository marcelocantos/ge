// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/sprite.h>

#include <ge/FileIO.h>
#include <ge/Resource.h>

#include <bgfx/bgfx.h>
#include <spdlog/spdlog.h>

#include <cstdint>
#include <cstring>
#include <iterator>
#include <vector>

namespace ge {

namespace {

struct State {
    bgfx::ProgramHandle program     = BGFX_INVALID_HANDLE;
    bgfx::UniformHandle sampler     = BGFX_INVALID_HANDLE;
    bgfx::VertexLayout  layout;
    bool                layoutReady = false;
};

constexpr uint64_t kDefaultBlend =
    BGFX_STATE_WRITE_RGB | BGFX_STATE_WRITE_A |
    BGFX_STATE_BLEND_FUNC(BGFX_STATE_BLEND_ONE, BGFX_STATE_BLEND_INV_SRC_ALPHA);

bgfx::ShaderHandle loadShader(const std::string& path) {
    auto stream = openFile(path, /*binary=*/true);
    if (!stream || !*stream) return BGFX_INVALID_HANDLE;
    std::vector<uint8_t> data((std::istreambuf_iterator<char>(*stream)),
                              std::istreambuf_iterator<char>());
    if (data.empty()) return BGFX_INVALID_HANDLE;
    const bgfx::Memory* mem = bgfx::alloc(static_cast<uint32_t>(data.size() + 1));
    std::memcpy(mem->data, data.data(), data.size());
    mem->data[data.size()] = '\0';
    return bgfx::createShader(mem);
}

State& globalState() {
    static State s;
    return s;
}

bool ensureProgram() {
    auto& s = globalState();
    if (bgfx::isValid(s.program)) return true;

    const std::string shaderDir = renderShaderDir();
    bgfx::ShaderHandle vs = loadShader(resource(shaderDir + "/ge_sprite_vs.bin"));
    bgfx::ShaderHandle fs = loadShader(resource(shaderDir + "/ge_sprite_fs.bin"));
    if (!bgfx::isValid(vs) || !bgfx::isValid(fs)) {
        spdlog::error("ge::sprite: failed to load sprite shaders from {}", shaderDir);
        if (bgfx::isValid(vs)) bgfx::destroy(vs);
        if (bgfx::isValid(fs)) bgfx::destroy(fs);
        return false;
    }
    s.program = bgfx::createProgram(vs, fs, /*destroyShaders=*/true);
    if (!bgfx::isValid(s.sampler)) {
        s.sampler = bgfx::createUniform("s_tex", bgfx::UniformType::Sampler);
    }
    if (!s.layoutReady) {
        s.layout.begin()
            .add(bgfx::Attrib::Position,  3, bgfx::AttribType::Float)
            .add(bgfx::Attrib::TexCoord0, 2, bgfx::AttribType::Float)
            .add(bgfx::Attrib::Color0,    4, bgfx::AttribType::Uint8,
                 /*normalized=*/true)
            .end();
        s.layoutReady = true;
    }
    return true;
}

// Apply an la::float4x4 (column-major) to a 2D point with z=0, w=1.
inline la::float2 applyMatrix(const la::float4x4& m, float x, float y) {
    const auto v = la::mul(m, la::float4{x, y, 0.f, 1.f});
    return {v.x, v.y};
}

} // namespace

// ────────────────────────────────────────────────
// Sprite
// ────────────────────────────────────────────────

void Sprite::draw(bgfx::ViewId view) const {
    if (isNull()) return;
    if (!ensureProgram()) return;
    auto& s = globalState();

    // Unit-square model space, image fills (0..1)² with v=0 at source top.
    constexpr uint32_t kWhite = 0xFFFFFFFFu;
    const SpriteVertex verts[6] = {
        {0.f, 0.f, 0.f, 0.f, 0.f, kWhite},  // tl
        {1.f, 0.f, 0.f, 1.f, 0.f, kWhite},  // tr
        {1.f, 1.f, 0.f, 1.f, 1.f, kWhite},  // br
        {0.f, 0.f, 0.f, 0.f, 0.f, kWhite},  // tl
        {1.f, 1.f, 0.f, 1.f, 1.f, kWhite},  // br
        {0.f, 1.f, 0.f, 0.f, 1.f, kWhite},  // bl
    };

    bgfx::TransientVertexBuffer tvb;
    bgfx::allocTransientVertexBuffer(&tvb, 6, s.layout);
    std::memcpy(tvb.data, verts, sizeof(verts));
    bgfx::setVertexBuffer(0, &tvb);
    bgfx::setTexture(0, s.sampler, tex);
    bgfx::setState(kDefaultBlend);
    bgfx::submit(view, s.program);
}

// ────────────────────────────────────────────────
// SpriteBatch
// ────────────────────────────────────────────────

SpriteBatch::SpriteBatch() : blendState_(kDefaultBlend) {}
SpriteBatch::~SpriteBatch() = default;

void SpriteBatch::clear() {
    quads_.clear();
    blendState_ = kDefaultBlend;
}

void SpriteBatch::setBlendState(uint64_t state) {
    blendState_ = state;
}

bool SpriteBatch::ensureState() {
    return ensureProgram();
}

void SpriteBatch::addSprite(const la::float4x4& m,
                            const Sprite& sprite,
                            uint32_t color) {
    addSprite(m, sprite, Rect{0.f, 0.f, 1.f, 1.f}, color);
}

void SpriteBatch::addSprite(const la::float4x4& m,
                            const Sprite& sprite,
                            Rect uvSubRect,
                            uint32_t color) {
    if (sprite.isNull()) return;

    // Apply m to the four unit-square corners. Vertex positions are
    // baked into the world frame on the CPU; the shader's u_modelViewProj
    // contributes only the view + projection.
    const auto p00 = applyMatrix(m, 0.f, 0.f);
    const auto p10 = applyMatrix(m, 1.f, 0.f);
    const auto p11 = applyMatrix(m, 1.f, 1.f);
    const auto p01 = applyMatrix(m, 0.f, 1.f);

    const float uvL = uvSubRect.x;
    const float uvT = uvSubRect.y;
    const float uvR = uvSubRect.x + uvSubRect.w;
    const float uvB = uvSubRect.y + uvSubRect.h;

    Quad q;
    q.tex = sprite.tex;
    q.verts[0] = {p00.x, p00.y, 0.f, uvL, uvT, color};
    q.verts[1] = {p10.x, p10.y, 0.f, uvR, uvT, color};
    q.verts[2] = {p11.x, p11.y, 0.f, uvR, uvB, color};
    q.verts[3] = {p00.x, p00.y, 0.f, uvL, uvT, color};
    q.verts[4] = {p11.x, p11.y, 0.f, uvR, uvB, color};
    q.verts[5] = {p01.x, p01.y, 0.f, uvL, uvB, color};
    quads_.push_back(q);
}

void SpriteBatch::submit(bgfx::ViewId view) {
    if (quads_.empty()) return;
    if (!ensureProgram()) return;

    auto& s = globalState();

    std::size_t i = 0;
    while (i < quads_.size()) {
        bgfx::TextureHandle curTex = quads_[i].tex;
        std::size_t j = i + 1;
        while (j < quads_.size() && quads_[j].tex.idx == curTex.idx) {
            ++j;
        }
        const std::size_t count = j - i;

        bgfx::TransientVertexBuffer tvb;
        bgfx::allocTransientVertexBuffer(&tvb,
            static_cast<uint32_t>(count * 6), s.layout);
        for (std::size_t k = 0; k < count; ++k) {
            std::memcpy(tvb.data + k * 6 * sizeof(SpriteVertex),
                        quads_[i + k].verts,
                        6 * sizeof(SpriteVertex));
        }

        bgfx::setVertexBuffer(0, &tvb);
        bgfx::setTexture(0, s.sampler, curTex);
        bgfx::setState(blendState_);
        bgfx::submit(view, s.program);

        i = j;
    }

    blendState_ = kDefaultBlend;
}

} // namespace ge
