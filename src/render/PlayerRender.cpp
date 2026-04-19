// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/PlayerRender.h>
#include <ge/Protocol.h>

#include "AccelSynth.h"
#include "../../tools/player_orientation.h"

#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>

#include <algorithm>
#include <cmath>
#include <optional>
#include <vector>

namespace ge {

namespace {

// Subdivision count for the tilt composite mesh (N×N quads).
// 16×16 = 512 triangles. Cheap, and linear-UV interpolation per-triangle
// is visually indistinguishable from perspective-correct mapping at the
// tilt angles we support (< ~60°).
constexpr int kMeshN = 16;

// Camera distance for the composite perspective; matches DirectRenderHost.
// fovY = 2·atan(1/D) → at zero tilt, a quad with halfW=aspect, halfH=1 at
// z=0 exactly fills clip space.
constexpr float kComposeCameraD = 2.0f;

struct Mat3 { float m[9]; };  // row-major 3x3

// Rodrigues' formula specialised for a rotation axis in the XY plane
// (axZ = 0). Returns the 3x3 rotation matrix.
Mat3 rotationXY(float axX, float axY, float angle) {
    const float c = std::cos(angle);
    const float s = std::sin(angle);
    const float C = 1.f - c;
    Mat3 r;
    r.m[0] = c + axX * axX * C;
    r.m[1] = axX * axY * C;
    r.m[2] = axY * s;
    r.m[3] = axX * axY * C;
    r.m[4] = c + axY * axY * C;
    r.m[5] = -axX * s;
    r.m[6] = -axY * s;
    r.m[7] = axX * s;
    r.m[8] = c;
    return r;
}

// Apply tilt rotation + perspective + bounding-box fit to a local-space
// (wx, wy, 0) point. Returns NDC (x, y) after fit. Returns false if the
// point is behind the camera (z_view <= small epsilon).
struct ComposeParams {
    Mat3  rot;
    float aspect;
    // Bounding-box fit applied to NDC: ndc' = ndc * fitS + fitT.
    float fitS = 1.f;
    float fitTx = 0.f;
    float fitTy = 0.f;
};

bool projectVertex(const ComposeParams& p, float wx, float wy,
                   float& ndcX, float& ndcY) {
    // Rotate (wx, wy, 0).
    const float rx = p.rot.m[0]*wx + p.rot.m[1]*wy;
    const float ry = p.rot.m[3]*wx + p.rot.m[4]*wy;
    const float rz = p.rot.m[6]*wx + p.rot.m[7]*wy;
    // View: camera at (0,0,D) looking down -Z, so z_view = D - rz.
    const float zView = kComposeCameraD - rz;
    if (zView < 0.01f) return false;
    // Perspective with fovY = 2·atan(1/D): f = cot(fovY/2) = D.
    const float ndcX0 = (kComposeCameraD / p.aspect) * rx / zView;
    const float ndcY0 = kComposeCameraD * ry / zView;
    ndcX = ndcX0 * p.fitS + p.fitTx;
    ndcY = ndcY0 * p.fitS + p.fitTy;
    return true;
}

} // namespace

struct PlayerRender::Impl {
    SDL_Window* window = nullptr;
    SDL_Renderer* renderer = nullptr;
    SDL_Texture* videoTex = nullptr;
    int texW = 0, texH = 0;
    SDL_PixelFormat texFormat = SDL_PIXELFORMAT_UNKNOWN;

    uint8_t requestedOrientation = 0;

    // Sensor sources. Exactly one or neither is active.
    SDL_Sensor* accelSensor = nullptr;
    std::optional<AccelSynth> synth;

    // Scratch buffers re-used each frame.
    std::vector<SDL_Vertex> meshVerts;
    std::vector<int>        meshIndices;

