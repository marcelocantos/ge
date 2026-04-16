// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include "DirectRenderHost.h"
#include "AccelSynth.h"

#include <ge/Protocol.h>
#include <ge/Signal.h>

#include <bgfx/bgfx.h>
#include <bx/math.h>
#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>

#include <cstdio>
#include <cstring>
#include <optional>

namespace ge {

namespace {

// View 0: engine's game rendering.
// View 1: composite pass (textured quad with tilt, targets the swap chain).
constexpr bgfx::ViewId kGameView     = 0;
constexpr bgfx::ViewId kComposeView  = 1;

// Vertex layout for the composite quad.
struct ComposeVertex {
    float x, y, z;
    float u, v;
};

bgfx::VertexLayout composeLayout() {
    bgfx::VertexLayout l;
    l.begin()
        .add(bgfx::Attrib::Position,  3, bgfx::AttribType::Float)
        .add(bgfx::Attrib::TexCoord0, 2, bgfx::AttribType::Float)
        .end();
    return l;
}

bgfx::ShaderHandle loadShader(const char* path) {
    std::FILE* f = std::fopen(path, "rb");
    if (!f) {
        SPDLOG_ERROR("DirectRenderHost: can't open shader {}", path);
        return BGFX_INVALID_HANDLE;
    }
    std::fseek(f, 0, SEEK_END);
    long sz = std::ftell(f);
    std::rewind(f);
    const bgfx::Memory* mem = bgfx::alloc(static_cast<uint32_t>(sz + 1));
    std::fread(mem->data, 1, static_cast<size_t>(sz), f);
    mem->data[sz] = '\0';
    std::fclose(f);
    return bgfx::createShader(mem);
}

} // namespace

struct DirectRenderHost::Impl {
    int width = 0, height = 0;
    std::unique_ptr<BgfxContext> bgfxCtx;
    std::function<void(const SDL_Event&)> eventHandler;
    bool quit = false;

    std::optional<AccelSynth> synth;

    // Offscreen pipeline — lazily created on first non-zero tilt.
    bool offscreenReady = false;
    bgfx::FrameBufferHandle offFB    = BGFX_INVALID_HANDLE;
    bgfx::TextureHandle     colorTex = BGFX_INVALID_HANDLE;
    bgfx::TextureHandle     depthTex = BGFX_INVALID_HANDLE;
    bgfx::ProgramHandle     compose  = BGFX_INVALID_HANDLE;
    bgfx::UniformHandle     sampler  = BGFX_INVALID_HANDLE;
    bgfx::VertexLayout      layout;

    // Per-frame flag: is tilt active on this frame?
    bool tiltActiveThisFrame = false;

    void ensureOffscreen() {
        if (offscreenReady) return;
        layout = composeLayout();
        colorTex = bgfx::createTexture2D(
            width, height, false, 1, bgfx::TextureFormat::BGRA8,
            BGFX_TEXTURE_RT);
        depthTex = bgfx::createTexture2D(
            width, height, false, 1, bgfx::TextureFormat::D24S8,
            BGFX_TEXTURE_RT_WRITE_ONLY);
        bgfx::TextureHandle atts[] = { colorTex, depthTex };
        offFB = bgfx::createFrameBuffer(2, atts, /*destroyTextures=*/false);

        bgfx::ShaderHandle vs = loadShader("build/ge/shaders/ge_compose_vs.bin");
        bgfx::ShaderHandle fs = loadShader("build/ge/shaders/ge_compose_fs.bin");
        if (!bgfx::isValid(vs) || !bgfx::isValid(fs)) {
            SPDLOG_ERROR("DirectRenderHost: compose shaders missing — viewport tilt disabled");
            return;
        }
        compose = bgfx::createProgram(vs, fs, /*destroyShaders=*/true);
        sampler = bgfx::createUniform("s_tex", bgfx::UniformType::Sampler);
        offscreenReady = true;
        SPDLOG_INFO("DirectRenderHost: offscreen pipeline created ({}x{})", width, height);
    }

