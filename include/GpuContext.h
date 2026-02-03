#pragma once
#include <memory>

// RAII wrapper for GPU lifecycle (platform-specific initialization)
class GpuContext {
public:
    GpuContext(void* nativeWindowHandle, int width, int height);
    ~GpuContext();

    int width() const;
    int height() const;

private:
    struct M;
    std::unique_ptr<M> m;
};
