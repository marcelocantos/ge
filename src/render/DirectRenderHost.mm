// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include "DirectRenderHost.h"
#include "AccelSynth.h"

#include <ge/FileIO.h>
#include <ge/Protocol.h>
#include <ge/Resource.h>
#include <ge/Signal.h>

#include "../../tools/player_orientation.h"

#include <iterator>
#include <vector>

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

// Rotate a 3-axis accelerometer sample from the device-hardware frame
// (SDL3's reported convention: +X = physical right edge up, +Y = physical
// top edge up, +Z = screen up) into the game's screen frame.
//
// The rotation is keyed on the LIVE display orientation reported by SDL
// (SDL_GetCurrentDisplayOrientation) — not on SessionConfig.orientation,
// which only records what the app *requested*. The live value reflects
// what the OS actually rotated to (post-lock-if-honoured, or the live
// rotation when no lock was requested), so this stays correct in both
// locked and free-orientation modes and across the brief window between
// a lock request and the OS settling.
//
// Touch and mouse coordinates are NOT rotated — both iOS and Android
// already deliver those in the rotated UI frame. Accelerometer is the
// outlier because the sensor chip is fixed to the chassis and has no
// notion of UI orientation. Z (out of screen) is invariant under any
// in-plane UI rotation, so it passes through.
//
// Each case is a 2D rotation expressed as a swap-and-sign on (x, y):
//
//   Portrait        identity            ( x,  y)
//   Landscape       device rotated CW   (-y,  x)
//   PortraitFlipped device upside down  (-x, -y)
//   LandscapeFlip   device rotated CCW  ( y, -x)
void rotateAccelToScreen(SDL_DisplayOrientation orient, float d[/*≥3*/]) {
    const float x = d[0];
    const float y = d[1];
    switch (orient) {
    case SDL_ORIENTATION_LANDSCAPE:
        d[0] = -y; d[1] =  x; break;
    case SDL_ORIENTATION_LANDSCAPE_FLIPPED:
        d[0] =  y; d[1] = -x; break;
    case SDL_ORIENTATION_PORTRAIT_FLIPPED:
        d[0] = -x; d[1] = -y; break;
    case SDL_ORIENTATION_PORTRAIT:
    case SDL_ORIENTATION_UNKNOWN:
    default:
        break;  // identity — fall back to device frame on unknown
    }
}

bgfx::ShaderHandle loadShader(const char* path) {
    auto stream = ge::openFile(path, /*binary=*/true);
    if (!stream || !*stream) {
        SPDLOG_ERROR("DirectRenderHost: can't open shader {}", path);
        return BGFX_INVALID_HANDLE;
    }
    std::vector<uint8_t> data((std::istreambuf_iterator<char>(*stream)),
                              std::istreambuf_iterator<char>());
    if (data.empty()) {
        SPDLOG_ERROR("DirectRenderHost: empty shader {}", path);
        return BGFX_INVALID_HANDLE;
    }
    const bgfx::Memory* mem = bgfx::alloc(static_cast<uint32_t>(data.size() + 1));
    std::memcpy(mem->data, data.data(), data.size());
    mem->data[data.size()] = '\0';
    return bgfx::createShader(mem);
}

} // namespace

struct DirectRenderHost::Impl {
    int width = 0, height = 0;
    std::unique_ptr<BgfxContext> bgfxCtx;
    std::function<void(const SDL_Event&)> eventHandler;
    bool quit = false;

    std::optional<AccelSynth> synth;
    SDL_Sensor* accelSensor = nullptr;

    // Offscreen pipeline — lazily created on first non-zero tilt.
    bool offscreenReady = false;
    int  offscreenW = 0, offscreenH = 0;
    bgfx::FrameBufferHandle offFB    = BGFX_INVALID_HANDLE;
    bgfx::TextureHandle     colorTex = BGFX_INVALID_HANDLE;
    bgfx::TextureHandle     depthTex = BGFX_INVALID_HANDLE;
    bgfx::ProgramHandle     compose  = BGFX_INVALID_HANDLE;
    bgfx::UniformHandle     sampler  = BGFX_INVALID_HANDLE;
    bgfx::VertexLayout      layout;

    // Per-frame flag: is tilt active on this frame?
    bool tiltActiveThisFrame = false;

    // Resize handling: events fire on the main thread before frame
    // commands are encoded, but bgfx::reset must be paired with all
    // resize-dependent work (destroyOffscreen, setViewRect) at a
    // frame boundary. We stage the new dims here and apply them at
    // the top of beginFrame, then clear the flag.
    bool     pendingResize = false;
    int      pendingW = 0;
    int      pendingH = 0;

