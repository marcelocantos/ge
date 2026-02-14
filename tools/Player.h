#pragma once
#include <cstdint>
#include <functional>
#include <memory>
#include <string>

namespace sq { struct ScanResult; }

constexpr int kDefaultWidth = 390;
constexpr int kDefaultHeight = 844;
constexpr char kDefaultHost[] = "localhost";
constexpr uint16_t kDefaultPort = 42069;

class Player {
public:
    Player(std::string host, uint16_t port, int width, int height,
           bool maximized = false, int maxRetries = -1);
    ~Player();
    int run();

private:
    struct M;
    std::unique_ptr<M> m;
};

// Mobile reconnect loop: calls discover() to get a server address, connects,
// and loops back to discovery on disconnect. Returns non-zero on fatal error.
int playerLoop(std::function<sq::ScanResult()> discover);
