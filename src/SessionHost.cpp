#define ASIO_STANDALONE
#include <asio.hpp>

#include <ge/SessionHost.h>
#include <ge/Session.h>
#include <ge/Protocol.h>
#include <spdlog/spdlog.h>

#include "DaemonSink.h"
#include "WebSocketClient.h"
#include <ge/Tweak.h>

#include <SDL3/SDL.h>

#include <atomic>
#include <chrono>
#include <csignal>
#include <cstdlib>
#include <mutex>
#include <string>
#include <thread>
#include <unordered_map>
#include <vector>

namespace {

std::atomic<bool> g_stopRequested{false};

} // namespace

namespace ge {

struct SessionHost::M {
    std::string daemonHost = "localhost";
    uint16_t daemonPort = 42069;

    // Sideband connection to ged (owned by SessionHost, shared across sessions)
    std::shared_ptr<WsConnection> sidebandConn;
    std::shared_ptr<DaemonSink> daemonSink;
    uint64_t lastTweakGen = 0;

    // Active session threads
    std::mutex threadsMu;
    std::unordered_map<std::string, std::thread> threads;  // sessionId -> thread
};

SessionHost::SessionHost()
    : m(std::make_unique<M>())
{
    // GE_DAEMON_ADDR overrides the default daemon address
    if (auto* env = std::getenv("GE_DAEMON_ADDR")) {
        std::string addr(env);
        auto colon = addr.rfind(':');
        if (colon != std::string::npos) {
            m->daemonHost = addr.substr(0, colon);
            m->daemonPort = static_cast<uint16_t>(std::stoi(addr.substr(colon + 1)));
        } else {
            m->daemonHost = addr;
        }
    }
}

SessionHost::~SessionHost() {
    // Join any remaining session threads
    std::lock_guard lock(m->threadsMu);
    for (auto& [id, t] : m->threads) {
        if (t.joinable()) t.join();
    }

    // Remove daemon log sink
    if (m->daemonSink) {
        auto& sinks = spdlog::default_logger()->sinks();
        sinks.erase(
            std::remove(sinks.begin(), sinks.end(), m->daemonSink),
            sinks.end());
        m->daemonSink.reset();
    }
}

// Parse a JSON string value for a given key. Minimal parser for
// simple sideband messages like {"type":"player_attached","session_id":"s1"}.
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
    for (size_t i = bracePos; i < json.size(); i++) {
        if (json[i] == '{') depth++;
        else if (json[i] == '}') {
            depth--;
            if (depth == 0) return json.substr(bracePos, i - bracePos + 1);
        }
    }
    return {};
}

