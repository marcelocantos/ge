#pragma once
#include <cstdint>
#include <memory>
#include <string>

constexpr int kDefaultWidth = 390;
constexpr int kDefaultHeight = 844;
constexpr char kDefaultHost[] = "localhost";
constexpr uint16_t kDefaultPort = 42069;

class Receiver {
public:
    Receiver(std::string host, uint16_t port, int width, int height,
             bool maximized = false);
    ~Receiver();
    int run();

private:
    struct M;
    std::unique_ptr<M> m;
};
