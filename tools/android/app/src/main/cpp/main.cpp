// Android ge player entry point.
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

// Check debug.ge.address system property for direct connection (skips QR).
// Set via: adb shell setprop debug.ge.address "192.168.1.100:42069"
// Or just: adb shell setprop debug.ge.address "192.168.1.100" (uses default port)
// Clear:  adb shell setprop debug.ge.address ""
ge::ScanResult directAddress() {
    char value[PROP_VALUE_MAX] = {};
    __system_property_get("debug.ge.address", value);
    if (value[0] == '\0') return {};

    std::string addr(value);
    // Parse host:port
    auto colon = addr.rfind(':');
    if (colon != std::string::npos) {
        uint16_t port = static_cast<uint16_t>(std::stoi(addr.substr(colon + 1)));
        return {addr.substr(0, colon), port};
    }
    return {addr, kDefaultPort};
}
} // namespace

int main(int argc, char* argv[]) {
    auto logger = spdlog::android_logger_mt("ge", "GePlayer");
    spdlog::set_default_logger(logger);
    spdlog::set_level(spdlog::level::info);

    SPDLOG_INFO("ge player (Android) starting...");

    return playerLoop([] {
        // Priority: debug property > emulator detection > QR scan
        auto direct = directAddress();
        if (!direct.host.empty()) {
            SPDLOG_INFO("Direct connection via debug.ge.address: {}:{}", direct.host, direct.port);
            return direct;
        }
        if (isEmulator()) return ge::ScanResult{"10.0.2.2", kDefaultPort};
        return ge::scanQRCode();
    });
}