void SessionHost::run(Factory factory) {
    // Ignore SIGPIPE — broken socket writes must return EPIPE, not kill us.
    signal(SIGPIPE, SIG_IGN);

    // Connect sideband WS to ged
    SPDLOG_INFO("SessionHost: connecting to ged at {}:{}...",
                m->daemonHost, m->daemonPort);

    for (int attempt = 1; ; ++attempt) {
        m->sidebandConn = connectWebSocket(
            m->daemonHost, m->daemonPort, "/ws/server");
        if (m->sidebandConn) break;
        if (attempt >= 10) {
            SPDLOG_ERROR("SessionHost: failed to connect to ged — is ged running?");
            return;
        }
        SPDLOG_WARN("Sideband connect failed, retrying in 500ms... (attempt {})", attempt);
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
    }

    // Send hello
    char hello[256];
    snprintf(hello, sizeof(hello),
             R"({"type":"hello","name":"%s","pid":%d,"version":%d})",
             getprogname(), getpid(), wire::kProtocolVersion);
    m->sidebandConn->sendText(std::string(hello));
    SPDLOG_INFO("Registered with ged as '{}' (pid {})", getprogname(), getpid());

    // Install daemon log sink (shared across all sessions)
    m->daemonSink = std::make_shared<DaemonSink>(m->sidebandConn);
    spdlog::default_logger()->sinks().push_back(m->daemonSink);

    // Send initial tweak state
    {
        std::string tweakMsg = R"({"type":"tweaks","data":)" + tweak::toJson() + "}";
        m->sidebandConn->sendText(tweakMsg);
        m->lastTweakGen = tweak::generation().load(std::memory_order_relaxed);
        SPDLOG_INFO("Sent initial tweak state ({} tweaks)", tweak::registry().size());
    }

    // Install SIGINT handler
    g_stopRequested.store(false);
    struct sigaction sa{};
    sa.sa_handler = [](int) { g_stopRequested.store(true, std::memory_order_relaxed); };
    sigemptyset(&sa.sa_mask);
    struct sigaction oldSa{};
    sigaction(SIGINT, &sa, &oldSa);

    // ── Sideband poll loop ──
    SPDLOG_INFO("SessionHost: entering sideband poll loop");

    int backoffMs = 100;

    while (!g_stopRequested.load(std::memory_order_relaxed)) {
        // Check sideband connection — reconnect with exponential backoff
        if (!m->sidebandConn || !m->sidebandConn->isOpen()) {
            SPDLOG_WARN("SessionHost: sideband connection lost, reconnecting in {}ms...", backoffMs);
            SDL_Delay(backoffMs);
            backoffMs = std::min(static_cast<int>(backoffMs * 1.2), 5000);

            if (g_stopRequested.load(std::memory_order_relaxed)) break;

            m->sidebandConn = connectWebSocket(
                m->daemonHost, m->daemonPort, "/ws/server");
            if (!m->sidebandConn) continue;

            // Re-register with ged
            char hello[256];
            snprintf(hello, sizeof(hello),
                     R"({"type":"hello","name":"%s","pid":%d,"version":%d})",
                     getprogname(), getpid(), wire::kProtocolVersion);
            m->sidebandConn->sendText(std::string(hello));

            // Re-attach daemon log sink to new connection
            m->daemonSink->setConnection(m->sidebandConn);

            // Re-send tweak state
            std::string tweakMsg = R"({"type":"tweaks","data":)" + tweak::toJson() + "}";
            m->sidebandConn->sendText(tweakMsg);
            m->lastTweakGen = tweak::generation().load(std::memory_order_relaxed);

            backoffMs = 100;
            SPDLOG_INFO("SessionHost: reconnected to ged");
        }

        // Poll sideband for messages
        while (m->sidebandConn && m->sidebandConn->available() > 0) {
            std::vector<char> sbData;
            if (!m->sidebandConn->recvBinary(sbData)) break;
            std::string msg(sbData.begin(), sbData.end());

            auto type = jsonStringValue(msg, "type");

            if (type == "player_attached") {
                auto sessionId = jsonStringValue(msg, "session_id");
                if (sessionId.empty()) {
                    SPDLOG_WARN("SessionHost: player_attached without session_id");
                    continue;
                }

                SPDLOG_INFO("SessionHost: player attached, session '{}'", sessionId);

                // Spawn a session thread
                auto threadFn = [this, sessionId, &factory]() {
                    ge::sessionId = sessionId;
                    SPDLOG_INFO("Session '{}': thread started", sessionId);
                    try {
                        Session session(m->daemonHost, m->daemonPort,
                                        sessionId, m->daemonSink);
                        auto config = factory(session);
                        session.run(std::move(config));
                    } catch (const std::exception& e) {
                        SPDLOG_WARN("Session '{}': {}", sessionId, e.what());
                    }
                    SPDLOG_INFO("Session '{}': thread exiting", sessionId);

                    // Clean up: mark thread as finished (detach from map)
                    std::lock_guard lock(m->threadsMu);
                    auto it = m->threads.find(sessionId);
                    if (it != m->threads.end()) {
                        it->second.detach();
                        m->threads.erase(it);
                    }
                };

                std::lock_guard lock(m->threadsMu);
                m->threads.emplace(sessionId, std::thread(std::move(threadFn)));

            } else if (type == "player_detached") {
                auto sessionId = jsonStringValue(msg, "session_id");
                SPDLOG_INFO("SessionHost: player detached, session '{}'", sessionId);
                // Session thread will exit on its own when wire WS closes.

            } else if (type == "tweak_set") {
                auto data = jsonObjectValue(msg, "data");
                if (!data.empty() && tweak::parseAndApply(data)) {
                    SPDLOG_INFO("SessionHost: tweak_set applied");
                }

            } else if (type == "tweak_reset") {
                auto data = jsonObjectValue(msg, "data");
                if (!data.empty()) {
                    tweak::parseAndReset(data);
                    SPDLOG_INFO("SessionHost: tweak_reset applied");
                }
            }
        }

        // Send updated tweak state if generation changed
        auto gen = tweak::generation().load(std::memory_order_relaxed);
        if (gen != m->lastTweakGen && m->sidebandConn && m->sidebandConn->isOpen()) {
            m->lastTweakGen = gen;
            std::string tweakMsg = R"({"type":"tweaks","data":)" + tweak::toJson() + "}";
            try { m->sidebandConn->sendText(tweakMsg); } catch (...) {}
        }

        // Join finished threads
        {
            std::lock_guard lock(m->threadsMu);
            // Nothing to do — threads detach themselves on exit
        }

        SDL_Delay(10);  // avoid busy-wait
    }

    SPDLOG_INFO("SessionHost: shutting down...");

    // Close sideband — ged will send SessionEnd to all players
    if (m->sidebandConn && m->sidebandConn->isOpen()) {
        try { m->sidebandConn->close(); } catch (...) {}
    }

    // Wait for all session threads to finish
    {
        std::lock_guard lock(m->threadsMu);
        for (auto& [id, t] : m->threads) {
            SPDLOG_INFO("Waiting for session '{}' to finish...", id);
            if (t.joinable()) t.join();
        }
        m->threads.clear();
    }

    // Restore SIGINT handler
    sigaction(SIGINT, &oldSa, nullptr);

    SPDLOG_INFO("SessionHost: shutdown complete");
}

} // namespace ge
