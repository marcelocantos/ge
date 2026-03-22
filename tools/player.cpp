// Desktop ge player entry point.
// Usage: bin/player [options] [host:port] [width height]
//
// Options:
//   --device <name>   Use a device preset (see list below)
//   --stream          H.264 stream mode (decode video instead of Dawn wire)
//   --maximized       Start maximized
//   --headless        Hidden window (no UI)
//   --profile <name>  Player profile name
//
// Device presets (point size, not pixels):
//   ipad-air          820 x 1180  (iPad Air 5th gen)
//   ipad-pro-11       834 x 1194  (iPad Pro 11")
//   ipad-pro-13       1024 x 1366 (iPad Pro 12.9")
//   ipad-mini         744 x 1133  (iPad mini 6th gen)
//   iphone-16         393 x 852   (iPhone 16)
//   iphone-16-pro-max 440 x 956   (iPhone 16 Pro Max)
//   iphone-se         375 x 667   (iPhone SE 3rd gen)
//
// Shortcuts: ipad = ipad-air, iphone = iphone-16

#include "Player.h"
#include <cstring>
#include <spdlog/spdlog.h>
#include <string>

namespace {

struct DevicePreset {
    const char* name;
    int width;
    int height;
};

constexpr DevicePreset kDevicePresets[] = {
    // Apple
    {"ipad-air",           820,  1180},
    {"ipad-pro-11",        834,  1194},
    {"ipad-pro-13",        1024, 1366},
    {"ipad-mini",          744,  1133},
    {"iphone-16",          393,  852},
    {"iphone-16-pro-max",  440,  956},
    {"iphone-se",          375,  667},
    // Android
    {"pixel-9",            412,  915},
    {"pixel-9-pro-xl",     448,  998},
    {"pixel-tablet",       800,  1280},
    {"galaxy-s24",         360,  780},
    {"galaxy-s24-ultra",   412,  915},
    {"galaxy-tab-s9",      753,  1205},
    {"galaxy-fold",        373,  841},   // cover screen
    {"galaxy-fold-open",   884,  1104},  // inner screen
    {"pixel-fold",         380,  906},   // cover screen
    {"pixel-fold-open",    884,  1075},  // inner screen (tablet-like)
    // Shortcuts
    {"ipad",               820,  1180},
    {"iphone",             393,  852},
    {"pixel",              412,  915},
    {"galaxy",             360,  780},
};

const DevicePreset* findPreset(const char* name) {
    for (const auto& p : kDevicePresets) {
        if (std::strcmp(p.name, name) == 0) return &p;
    }
    return nullptr;
}

void printPresets() {
    SPDLOG_ERROR("Available device presets:");
    for (const auto& p : kDevicePresets) {
        if (std::strcmp(p.name, "ipad") == 0 || std::strcmp(p.name, "iphone") == 0 ||
            std::strcmp(p.name, "pixel") == 0 || std::strcmp(p.name, "galaxy") == 0)
            SPDLOG_ERROR("  {:20s} (shortcut)", p.name);
        else
            SPDLOG_ERROR("  {:20s} {} x {}", p.name, p.width, p.height);
    }
}

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
    bool headless = false;
    bool streamMode = false;
    std::string profile = "default";

    // Consume flags, then positional args
    int pos = 1;
    while (pos < argc && argv[pos][0] == '-') {
        if (std::strcmp(argv[pos], "--maximized") == 0) {
            maximized = true;
        } else if (std::strcmp(argv[pos], "--headless") == 0) {
            headless = true;
        } else if (std::strcmp(argv[pos], "--stream") == 0) {
            streamMode = true;
        } else if (std::strcmp(argv[pos], "--profile") == 0 && pos + 1 < argc) {
            profile = argv[++pos];
        } else if (std::strcmp(argv[pos], "--device") == 0 && pos + 1 < argc) {
            auto* preset = findPreset(argv[++pos]);
            if (!preset) {
                SPDLOG_ERROR("Unknown device preset: {}", argv[pos]);
                printPresets();
                return 1;
            }
            width = preset->width;
            height = preset->height;
        }
        pos++;
    }
    if (pos < argc) {
        parseHostPort(argv[pos++], host, port);
    }
    if (pos < argc) width = std::stoi(argv[pos++]);
    if (pos < argc) height = std::stoi(argv[pos++]);

    SPDLOG_INFO("ge player starting...");
    SPDLOG_INFO("Target: {}:{}, dimensions: {}x{}{}{}{}, profile: {}", host, port, width, height,
                maximized ? " (maximized)" : "",
                headless ? " (headless)" : "",
                streamMode ? " (stream)" : "",
                profile);

    Player player(host, port, width, height, maximized, -1, headless, profile, "mac",
                  0, streamMode);
    return player.run();
}
