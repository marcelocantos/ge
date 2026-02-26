// iOS ge player entry point.
// Scans a QR code on startup to discover the game server, then runs the shared Player.

#include <TargetConditionals.h>
#include "Player.h"
#include "QRScanner.h"
#include <SDL3/SDL_main.h>
#include <spdlog/spdlog.h>

int main(int argc, char* argv[]) {
    SPDLOG_INFO("ge player (iOS) starting...");

    return playerLoop([] {
#if TARGET_OS_SIMULATOR
        SPDLOG_INFO("Simulator: using localhost:{}", kDefaultPort);
        return ge::ScanResult{"localhost", kDefaultPort};
#else
        return ge::scanQRCode();
#endif
    });
}
