// Platform-specific receiver code for Apple (macOS / iOS).
// Creates a Metal-backed WebGPU surface via SDL3.

#include "receiver_platform.h"

#include <SDL3/SDL_metal.h>
#include <spdlog/spdlog.h>
#include <stdexcept>

namespace {
// Kept alive for the lifetime of the surface.
SDL_MetalView g_metalView = nullptr;
} // namespace

namespace platform {

SDL_WindowFlags windowFlags() {
    return SDL_WINDOW_METAL;
}

WGPUSurface createSurface(WGPUInstance instance, SDL_Window* window) {
    g_metalView = SDL_Metal_CreateView(window);
    if (!g_metalView) {
        throw std::runtime_error(std::string("SDL_Metal_CreateView failed: ") + SDL_GetError());
    }
    SPDLOG_INFO("Metal view created");

    void* metalLayer = SDL_Metal_GetLayer(g_metalView);
    WGPUSurfaceSourceMetalLayer metalSource = WGPU_SURFACE_SOURCE_METAL_LAYER_INIT;
    metalSource.layer = metalLayer;

    WGPUSurfaceDescriptor surfaceDesc{};
    surfaceDesc.nextInChain = reinterpret_cast<WGPUChainedStruct*>(&metalSource);

    return wgpuInstanceCreateSurface(instance, &surfaceDesc);
}

} // namespace platform
