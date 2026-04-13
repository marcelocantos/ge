// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/SessionHost.h>
#include <ge/BgfxContext.h>
#include <ge/Signal.h>
#include <ge/Protocol.h>
#include <ge/VideoEncoder.h>
#include <ge/WebSocketClient.h>
#include <ge/FrameLog.h>

#include <bgfx/bgfx.h>
#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>

#include <cstring>

// Lightweight write buffer for building wire messages without manual offsets.
struct WireWriter {
    std::vector<uint8_t> buf;

    explicit WireWriter(size_t capacity = 0) { buf.reserve(capacity); }

    template <typename T>
    void put(const T& val) {
        auto p = reinterpret_cast<const uint8_t*>(&val);
        buf.insert(buf.end(), p, p + sizeof(T));
    }

    void append(const void* data, size_t size) {
        auto p = static_cast<const uint8_t*>(data);
        buf.insert(buf.end(), p, p + size);
    }

    const uint8_t* data() const { return buf.data(); }
    size_t size() const { return buf.size(); }
};
#include <string>
#include <unistd.h>
#include <unordered_map>
#include <vector>

namespace ge {

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

    static constexpr int kNumReadback = 3;
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

    // bgfx context — deferred until the first DeviceInfo arrives,
    // so the context is sized to an actual player's dimensions.
    std::unique_ptr<BgfxContext> bgfxCtx;

    // Active sessions
    std::unordered_map<std::string, std::unique_ptr<Session>> sessions;

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

                    // Always send SessionConfig on the wire so the player
                    // can apply orientation/sensor hints BEFORE creating
                    // its window. The player blocks on this message.
                    {
                        wire::MessageHeader cfgHdr{};
                        cfgHdr.magic = wire::kSessionConfigMagic;
                        cfgHdr.length = sizeof(wire::SessionConfig);
                        wire::SessionConfig cfg{};
                        cfg.sensors = config.sensors;
                        cfg.orientation = config.orientation;
                        std::vector<uint8_t> cfgMsg(sizeof(cfgHdr) + sizeof(cfg));
                        std::memcpy(cfgMsg.data(), &cfgHdr, sizeof(cfgHdr));
                        std::memcpy(cfgMsg.data() + sizeof(cfgHdr), &cfg, sizeof(cfg));
                        wire->sendBinary(cfgMsg.data(), cfgMsg.size());
                        SPDLOG_INFO("Session '{}': sent SessionConfig (sensors=0x{:x}, orientation={})",
                                    sessionId, cfg.sensors, cfg.orientation);
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

        // ── 2. Frame pacing: absolute timestamps, no drift ──
        uint64_t targetTime = startTime + (uint64_t)frameIndex * freq / 60;
        uint64_t now = SDL_GetPerformanceCounter();
        if (now < targetTime) {
            // Sleep for most of the wait, busy-wait the remainder.
            int64_t remaining = targetTime - now;
            int64_t sleepTicks = remaining - freq / 1000;  // wake 1ms early
            if (sleepTicks > 0) {
                SDL_Delay((uint32_t)(sleepTicks * 1000 / freq));
            }
            while (SDL_GetPerformanceCounter() < targetTime) {}
            now = SDL_GetPerformanceCounter();
        }
        frameIndex++;
        float dt = float(now - lastTime) / float(freq);
        lastTime = now;
        if (dt > 0.1f) dt = 0.1f;

        // Local SDL events (only after bgfx/SDL init)
        if (bgfxCtx) {
            SDL_Event e;
            while (SDL_PollEvent(&e)) {
                if (e.type == SDL_EVENT_QUIT) break;
            }
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
                        SPDLOG_WARN("Session '{}': invalid DeviceInfo {}x{}, skipping",
                                    id, info.width, info.height);
                        continue;
                    }

                    // Lazily init bgfx on first session.
                    if (!bgfxCtx) {
                        bgfxCtx = std::make_unique<BgfxContext>(
                            BgfxConfig{sess->width, sess->height, config.headless});
                        SPDLOG_INFO("bgfx initialized at {}x{}", sess->width, sess->height);
                    }
                    SPDLOG_INFO("Session '{}': DeviceInfo {}x{} @{}x → render at {}x{}",
                                id, info.width, info.height, info.pixelRatio,
                                sess->width, sess->height);

                    sess->initCapture();

                    auto wirePtr = sess->wire;
                    int w = sess->width, h = sess->height;
                    auto encodeSeq = std::make_shared<uint32_t>(0);
                    sess->encoder = std::make_unique<VideoEncoder>(w, h, 60,
                        [wirePtr, encodeSeq](VideoEncoder::Frame frame) {
                            if (!wirePtr || !wirePtr->isOpen()) return;
                            uint32_t seq = (*encodeSeq)++;
                            uint8_t flags = frame.isKeyframe ? 1 : 0;
                            uint32_t payloadSize = sizeof(flags) + sizeof(seq) + frame.size;
                            WireWriter w(sizeof(wire::MessageHeader) + payloadSize);
                            w.put(wire::MessageHeader{wire::kVideoStreamMagic, payloadSize});
                            w.put(flags);
                            w.put(seq);
                            w.append(frame.data, frame.size);
                            wirePtr->sendBinary(w.data(), w.size());
                        });

                    std::string dbPath = ":memory:";
                    if (config.orgName && config.appName) {
                        char* pref = SDL_GetPrefPath(config.orgName, config.appName);
                        if (pref) {
                            dbPath = std::string(pref) + "game.db";
                            SDL_free(pref);
                            SPDLOG_INFO("Session '{}': persistent DB at {}", id, dbPath);
                        }
                    }
                    Context ctx{w, h, DeviceClass::Desktop, dbPath};
                    sess->config = factory(ctx);
                    sess->ready = true;
                    SPDLOG_INFO("Session '{}': ready ({}x{})", id, w, h);

                } else if (magic == wire::kSdlEventMagic && sess->ready &&
                           data.size() >= sizeof(wire::MessageHeader) + sizeof(SDL_Event)) {
                    SDL_Event ev;
                    std::memcpy(&ev, data.data() + sizeof(wire::MessageHeader), sizeof(SDL_Event));
                    if (sess->config.onEvent) sess->config.onEvent(ev);
                }
            }

            if (!sess->ready) continue;  // waiting for DeviceInfo

            uint64_t t0 = SDL_GetPerformanceCounter();

            // Update
            if (sess->config.onUpdate) sess->config.onUpdate(dt);

            uint64_t t1 = SDL_GetPerformanceCounter();

            // Set all views to this session's framebuffer
            for (bgfx::ViewId v = 0; v < 16; ++v) {
                bgfx::setViewFrameBuffer(v, sess->fb);
            }

            // Render
            if (sess->config.onRender) sess->config.onRender(sess->width, sess->height);

            uint64_t t2 = SDL_GetPerformanceCounter();

            // Capture blit
            sess->submitCaptureBlit();

            // Submit this session's frame
            uint32_t frameNum = bgfx::frame();

            uint64_t t3 = SDL_GetPerformanceCounter();

            // Read back + encode
            if (sess->readCapturedFrame(frameNum)) {
                sess->encoder->encode(sess->pixelBuf.data(), sess->width * 4);
            }

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

        // If bgfx is up but no sessions are rendering, still call frame
        // to keep the context alive.
        if (bgfxCtx && sessions.empty()) {
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
