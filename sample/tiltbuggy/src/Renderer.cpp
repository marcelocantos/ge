// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include "Renderer.h"
#include "Scene.h"

#include <ge/FileIO.h>

#include <bgfx/bgfx.h>
#include <bx/math.h>

#include <cmath>
#include <cstdio>
#include <cstring>
#include <iterator>
#include <string>
#include <vector>

namespace tiltbuggy {

namespace {

struct PosColorVertex {
    float x, y;
    uint32_t abgr;
};

bgfx::VertexLayout makeLayout() {
    bgfx::VertexLayout layout;
    layout.begin()
        .add(bgfx::Attrib::Position, 2, bgfx::AttribType::Float)
        .add(bgfx::Attrib::Color0,   4, bgfx::AttribType::Uint8, true)
        .end();
    return layout;
}

// Read a compiled shader .bin file into bgfx memory. Uses ge::openFile so
// the lookup goes through SDL_IOStream, which transparently handles APK
// asset reads on Android, iOS bundle resources, and plain filesystem on
// desktop.
bgfx::ShaderHandle loadShader(const char* shaderDir, const char* name) {
    char path[512];
    std::snprintf(path, sizeof(path), "%s/%s.bin", shaderDir, name);
    auto stream = ge::openFile(path, /*binary=*/true);
    if (!stream || !*stream) return BGFX_INVALID_HANDLE;
    std::vector<uint8_t> data((std::istreambuf_iterator<char>(*stream)),
                              std::istreambuf_iterator<char>());
    if (data.empty()) return BGFX_INVALID_HANDLE;
    const bgfx::Memory* mem = bgfx::alloc(static_cast<uint32_t>(data.size() + 1));
    std::memcpy(mem->data, data.data(), data.size());
    mem->data[data.size()] = '\0';
    return bgfx::createShader(mem);
}

// Append two triangles forming an axis-aligned rect (world space).
void pushRect(std::vector<PosColorVertex>& verts,
              float l, float t, float r, float b,
              uint32_t abgr) {
    verts.push_back({l, t, abgr});
    verts.push_back({r, t, abgr});
    verts.push_back({r, b, abgr});
    verts.push_back({l, t, abgr});
    verts.push_back({r, b, abgr});
    verts.push_back({l, b, abgr});
}

// Append two triangles forming a rotated rect centred at (cx,cy).
void pushRotatedRect(std::vector<PosColorVertex>& verts,
                     float cx, float cy, float hw, float hh,
                     float angle, uint32_t abgr) {
    const float c = std::cos(angle);
    const float s = std::sin(angle);
    // Four corners in local space: (±hw, ±hh)
    float lx[4] = { -hw,  hw,  hw, -hw };
    float ly[4] = { -hh, -hh,  hh,  hh };
    PosColorVertex v[4];
    for (int i = 0; i < 4; ++i) {
        v[i].x   = cx + lx[i] * c - ly[i] * s;
        v[i].y   = cy + lx[i] * s + ly[i] * c;
        v[i].abgr = abgr;
    }
    // Two triangles: 0-1-2, 0-2-3
    verts.push_back(v[0]); verts.push_back(v[1]); verts.push_back(v[2]);
    verts.push_back(v[0]); verts.push_back(v[2]); verts.push_back(v[3]);
}

// Pack 0xRRGGBB into bgfx ABGR (alpha=0xFF).
constexpr uint32_t rgb(uint32_t r, uint32_t g, uint32_t b) {
    return 0xFF000000u | (b << 16) | (g << 8) | r;
}

} // namespace

struct Renderer::Impl {
    bgfx::VertexLayout  layout;
    bgfx::ProgramHandle program = BGFX_INVALID_HANDLE;
};

Renderer::Renderer() : i_(std::make_unique<Impl>()) {}
Renderer::~Renderer() {
    if (bgfx::isValid(i_->program)) bgfx::destroy(i_->program);
}

void Renderer::init(const char* shaderDir) {
    i_->layout = makeLayout();

    bgfx::ShaderHandle vs = loadShader(shaderDir, "simple_vs");
    bgfx::ShaderHandle fs = loadShader(shaderDir, "simple_fs");
    i_->program = bgfx::createProgram(vs, fs, /*destroyShaders=*/true);
}

void Renderer::drawFrame(const Scene& scene, int width, int height,
                         float /*tiltX*/, float /*tiltY*/) {
    // The host's composite pass applies viewport tilt (when synthesised
    // tilt is non-zero). The game just renders a flat top-down view.
    bgfx::setViewRect(0, 0, 0, static_cast<uint16_t>(width),
                                static_cast<uint16_t>(height));
    bgfx::setViewClear(0,
        BGFX_CLEAR_COLOR | BGFX_CLEAR_DEPTH,
        0x222222ff, 1.0f, 0);

    // Orthographic projection: fit [-he,+he] in the shorter axis.
    const float he    = scene.halfExtent();
    const float aspect = static_cast<float>(width) / static_cast<float>(height);
    float orthoW, orthoH;
    if (aspect >= 1.0f) {
        orthoH = he;
        orthoW = he * aspect;
    } else {
        orthoW = he;
        orthoH = he / aspect;
    }

    float proj[16];
    bx::mtxOrtho(proj,
        -orthoW, orthoW,
        -orthoH, orthoH,
        -1.0f, 1.0f, 0.0f,
        bgfx::getCaps()->homogeneousDepth);

    float view[16];
    bx::mtxIdentity(view);
    bgfx::setViewTransform(0, view, proj);

    std::vector<PosColorVertex> verts;
    verts.reserve(6 * (2 + scene.surfaces().size()));

    pushRect(verts, -orthoW, -orthoH, orthoW, orthoH, rgb(0x44, 0x44, 0x44));

    // 2. Surface rects.
    for (const auto& surf : scene.surfaces()) {
        uint32_t color;
        switch (surf.type) {
            case SurfaceType::Ice:     color = rgb(0x88, 0xCC, 0xFF); break;
            case SurfaceType::Dirt:    color = rgb(0xAA, 0x66, 0x44); break;
            case SurfaceType::Asphalt: continue;
            default:                  continue;
        }
        pushRect(verts, surf.l, surf.b, surf.r, surf.t, color);
    }

    // 3. Buggy: 1.0 × 0.5 m, rotated.
    const Pose pose = scene.buggyPose();
    pushRotatedRect(verts,
        pose.x, pose.y,
        /*hw=*/0.5f, /*hh=*/0.25f,
        pose.angle,
        rgb(0xFF, 0xCC, 0x33));

    // --- Submit ---
    const uint32_t numVerts = static_cast<uint32_t>(verts.size());
    bgfx::TransientVertexBuffer tvb;
    bgfx::allocTransientVertexBuffer(&tvb, numVerts, i_->layout);
    std::memcpy(tvb.data, verts.data(), numVerts * sizeof(PosColorVertex));

    float identity[16];
    bx::mtxIdentity(identity);
    bgfx::setTransform(identity);

    bgfx::setVertexBuffer(0, &tvb, 0, numVerts);
    bgfx::setState(BGFX_STATE_WRITE_RGB | BGFX_STATE_WRITE_A);
    bgfx::submit(0, i_->program);
}

} // namespace tiltbuggy
