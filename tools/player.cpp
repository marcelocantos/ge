// Desktop ge Player entry point.
// Usage: bin/player [--maximized] [host:port] [width] [height]

#include "Player.h"
#include <cstring>
#include <fstream>
#include <spdlog/spdlog.h>
#include <string>

namespace {

void parseHostPort(const char* arg, std::string& host, uint16_t& port) {
    std::string s(arg);
    auto colonPos = s.rfind(':');
    if (colonPos != std::string::npos) {
        host = s.substr(0, colonPos);
        port = static_cast<uint16_t>(std::stoi(s.substr(colonPos + 1)));
    } else {
        host = s;
    }
}

// Try reading the port from .geport (written by the server on startup).
// Checks ./.geport first (same directory as server), then /tmp/.geport
// (readable by iOS Simulator).
bool readPortFile(uint16_t& port) {
    for (auto* path : {".geport", "/tmp/.geport"}) {
        std::ifstream f(path);
        int p = 0;
        if (f >> p && p > 0 && p <= 65535) {
            port = static_cast<uint16_t>(p);
            return true;
        }
    }
    return false;
}

} // namespace

int main(int argc, char* argv[]) {
    std::string host = kDefaultHost;
    uint16_t port = kDefaultPort;
    int width = kDefaultWidth;
    int height = kDefaultHeight;
    bool maximized = false;
    bool headless = false;
    std::string profile = "default";

    // Consume flags, then positional args
    int pos = 1;
    while (pos < argc && argv[pos][0] == '-') {
        if (std::strcmp(argv[pos], "--maximized") == 0) {
            maximized = true;
        } else if (std::strcmp(argv[pos], "--headless") == 0) {
            headless = true;
        } else if (std::strcmp(argv[pos], "--profile") == 0 && pos + 1 < argc) {
            profile = argv[++pos];
        }
        pos++;
    }
    if (pos < argc) {
        parseHostPort(argv[pos++], host, port);
    } else {
        // No address given — try .geport for auto-discovery
        readPortFile(port);
    }
    if (pos < argc) width = std::stoi(argv[pos++]);
    if (pos < argc) height = std::stoi(argv[pos++]);

    SPDLOG_INFO("ge Player starting...");
    SPDLOG_INFO("Target: {}:{}, dimensions: {}x{}{}{}, profile: {}", host, port, width, height,
                maximized ? " (maximized)" : "",
                headless ? " (headless)" : "",
                profile);

    Player player(host, port, width, height, maximized, -1, headless, profile);
    return player.run();
}
