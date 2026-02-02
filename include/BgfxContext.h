#pragma once
#include <memory>

// RAII wrapper for bgfx lifecycle (platform-specific initialization)
class BgfxContext {
public:
    BgfxContext(void* nativeWindowHandle, int width, int height);
    ~BgfxContext();

    bool isValid() const;
    int width() const;
    int height() const;

private:
    struct M;
    std::unique_ptr<M> m;
};
