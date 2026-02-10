#pragma once

#include <SDL3/SDL.h>
#include <webgpu/webgpu.h>

namespace platform {

// Returns SDL window flags for the platform's GPU backend
// (SDL_WINDOW_METAL on Apple, SDL_WINDOW_VULKAN on Android).
SDL_WindowFlags windowFlags();

// Creates a WebGPU surface from an SDL window using the platform's native API.
WGPUSurface createSurface(WGPUInstance instance, SDL_Window* window);

// Syncs the GPU layer's drawable size with the SDL window's pixel dimensions.
// On iOS, the CAMetalLayer may not auto-resize on rotation; this forces it.
// Returns the resulting drawable size.
void syncDrawableSize(SDL_Window* window, int* w, int* h);

} // namespace platform
