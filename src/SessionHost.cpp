// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#define ASIO_STANDALONE
#include <asio.hpp>

#include <ge/SessionHost.h>
#include <ge/StreamSession.h>
#include <ge/Protocol.h>
#include <ge/Tweak.h>
#include <SDL3/SDL.h>
#include <dawn/dawn_proc.h>
#include <dawn/native/DawnNative.h>
#include <spdlog/spdlog.h>

#include "DaemonSink.h"
#include "WebSocketClient.h"

#include <algorithm>
#include <atomic>
#include <chrono>
#include <csignal>
#include <mutex>
#include <string>
#include <thread>
#include <vector>

namespace ge {

// Thread-local session ID is declared in DaemonSink.h (inline thread_local).

static std::atomic<bool> g_stopRequested{false};

struct SessionHost::M {
    std::string daemonHost = "localhost";
    uint16_t daemonPort = 42069;
    std::shared_ptr<WsConnection> sidebandConn;
    std::shared_ptr<DaemonSink> daemonSink;
    uint64_t lastTweakGen = 0;

    // Player attachment signal from sideband thread to main thread
    std::mutex attachMu;
    std::string pendingSessionId;  // non-empty = player waiting
    bool hasPending = false;

    M() {
        // Resolve daemon address from env
        if (auto addr = std::getenv("GE_DAEMON_ADDR")) {
            std::string s(addr);
            auto colon = s.rfind(':');
            if (colon != std::string::npos) {
                daemonHost = s.substr(0, colon);
                daemonPort = static_cast<uint16_t>(std::stoi(s.substr(colon + 1)));
            }
        }
    }
};

SessionHost::SessionHost() : m(std::make_unique<M>()) {}

SessionHost::~SessionHost() {
    if (m->daemonSink) {
        auto& sinks = spdlog::default_logger()->sinks();
        sinks.erase(
            std::remove(sinks.begin(), sinks.end(), m->daemonSink),
            sinks.end());
    }
}

// Parse a JSON string value for a given key.
static std::string jsonStringValue(const std::string& json, const std::string& key) {
    std::string needle = "\"" + key + "\":\"";
    auto pos = json.find(needle);
    if (pos == std::string::npos) return {};
    pos += needle.size();
    auto end = json.find('"', pos);
    if (end == std::string::npos) return {};
    return json.substr(pos, end - pos);
}

// Extract a nested JSON object for a given key.
static std::string jsonObjectValue(const std::string& json, const std::string& key) {
    std::string needle = "\"" + key + "\"";
    auto pos = json.find(needle);
    if (pos == std::string::npos) return {};
    auto bracePos = json.find('{', pos + needle.size());
    if (bracePos == std::string::npos) return {};
    int depth = 0;
    for (size_t i = bracePos; i < json.size(); ++i) {
        if (json[i] == '{') depth++;
        else if (json[i] == '}') {
            depth--;
            if (depth == 0) return json.substr(bracePos, i - bracePos + 1);
        }
    }
    return {};
}

void SessionHost::run(StreamFactory factory) {
    signal(SIGPIPE, SIG_IGN);

    // Initialize SDL video on the main thread (required by macOS for Metal).
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SPDLOG_ERROR("SessionHost: SDL_Init failed: {}", SDL_GetError());
        return;
    }

    // Set Dawn native procs for local GPU rendering.
    dawnProcSetProcs(&dawn::native::GetProcs());

    // Pre-create a hidden Metal window on the main thread.
    SDL_Window* gpuWindow = SDL_CreateWindow(
        "ge-stream", 640, 480, SDL_WINDOW_HIDDEN | SDL_WINDOW_METAL);
    if (!gpuWindow) {
        SPDLOG_ERROR("SessionHost: SDL_CreateWindow failed: {}", SDL_GetError());
        return;
    }

    // Connect sideband to ged
    SPDLOG_INFO("SessionHost: connecting to ged at {}:{}...",
                m->daemonHost, m->daemonPort);

    for (int attempt = 1; ; ++attempt) {
        m->sidebandConn = connectWebSocket(
            m->daemonHost, m->daemonPort, "/ws/server");
        if (m->sidebandConn) break;
        if (attempt >= 10) {
            SPDLOG_ERROR("SessionHost: failed to connect to ged");
            SDL_DestroyWindow(gpuWindow);
            return;
        }
        SPDLOG_WARN("Sideband connect failed, retrying... (attempt {})", attempt);
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
    }

    // Send hello
    char hello[256];
    snprintf(hello, sizeof(hello),
             R"({"type":"hello","name":"%s","pid":%d,"version":%d})",
             getprogname(), getpid(), wire::kProtocolVersion);
    m->sidebandConn->sendText(std::string(hello));
    SPDLOG_INFO("Registered with ged as '{}' (pid {})", getprogname(), getpid());

    // Install daemon log sink
    m->daemonSink = std::make_shared<DaemonSink>(m->sidebandConn);
    spdlog::default_logger()->sinks().push_back(m->daemonSink);

