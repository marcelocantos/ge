// Android Squz Player entry point.
// Scans a QR code on startup to discover the game server, then runs the shared
// Player.

#include "Player.h"
#include "QRScanner.h"
#include <SDL3/SDL_main.h>
#include <spdlog/spdlog.h>
#include <sys/system_properties.h>

namespace {
bool isEmulator() {
    char value[PROP_VALUE_MAX] = {};
    __system_property_get("ro.kernel.qemu", value);
    return value[0] == '1';
}
} // namespace

int main(int argc, char* argv[]) {
    SPDLOG_INFO("Squz Player (Android) starting...");

    std::string host;
    uint16_t port = kDefaultPort;

    if (isEmulator()) {
        // 10.0.2.2 is the Android emulator's alias for the host's localhost.
        host = "10.0.2.2";
        SPDLOG_INFO("Emulator: using {}:{}", host, port);
    } else {
        auto scan = sq::scanQRCode();
        if (scan.host.empty()) {
            SPDLOG_ERROR("No QR code scanned, exiting");
            return 1;
        }
        host = std::move(scan.host);
        if (scan.port) port = scan.port;
    }
    int width = kDefaultWidth;
    int height = kDefaultHeight;

    SPDLOG_INFO("Target: {}:{}, dimensions: {}x{}", host, port, width, height);

    Player player(host, port, width, height);
    return player.run();
}
