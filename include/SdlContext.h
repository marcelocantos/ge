#pragma once
#include <memory>

struct SDL_Window;

// RAII wrapper for SDL lifecycle (platform-specific initialization)
class SdlContext {
public:
    SdlContext(const char* windowTitle, int width, int height);
    ~SdlContext();

    SDL_Window* window() const;
    void* nativeWindowHandle() const;

private:
    struct M;
    std::unique_ptr<M> m;
};
