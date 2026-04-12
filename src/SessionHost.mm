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
#include <unordered_map>
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

// ── Per-session state ──────────────────────────────────────────────

struct Session {
    std::string id;
    std::shared_ptr<WsConnection> wire;
    RunConfig config;
    int width = 0, height = 0;
    bool ready = false;  // true once DeviceInfo arrives and capture is initialized

    // Offscreen capture: framebuffer + double-buffered readback.
    bgfx::FrameBufferHandle fb = BGFX_INVALID_HANDLE;
    bgfx::TextureHandle renderTex = BGFX_INVALID_HANDLE;

    static constexpr int kNumReadback = 2;
    struct ReadbackSlot {
        bgfx::TextureHandle tex = BGFX_INVALID_HANDLE;
        std::vector<uint8_t> buf;
        uint32_t readyFrame = 0;
        bool pending = false;
    };
    ReadbackSlot readback[kNumReadback];
    int submitIdx = 0;

    std::unique_ptr<VideoEncoder> encoder;
    std::vector<uint8_t> pixelBuf;

    bool initCapture() {
        renderTex = bgfx::createTexture2D(
            width, height, false, 1,
            bgfx::TextureFormat::BGRA8,
            BGFX_TEXTURE_RT | BGFX_TEXTURE_BLIT_DST);
        bgfx::TextureHandle attachments[] = { renderTex };
        fb = bgfx::createFrameBuffer(1, attachments, false);

        size_t frameBytes = width * height * 4;
        for (auto& slot : readback) {
            slot.tex = bgfx::createTexture2D(
                width, height, false, 1,
                bgfx::TextureFormat::BGRA8,
                BGFX_TEXTURE_BLIT_DST | BGFX_TEXTURE_READ_BACK);
            slot.buf.resize(frameBytes);
        }
        pixelBuf.resize(frameBytes);
        return bgfx::isValid(fb);
    }

    void submitCaptureBlit() {
        auto& slot = readback[submitIdx];
        if (slot.pending) return;
        bgfx::setViewFrameBuffer(255, BGFX_INVALID_HANDLE);
        bgfx::blit(255, slot.tex, 0, 0, renderTex);
        slot.readyFrame = bgfx::readTexture(slot.tex, slot.buf.data());
        slot.pending = true;
        submitIdx = (submitIdx + 1) % kNumReadback;
    }

    bool readCapturedFrame(uint32_t frameNum) {
        for (auto& slot : readback) {
            if (slot.pending && frameNum >= slot.readyFrame) {
                slot.pending = false;
                std::memcpy(pixelBuf.data(), slot.buf.data(), pixelBuf.size());
                return true;
            }
        }
        return false;
    }

    void destroy() {
        if (config.onShutdown) config.onShutdown();
        if (encoder) encoder->flush();
        for (auto& slot : readback)
            if (bgfx::isValid(slot.tex)) bgfx::destroy(slot.tex);
        if (bgfx::isValid(fb)) bgfx::destroy(fb);
        // renderTex is NOT destroyed — owned by FB (destroyTexture=false above,
        // but we passed false to createFrameBuffer so we must destroy it ourselves)
        if (bgfx::isValid(renderTex)) bgfx::destroy(renderTex);
    }
};

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

// ── ge::run — multi-session server ─────────────────────────────────

