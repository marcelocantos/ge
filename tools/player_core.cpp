// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

// H.264 video player — receives encoded frames from ged, decodes via
// VideoToolbox, and renders to an SDL3 window.

#include "player_core.h"

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

    SPDLOG_INFO("PLAYER sizeof(SDL_Event)={}", sizeof(SDL_Event));

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

    // Get screen dimensions from the primary display (no window needed).
    const SDL_DisplayMode* dm = SDL_GetCurrentDisplayMode(SDL_GetPrimaryDisplay());
    int pixW = dm ? dm->w : 1080;
    int pixH = dm ? dm->h : 2400;
    int pixelRatio = (dm && dm->pixel_density > 0) ? int(dm->pixel_density) : 1;

    // Send DeviceInfo so the server can set up and reply with SessionConfig.
    {
        wire::MessageHeader hdr{};
        hdr.magic = wire::kDeviceInfoMagic;
        hdr.length = sizeof(wire::DeviceInfo);
        wire::DeviceInfo devInfo{};
        devInfo.width = pixW;
        devInfo.height = pixH;
        devInfo.pixelRatio = pixelRatio;
        devInfo.deviceClass = 3; // desktop
        std::vector<uint8_t> msg(sizeof(hdr) + sizeof(devInfo));
        std::memcpy(msg.data(), &hdr, sizeof(hdr));
        std::memcpy(msg.data() + sizeof(hdr), &devInfo, sizeof(devInfo));
        conn->sendBinary(msg.data(), msg.size());
        SPDLOG_INFO("DeviceInfo sent ({}x{} @{}x)", pixW, pixH, pixelRatio);
    }

    // Read messages until we get SessionConfig or a video frame. ged sends
    // ServerAssigned first (from the broker), then the wire is established
    // and the server sends SessionConfig. We need to drain the ged messages
    // to reach it. This blocks until the server is ready, which is fine —
    // we can't show anything until we have the session config anyway.
    SDL_Sensor* accelSensor = nullptr;
    while (conn->isOpen()) {
        std::vector<char> msg;
        if (!conn->recvBinary(msg) || msg.size() < 8) break;
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
                const char* hint = nullptr;
                switch (cfg.orientation) {
                case 1: hint = "LandscapeLeft"; break;
                case 2: hint = "LandscapeRight"; break;
                case 3: hint = "Portrait"; break;
                case 4: hint = "PortraitUpsideDown"; break;
                }
                if (hint) {
                    SDL_SetHint(SDL_HINT_ORIENTATIONS, hint);
                    SPDLOG_INFO("Orientation locked to {} (server requested)", hint);
                }
            }
            break;
        }
        if (magic == wire::kServerAssignedMagic ||
            magic == wire::kStreamStartMagic) {
            SPDLOG_INFO("Pre-window: skipping message 0x{:08x}", magic);
            continue;  // ged housekeeping — keep waiting for SessionConfig
        }
        // Got a video frame or unknown message — server didn't send config.
        break;
    }

    // ── Create window (orientation hint already applied) ───────────────

    SDL_Window* window = SDL_CreateWindow(
        "GE Player", 820, 1180,
        SDL_WINDOW_RESIZABLE | SDL_WINDOW_HIGH_PIXEL_DENSITY);
    if (!window) {
        SPDLOG_ERROR("SDL_CreateWindow failed: {}", SDL_GetError());
        SDL_Quit();
        return 1;
    }

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

    // Coordinate mapping: player window → server render space
    auto mapEvent = [&](SDL_Event& e) {
        if (!videoTex) return;
        int ww, wh;
        SDL_GetWindowSizeInPixels(window, &ww, &wh);
        float scaleX = float(ww) / float(texW);
        float scaleY = float(wh) / float(texH);
        float scale = std::min(scaleX, scaleY);
        float offsetX = (ww - texW * scale) / 2.0f;
        float offsetY = (wh - texH * scale) / 2.0f;

        if (e.type == SDL_EVENT_MOUSE_MOTION) {
            e.motion.x = (e.motion.x - offsetX) / scale;
            e.motion.y = (e.motion.y - offsetY) / scale;
        } else if (e.type == SDL_EVENT_MOUSE_BUTTON_DOWN ||
                   e.type == SDL_EVENT_MOUSE_BUTTON_UP) {
            e.button.x = (e.button.x - offsetX) / scale;
            e.button.y = (e.button.y - offsetY) / scale;
        } else if (e.type == SDL_EVENT_FINGER_DOWN ||
                   e.type == SDL_EVENT_FINGER_UP ||
                   e.type == SDL_EVENT_FINGER_MOTION) {
            // Finger events use normalized 0-1 coords; convert to server
            // pixel coordinates so GlobeController uses the same scale
            // as mouse events.
            float px = e.tfinger.x * ww;
            float py = e.tfinger.y * wh;
            e.tfinger.x = (px - offsetX) / scale;
            e.tfinger.y = (py - offsetY) / scale;
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
            // Scale to fit window while preserving aspect ratio
            int ww, wh;
            SDL_GetWindowSizeInPixels(window, &ww, &wh);
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
