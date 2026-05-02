// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// ge::run() dispatcher + runDirect() (distribution modality).
//
// The brokered implementation (runBrokered) lives in SessionHost_brokered.mm
// which is only compiled when the parent build wants brokered support (i.e.
// not mobile distribution). Define GE_DIRECT_ONLY to compile just runDirect
// without pulling in the bridge subsystem, WebSocketClient, ServerWireBridge
// etc.

#include <ge/SessionHost.h>
#include <ge/Signal.h>
#include <ge/Protocol.h>

#include "render/DirectRenderHost.h"

#include <bgfx/bgfx.h>
#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>

#include <string>

namespace ge {

// Brokered entry point — defined in SessionHost_brokered.mm when included.
// For GE_DIRECT_ONLY builds, we stub it out with a runtime error.
#ifdef GE_DIRECT_ONLY
static void runBrokered(Factory, const SessionHostConfig&) {
    SPDLOG_ERROR("ge::run: headless/brokered modality requested but this build "
                 "was compiled with GE_DIRECT_ONLY — relink with the bridge "
                 "subsystem enabled.");
}
#else
void runBrokered(Factory factory, const SessionHostConfig& config);
#endif

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

        // While the host is paused (Android backgrounded, swap chain
        // torn down), skip the entire render bracket — bgfx::frame()
        // against a dead surface crashes. SDL3 also blocks the main
        // loop on Android during background, but we belt-and-brace the
        // gate here. Game's onUpdate keeps running so timers don't
        // freeze; reset `last` so the first foreground frame doesn't
        // see a multi-second dt.
        if (host.paused()) {
            last = SDL_GetPerformanceCounter();
            continue;
        }

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
