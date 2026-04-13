// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

// H.264 video player — receives encoded frames from ged, decodes via
// VideoToolbox, and renders to an SDL3 window.

#include "player_core.h"
#include "player_orientation.h"

#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>

#include <ge/Protocol.h>
#include <ge/Signal.h>
#include <ge/VideoDecoder.h>
#include <ge/WebSocketClient.h>

#include <cstring>
#include <mutex>
#include <string>
#include <vector>

// Parse AVCC-format NAL units from encoded frame data.
// AVCC format: [4-byte big-endian length][NAL body] repeated.
// For keyframes the encoder prepends SPS and PPS NAL units.
// NAL type is (first byte of NAL body) & 0x1F:
//   7 = SPS, 8 = PPS, 5 = IDR (keyframe), 1 = non-IDR (P-frame)
struct AVCCParser {
    std::vector<uint8_t> sps, pps;
    bool paramsDirty = false;

    // Parse all NAL units from an AVCC stream. Returns frame NALs
    // (non-parameter-set NALs) as (pointer, size) pairs into the
    // original data.
    std::vector<std::pair<const uint8_t*, size_t>>
    parse(const uint8_t* data, size_t size) {
        std::vector<std::pair<const uint8_t*, size_t>> frameNals;
        size_t offset = 0;
        while (offset + 4 <= size) {
            uint32_t nalLen = (uint32_t(data[offset]) << 24)
                            | (uint32_t(data[offset+1]) << 16)
                            | (uint32_t(data[offset+2]) << 8)
                            | uint32_t(data[offset+3]);
            offset += 4;
            if (nalLen == 0 || offset + nalLen > size) break;

            const uint8_t* nalBody = data + offset;
            uint8_t nalType = nalBody[0] & 0x1F;

            if (nalType == 7) { // SPS
                if (sps.size() != nalLen || std::memcmp(sps.data(), nalBody, nalLen) != 0) {
                    sps.assign(nalBody, nalBody + nalLen);
                    paramsDirty = true;
                }
            } else if (nalType == 8) { // PPS
                if (pps.size() != nalLen || std::memcmp(pps.data(), nalBody, nalLen) != 0) {
                    pps.assign(nalBody, nalBody + nalLen);
                    paramsDirty = true;
                }
            } else {
                frameNals.emplace_back(nalBody, nalLen);
            }
            offset += nalLen;
        }
        return frameNals;
    }

    bool hasParams() const { return !sps.empty() && !pps.empty(); }
};