    // Coordinate-map a window-pixel (sx, sy) to video-texture space.
    // Accounts for aspect-fit scaling and portrait-in-landscape rotation.
    void mapToTexture(float sx, float sy, float& ox, float& oy) const {
        if (!videoTex) { ox = sx; oy = sy; return; }
        int ww, wh;
        SDL_GetWindowSizeInPixels(window, &ww, &wh);
        const bool rotated = (ww > wh) && (texH > texW);

        float visW, visH;
        if (rotated) {
            const float s = std::min(float(ww) / float(texH),
                                     float(wh) / float(texW));
            visW = texW * s;
            visH = texH * s;
        } else {
            const float s = std::min(float(ww) / float(texW),
                                     float(wh) / float(texH));
            visW = texW * s;
            visH = texH * s;
        }
        const float offX = (ww - visW) * 0.5f;
        const float offY = (wh - visH) * 0.5f;
        const float nx = (sx - offX) / visW;
        const float ny = (sy - offY) / visH;
        if (rotated) {
            ox = (1.f - ny) * texW;
            oy = nx * texH;
        } else {
            ox = nx * texW;
            oy = ny * texH;
        }
    }

    // Rewrite event coordinates in-place to server-space.
    void mapEvent(SDL_Event& e) const {
        if (!videoTex) return;
        if (e.type == SDL_EVENT_MOUSE_MOTION) {
            mapToTexture(e.motion.x, e.motion.y, e.motion.x, e.motion.y);
        } else if (e.type == SDL_EVENT_MOUSE_BUTTON_DOWN ||
                   e.type == SDL_EVENT_MOUSE_BUTTON_UP) {
            mapToTexture(e.button.x, e.button.y, e.button.x, e.button.y);
        } else if (e.type == SDL_EVENT_FINGER_DOWN ||
                   e.type == SDL_EVENT_FINGER_UP ||
                   e.type == SDL_EVENT_FINGER_MOTION) {
            int ww, wh;
            SDL_GetWindowSizeInPixels(window, &ww, &wh);
            const float px = e.tfinger.x * ww;
            const float py = e.tfinger.y * wh;
            mapToTexture(px, py, e.tfinger.x, e.tfinger.y);
        }
    }
};

PlayerRender::PlayerRender(const Config& cfg)
    : i_(std::make_unique<Impl>()) {
    i_->requestedOrientation = cfg.orientation;

    Uint32 flags = SDL_WINDOW_RESIZABLE | SDL_WINDOW_HIGH_PIXEL_DENSITY;
    if (cfg.borderless) flags |= SDL_WINDOW_BORDERLESS;

    i_->window = SDL_CreateWindow("GE Player",
                                  cfg.initialW, cfg.initialH, flags);
    if (!i_->window) {
        SPDLOG_ERROR("PlayerRender: SDL_CreateWindow failed: {}", SDL_GetError());
        return;
    }
    playerForceOrientation(i_->requestedOrientation);

    i_->renderer = SDL_CreateRenderer(i_->window, nullptr);
    if (!i_->renderer) {
        SPDLOG_ERROR("PlayerRender: SDL_CreateRenderer failed: {}", SDL_GetError());
    }
}

PlayerRender::~PlayerRender() {
    if (i_->accelSensor) SDL_CloseSensor(i_->accelSensor);
    if (i_->videoTex)    SDL_DestroyTexture(i_->videoTex);
    if (i_->renderer)    SDL_DestroyRenderer(i_->renderer);
    if (i_->window)      SDL_DestroyWindow(i_->window);
}

SDL_Window* PlayerRender::window() const { return i_->window; }

void PlayerRender::enableAccelerometer() {
    // Try a real sensor first.
    int count = 0;
    SDL_SensorID* sensors = SDL_GetSensors(&count);
    if (sensors) {
        for (int k = 0; k < count; k++) {
            if (SDL_GetSensorTypeForID(sensors[k]) == SDL_SENSOR_ACCEL) {
                i_->accelSensor = SDL_OpenSensor(sensors[k]);
                if (i_->accelSensor) {
                    SPDLOG_INFO("PlayerRender: opened real accelerometer");
                    break;
                }
            }
        }
        SDL_free(sensors);
    }
    // Fall back to Shift-mouse synthesis.
    if (!i_->accelSensor) {
        i_->synth.emplace();
        i_->synth->setWindow(i_->window);
        SPDLOG_INFO("PlayerRender: Shift-mouse accelerometer synthesis enabled");
    }
}

void PlayerRender::getDeviceDimensions(int& w, int& h, int& pixelRatio) const {
    const SDL_DisplayMode* dm = SDL_GetCurrentDisplayMode(SDL_GetPrimaryDisplay());
    w  = dm ? dm->w : 1080;
    h  = dm ? dm->h : 2400;
    pixelRatio = (dm && dm->pixel_density > 0) ? int(dm->pixel_density) : 1;

    const bool wantPortrait  = (i_->requestedOrientation == wire::kOrientationPortrait ||
                                i_->requestedOrientation == wire::kOrientationPortraitFlipped);
    const bool wantLandscape = (i_->requestedOrientation == wire::kOrientationLandscape ||
                                i_->requestedOrientation == wire::kOrientationLandscapeFlipped);
    if (wantPortrait  && w > h) std::swap(w, h);
    if (wantLandscape && h > w) std::swap(w, h);
}

void PlayerRender::updateVideoTexture(const VideoFrame& frame) {
    if (!i_->renderer) return;

    SDL_PixelFormat sdlFormat = SDL_PIXELFORMAT_UNKNOWN;
    switch (frame.format) {
    case VideoFrame::Format::BGRA: sdlFormat = SDL_PIXELFORMAT_BGRA32; break;
    case VideoFrame::Format::NV12: sdlFormat = SDL_PIXELFORMAT_NV12;   break;
    case VideoFrame::Format::IYUV: sdlFormat = SDL_PIXELFORMAT_IYUV;   break;
    }
    if (sdlFormat == SDL_PIXELFORMAT_UNKNOWN) return;

    if (!i_->videoTex || i_->texW != frame.width ||
        i_->texH != frame.height || i_->texFormat != sdlFormat) {
        if (i_->videoTex) SDL_DestroyTexture(i_->videoTex);
        i_->videoTex = SDL_CreateTexture(i_->renderer, sdlFormat,
            SDL_TEXTUREACCESS_STREAMING, frame.width, frame.height);
        i_->texW = frame.width;
        i_->texH = frame.height;
        i_->texFormat = sdlFormat;
        SPDLOG_INFO("PlayerRender: video texture created {}x{} format={}",
                    frame.width, frame.height, SDL_GetPixelFormatName(sdlFormat));
    }

    switch (frame.format) {
    case VideoFrame::Format::BGRA:
        SDL_UpdateTexture(i_->videoTex, nullptr, frame.planes[0], frame.strides[0]);
        break;
    case VideoFrame::Format::NV12:
        // Y plane + interleaved UV plane.
        SDL_UpdateNVTexture(i_->videoTex, nullptr,
                            frame.planes[0], frame.strides[0],
                            frame.planes[1], frame.strides[1]);
        break;
    case VideoFrame::Format::IYUV:
        // Separate Y, U, V planes.
        SDL_UpdateYUVTexture(i_->videoTex, nullptr,
                             frame.planes[0], frame.strides[0],
                             frame.planes[1], frame.strides[1],
                             frame.planes[2], frame.strides[2]);
        break;
    }
}

PlayerRender::PumpResult PlayerRender::pumpEvents() {
    PumpResult r;
    // Drive AccelSynth ease-back each frame, and hook its emitted
    // synthetic sensor events into the upstream queue.
    std::vector<SDL_Event> synthBatch;
    if (i_->synth) {
        i_->synth->setEmit([&](const SDL_Event& e) { synthBatch.push_back(e); });
        i_->synth->update();
    }

    SDL_Event e;
    SDL_Event lastMotion{};
    bool hasMotion = false;
    while (SDL_PollEvent(&e)) {
        if (e.type == SDL_EVENT_QUIT) { r.quit = true; continue; }
        if (i_->synth && i_->synth->handle(e)) continue;

        switch (e.type) {
        case SDL_EVENT_MOUSE_MOTION:
        case SDL_EVENT_FINGER_MOTION:
            i_->mapEvent(e);
            lastMotion = e;
            hasMotion = true;
            break;
        case SDL_EVENT_MOUSE_BUTTON_DOWN:
        case SDL_EVENT_MOUSE_BUTTON_UP:
        case SDL_EVENT_MOUSE_WHEEL:
        case SDL_EVENT_FINGER_DOWN:
        case SDL_EVENT_FINGER_UP:
            i_->mapEvent(e);
            r.upstreamEvents.push_back(e);
            break;
        case SDL_EVENT_KEY_DOWN:
        case SDL_EVENT_KEY_UP:
        case SDL_EVENT_SENSOR_UPDATE:
            r.upstreamEvents.push_back(e);
            break;
        }
    }
    if (hasMotion) r.upstreamEvents.push_back(lastMotion);
    // Synth-emitted events come last (post-user-input) and go upstream too.
    for (auto& se : synthBatch) r.upstreamEvents.push_back(se);
    return r;
}

PlayerRender::RenderStats PlayerRender::render() {
    RenderStats s;
    if (!i_->renderer) return s;

    const uint64_t tDrainStart = SDL_GetPerformanceCounter();

    SDL_SetRenderDrawColor(i_->renderer, 0, 0, 0, 255);
    SDL_RenderClear(i_->renderer);

    if (i_->videoTex) {
        int ww, wh;
        SDL_GetWindowSizeInPixels(i_->window, &ww, &wh);
        const bool needsRotation = (ww > wh) && (i_->texH > i_->texW);

        // Compute display rect (aspect-fit).
        float visW, visH;
        if (needsRotation) {
            const float scale = std::min(float(ww) / float(i_->texH),
                                         float(wh) / float(i_->texW));
            visW = i_->texH * scale;  // post-rotation width
            visH = i_->texW * scale;  // post-rotation height
        } else {
            const float scale = std::min(float(ww) / float(i_->texW),
                                         float(wh) / float(i_->texH));
            visW = i_->texW * scale;
            visH = i_->texH * scale;
        }
        const float offX = (ww - visW) * 0.5f;
        const float offY = (wh - visH) * 0.5f;

        // Tilt from AccelSynth (only synth path tilts — real sensor
        // means the device is physically tilted, no need to simulate).
        Tilt t{};
        if (i_->synth) t = i_->synth->current();
        const float mag = std::sqrt(t.x * t.x + t.y * t.y);
        const bool tiltActive = (mag > 0.7f);

        if (!tiltActive) {
            if (needsRotation) {
                // SDL_RenderTextureRotated rotates the texture within its
                // dest rect. For a portrait texture rotated -90° in a
                // landscape window, the dest rect matches the pre-rotation
                // size (texW × texH) scaled to fit the post-rotation bbox.
                const float scale = std::min(float(ww) / float(i_->texH),
                                             float(wh) / float(i_->texW));
                const float dstW = i_->texW * scale;
                const float dstH = i_->texH * scale;
                SDL_FRect dst{ (ww - dstW) * 0.5f, (wh - dstH) * 0.5f,
                               dstW, dstH };
                SDL_RenderTextureRotated(i_->renderer, i_->videoTex,
                                         nullptr, &dst,
                                         -90.0, nullptr, SDL_FLIP_NONE);
            } else {
                SDL_FRect dst{ offX, offY, visW, visH };
                SDL_RenderTexture(i_->renderer, i_->videoTex, nullptr, &dst);
            }
        } else {
            // Viewport-tilt composite via subdivided mesh.
            // World-space quad: halfW = aspect, halfH = 1.
            // Aspect here is the *displayed* aspect (post-rotation if needed).
            const float displayW = needsRotation ? float(i_->texH) : float(i_->texW);
            const float displayH = needsRotation ? float(i_->texW) : float(i_->texH);
            const float aspect   = displayW / displayH;
            const float halfW = aspect;
            const float halfH = 1.f;

            // Rotation axis in screen plane (same convention as DirectRenderHost).
            const float axX = -t.y / mag;
            const float axY =  t.x / mag;
            const float angle = mag * kTiltRadPerPixel;

            ComposeParams cp;
            cp.rot = rotationXY(axX, axY, angle);
            cp.aspect = aspect;

            // Bounding-box fit: project the four corners, compute NDC bbox,
            // fit to [-1,1]×[-1,1].
            float minX = 1e30f, minY = 1e30f, maxX = -1e30f, maxY = -1e30f;
            const float corners[4][2] = {
                {-halfW, -halfH}, { halfW, -halfH},
                { halfW,  halfH}, {-halfW,  halfH},
            };
            for (auto& c : corners) {
                float nx, ny;
                if (!projectVertex(cp, c[0], c[1], nx, ny)) continue;
                minX = std::min(minX, nx); maxX = std::max(maxX, nx);
                minY = std::min(minY, ny); maxY = std::max(maxY, ny);
            }
            const float bboxW = maxX - minX;
            const float bboxH = maxY - minY;
            const float fitS = std::min(2.f / bboxW, 2.f / bboxH);
            cp.fitS = fitS;
            cp.fitTx = -fitS * (minX + maxX) * 0.5f;
            cp.fitTy = -fitS * (minY + maxY) * 0.5f;

            // Build the subdivided mesh. Each vertex:
            //   - screen position (via projectVertex + NDC→pixel)
            //   - texture UV (rotation-aware if portrait video in landscape)
            const int V = (kMeshN + 1) * (kMeshN + 1);
            i_->meshVerts.resize(V);
            i_->meshIndices.resize(kMeshN * kMeshN * 6);

            for (int j = 0; j <= kMeshN; j++) {
                const float fy = float(j) / float(kMeshN);      // 0..1
                const float wy = -halfH + 2.f * halfH * fy;
                for (int k = 0; k <= kMeshN; k++) {
                    const float fx = float(k) / float(kMeshN);  // 0..1
                    const float wx = -halfW + 2.f * halfW * fx;

                    // UV in the video texture.
                    float u, v;
                    if (needsRotation) {
                        // Portrait video rotated 90° CCW to fit landscape
                        // display. Display's +x axis = video's +v axis
                        // (going right in display = going down in video's
                        // pre-rotation frame), display's +y = video's -u.
                        u = 1.f - fy;
                        v = fx;
                    } else {
                        u = fx;
                        v = fy;
                    }

                    // Screen position from projected NDC.
                    float ndcX, ndcY;
                    if (!projectVertex(cp, wx, wy, ndcX, ndcY)) {
                        ndcX = 0; ndcY = 0;
                    }
                    const float sx = (ndcX * 0.5f + 0.5f) * ww;
                    const float sy = (0.5f - ndcY * 0.5f) * wh;

                    SDL_Vertex& vv = i_->meshVerts[j * (kMeshN + 1) + k];
                    vv.position = SDL_FPoint{ sx, sy };
                    vv.color    = SDL_FColor{ 1.f, 1.f, 1.f, 1.f };
                    vv.tex_coord = SDL_FPoint{ u, v };
                }
            }
            int* ix = i_->meshIndices.data();
            for (int j = 0; j < kMeshN; j++) {
                for (int k = 0; k < kMeshN; k++) {
                    const int a = j * (kMeshN + 1) + k;
                    const int b = a + 1;
                    const int c = a + (kMeshN + 1);
                    const int d = c + 1;
                    *ix++ = a; *ix++ = b; *ix++ = d;
                    *ix++ = a; *ix++ = d; *ix++ = c;
                }
            }
            SDL_RenderGeometry(i_->renderer, i_->videoTex,
                               i_->meshVerts.data(), int(i_->meshVerts.size()),
                               i_->meshIndices.data(), int(i_->meshIndices.size()));
        }
    }

    const uint64_t tPresentStart = SDL_GetPerformanceCounter();
    SDL_RenderPresent(i_->renderer);
    const uint64_t tEnd = SDL_GetPerformanceCounter();
    const uint64_t freq = SDL_GetPerformanceFrequency();
    s.drainMs  = float(tPresentStart - tDrainStart) * 1000.f / float(freq);
    s.renderMs = float(tEnd - tPresentStart) * 1000.f / float(freq);
    return s;
}

} // namespace ge
