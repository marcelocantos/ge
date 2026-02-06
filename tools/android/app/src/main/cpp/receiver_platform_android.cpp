// Platform-specific receiver code for Android.
// Creates a Vulkan-backed WebGPU surface via SDL3's ANativeWindow.

#include "receiver_platform.h"

#include <SDL3/SDL_properties.h>
#include <SDL3/SDL_video.h>
#include <spdlog/spdlog.h>
#include <stdexcept>

namespace platform {

SDL_WindowFlags windowFlags() {
    return SDL_WINDOW_VULKAN;
}

WGPUSurface createSurface(WGPUInstance instance, SDL_Window* window) {
    SDL_PropertiesID props = SDL_GetWindowProperties(window);
    void* nativeWindow = SDL_GetPointerProperty(
        props, SDL_PROP_WINDOW_ANDROID_WINDOW_POINTER, nullptr);
    if (!nativeWindow) {
        throw std::runtime_error("Failed to get ANativeWindow from SDL");
    }
    SPDLOG_INFO("Got ANativeWindow for Vulkan surface");

    WGPUSurfaceSourceAndroidNativeWindow androidSource =
        WGPU_SURFACE_SOURCE_ANDROID_NATIVE_WINDOW_INIT;
    androidSource.window = nativeWindow;

    WGPUSurfaceDescriptor surfaceDesc{};
    surfaceDesc.nextInChain =
        reinterpret_cast<WGPUChainedStruct*>(&androidSource);

    return wgpuInstanceCreateSurface(instance, &surfaceDesc);
}

} // namespace platform