    void ensureOffscreen() {
        if (offscreenReady && offscreenW == width && offscreenH == height)
            return;
        // Stale offscreen (size mismatch after a resize that wasn't
        // cleanly torn down): rebuild at current dims.
        if (offscreenReady) destroyOffscreen();
        layout = composeLayout();
        colorTex = bgfx::createTexture2D(
            width, height, false, 1, bgfx::TextureFormat::BGRA8,
            BGFX_TEXTURE_RT);
        depthTex = bgfx::createTexture2D(
            width, height, false, 1, bgfx::TextureFormat::D24S8,
            BGFX_TEXTURE_RT_WRITE_ONLY);
        bgfx::TextureHandle atts[] = { colorTex, depthTex };
        offFB = bgfx::createFrameBuffer(2, atts, /*destroyTextures=*/false);

        bgfx::ShaderHandle vs = loadShader(ge::resource(ge::renderShaderDir() + "/ge_compose_vs.bin").c_str());
        bgfx::ShaderHandle fs = loadShader(ge::resource(ge::renderShaderDir() + "/ge_compose_fs.bin").c_str());
        if (!bgfx::isValid(vs) || !bgfx::isValid(fs)) {
            SPDLOG_ERROR("DirectRenderHost: compose shaders missing — viewport tilt disabled");
            return;
        }
        compose = bgfx::createProgram(vs, fs, /*destroyShaders=*/true);
        sampler = bgfx::createUniform("s_tex", bgfx::UniformType::Sampler);
        offscreenReady = true;
        offscreenW = width;
        offscreenH = height;
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

    // On platforms where the actual surface size differs from the
    // caller's hint (notably Android fullscreen), BgfxContext picks up
    // the true native dimensions — adopt them so our offscreen
    // pipeline and per-frame viewports match.
    if (i_->bgfxCtx->width()  > 0) i_->width  = i_->bgfxCtx->width();
    if (i_->bgfxCtx->height() > 0) i_->height = i_->bgfxCtx->height();

    if (config.sensors & wire::kSensorAccelerometer) {
        // Try a real sensor first (real device, Android emulator virtual sensors).
        int count = 0;
        SDL_SensorID* sensors = SDL_GetSensors(&count);
        if (sensors) {
            for (int k = 0; k < count; k++) {
                if (SDL_GetSensorTypeForID(sensors[k]) == SDL_SENSOR_ACCEL) {
                    i_->accelSensor = SDL_OpenSensor(sensors[k]);
                    if (i_->accelSensor) {
                        SPDLOG_INFO("DirectRenderHost: opened real accelerometer");
                        break;
                    }
                }
            }
            SDL_free(sensors);
        }
        // Fall back to Shift-mouse synthesis.
        if (!i_->accelSensor) {
            i_->synth.emplace();
            i_->synth->setWindow(i_->bgfxCtx->window());
            SPDLOG_INFO("DirectRenderHost: Shift-mouse accelerometer synthesis enabled");
        }
    }

    SPDLOG_INFO("DirectRenderHost: {}x{}", i_->width, i_->height);
}

DirectRenderHost::~DirectRenderHost() {
    if (i_->accelSensor) {
        SDL_CloseSensor(i_->accelSensor);
        i_->accelSensor = nullptr;
    }
    i_->destroyOffscreen();
}

int DirectRenderHost::width() const  { return i_->width; }
int DirectRenderHost::height() const { return i_->height; }
DeviceClass DirectRenderHost::deviceClass() const { return DeviceClass::Desktop; }

void DirectRenderHost::send(const wire::SessionConfig& cfg) {
    // iPadOS 26 ignores Info.plist orientation restrictions on iPad — the
    // only working lock is the prefersInterfaceOrientationLocked swizzle in
    // player_orientation_ios.mm. See ge/CLAUDE.md "iOS orientation lock".
    playerForceOrientation(cfg.orientation);  // 0 = no-op
    // Sensors are opened in the constructor from SessionHostConfig.
    // Sensor-frame rotation is keyed on the LIVE display orientation in
    // pumpEvents — cfg.orientation is just the lock request, not ground
    // truth, and tells us nothing in the no-lock case.
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
        // Any event that could signal a drawable-size change. On iOS the
        // definitive one is SDL_EVENT_WINDOW_METAL_VIEW_RESIZED — the
        // CAMetalLayer's drawableSize is only guaranteed current by then.
        // Stage the new size; apply at frame boundary.
        if (e.type == SDL_EVENT_WINDOW_PIXEL_SIZE_CHANGED ||
            e.type == SDL_EVENT_WINDOW_RESIZED ||
            e.type == SDL_EVENT_WINDOW_METAL_VIEW_RESIZED) {
            int newW = 0, newH = 0;
            SDL_GetWindowSizeInPixels(i_->bgfxCtx->window(), &newW, &newH);
            if (newW > 0 && newH > 0 &&
                (newW != i_->width || newH != i_->height)) {
                i_->pendingResize = true;
                i_->pendingW = newW;
                i_->pendingH = newH;
            }
            continue;
        }
        if (i_->synth && i_->synth->handle(e)) continue;
        // Rotate real-sensor accel into screen frame using the live
        // display orientation. AccelSynth events bypass — they arrive
        // via setEmit() callback, already in screen frame
        // (mouse-displacement physics).
        if (e.type == SDL_EVENT_SENSOR_UPDATE) {
            SDL_DisplayOrientation o = SDL_ORIENTATION_UNKNOWN;
            if (SDL_DisplayID disp = SDL_GetDisplayForWindow(i_->bgfxCtx->window())) {
                o = SDL_GetCurrentDisplayOrientation(disp);
            }
            rotateAccelToScreen(o, e.sensor.data);
        }
        if (i_->eventHandler) i_->eventHandler(e);
    }
}