void run(Factory factory, const SessionHostConfig& config) {
    // Connect to ged sideband (control channel)
    auto sideband = connectWebSocket("localhost", 42069, "/ws/server?name=yourworld", 2000);
    if (!sideband || !sideband->isOpen()) {
        SPDLOG_WARN("Failed to connect to ged — running standalone");
        return;
    }
    SPDLOG_INFO("Connected to ged sideband");
    std::string hello = "{\"type\":\"hello\",\"name\":\"yourworld\",\"pid\":"
        + std::to_string(getpid()) + ",\"version\":"
        + std::to_string(wire::kProtocolVersion) + "}";
    sideband->sendText(hello);

    // bgfx init (one global context, sessions share it via separate FBs)
    int defaultW = 820, defaultH = 1180;
    BgfxContext bgfxCtx({defaultW, defaultH, config.headless});

    // Active sessions
    std::unordered_map<std::string, std::unique_ptr<Session>> sessions;

    // Frame timing
    uint64_t lastTime = SDL_GetPerformanceCounter();
    uint64_t freq = SDL_GetPerformanceFrequency();

    SPDLOG_INFO("SessionHost: waiting for players...");

    while (!bgfxCtx.shouldQuit()) {
        // ── 1. Poll sideband for control messages ──
        while (sideband->isOpen() && sideband->available() > 0) {
            std::vector<char> data;
            if (!sideband->recvBinary(data) || data.empty()) break;

            // Text frames (JSON) start with '{'; binary frames start with a magic uint32.
            if (data[0] == '{') {
                std::string msg(data.begin(), data.end());
                auto type = jsonStringValue(msg, "type");
                auto sessionId = jsonStringValue(msg, "session_id");

                if (type == "player_attached" && !sessionId.empty()) {
                    if (sessions.count(sessionId)) continue;
                    SPDLOG_INFO("Player attached: session '{}'", sessionId);

                    // Open per-session wire. DeviceInfo will arrive on it
                    // naturally — the session initializes when it does.
                    std::string wirePath = "/ws/server/wire/" + sessionId;
                    auto wire = connectWebSocket("localhost", 42069, wirePath, 2000);
                    if (!wire || !wire->isOpen()) {
                        SPDLOG_ERROR("Failed to open wire for session '{}'", sessionId);
                        continue;
                    }

                    auto sess = std::make_unique<Session>();
                    sess->id = sessionId;
                    sess->wire = std::move(wire);
                    sessions[sessionId] = std::move(sess);

                } else if (type == "player_detached" && !sessionId.empty()) {
                    auto it = sessions.find(sessionId);
                    if (it != sessions.end()) {
                        SPDLOG_INFO("Player detached: session '{}'", sessionId);
                        it->second->destroy();
                        sessions.erase(it);
                    }
                }
            }
            // Binary frames on sideband are ignored (all data goes on wires now)
        }

        if (!sideband->isOpen()) break;

        // ── 2. Delta time ──
        uint64_t now = SDL_GetPerformanceCounter();
        float dt = float(now - lastTime) / float(freq);
        lastTime = now;
        if (dt > 0.1f) dt = 0.1f;

        // ── 3. Frame pacing (60fps total, shared across sessions) ──
        if (config.headless && dt < 1.0f/60.0f) {
            SDL_Delay(uint32_t((1.0f/60.0f - dt) * 1000.0f));
        }

        // Local SDL events
        SDL_Event e;
        while (SDL_PollEvent(&e)) {
            if (e.type == SDL_EVENT_QUIT) break;
        }

        // ── 4. Drain wires + update + render each session ──
        for (auto& [id, sess] : sessions) {
            // Drain messages from this session's wire
            while (sess->wire && sess->wire->isOpen() && sess->wire->available() > 0) {
                std::vector<char> data;
                if (!sess->wire->recvBinary(data)) break;
                if (data.size() < 8) continue;

                uint32_t magic = 0;
                std::memcpy(&magic, data.data(), 4);

                if (magic == wire::kDeviceInfoMagic && !sess->ready &&
                    data.size() >= sizeof(wire::MessageHeader) + sizeof(wire::DeviceInfo)) {
                    // DeviceInfo arrived — initialize the session.
                    wire::DeviceInfo info;
                    std::memcpy(&info, data.data() + sizeof(wire::MessageHeader), sizeof(info));
                    sess->width = info.width / 2;
                    sess->height = info.height / 2;
                    if (sess->width == 0 || sess->height == 0) {
                        sess->width = defaultW; sess->height = defaultH;
                    }
                    SPDLOG_INFO("Session '{}': DeviceInfo {}x{} @{}x → render at {}x{}",
                                id, info.width, info.height, info.pixelRatio,
                                sess->width, sess->height);

                    sess->initCapture();

                    auto wirePtr = sess->wire;
                    int w = sess->width, h = sess->height;
                    sess->encoder = std::make_unique<VideoEncoder>(w, h, 30,
                        [wirePtr](VideoEncoder::Frame frame) {
                            if (!wirePtr || !wirePtr->isOpen()) return;
                            wire::MessageHeader hdr{};
                            hdr.magic = wire::kVideoStreamMagic;
                            hdr.length = 1 + frame.size;
                            uint8_t flags = frame.isKeyframe ? 1 : 0;
                            std::vector<uint8_t> msg(sizeof(hdr) + 1 + frame.size);
                            std::memcpy(msg.data(), &hdr, sizeof(hdr));
                            msg[sizeof(hdr)] = flags;
                            std::memcpy(msg.data() + sizeof(hdr) + 1, frame.data, frame.size);
                            wirePtr->sendBinary(msg.data(), msg.size());
                        });

                    Context ctx{w, h, DeviceClass::Desktop, ":memory:"};
                    sess->config = factory(ctx);
                    sess->ready = true;
                    SPDLOG_INFO("Session '{}': ready ({}x{})", id, w, h);

                    // Send SessionConfig if the game declared requirements.
                    if (sess->config.sensors || sess->config.orientation) {
                        wire::MessageHeader cfgHdr{};
                        cfgHdr.magic = wire::kSessionConfigMagic;
                        cfgHdr.length = sizeof(wire::SessionConfig);
                        wire::SessionConfig cfg{};
                        cfg.sensors = sess->config.sensors;
                        cfg.orientation = sess->config.orientation;
                        std::vector<uint8_t> cfgMsg(sizeof(cfgHdr) + sizeof(cfg));
                        std::memcpy(cfgMsg.data(), &cfgHdr, sizeof(cfgHdr));
                        std::memcpy(cfgMsg.data() + sizeof(cfgHdr), &cfg, sizeof(cfg));
                        wirePtr->sendBinary(cfgMsg.data(), cfgMsg.size());
                        SPDLOG_INFO("Session '{}': sent SessionConfig (sensors=0x{:x}, orientation={})",
                                    id, cfg.sensors, cfg.orientation);
                    }

                } else if (magic == wire::kSdlEventMagic && sess->ready &&
                           data.size() >= sizeof(wire::MessageHeader) + sizeof(SDL_Event)) {
                    SDL_Event ev;
                    std::memcpy(&ev, data.data() + sizeof(wire::MessageHeader), sizeof(SDL_Event));
                    if (sess->config.onEvent) sess->config.onEvent(ev);
                }
            }

            if (!sess->ready) continue;  // waiting for DeviceInfo

            // Update
            if (sess->config.onUpdate) sess->config.onUpdate(dt);

            // Set all views to this session's framebuffer
            for (bgfx::ViewId v = 0; v < 16; ++v) {
                bgfx::setViewFrameBuffer(v, sess->fb);
            }

            // Render
            if (sess->config.onRender) sess->config.onRender(sess->width, sess->height);

            // Capture blit
            sess->submitCaptureBlit();

            // Submit this session's frame
            uint32_t frameNum = bgfx::frame();

            // Read back + encode
            if (sess->readCapturedFrame(frameNum)) {
                sess->encoder->encode(sess->pixelBuf.data(), sess->width * 4);
            }
        }

        // If no sessions, still call bgfx::frame to keep the context alive
        if (sessions.empty()) {
            bgfx::frame();
        }

        // Clean up disconnected sessions
        for (auto it = sessions.begin(); it != sessions.end(); ) {
            if (it->second->wire && !it->second->wire->isOpen()) {
                SPDLOG_INFO("Session '{}': wire disconnected", it->first);
                it->second->destroy();
                it = sessions.erase(it);
            } else {
                ++it;
            }
        }
    }

    // Tear down remaining sessions
    for (auto& [id, sess] : sessions) {
        sess->destroy();
    }
}

} // namespace ge