    void destroyOffscreen() {
        if (bgfx::isValid(sampler))  { bgfx::destroy(sampler);  sampler  = BGFX_INVALID_HANDLE; }
        if (bgfx::isValid(compose))  { bgfx::destroy(compose);  compose  = BGFX_INVALID_HANDLE; }
        if (bgfx::isValid(offFB))    { bgfx::destroy(offFB);    offFB    = BGFX_INVALID_HANDLE; }
        if (bgfx::isValid(colorTex)) { bgfx::destroy(colorTex); colorTex = BGFX_INVALID_HANDLE; }
        if (bgfx::isValid(depthTex)) { bgfx::destroy(depthTex); depthTex = BGFX_INVALID_HANDLE; }
        offscreenReady = false;
    }
};

DirectRenderHost::DirectRenderHost(const SessionHostConfig& config)
    : i_(std::make_unique<Impl>()) {
    i_->width  = config.width  > 0 ? config.width  : 1280;
    i_->height = config.height > 0 ? config.height : 800;

    SDL_SetHint(SDL_HINT_VIDEO_ALLOW_SCREENSAVER,
                config.disableScreenSaver ? "0" : "1");

    i_->bgfxCtx = std::make_unique<BgfxContext>(
        BgfxConfig{i_->width, i_->height, /*headless=*/false, config.appName});

    if ((config.sensors & wire::kSensorAccelerometer) &&
        !AccelSynth::realSensorAvailable()) {
        i_->synth.emplace();
        i_->synth->setWindow(i_->bgfxCtx->window());
        SPDLOG_INFO("DirectRenderHost: ⌥-mouse accelerometer synthesis enabled");
    }

    SPDLOG_INFO("DirectRenderHost: {}x{}", i_->width, i_->height);
}

DirectRenderHost::~DirectRenderHost() {
    i_->destroyOffscreen();
}

int DirectRenderHost::width() const  { return i_->width; }
int DirectRenderHost::height() const { return i_->height; }
DeviceClass DirectRenderHost::deviceClass() const { return DeviceClass::Desktop; }

void DirectRenderHost::send(const wire::SessionConfig&) {
    // Direct mode applies orientation/sensor hints in-process; no-op for now.
}

void DirectRenderHost::setEventHandler(std::function<void(const SDL_Event&)> h) {
    i_->eventHandler = h;
    if (i_->synth) i_->synth->setEmit(h);
}

void DirectRenderHost::pumpEvents() {
    SDL_Event e;
    while (SDL_PollEvent(&e)) {
        if (e.type == SDL_EVENT_QUIT) {
            i_->quit = true;
            continue;
        }
        if (i_->synth && i_->synth->handle(e)) continue;
        if (i_->eventHandler) i_->eventHandler(e);
    }
}

void DirectRenderHost::beginFrame() {
    // Decide for this frame: is tilt non-zero? If so, use the composited
    // path (render game into offscreen FB, compose a tilted quad onto the
    // swap chain). Otherwise, render straight to the swap chain.
    Tilt t{};
    if (i_->synth) {
        i_->synth->update();   // drive ease-back when ⌥ has been released
        t = i_->synth->current();
    }
    i_->tiltActiveThisFrame = (t.x * t.x + t.y * t.y) > 0.5f;  // >~0.7 px
    if (i_->tiltActiveThisFrame) i_->ensureOffscreen();

    if (i_->tiltActiveThisFrame && i_->offscreenReady) {
        bgfx::setViewFrameBuffer(kGameView, i_->offFB);
    } else {
        bgfx::setViewFrameBuffer(kGameView, BGFX_INVALID_HANDLE);
    }
    bgfx::setViewRect(kGameView, 0, 0, uint16_t(i_->width), uint16_t(i_->height));
}

void DirectRenderHost::endFrame(uint32_t /*bgfxFrameNumber*/) {
    if (!(i_->tiltActiveThisFrame && i_->offscreenReady)) return;

    // Composite pass: draw a single textured quad at z=0 in a perspective
    // frustum, tilted by (tilt.x, tilt.y) about the perpendicular axis.
    // The quad's dimensions and camera distance are chosen so zero tilt
    // maps the quad exactly to NDC.
    Tilt t = i_->synth->current();
    float mag = std::sqrt(t.x * t.x + t.y * t.y);
    float angle = mag * kTiltRadPerPixel;

    // Rotation axis in screen plane, perpendicular to displacement.
    float axX =  (mag > 0.f) ? (-t.y / mag) : 0.f;
    float axY =  (mag > 0.f) ? ( t.x / mag) : 0.f;
    float axZ = 0.f;

    // Set up view 1 targeting the swap chain.
    bgfx::setViewFrameBuffer(kComposeView, BGFX_INVALID_HANDLE);
    bgfx::setViewRect(kComposeView, 0, 0, uint16_t(i_->width), uint16_t(i_->height));
    bgfx::setViewClear(kComposeView, BGFX_CLEAR_COLOR | BGFX_CLEAR_DEPTH,
                       0x000000ff, 1.0f, 0);

    // Perspective camera: at distance D from origin, FOV chosen so a
    // 2×2 quad at z=0 exactly fills clip space when untilted.
    // tan(fovY/2) = 1/D  →  fovY = 2·atan(1/D).
    const float D = 2.0f;
    const float aspect = float(i_->width) / float(i_->height);
    const float fovY = 2.f * std::atan(1.f / D) * 180.f / 3.14159265f;
    float proj[16];
    bx::mtxProj(proj, fovY, aspect, 0.01f, D * 4.f,
                bgfx::getCaps()->homogeneousDepth);

    float view[16];
    const bx::Vec3 eye{0.f, 0.f, D};
    const bx::Vec3 at {0.f, 0.f, 0.f};
    const bx::Vec3 up {0.f, 1.f, 0.f};
    bx::mtxLookAt(view, eye, at, up);
    bgfx::setViewTransform(kComposeView, view, proj);

    // Quad dimensions: width = aspect, height = 1 (so it fits the frustum
    // horizontally as well as vertically at zero tilt).
    const float halfW = aspect;
    const float halfH = 1.f;
    ComposeVertex verts[6] = {
        { -halfW, -halfH, 0.f, 1.f, 1.f },
        {  halfW, -halfH, 0.f, 0.f, 1.f },
        {  halfW,  halfH, 0.f, 0.f, 0.f },
        { -halfW, -halfH, 0.f, 1.f, 1.f },
        {  halfW,  halfH, 0.f, 0.f, 0.f },
        { -halfW,  halfH, 0.f, 1.f, 0.f },
    };

    bgfx::TransientVertexBuffer tvb;
    bgfx::allocTransientVertexBuffer(&tvb, 6, i_->layout);
    std::memcpy(tvb.data, verts, sizeof(verts));

    // Model transform: rotation about (axX, axY, 0) by `angle`.
    float model[16];
    bx::Quaternion q = bx::fromAxisAngle(bx::Vec3{axX, axY, axZ}, angle);
    bx::mtxFromQuaternion(model, q);

    // Re-fit the tilted quad to the viewport: compute the projected
    // bounding box of the four corners in NDC, then prepend a 2D
    // scale+translate to the projection so the bbox is centered and
    // maximally sized without clipping.
    auto applyMtx = [](const float* m, float x, float y, float z, float w,
                       float out[4]) {
        out[0] = m[0]*x + m[4]*y + m[ 8]*z + m[12]*w;
        out[1] = m[1]*x + m[5]*y + m[ 9]*z + m[13]*w;
        out[2] = m[2]*x + m[6]*y + m[10]*z + m[14]*w;
        out[3] = m[3]*x + m[7]*y + m[11]*z + m[15]*w;
    };
    float corners[4][2] = {
        {-halfW, -halfH}, { halfW, -halfH},
        { halfW,  halfH}, {-halfW,  halfH},
    };
    float minX = 1e30f, minY = 1e30f, maxX = -1e30f, maxY = -1e30f;
    for (auto& c : corners) {
        float worldP[4], viewP[4], clipP[4];
        applyMtx(model, c[0], c[1], 0.f, 1.f, worldP);
        applyMtx(view,  worldP[0], worldP[1], worldP[2], worldP[3], viewP);
        applyMtx(proj,  viewP[0],  viewP[1],  viewP[2],  viewP[3],  clipP);
        const float invW = 1.f / clipP[3];
        const float ndcX = clipP[0] * invW;
        const float ndcY = clipP[1] * invW;
        if (ndcX < minX) minX = ndcX;
        if (ndcY < minY) minY = ndcY;
        if (ndcX > maxX) maxX = ndcX;
        if (ndcY > maxY) maxY = ndcY;
    }
    const float bboxW = maxX - minX;
    const float bboxH = maxY - minY;
    const float cx    = (minX + maxX) * 0.5f;
    const float cy    = (minY + maxY) * 0.5f;
    const float fitS  = std::min(2.f / bboxW, 2.f / bboxH);
    float fit[16];
    bx::mtxIdentity(fit);
    fit[0]  = fitS;
    fit[5]  = fitS;
    fit[12] = -fitS * cx;
    fit[13] = -fitS * cy;
    float fittedProj[16];
    bx::mtxMul(fittedProj, fit, proj);
    bgfx::setViewTransform(kComposeView, view, fittedProj);

    bgfx::setTransform(model);
    bgfx::setVertexBuffer(0, &tvb, 0, 6);
    bgfx::setTexture(0, i_->sampler, i_->colorTex);
    bgfx::setState(BGFX_STATE_WRITE_RGB | BGFX_STATE_WRITE_A);
    bgfx::submit(kComposeView, i_->compose);
}

bool DirectRenderHost::shouldQuit() const {
    return i_->quit || ge::shouldQuit();
}

} // namespace ge