void DirectRenderHost::beginFrame() {
    // Apply any staged resize at the frame boundary so all bgfx state
    // (backbuffer, offscreen RT, view rects) moves together.
    if (i_->pendingResize) {
        SPDLOG_INFO("DirectRenderHost: resize {}x{} -> {}x{}",
                    i_->width, i_->height, i_->pendingW, i_->pendingH);
        i_->width = i_->pendingW;
        i_->height = i_->pendingH;
        i_->pendingResize = false;
        bgfx::reset(uint32_t(i_->width), uint32_t(i_->height),
                    BGFX_RESET_VSYNC);
        // Offscreen pipeline tied to old size — tear down; it will be
        // recreated below if this frame needs the composited path.
        i_->destroyOffscreen();
    }

    // Decide for this frame: is tilt non-zero? If so, use the composited
    // path (render game into offscreen FB, compose a tilted quad onto the
    // swap chain). Otherwise, render straight to the swap chain.
    Tilt t{};
    if (i_->synth) {
        i_->synth->update();   // drive ease-back when Shift has been released
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

    // Submit the compose pass in the same frame as the game render.
    // bgfx executes views in ID order, so view 0 (game) writes to offFB
    // before view 1 (compose) samples it. Submitting in endFrame instead
    // would queue compose into the *next* frame's buffer — a handle
    // referenced by that pending draw could then be freed during a
    // resize-triggered destroyOffscreen, flashing magenta.
    if (i_->tiltActiveThisFrame && i_->offscreenReady) {
        submitCompose(t.x, t.y);
    }
}

void DirectRenderHost::endFrame(uint32_t /*bgfxFrameNumber*/) {
    // Direct mode has nothing to do post-frame; brokered mode reads
    // the backbuffer here for video encoding.
}

void DirectRenderHost::submitCompose(float tx, float ty) {
    float mag = std::sqrt(tx * tx + ty * ty);
    float angle = mag * kTiltRadPerPixel;

    // Rotation axis in screen plane, perpendicular to displacement.
    float axX =  (mag > 0.f) ? (-ty / mag) : 0.f;
    float axY =  (mag > 0.f) ? ( tx / mag) : 0.f;
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
    // bx::mtxLookAt defaults to left-handed, which flips X in view space
    // (eye at +Z looking at origin → side = up×forward = -X). Sampling u=1
    // at the quad's -X edge compensates so world-space orientation on the
    // render target maps back correctly on the composited quad.
    //
    // Render-target texel origin is top-left on Metal/Vulkan, bottom-left
    // on GLES — bgfx reports this via caps so we flip V only when needed.
    const bool  flipV = bgfx::getCaps()->originBottomLeft;
    const float v0 = flipV ? 1.f : 0.f;  // world +Y (top) → texel v
    const float v1 = flipV ? 0.f : 1.f;  // world -Y (bottom) → texel v
    ComposeVertex verts[6] = {
        { -halfW, -halfH, 0.f, 1.f, v1 },
        {  halfW, -halfH, 0.f, 0.f, v1 },
        {  halfW,  halfH, 0.f, 0.f, v0 },
        { -halfW, -halfH, 0.f, 1.f, v1 },
        {  halfW,  halfH, 0.f, 0.f, v0 },
        { -halfW,  halfH, 0.f, 1.f, v0 },
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
