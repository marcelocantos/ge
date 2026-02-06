// Android wire receiver entry point.
// Scans a QR code on startup to discover the game server, then runs the shared
// Receiver.

#include "Receiver.h"
#include "QRScanner.h"
#include <SDL3/SDL_main.h>
#include <spdlog/spdlog.h>

int main(int argc, char* argv[]) {
    SPDLOG_INFO("Wire Receiver (Android) starting...");

    auto scan = sq::scanQRCode();
    if (scan.host.empty()) {
        SPDLOG_ERROR("No QR code scanned, exiting");
        return 1;
    }

    std::string host = std::move(scan.host);
    uint16_t port = scan.port ? scan.port : kDefaultPort;
    int width = kDefaultWidth;
    int height = kDefaultHeight;

    SPDLOG_INFO("Target: {}:{}, dimensions: {}x{}", host, port, width, height);

    Receiver receiver(host, port, width, height);
    return receiver.run();
}
