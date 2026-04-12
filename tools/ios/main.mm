// iOS ge player entry point.
// Scans a QR code on startup to discover the game server, then runs the shared player core.
//
// Set GE_DAEMON_ADDR=host:port to skip QR scanning and connect directly.
// Example: xcrun devicectl device process launch -e '{"GE_DAEMON_ADDR":"192.168.1.217:42069"}' ...

#include <TargetConditionals.h>
#include "player_core.h"
#include "QRScanner.h"
#include <SDL3/SDL_main.h>
#include <spdlog/spdlog.h>
#include <spdlog/sinks/base_sink.h>
#import <os/log.h>

#include <cstdlib>
#include <string>

template<typename Mutex>
class os_log_sink : public spdlog::sinks::base_sink<Mutex> {
protected:
    void sink_it_(const spdlog::details::log_msg& msg) override {
        spdlog::memory_buf_t formatted;
        spdlog::sinks::base_sink<Mutex>::formatter_->format(msg, formatted);
        std::string log_str = fmt::to_string(formatted);
        os_log_type_t type = OS_LOG_TYPE_DEFAULT;
        switch (msg.level) {
            case spdlog::level::trace:
            case spdlog::level::debug: type = OS_LOG_TYPE_DEBUG; break;
            case spdlog::level::info:  type = OS_LOG_TYPE_INFO; break;
            case spdlog::level::warn:  type = OS_LOG_TYPE_ERROR; break;
            case spdlog::level::err:   type = OS_LOG_TYPE_FAULT; break;
            default: break;
        }
        os_log_with_type(OS_LOG_DEFAULT, type, "%{public}s", log_str.c_str());
    }
    void flush_() override {}
};

static constexpr uint16_t kDefaultPort = 42069;

int main(int argc, char* argv[]) {
    auto sink = std::make_shared<os_log_sink<std::mutex>>();
    auto logger = std::make_shared<spdlog::logger>("player", sink);
    logger->set_level(spdlog::level::info);
    spdlog::set_default_logger(logger);

    SPDLOG_INFO("ge player (iOS) starting...");

    std::string host;
    uint16_t port = kDefaultPort;

    // Fast, non-blocking overrides first.
    if (const char* addr = std::getenv("GE_DAEMON_ADDR")) {
        std::string s(addr);
        host = s;
        if (auto colon = s.rfind(':'); colon != std::string::npos) {
            host = s.substr(0, colon);
            port = static_cast<uint16_t>(std::stoi(s.substr(colon + 1)));
        }
        SPDLOG_INFO("GE_DAEMON_ADDR: {}:{}", host, port);
    }
#if TARGET_OS_SIMULATOR
    else {
        SPDLOG_INFO("Simulator: using localhost:{}", kDefaultPort);
        host = "localhost";
        port = kDefaultPort;
    }
#else
    else {
        // Blocking QR scan to discover the server.
        ge::ScanResult result = ge::scanQRCode();
        host = result.host;
        port = result.port;
    }
#endif

    return playerCore(host, port);
}
