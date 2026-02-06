// Desktop wire receiver entry point.
// Usage: bin/receiver [host:port] [width] [height]

#include "Receiver.h"
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

    if (argc >= 2) parseHostPort(argv[1], host, port);
    if (argc >= 3) width = std::stoi(argv[2]);
    if (argc >= 4) height = std::stoi(argv[3]);

    SPDLOG_INFO("Wire Receiver starting...");
    SPDLOG_INFO("Target: {}:{}, dimensions: {}x{}", host, port, width, height);

    Receiver receiver(host, port, width, height);
    return receiver.run();
}
