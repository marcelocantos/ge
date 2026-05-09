// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/SvgSprite.h>

#include <ge/FileIO.h>
#include <ge/Resource.h>
#include <ge/SvgRasterizer.h>

#include <bgfx/bgfx.h>
#include <bx/math.h>
#include <spdlog/spdlog.h>

#include <cstdint>
#include <cstring>
#include <iterator>
#include <vector>

namespace ge {

namespace {

// Lazy-initialised state for the textured-quad path. Lifetimes follow
// the bgfx context: `program` becomes invalid when bgfx::shutdown() runs,
// and ensureProgram() recreates it on the next call.
struct State {
    bgfx::ProgramHandle program     = BGFX_INVALID_HANDLE;
    bgfx::UniformHandle sampler     = BGFX_INVALID_HANDLE;
    bgfx::VertexLayout  layout;
    bool                layoutReady = false;
};

State& state() {
    static State s;
    return s;
}

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

bool ensureProgram() {
    auto& s = state();
    if (bgfx::isValid(s.program)) return true;

    auto shaderDir = renderShaderDir();
    bgfx::ShaderHandle vs = loadShader(resource(shaderDir + "/ge_compose_vs.bin"));
    bgfx::ShaderHandle fs = loadShader(resource(shaderDir + "/ge_compose_fs.bin"));
    if (!bgfx::isValid(vs) || !bgfx::isValid(fs)) {
        spdlog::error("ge::drawTexturedQuad: failed to load compose shaders from {}", shaderDir);
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
            .end();
        s.layoutReady = true;
    }
    return true;
}

} // namespace

SvgSprite rasterizeSvgSprite(std::string_view svg, int targetW, int targetH) {
    auto pixels = rasterizeSvgToPixels(svg, targetW, targetH);
    if (pixels.isNull()) return SvgSprite{};
    const bgfx::Memory* mem = bgfx::copy(
        pixels.rgba.data(),
        static_cast<uint32_t>(pixels.rgba.size()));
    SvgSprite out;
    out.tex = bgfx::createTexture2D(
        static_cast<uint16_t>(pixels.width),
        static_cast<uint16_t>(pixels.height),
        false, 1,
        bgfx::TextureFormat::RGBA8,
        BGFX_TEXTURE_NONE,
        mem);
    out.width  = pixels.width;
    out.height = pixels.height;
    return out;
}

void drawTexturedQuad(bgfx::ViewId view, bgfx::TextureHandle tex,
                      float halfW, float halfH) {
    if (!bgfx::isValid(tex)) return;
    if (!ensureProgram()) return;
    auto& s = state();

    // UVs: model +Y is sprite TOP. Pixel space has Y growing downward, so
    // v = 0 at the top of the SVG, v = 1 at the bottom.
    struct V { float x, y, z, u, v; };
    const V verts[6] = {
        {-halfW, -halfH, 0.f, 0.f, 1.f},  // bl
        { halfW, -halfH, 0.f, 1.f, 1.f},  // br
        { halfW,  halfH, 0.f, 1.f, 0.f},  // tr
        {-halfW, -halfH, 0.f, 0.f, 1.f},  // bl
        { halfW,  halfH, 0.f, 1.f, 0.f},  // tr
        {-halfW,  halfH, 0.f, 0.f, 0.f},  // tl
    };

    bgfx::TransientVertexBuffer tvb;
    bgfx::allocTransientVertexBuffer(&tvb, 6, s.layout);
    std::memcpy(tvb.data, verts, sizeof(verts));
    bgfx::setVertexBuffer(0, &tvb);
    bgfx::setTexture(0, s.sampler, tex);
    bgfx::setState(BGFX_STATE_WRITE_RGB | BGFX_STATE_WRITE_A
                 | BGFX_STATE_BLEND_FUNC(BGFX_STATE_BLEND_ONE,
                                         BGFX_STATE_BLEND_INV_SRC_ALPHA));
    bgfx::submit(view, s.program);
}

void drawSprite(bgfx::ViewId view, const SvgSprite& sprite) {
    if (sprite.isNull()) return;
    drawTexturedQuad(view, sprite.tex,
                     static_cast<float>(sprite.width)  * 0.5f,
                     static_cast<float>(sprite.height) * 0.5f);
}

void drawSprite(bgfx::ViewId view, const SvgSprite& sprite,
                float l, float t, float r, float b) {
    if (sprite.isNull() || sprite.width <= 0 || sprite.height <= 0) return;

    // Map the unit-pixel quad (centred on origin) to world rect (l,b)..(r,t).
    // Pixel-space scale: (r-l)/width on X, (t-b)/height on Y. Translation: rect centre.
    const float sx = (r - l) / static_cast<float>(sprite.width);
    const float sy = (t - b) / static_cast<float>(sprite.height);
    const float cx = (l + r) * 0.5f;
    const float cy = (t + b) * 0.5f;

    float m[16];
    bx::mtxIdentity(m);
    m[0]  = sx;   // scale x
    m[5]  = sy;   // scale y
    m[12] = cx;   // translate x
    m[13] = cy;   // translate y
    bgfx::setTransform(m);

    drawSprite(view, sprite);
}

} // namespace ge
