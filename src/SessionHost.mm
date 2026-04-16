// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/SessionHost.h>
#include <ge/BgfxContext.h>
#include <ge/Signal.h>
#include <ge/Protocol.h>
#include <ge/VideoEncoder.h>
#include <ge/WebSocketClient.h>
#include <ge/FrameLog.h>

#include "render/DirectRenderHost.h"
#include "bridge/ServerWireBridge.h"

#include <bgfx/bgfx.h>
#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>

#include <algorithm>
#include <cstring>
#include <string>
#include <unistd.h>
#include <unordered_map>
#include <vector>

namespace ge {

namespace {
struct BrokeredSession {
    std::unique_ptr<ServerWireBridge> bridge;
    RunConfig config;  // empty until DeviceInfo arrives + factory called
};
}  // namespace

// ── Sideband JSON parsing (minimal, no dependencies) ───────────────

static std::string jsonStringValue(const std::string& json, const std::string& key) {
    auto needle = "\"" + key + "\"";
    auto pos = json.find(needle);
    if (pos == std::string::npos) return "";
    pos = json.find('"', pos + needle.size() + 1);
    if (pos == std::string::npos) return "";
    auto end = json.find('"', pos + 1);
    if (end == std::string::npos) return "";
    return json.substr(pos + 1, end - pos - 1);
}

// ── runBrokered: game-server in the player/ged modality ───────────
//
// This is the server-side half of the bridge subsystem in the intended
// architecture. It owns ged sideband + per-session wire + headless
// bgfx framebuffer + H.264 encode. Future refactor: extract into
// a dedicated ServerWireBridge class that implements a RenderHost
// interface shared with runDirect's DirectRenderHost.

static void runBrokered(Factory factory, const SessionHostConfig& config) {
    const char* name = (config.appName && *config.appName) ? config.appName : "server";

    // Initial screen-saver policy — must be set before SDL_Init
    // (BgfxContext does that). Games can toggle at runtime.
    SDL_SetHint(SDL_HINT_VIDEO_ALLOW_SCREENSAVER,
                config.disableScreenSaver ? "0" : "1");

    // Connect to ged sideband (control channel)
    auto sideband = connectWebSocket("localhost", 42069,
        std::string("/ws/server?name=") + name, 2000);
    if (!sideband || !sideband->isOpen()) {
        SPDLOG_WARN("Failed to connect to ged — running standalone");
        return;
    }
    SPDLOG_INFO("Connected to ged sideband");
    std::string hello = std::string("{\"type\":\"hello\",\"name\":\"") + name + "\",\"pid\":"
        + std::to_string(getpid()) + ",\"version\":"
        + std::to_string(wire::kProtocolVersion) + "}";
    sideband->sendText(hello);

    // bgfx context — deferred until the first session's DeviceInfo arrives.
    std::unique_ptr<BgfxContext> bgfxCtx;

    // Active sessions: each owns a ServerWireBridge (wire + capture + encode).
    std::unordered_map<std::string, BrokeredSession> sessions;

    // Frame timing
    uint64_t freq = SDL_GetPerformanceFrequency();
    uint64_t startTime = SDL_GetPerformanceCounter();
    uint64_t lastTime = startTime;
    uint64_t frameIndex = 0;

    SPDLOG_INFO("SessionHost: waiting for players...");

    while (!ge::shouldQuit()) {
        // ── 1. Poll sideband for control messages ──
        while (sideband->isOpen() && sideband->available() > 0) {
            std::vector<char> data;
            if (!sideband->recvBinary(data) || data.empty()) break;

            if (data[0] != '{') continue;  // ignore binary on sideband
            std::string msg(data.begin(), data.end());
            auto type = jsonStringValue(msg, "type");
            auto sessionId = jsonStringValue(msg, "session_id");

            if (type == "player_attached" && !sessionId.empty()) {
                if (sessions.count(sessionId)) continue;
                SPDLOG_INFO("Player attached: session '{}'", sessionId);

                std::string wirePath = "/ws/server/wire/" + sessionId;
                auto wire = connectWebSocket("localhost", 42069, wirePath, 2000);
                if (!wire || !wire->isOpen()) {
                    SPDLOG_ERROR("Failed to open wire for session '{}'", sessionId);
                    continue;
                }

                BrokeredSession bs;
                bs.bridge = std::make_unique<ServerWireBridge>(sessionId, std::move(wire));

                // Tell the player about session requirements (sensors,
                // orientation) before it creates its window.
                wire::SessionConfig sc{};
                sc.sensors = config.sensors;
                sc.orientation = config.orientation;
                bs.bridge->send(sc);

                sessions.emplace(sessionId, std::move(bs));

            } else if (type == "player_detached" && !sessionId.empty()) {
                auto it = sessions.find(sessionId);
                if (it != sessions.end()) {
                    SPDLOG_INFO("Player detached: session '{}'", sessionId);
                    if (it->second.config.onShutdown) it->second.config.onShutdown();
                    it->second.bridge->shutdown();
                    sessions.erase(it);
                }
            }
        }

        if (!sideband->isOpen()) break;

        // ── 2. Frame pacing: absolute timestamps, no drift ──
        uint64_t targetTime = startTime + (uint64_t)frameIndex * freq / 60;
        uint64_t now = SDL_GetPerformanceCounter();
        if (now < targetTime) {
            int64_t remaining = targetTime - now;
            int64_t sleepTicks = remaining - freq / 1000;
            if (sleepTicks > 0) SDL_Delay((uint32_t)(sleepTicks * 1000 / freq));
            while (SDL_GetPerformanceCounter() < targetTime) {}
            now = SDL_GetPerformanceCounter();
        }
        frameIndex++;
        float dt = float(now - lastTime) / float(freq);
        lastTime = now;
        if (dt > 0.1f) dt = 0.1f;

        // Local SDL events (only after bgfx/SDL init).
        if (bgfxCtx) {
            SDL_Event e;
            while (SDL_PollEvent(&e)) {
                if (e.type == SDL_EVENT_QUIT) break;
            }
        }

        // ── 3. Drain wires + (one-time init) + per-session frame ──
        for (auto& [id, bs] : sessions) {
            bs.bridge->pumpWire();

            // Lazy init: when DeviceInfo has arrived, init bgfx (once,
            // shared across all sessions) and the per-session capture.
            if (!bs.bridge->isReady() && bs.bridge->hasDimensions()) {
                if (!bgfxCtx) {
                    bgfxCtx = std::make_unique<BgfxContext>(
                        BgfxConfig{bs.bridge->width(), bs.bridge->height(),
                                   config.headless});
                    SPDLOG_INFO("bgfx initialized at {}x{}",
                                bs.bridge->width(), bs.bridge->height());
                }
                bs.bridge->initialise();

                std::string dbPath = ":memory:";
                if (config.orgName && config.appName) {
                    char* pref = SDL_GetPrefPath(config.orgName, config.appName);
                    if (pref) {
                        dbPath = std::string(pref) + "game.db";
                        SDL_free(pref);
                        SPDLOG_INFO("Session '{}': persistent DB at {}", id, dbPath);
                    }
                }
                Context ctx{bs.bridge->width(), bs.bridge->height(),
                            bs.bridge->deviceClass(), dbPath, config.schemaDdl};
                bs.config = factory(ctx);
                bs.bridge->setEventHandler(bs.config.onEvent);
            }

            if (!bs.bridge->isReady()) continue;

            uint64_t t0 = SDL_GetPerformanceCounter();
            if (bs.config.onUpdate) bs.config.onUpdate(dt);
            uint64_t t1 = SDL_GetPerformanceCounter();
            bs.bridge->beginFrame();
            if (bs.config.onRender)
                bs.config.onRender(bs.bridge->width(), bs.bridge->height());
            uint64_t t2 = SDL_GetPerformanceCounter();
            uint32_t frameNum = bgfx::frame();
            uint64_t t3 = SDL_GetPerformanceCounter();
            bs.bridge->endFrame(frameNum);
            uint64_t t4 = SDL_GetPerformanceCounter();

            struct ServerFrame { uint64_t t0, t1, t2, t3, t4; };
            static FrameLog<ServerFrame> serverLog([](const std::vector<ServerFrame>& frames, uint64_t freq) {
                auto ms = [freq](uint64_t a, uint64_t b) { return float(b - a) * 1000.0f / float(freq); };
                float maxTotal = 0, maxUpdate = 0, maxRender = 0, maxSubmit = 0, maxEncode = 0, maxGap = 0;
                for (size_t i = 0; i < frames.size(); i++) {
                    auto& f = frames[i];
                    float total = ms(f.t0, f.t4);
                    if (total > maxTotal) maxTotal = total;
                    if (ms(f.t0, f.t1) > maxUpdate) maxUpdate = ms(f.t0, f.t1);
                    if (ms(f.t1, f.t2) > maxRender) maxRender = ms(f.t1, f.t2);
                    if (ms(f.t2, f.t3) > maxSubmit) maxSubmit = ms(f.t2, f.t3);
                    if (ms(f.t3, f.t4) > maxEncode) maxEncode = ms(f.t3, f.t4);
                    if (i > 0) {
                        float gap = ms(frames[i-1].t0, f.t0);
                        if (gap > maxGap) maxGap = gap;
                    }
                }
                SPDLOG_INFO("ServerLog: {} frames, maxTotal={:.1f}ms maxGap={:.1f}ms | "
                            "update={:.1f} render={:.1f} submit={:.1f} encode={:.1f}",
                            frames.size(), maxTotal, maxGap,
                            maxUpdate, maxRender, maxSubmit, maxEncode);
            });
            serverLog.record({t0, t1, t2, t3, t4});
        }

        // Keep bgfx alive when no sessions are rendering.
        if (bgfxCtx && sessions.empty()) bgfx::frame();

        // Reap disconnected sessions.
        for (auto it = sessions.begin(); it != sessions.end(); ) {
            if (it->second.bridge->shouldQuit()) {
                SPDLOG_INFO("Session '{}': wire disconnected", it->first);
                if (it->second.config.onShutdown) it->second.config.onShutdown();
                it->second.bridge->shutdown();
                it = sessions.erase(it);
            } else {
                ++it;
            }
        }
    }

    // Tear down remaining sessions.
    for (auto& [id, bs] : sessions) {
        if (bs.config.onShutdown) bs.config.onShutdown();
        bs.bridge->shutdown();
    }
}

// ── runDirect: standalone / distribution modality ─────────────────
//
// Render + engine in one process, no ged, no wire. Uses DirectRenderHost
// for window + bgfx + input.

static void runDirect(Factory factory, const SessionHostConfig& config) {
    DirectRenderHost host(config);

    std::string dbPath = ":memory:";
    if (config.orgName && config.appName) {
        char* pref = SDL_GetPrefPath(config.orgName, config.appName);
        if (pref) {
            dbPath = std::string(pref) + "game.db";
            SDL_free(pref);
            SPDLOG_INFO("Direct mode: persistent DB at {}", dbPath);
        }
    }

    Context ctx{host.width(), host.height(), host.deviceClass(),
                dbPath, config.schemaDdl};
    RunConfig rc = factory(ctx);
    host.setEventHandler(rc.onEvent);

    wire::SessionConfig sc{};
    sc.sensors = config.sensors;
    sc.orientation = config.orientation;
    host.send(sc);

    uint64_t freq = SDL_GetPerformanceFrequency();
    uint64_t last = SDL_GetPerformanceCounter();

    while (!host.shouldQuit()) {
        host.pumpEvents();

        uint64_t now = SDL_GetPerformanceCounter();
        float dt = float(now - last) / float(freq);
        last = now;
        if (dt > 0.1f) dt = 0.1f;

        if (rc.onUpdate) rc.onUpdate(dt);

        host.beginFrame();
        if (rc.onRender) rc.onRender(host.width(), host.height());
        uint32_t frameNum = bgfx::frame();
        host.endFrame(frameNum);
    }

    if (rc.onShutdown) rc.onShutdown();
}

// ── ge::run — dispatch by modality ────────────────────────────────

void run(Factory factory, const SessionHostConfig& config) {
    if (config.headless) {
        runBrokered(factory, config);
    } else {
        runDirect(factory, config);
    }
}

} // namespace ge
