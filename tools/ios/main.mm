// iOS ge Player entry point.
// Scans a QR code on startup to discover the game server, then runs the shared Player.

#include <TargetConditionals.h>
#include "Player.h"
#include "QRScanner.h"
#include <SDL3/SDL_main.h>
#include <spdlog/spdlog.h>
#include <fstream>

int main(int argc, char* argv[]) {
    SPDLOG_INFO("ge Player (iOS) starting...");

    return playerLoop([] {
#if TARGET_OS_SIMULATOR
        uint16_t port = kDefaultPort;
        std::ifstream pf("/tmp/.geport");
        int p = 0;
        if (pf >> p && p > 0 && p <= 65535)
            port = static_cast<uint16_t>(p);
        SPDLOG_INFO("Simulator: using localhost:{}", port);
        return ge::ScanResult{"localhost", port};
#else
        return ge::scanQRCode();
#endif
    });
}
