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
#include <spdlog/spdlog.h>

#include <cstring>
#include <string>
#include <unistd.h>
#include <vector>

namespace ge {

struct Context::M {
    int width;
    int height;
    DeviceClass deviceClass;
    std::shared_ptr<sqlpipe::Database> db;
};

Context::Context(int width, int height, DeviceClass deviceClass,
                 const std::string& dbPath)
    : m(std::make_shared<M>(M{width, height, deviceClass,
        std::make_shared<sqlpipe::Database>(dbPath)})) {}

int Context::width() const { return m->width; }
int Context::height() const { return m->height; }
DeviceClass Context::deviceClass() const { return m->deviceClass; }
std::shared_ptr<sqlpipe::Database> Context::db() const { return m->db; }

void run(Factory factory, const SessionHostConfig& config) {
    // Connect to ged sideband
    auto wireConn = connectWebSocket("localhost", 42069, "/ws/server?name=yourworld", 2000);
    if (wireConn && wireConn->isOpen()) {
        SPDLOG_INFO("Connected to ged sideband");
        std::string hello = "{\"type\":\"hello\",\"name\":\"yourworld\",\"pid\":"
            + std::to_string(getpid()) + ",\"version\":"
            + std::to_string(wire::kProtocolVersion) + "}";
        wireConn->sendText(hello);
    } else {
        SPDLOG_WARN("Failed to connect to ged — running standalone");
    }

    // Resolve render dimensions.
    int w = config.width, h = config.height;
    if (config.headless && w == 0 && h == 0 && wireConn && wireConn->isOpen()) {
        SPDLOG_INFO("Waiting for player DeviceInfo...");
        wireConn->setRecvTimeout(30000);
        while (wireConn->isOpen()) {
            std::vector<char> data;
            if (!wireConn->recvBinary(data)) {
                if (!wireConn->isOpen()) break;
                continue;
            }
            if (data.size() < 8) continue;

            uint32_t magic = 0;
            std::memcpy(&magic, data.data(), 4);

            if (magic == wire::kDeviceInfoMagic &&
                data.size() >= sizeof(wire::MessageHeader) + sizeof(wire::DeviceInfo)) {
                wire::DeviceInfo info;
                std::memcpy(&info, data.data() + sizeof(wire::MessageHeader), sizeof(info));
                // Render at half the player's pixel dimensions.
                w = info.width / 2;
                h = info.height / 2;
                SPDLOG_INFO("Received DeviceInfo: {}x{} @{}x → render at {}x{}",
                            info.width, info.height, info.pixelRatio, w, h);
                break;
            }
        }
        wireConn->setRecvTimeout(0);
    }
    if (w == 0 || h == 0) {
        w = 820;
        h = 1180;
        SPDLOG_WARN("No DeviceInfo received, using fallback {}x{}", w, h);
    }

    // Initialize bgfx
    BgfxContext ctx({w, h, config.headless});

    // H.264 encoder + pixel buffer (headless only).
    std::unique_ptr<VideoEncoder> encoder;
    std::vector<uint8_t> pixelBuf;
    if (config.headless) {
        pixelBuf.resize(w * h * 4);
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
    }

    // Render loop
    uint64_t lastTime = SDL_GetPerformanceCounter();
    uint64_t freq = SDL_GetPerformanceFrequency();
    bool quit = false;

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
    SPDLOG_INFO("Game DB: {}", dbPath);

    Context ctx_info{w, h, DeviceClass::Desktop, dbPath};
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

        // Headless mode: pace to ~60fps.
        if (config.headless && dt < 1.0f/60.0f) {
            SDL_Delay(uint32_t((1.0f/60.0f - dt) * 1000.0f));
        }

        // Direct all views to the offscreen framebuffer.
        if (ctx.isCaptureEnabled()) {
            bgfx::FrameBufferHandle fb = { ctx.captureFrameBuffer() };
            for (bgfx::ViewId v = 0; v < 16; ++v) {
                bgfx::setViewFrameBuffer(v, fb);
            }
        }

        if (runConfig.onRender) runConfig.onRender(w, h);

        if (ctx.isCaptureEnabled()) {
            ctx.submitCaptureBlit();
        }

        uint32_t frameNum = bgfx::frame();

        // Read async readback and encode.
        if (encoder && ctx.isCaptureEnabled()) {
            if (ctx.readCapturedFrame(frameNum, pixelBuf.data(), pixelBuf.size())) {
                encoder->encode(pixelBuf.data(), w * 4);
            }
        }
    }

    if (encoder) encoder->flush();
    if (runConfig.onShutdown) runConfig.onShutdown();
}

} // namespace ge
