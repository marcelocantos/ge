// iOS ge player entry point.
// Scans a QR code on startup to discover the game server, then runs the shared Player.
//
// Set GE_DAEMON_ADDR=host:port to skip QR scanning and connect directly.
// Example: xcrun devicectl device process launch -e '{"GE_DAEMON_ADDR":"192.168.1.217:42069"}' ...

#include <TargetConditionals.h>
#include "Player.h"
#include "QRScanner.h"
#include <SDL3/SDL_main.h>
#include <spdlog/spdlog.h>

#include <cstdlib>
#include <string>

int main(int argc, char* argv[]) {
    SPDLOG_INFO("ge player (iOS) starting...");

    return playerLoop([] {
        // Check for explicit address (skips QR scan entirely).
        if (const char* addr = std::getenv("GE_DAEMON_ADDR")) {
            std::string s(addr);
            std::string host = s;
            uint16_t port = kDefaultPort;
            if (auto colon = s.rfind(':'); colon != std::string::npos) {
                host = s.substr(0, colon);
                port = static_cast<uint16_t>(std::stoi(s.substr(colon + 1)));
            }
            SPDLOG_INFO("GE_DAEMON_ADDR: {}:{}", host, port);
            return ge::ScanResult{host, port};
        }
#if TARGET_OS_SIMULATOR
        SPDLOG_INFO("Simulator: using localhost:{}", kDefaultPort);
        return ge::ScanResult{"localhost", kDefaultPort};
#else
        return ge::scanQRCode();
#endif
    }, "ios");
}
