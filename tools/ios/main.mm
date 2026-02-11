// iOS Squz Player entry point.
// Scans a QR code on startup to discover the game server, then runs the shared Player.

#include <TargetConditionals.h>
#include "Player.h"
#include "QRScanner.h"
#include <SDL3/SDL_main.h>
#include <spdlog/spdlog.h>
#include <fstream>

int main(int argc, char* argv[]) {
    SPDLOG_INFO("Squz Player (iOS) starting...");

#if TARGET_OS_SIMULATOR
    std::string host = kDefaultHost;
    uint16_t port = kDefaultPort;
    {
        std::ifstream pf("/tmp/.sqport");
        int p = 0;
        if (pf >> p && p > 0 && p <= 65535)
            port = static_cast<uint16_t>(p);
    }
    SPDLOG_INFO("Simulator: using {}:{}", host, port);
#else
    auto scan = sq::scanQRCode();
    if (scan.host.empty()) {
        SPDLOG_ERROR("No QR code scanned, exiting");
        return 1;
    }

    std::string host = std::move(scan.host);
    uint16_t port = scan.port ? scan.port : kDefaultPort;
#endif
    int width = kDefaultWidth;
    int height = kDefaultHeight;

    SPDLOG_INFO("Target: {}:{}, dimensions: {}x{}", host, port, width, height);

    Player player(host, port, width, height);
    return player.run();
}
