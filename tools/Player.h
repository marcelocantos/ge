#pragma once
#include <cstdint>
#include <functional>
#include <memory>
#include <string>

namespace ge { struct ScanResult; }

constexpr int kDefaultWidth = 390;
constexpr int kDefaultHeight = 844;
constexpr char kDefaultHost[] = "localhost";
constexpr uint16_t kDefaultPort = 42069;

class Player {
public:
    Player(std::string host, uint16_t port, int width, int height,
           bool maximized = false, int maxRetries = -1, bool headless = false,
           std::string profile = "default", std::string name = "",
           int connectTimeoutMs = 0, bool streamMode = false);
    ~Player();
    int run();

private:
    struct M;
    std::unique_ptr<M> m;
};

// Reconnect loop with two-phase address discovery:
//   1. checkOverride() — fast: env var, simulator, debug property. Empty = no override.
//   2. discover() — slow/blocking: QR scan.
// Between them, a stored address (from prior QR discovery) is tried with a 5s timeout.
// After QR discovery, the address is saved for next launch.
int playerLoop(std::function<ge::ScanResult()> checkOverride,
               std::function<ge::ScanResult()> discover,
               std::string name = "");
