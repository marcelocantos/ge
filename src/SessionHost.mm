// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/SessionHost.h>
#include <ge/BgfxContext.h>
#include <ge/Signal.h>
#include <ge/Protocol.h>
#include <ge/VideoEncoder.h>
#include <ge/WebSocketClient.h>

#include <bgfx/bgfx.h>
#include <SDL3/SDL.h>
#include <sqlite3.h>
#include <spdlog/spdlog.h>

#include <cstring>
#include <string>
#include <unistd.h>
#include <vector>

// ObjC capture — defined in ge/tools/player_capture_apple.mm
namespace capture {
    void enableCaptureLayer(void* layer);
    bool hasDrawable();
    bool readLastFrame(uint8_t* dst, int width, int height, size_t bytesPerRow);
}

namespace ge {

struct Context::M {
    int width;
    int height;
    DeviceClass deviceClass;
    sqlite3* db;
};

Context::Context(int width, int height, DeviceClass deviceClass, sqlite3* db)
    : m(std::make_shared<M>(M{width, height, deviceClass, db})) {}

int Context::width() const { return m->width; }
int Context::height() const { return m->height; }
DeviceClass Context::deviceClass() const { return m->deviceClass; }

sqlite3* Context::takeDb() {
    auto* h = m->db;
    m->db = nullptr;
    return h;
}

void run(Factory factory, const SessionHostConfig& config) {
    int w = config.width, h = config.height;

    // Initialize bgfx (handles signal handlers, vsync, surface creation)
    BgfxContext ctx({w, h, config.headless});

    if (config.headless) {
        capture::enableCaptureLayer(ctx.nativeHandle());
    }

    // Connect to ged sideband
    auto wireConn = connectWebSocket("localhost", 42069, "/ws/server?name=yourworld", 2000);
    if (wireConn && wireConn->isOpen()) {
        SPDLOG_INFO("Connected to ged sideband");
        std::string hello = "{\"type\":\"hello\",\"name\":\"yourworld\",\"pid\":"
            + std::to_string(getpid()) + ",\"version\":5}";
        wireConn->sendText(hello);
    } else {
        SPDLOG_WARN("Failed to connect to ged — running standalone");
    }

    // H.264 encoder (headless only)
    std::unique_ptr<VideoEncoder> encoder;
    std::vector<uint8_t> pixelBuf;
    if (config.headless) {
        encoder = std::make_unique<VideoEncoder>(w, h, 30,
            [&](VideoEncoder::Frame frame) {
                if (!wireConn || !wireConn->isOpen()) return;
                wire::MessageHeader hdr{};
                hdr.magic = wire::kVideoStreamMagic;
                hdr.length = 1 + frame.size;
                uint8_t flags = frame.isKeyframe ? 1 : 0;
                std::vector<uint8_t> msg(sizeof(hdr) + 1 + frame.size);
                std::memcpy(msg.data(), &hdr, sizeof(hdr));
                msg[sizeof(hdr)] = flags;
                std::memcpy(msg.data() + sizeof(hdr) + 1, frame.data, frame.size);
                wireConn->sendBinary(msg.data(), msg.size());
            });
        pixelBuf.resize(w * 4 * h);
    }

    // Render loop
    uint64_t lastTime = SDL_GetPerformanceCounter();
    uint64_t freq = SDL_GetPerformanceFrequency();
    bool quit = false;

    // Open game database — persistent file for bundled mode, in-memory for server.
    sqlite3* gameDb = nullptr;
    std::string dbPath;
    if (!config.headless && config.orgName && config.appName) {
        char* prefPath = SDL_GetPrefPath(config.orgName, config.appName);
        if (prefPath) {
            dbPath = std::string(prefPath) + "game.db";
            SDL_free(prefPath);
        } else {
            SPDLOG_WARN("SDL_GetPrefPath failed, falling back to :memory:");
            dbPath = ":memory:";
        }
    } else {
        dbPath = ":memory:";
    }
    int dbFlags = SQLITE_OPEN_READWRITE | SQLITE_OPEN_CREATE;
    int rc = sqlite3_open_v2(dbPath.c_str(), &gameDb, dbFlags, nullptr);
    if (rc != SQLITE_OK) {
        std::string msg = gameDb ? sqlite3_errmsg(gameDb) : "out of memory";
        sqlite3_close(gameDb);
        throw std::runtime_error("Failed to open game DB (" + dbPath + "): " + msg);
    }
    SPDLOG_INFO("Game DB: {}", dbPath);

    // Create per-session state via factory
    Context ctx_info{w, h, DeviceClass::Desktop, gameDb};
    auto runConfig = factory(ctx_info);

    while (!quit && !ctx.shouldQuit()) {
        // Drain input from player via ged
        while (wireConn && wireConn->isOpen() && wireConn->available() > 0) {
            std::vector<char> data;
            if (!wireConn->recvBinary(data)) break;
            if (data.size() < 8) continue;

            uint32_t magic = 0;
            std::memcpy(&magic, data.data(), 4);

            if (magic == wire::kSdlEventMagic &&
                data.size() >= sizeof(wire::MessageHeader) + sizeof(SDL_Event)) {
                SDL_Event ev;
                std::memcpy(&ev, data.data() + sizeof(wire::MessageHeader), sizeof(SDL_Event));
                if (runConfig.onEvent) runConfig.onEvent(ev);
            }
        }

        // Local SDL events
        SDL_Event e;
        while (SDL_PollEvent(&e)) {
            if (e.type == SDL_EVENT_QUIT) { quit = true; continue; }
            if (runConfig.onEvent) runConfig.onEvent(e);
        }

        // Delta time
        uint64_t now = SDL_GetPerformanceCounter();
        float dt = float(now - lastTime) / float(freq);
        lastTime = now;
        if (dt > 0.1f) dt = 0.1f;

        if (runConfig.onUpdate) runConfig.onUpdate(dt);
        if (runConfig.onRender) runConfig.onRender(w, h);
        bgfx::frame();

        // Capture + encode (headless only)
        if (encoder && capture::hasDrawable()) {
            if (capture::readLastFrame(pixelBuf.data(), w, h, w * 4)) {
                encoder->encode(pixelBuf.data(), w * 4);
            }
        }
    }

    if (encoder) encoder->flush();
    if (runConfig.onShutdown) runConfig.onShutdown();
}

} // namespace ge
