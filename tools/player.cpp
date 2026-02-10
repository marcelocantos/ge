// Desktop Squz Player entry point.
// Usage: bin/player [--maximized] [host:port] [width] [height]

#include "Player.h"
#include <cstring>
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

} // namespace

int main(int argc, char* argv[]) {
    std::string host = kDefaultHost;
    uint16_t port = kDefaultPort;
    int width = kDefaultWidth;
    int height = kDefaultHeight;
    bool maximized = false;

    // Consume flags, then positional args
    int pos = 1;
    while (pos < argc && argv[pos][0] == '-') {
        if (std::strcmp(argv[pos], "--maximized") == 0) {
            maximized = true;
        }
        pos++;
    }
    if (pos < argc) parseHostPort(argv[pos++], host, port);
    if (pos < argc) width = std::stoi(argv[pos++]);
    if (pos < argc) height = std::stoi(argv[pos++]);

    SPDLOG_INFO("Squz Player starting...");
    SPDLOG_INFO("Target: {}:{}, dimensions: {}x{}{}", host, port, width, height,
                maximized ? " (maximized)" : "");

    Player player(host, port, width, height, maximized);
    return player.run();
}
