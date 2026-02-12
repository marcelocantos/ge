// Android Squz Player entry point.
// Scans a QR code on startup to discover the game server, then runs the shared
// Player.

#include "Player.h"
#include "QRScanner.h"
#include <SDL3/SDL_main.h>
#include <spdlog/spdlog.h>
#include <spdlog/sinks/android_sink.h>
#include <sys/system_properties.h>

namespace {
bool isEmulator() {
    char value[PROP_VALUE_MAX] = {};
    __system_property_get("ro.kernel.qemu", value);
    return value[0] == '1';
}
} // namespace

int main(int argc, char* argv[]) {
    auto logger = spdlog::android_logger_mt("squz", "SquzPlayer");
    spdlog::set_default_logger(logger);
    spdlog::set_level(spdlog::level::info);

    SPDLOG_INFO("Squz Player (Android) starting...");

    for (;;) {
        std::string host;
        uint16_t port = kDefaultPort;

        if (isEmulator()) {
            host = "10.0.2.2";
            SPDLOG_INFO("Emulator: using {}:{}", host, port);
        } else {
            auto scan = sq::scanQRCode();
            if (scan.host.empty()) {
                SPDLOG_INFO("QR scan cancelled, retrying...");
                continue;
            }
            host = std::move(scan.host);
            if (scan.port) port = scan.port;
        }

        SPDLOG_INFO("Target: {}:{}", host, port);

        Player player(host, port, kDefaultWidth, kDefaultHeight, false, 0);
        int result = player.run();
        if (result != 0) return result;

        SPDLOG_INFO("Disconnected, returning to QR scan...");
    }
}