    // Send initial tweak state
    {
        std::string tweakMsg = R"({"type":"tweaks","data":)" + tweak::allToJson() + "}";
        m->sidebandConn->sendText(tweakMsg);
        m->lastTweakGen = tweak::generation().load(std::memory_order_relaxed);
        SPDLOG_INFO("Sent initial tweak state ({} tweaks)", tweak::TweakBase::all().size());
    }

    // SIGINT handler
    g_stopRequested.store(false);
    struct sigaction sa{};
    sa.sa_handler = [](int) { g_stopRequested.store(true, std::memory_order_relaxed); };
    sigemptyset(&sa.sa_mask);
    struct sigaction oldSa{};
    sigaction(SIGINT, &sa, &oldSa);

    // ── Sideband poll thread (background) ──
    // Reads sideband messages, signals main thread when a player attaches.
    auto sidebandThread = std::thread([this]() {
        while (!g_stopRequested.load(std::memory_order_relaxed)) {
            if (!m->sidebandConn || !m->sidebandConn->isOpen()) {
                // Reconnect
                SDL_Delay(500);
                if (g_stopRequested.load()) break;
                m->sidebandConn = connectWebSocket(
                    m->daemonHost, m->daemonPort, "/ws/server");
                if (!m->sidebandConn) continue;

                char hello[256];
                snprintf(hello, sizeof(hello),
                         R"({"type":"hello","name":"%s","pid":%d,"version":%d})",
                         getprogname(), getpid(), wire::kProtocolVersion);
                m->sidebandConn->sendText(std::string(hello));
                m->daemonSink->setConnection(m->sidebandConn);

                std::string tweakMsg = R"({"type":"tweaks","data":)" + tweak::allToJson() + "}";
                m->sidebandConn->sendText(tweakMsg);
                m->lastTweakGen = tweak::generation().load(std::memory_order_relaxed);
                SPDLOG_INFO("SessionHost: reconnected to ged");
            }

            // Poll sideband
            while (m->sidebandConn && m->sidebandConn->available() > 0) {
                std::vector<char> sbData;
                if (!m->sidebandConn->recvBinary(sbData)) break;
                std::string msg(sbData.begin(), sbData.end());

                auto type = jsonStringValue(msg, "type");

                if (type == "player_attached") {
                    auto sid = jsonStringValue(msg, "session_id");
                    if (!sid.empty()) {
                        std::lock_guard lock(m->attachMu);
                        m->pendingSessionId = sid;
                        m->hasPending = true;
                        SPDLOG_INFO("SessionHost: player attached, session '{}'", sid);
                    }
                } else if (type == "player_detached") {
                    SPDLOG_INFO("SessionHost: player detached");
                } else if (type == "tweak_set") {
                    auto data = jsonObjectValue(msg, "data");
                    if (!data.empty()) tweak::parseAndApply(data);
                } else if (type == "tweak_reset") {
                    auto data = jsonObjectValue(msg, "data");
                    if (!data.empty()) tweak::parseAndReset(data);
                }
            }

            // Broadcast tweak changes
            auto gen = tweak::generation().load(std::memory_order_relaxed);
            if (gen != m->lastTweakGen && m->sidebandConn && m->sidebandConn->isOpen()) {
                m->lastTweakGen = gen;
                std::string tweakMsg = R"({"type":"tweaks","data":)" + tweak::allToJson() + "}";
                try { m->sidebandConn->sendText(tweakMsg); } catch (...) {}
            }

            SDL_Delay(10);  // 100Hz poll
        }
    });

    // ── Main thread: run stream sessions ──
    // Waits for player attachment, runs StreamSession on the main thread.
    // Single-player at a time (fine for dev mode).
    SPDLOG_INFO("SessionHost: ready (stream mode, main thread render)");

    while (!g_stopRequested.load(std::memory_order_relaxed)) {
        // Check for pending player
        std::string sid;
        {
            std::lock_guard lock(m->attachMu);
            if (m->hasPending) {
                sid = m->pendingSessionId;
                m->hasPending = false;
            }
        }

        if (!sid.empty()) {
            ge::sessionId = sid;
            SPDLOG_INFO("Session '{}': starting (stream, main thread)", sid);
            try {
                StreamSession session(m->daemonHost, m->daemonPort,
                                      sid, m->daemonSink, gpuWindow);
                session.connect();
                auto config = factory(session);
                session.run(std::move(config));
            } catch (const std::exception& e) {
                SPDLOG_WARN("Session '{}': {}", sid, e.what());
            }
            SPDLOG_INFO("Session '{}': ended", sid);
        }

        SDL_Delay(50);  // 20Hz check for new players
    }

    // Cleanup
    sigaction(SIGINT, &oldSa, nullptr);
    g_stopRequested.store(true);
    if (sidebandThread.joinable()) sidebandThread.join();
    SDL_DestroyWindow(gpuWindow);
}

} // namespace ge
