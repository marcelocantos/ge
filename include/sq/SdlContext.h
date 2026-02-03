#pragma once
#include <memory>

struct SDL_Window;

// RAII wrapper for SDL lifecycle (platform-specific initialization)
class SdlContext {
public:
    SdlContext(const char* windowTitle, int width, int height);
    ~SdlContext();

    SDL_Window* window() const;

    // For WebGPU/Dawn: returns CAMetalLayer* on macOS
    void* metalLayer() const;

private:
    struct M;
    std::unique_ptr<M> m;
};