int playerCore(const std::string& host, int port) {
    ge::installSignalHandlers();

    SPDLOG_INFO("H.264 player starting");

    // No synthetic events — each input source sends its native event type only.
    // Desktop: mouse events. iOS/Android: finger events. iPad with trackpad: both (real).
    SDL_SetHint(SDL_HINT_TOUCH_MOUSE_EVENTS, "0");
    SDL_SetHint(SDL_HINT_MOUSE_TOUCH_EVENTS, "0");

    if (!SDL_Init(SDL_INIT_VIDEO | SDL_INIT_SENSOR)) {
        SPDLOG_ERROR("SDL_Init failed: {}", SDL_GetError());
        return 1;
    }

    // ── Connect to ged BEFORE creating the window ──────────────────────
    // This lets us receive SessionConfig (orientation lock, sensor needs)
    // and apply hints before SDL_CreateWindow, where Android reads them.

    std::string path = "/ws/wire?name=yourworld";
    auto conn = ge::connectWebSocket(host, port, path, 2000);
    if (!conn || !conn->isOpen()) {
        SPDLOG_ERROR("Failed to connect to ged");
        SDL_Quit();
        return 1;
    }
    SPDLOG_INFO("Connected to ged");

    // Wait for SessionConfig — the server's signal that it's ready.
    // DeviceInfo is sent AFTER SessionConfig so the player can apply
    // orientation hints and report the correct dimensions.
    SDL_Sensor* accelSensor = nullptr;
    uint8_t requestedOrientation = 0;
    while (conn->isOpen()) {
        std::vector<char> msg;
        if (!conn->recvBinary(msg) || msg.size() < 8) {
            break;
        }
        uint32_t magic = 0;
        std::memcpy(&magic, msg.data(), 4);

        if (magic == wire::kSessionConfigMagic &&
            msg.size() >= sizeof(wire::MessageHeader) + sizeof(wire::SessionConfig)) {
            wire::SessionConfig cfg;
            std::memcpy(&cfg, msg.data() + sizeof(wire::MessageHeader), sizeof(cfg));

            if (cfg.sensors & wire::kSensorAccelerometer) {
                int count = 0;
                SDL_SensorID* sensors = SDL_GetSensors(&count);
                if (sensors) {
                    for (int i = 0; i < count; i++) {
                        if (SDL_GetSensorTypeForID(sensors[i]) == SDL_SENSOR_ACCEL) {
                            accelSensor = SDL_OpenSensor(sensors[i]);
                            if (accelSensor) SPDLOG_INFO("Opened accelerometer (server requested)");
                            break;
                        }
                    }
                    SDL_free(sensors);
                }
            }
            if (cfg.orientation != 0) {
                requestedOrientation = cfg.orientation;
                const char* hint = nullptr;
                switch (cfg.orientation) {
                case wire::kOrientationLandscape:        hint = "LandscapeLeft"; break;
                case wire::kOrientationLandscapeFlipped: hint = "LandscapeRight"; break;
                case wire::kOrientationPortrait:         hint = "Portrait"; break;
                case wire::kOrientationPortraitFlipped:  hint = "PortraitUpsideDown"; break;
                }
                if (hint) {
                    SDL_SetHint(SDL_HINT_ORIENTATIONS, hint);
                }
            }
            break;
        }
        // ged housekeeping (ServerAssigned, etc.) — skip and keep waiting.
        continue;
    }

    // ── Send DeviceInfo (after SessionConfig, so dimensions are correct) ─

    {
        const SDL_DisplayMode* dm = SDL_GetCurrentDisplayMode(SDL_GetPrimaryDisplay());
        int w = dm ? dm->w : 1080;
        int h = dm ? dm->h : 2400;
        int pr = (dm && dm->pixel_density > 0) ? int(dm->pixel_density) : 1;

        // Normalize to requested orientation.
        bool wantPortrait = (requestedOrientation == SDL_ORIENTATION_PORTRAIT ||
                             requestedOrientation == SDL_ORIENTATION_PORTRAIT_FLIPPED);
        bool wantLandscape = (requestedOrientation == SDL_ORIENTATION_LANDSCAPE ||
                              requestedOrientation == SDL_ORIENTATION_LANDSCAPE_FLIPPED);
        if (wantPortrait && w > h) std::swap(w, h);
        if (wantLandscape && h > w) std::swap(w, h);

        wire::MessageHeader hdr{};
        hdr.magic = wire::kDeviceInfoMagic;
        hdr.length = sizeof(wire::DeviceInfo);
        wire::DeviceInfo devInfo{};
        devInfo.width = w;
        devInfo.height = h;
        devInfo.pixelRatio = pr;
        devInfo.deviceClass = 3;
        std::vector<uint8_t> msg(sizeof(hdr) + sizeof(devInfo));
        std::memcpy(msg.data(), &hdr, sizeof(hdr));
        std::memcpy(msg.data() + sizeof(hdr), &devInfo, sizeof(devInfo));
        conn->sendBinary(msg.data(), msg.size());
    }

    // ── Create window (orientation hint already applied) ───────────────

    SDL_Window* window = SDL_CreateWindow(
        "GE Player", 820, 1180,
        SDL_WINDOW_RESIZABLE | SDL_WINDOW_HIGH_PIXEL_DENSITY
#ifndef GE_DESKTOP
        | SDL_WINDOW_BORDERLESS
#endif
        );
    if (!window) {
        SPDLOG_ERROR("SDL_CreateWindow failed: {}", SDL_GetError());
        SDL_Quit();
        return 1;
    }

    // On iPad (iPadOS 16+), supportedInterfaceOrientations alone doesn't
    // prevent rotation — the window scene's geometry preferences must also
    // be set via requestGeometryUpdateWithPreferences. This is a no-op on
    // non-iOS platforms.
    playerForceOrientation(requestedOrientation);

    SDL_Renderer* renderer = SDL_CreateRenderer(window, nullptr);
    if (!renderer) {
        SPDLOG_ERROR("SDL_CreateRenderer failed: {}", SDL_GetError());
        return 1;
    }

    // Texture for decoded video frames (created on first decoded frame)
    SDL_Texture* videoTex = nullptr;
    int texW = 0, texH = 0;

    // Decoded frame buffer (written by decoder callback, read by render loop)
    std::mutex frameMutex;
    std::vector<uint8_t> decodedFrame;
    int frameW = 0, frameH = 0;
    size_t frameBytesPerRow = 0;
    bool frameReady = false;

    ge::VideoDecoder decoder([&](const uint8_t* bgra, int w, int h, size_t bpr) {
        std::lock_guard<std::mutex> lock(frameMutex);
        size_t totalBytes = bpr * h;
        decodedFrame.resize(totalBytes);
        std::memcpy(decodedFrame.data(), bgra, totalBytes);
        frameW = w;
        frameH = h;
        frameBytesPerRow = bpr;
        frameReady = true;
    });

    AVCCParser avccParser;

    // Helper to send an SDL event to the server via ged
    auto sendEvent = [&](const SDL_Event& e) {
        if (!conn || !conn->isOpen()) {
            static int n = 0;
            if (n++ < 3) SPDLOG_INFO("sendEvent: conn closed, dropping event 0x{:x}", e.type);
            return;
        }
        wire::MessageHeader evtHdr{};
        evtHdr.magic = wire::kSdlEventMagic;
        evtHdr.length = sizeof(SDL_Event);
        std::vector<uint8_t> msg(sizeof(evtHdr) + sizeof(SDL_Event));
        std::memcpy(msg.data(), &evtHdr, sizeof(evtHdr));
        std::memcpy(msg.data() + sizeof(evtHdr), &e, sizeof(SDL_Event));
        conn->sendBinary(msg.data(), msg.size());
        static int sent = 0;
        if (sent++ < 3) SPDLOG_INFO("sendEvent: sent 0x{:x} ({} bytes)", e.type, msg.size());
    };

    // Coordinate mapping: player window → server render space.
    // When the window is landscape but the server renders portrait,
    // we rotate coordinates: landscape (x,y) → portrait (y, W-x)
    // where W is the visible width of the rotated video.
    auto mapEvent = [&](SDL_Event& e) {
        if (!videoTex) return;
        int ww, wh;
        SDL_GetWindowSizeInPixels(window, &ww, &wh);
        bool rotated = (ww > wh) && (texH > texW);

        // Compute the visible rect of the video on screen.
        float visW, visH;
        if (rotated) {
            // Rotated: portrait video displayed in landscape window.
            // Visual (post-rotation) size is texH x texW.
            float scaleX = float(ww) / float(texH);
            float scaleY = float(wh) / float(texW);
            float scale = std::min(scaleX, scaleY);
            // visW/visH are the on-screen dimensions of the dest rect
            // (pre-rotation, as SDL sees it).
            visW = texW * scale;
            visH = texH * scale;
        } else {
            float scaleX = float(ww) / float(texW);
            float scaleY = float(wh) / float(texH);
            float scale = std::min(scaleX, scaleY);
            visW = texW * scale;
            visH = texH * scale;
        }
        float offsetX = (ww - visW) / 2.0f;
        float offsetY = (wh - visH) / 2.0f;

        // Helper: map screen pixel coord to server coord.
        auto mapCoord = [&](float sx, float sy, float& ox, float& oy) {
            // Screen → normalized video space (0..1)
            float nx = (sx - offsetX) / visW;
            float ny = (sy - offsetY) / visH;
            if (rotated) {
                // 90° CCW rotation: landscape (nx,ny) → portrait
                ox = (1.0f - ny) * texW;
                oy = nx * texH;
            } else {
                ox = nx * texW;
                oy = ny * texH;
            }
        };

        if (e.type == SDL_EVENT_MOUSE_MOTION) {
            mapCoord(e.motion.x, e.motion.y, e.motion.x, e.motion.y);
        } else if (e.type == SDL_EVENT_MOUSE_BUTTON_DOWN ||
                   e.type == SDL_EVENT_MOUSE_BUTTON_UP) {
            mapCoord(e.button.x, e.button.y, e.button.x, e.button.y);
        } else if (e.type == SDL_EVENT_FINGER_DOWN ||
                   e.type == SDL_EVENT_FINGER_UP ||
                   e.type == SDL_EVENT_FINGER_MOTION) {
            float px = e.tfinger.x * ww;
            float py = e.tfinger.y * wh;
            mapCoord(px, py, e.tfinger.x, e.tfinger.y);
        }
    };

    uint64_t frameCount = 0;
    bool running = true;

    while (running && !ge::shouldQuit()) {
        // Process SDL events — forward input to server.
        // Coalesce mouse/finger motion to avoid flooding the connection.
        SDL_Event e;
        SDL_Event lastMotion{};
        bool hasMotion = false;
        while (SDL_PollEvent(&e)) {
            if (e.type == SDL_EVENT_QUIT || ge::shouldQuit()) {
                running = false;
                continue;
            }
            // Debug: log touch/mouse events (unlimited)
            if (e.type >= 0x400 && e.type <= 0x900) {
                static int logCount = 0;
                if (logCount++ < 20) {
                    SPDLOG_INFO("Input event type=0x{:x}", e.type);
                }
            }

            switch (e.type) {
            case SDL_EVENT_MOUSE_MOTION:
            case SDL_EVENT_FINGER_MOTION:
                mapEvent(e);
                lastMotion = e;
                hasMotion = true;
                break;
            case SDL_EVENT_MOUSE_BUTTON_DOWN:
            case SDL_EVENT_MOUSE_BUTTON_UP:
            case SDL_EVENT_MOUSE_WHEEL:
            case SDL_EVENT_FINGER_DOWN:
            case SDL_EVENT_FINGER_UP:
                mapEvent(e);
                sendEvent(e);
                break;
            case SDL_EVENT_KEY_DOWN:
            case SDL_EVENT_KEY_UP:
                // Synthesize accelerometer from ⌥WASD when no real sensor.
                // WASD maps to physical device directions (how the user
                // holds it). The sensor axes are device-fixed (portrait):
                //   data[0] = X (positive = device tilts right)
                //   data[1] = Y (positive = device tilts toward user)
                // When the window is landscape, the physical device axes
                // are rotated relative to the keyboard.
                if (!accelSensor && (e.key.mod & SDL_KMOD_ALT)) {
                    constexpr float kG = 9.81f;
                    constexpr float kTilt = 0.25f * kG;
                    // Physical directions: W=away, S=toward, A=left, D=right
                    // relative to how the user holds the device.
                    float pw = 0, pa = 0;  // physical W/S and A/D axes
                    bool isTilt = true;
                    if (e.type == SDL_EVENT_KEY_DOWN) {
                        switch (e.key.scancode) {
                        case SDL_SCANCODE_W: pw = -1; break;  // away
                        case SDL_SCANCODE_S: pw =  1; break;  // toward
                        case SDL_SCANCODE_A: pa = -1; break;  // left
                        case SDL_SCANCODE_D: pa =  1; break;  // right
                        default: isTilt = false;
                        }
                    } else {
                        switch (e.key.scancode) {
                        case SDL_SCANCODE_W: case SDL_SCANCODE_S:
                        case SDL_SCANCODE_A: case SDL_SCANCODE_D:
                            break;
                        default: isTilt = false;
                        }
                    }
                    if (isTilt) {
                        // Portrait sensor values.
                        float ax = -pa * kTilt;
                        float ay =  pw * kTilt;

                        // Apply rotation matrix based on device orientation.
                        // Each orientation is a multiple of 90°, so the
                        // matrix is just 0, 1, -1 entries.
                        //
                        //   Portrait:         [ 1  0]   (identity)
                        //                     [ 0  1]
                        //   Landscape (CW):   [ 0  1]   (90° CW)
                        //                     [-1  0]
                        //   Upside-down:      [-1  0]   (180°)
                        //                     [ 0 -1]
                        //   Landscape (CCW):  [ 0 -1]   (270° CW)
                        //                     [ 1  0]
                        float rx = ax, ry = ay;
                        int physOrient = playerGetPhysicalOrientation();
                        switch (physOrient) {
                        default: // portrait — identity
                            break;
                        case SDL_ORIENTATION_LANDSCAPE: // 90° CW
                            rx =  ay;
                            ry = -ax;
                            break;
                        case SDL_ORIENTATION_PORTRAIT_FLIPPED: // 180°
                            rx = -ax;
                            ry = -ay;
                            break;
                        case SDL_ORIENTATION_LANDSCAPE_FLIPPED: // 270° CW
                            rx = -ay;
                            ry =  ax;
                            break;
                        }

                        SDL_Event se{};
                        se.type = SDL_EVENT_SENSOR_UPDATE;
                        se.sensor.data[0] = rx;
                        se.sensor.data[1] = ry;
                        sendEvent(se);
                        break;
                    }
                }
                sendEvent(e);
                break;
            case SDL_EVENT_SENSOR_UPDATE:
                sendEvent(e);
                break;
            }
        }
        if (hasMotion) sendEvent(lastMotion);

        // Drain ALL available messages. Decode every H.264 frame (P-frames
        // are delta-coded so skipping any corrupts the reference chain).
        // The decoder callback overwrites the decoded pixel buffer each time,
        // so the render loop always gets the latest result.
        while (conn->isOpen() && conn->available() > 0) {
            std::vector<char> data;
            if (!conn->recvBinary(data) || data.size() < 8) break;

            uint32_t magic = 0;
            std::memcpy(&magic, data.data(), 4);

            if (magic == wire::kVideoStreamMagic) {
                uint32_t length = 0;
                std::memcpy(&length, data.data() + 4, 4);
                if (data.size() < 8 + length) continue;

                const uint8_t* avccData = reinterpret_cast<const uint8_t*>(data.data()) + 9;
                size_t avccSize = length - 1;

                auto frameNals = avccParser.parse(avccData, avccSize);

                if (avccParser.paramsDirty && avccParser.hasParams()) {
                    decoder.setParameterSets(
                        avccParser.sps.data(), avccParser.sps.size(),
                        avccParser.pps.data(), avccParser.pps.size());
                    avccParser.paramsDirty = false;
                    SPDLOG_INFO("Decoder initialized with SPS/PPS");
                }

                static const uint8_t startCode[] = {0x00, 0x00, 0x00, 0x01};
                for (auto& [nalBody, nalSize] : frameNals) {
                    uint8_t nalType = nalBody[0] & 0x1F;
                    if (nalType != 1 && nalType != 5) continue;
                    std::vector<uint8_t> annexB(4 + nalSize);
                    std::memcpy(annexB.data(), startCode, 4);
                    std::memcpy(annexB.data() + 4, nalBody, nalSize);
                    decoder.decode(annexB.data(), annexB.size());
                }

                frameCount++;
                if (frameCount % 300 == 0) {
                    SPDLOG_INFO("Decoded {} frames", frameCount);
                }
            } else if (magic == wire::kSessionConfigMagic) {
                // Already handled during pre-window setup; ignore late arrivals.
            } else if (magic == wire::kServerAssignedMagic) {
                SPDLOG_INFO("Server assigned");
            } else if (magic == wire::kSessionEndMagic) {
                SPDLOG_INFO("Session ended");
            }
        }

        // Render the latest decoded frame
        {
            std::lock_guard<std::mutex> lock(frameMutex);
            if (frameReady) {
                // (Re)create texture if dimensions changed
                if (!videoTex || texW != frameW || texH != frameH) {
                    if (videoTex) SDL_DestroyTexture(videoTex);
                    videoTex = SDL_CreateTexture(renderer,
                        SDL_PIXELFORMAT_BGRA32,
                        SDL_TEXTUREACCESS_STREAMING,
                        frameW, frameH);
                    texW = frameW;
                    texH = frameH;
                    SPDLOG_INFO("Video texture created: {}x{}", texW, texH);
                }

                // Upload decoded pixels
                SDL_UpdateTexture(videoTex, nullptr,
                    decodedFrame.data(),
                    static_cast<int>(frameBytesPerRow));
                frameReady = false;
            }
        }

        SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
        SDL_RenderClear(renderer);
        if (videoTex) {
            int ww, wh;
            SDL_GetWindowSizeInPixels(window, &ww, &wh);

            // The video is always portrait. If the window is landscape,
            // rotate the video 90° CW to fill the landscape display.
            bool needsRotation = (ww > wh) && (texH > texW);

            if (needsRotation) {
                // SDL_RenderTextureRotated rotates the texture within the
                // dest rect. The dest rect is the pre-rotation bounding box.
                // For a portrait texture (texW x texH) rotated -90°, the
                // visual output is (texH x texW). We scale to fit the
                // landscape window using the visual (post-rotation) size,
                // then set the dest rect to the pre-rotation size at that
                // same scale so SDL's rotation produces the correct result.
                float scaleX = float(ww) / float(texH);  // visual width
                float scaleY = float(wh) / float(texW);  // visual height
                float scale = std::min(scaleX, scaleY);
                // Dest rect uses pre-rotation dimensions (portrait).
                float dstW = texW * scale;
                float dstH = texH * scale;
                SDL_FRect dst = {
                    (ww - dstW) / 2.0f,
                    (wh - dstH) / 2.0f,
                    dstW, dstH
                };
                SDL_RenderTextureRotated(renderer, videoTex, nullptr, &dst,
                                         -90.0, nullptr, SDL_FLIP_NONE);
            } else {
                float scaleX = float(ww) / float(texW);
                float scaleY = float(wh) / float(texH);
                float scale = std::min(scaleX, scaleY);
                float dstW = texW * scale;
                float dstH = texH * scale;
                SDL_FRect dst = {
                    (ww - dstW) / 2.0f,
                    (wh - dstH) / 2.0f,
                    dstW, dstH
                };
                SDL_RenderTexture(renderer, videoTex, nullptr, &dst);
            }
        }
        SDL_RenderPresent(renderer);
    }

    decoder.flush();
    if (conn) conn->close();
    if (videoTex) SDL_DestroyTexture(videoTex);
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
    SPDLOG_INFO("Player exited ({} frames decoded)", frameCount);
    return 0;
}
