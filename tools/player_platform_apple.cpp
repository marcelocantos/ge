// Platform-specific player code for Apple (macOS / iOS).
// Creates a Metal-backed WebGPU surface via SDL3.

#include "player_platform.h"

#include <SDL3/SDL_metal.h>
#include <QuartzCore/CAMetalLayer.h>
#if TARGET_OS_IPHONE
#include <UIKit/UIKit.h>
#endif
#include <spdlog/spdlog.h>
#include <stdexcept>

namespace {
// Kept alive for the lifetime of the surface.
SDL_MetalView g_metalView = nullptr;
} // namespace

namespace platform {

SDL_WindowFlags windowFlags() {
    return SDL_WINDOW_METAL | SDL_WINDOW_HIGH_PIXEL_DENSITY;
}

WGPUSurface createSurface(WGPUInstance instance, SDL_Window* window) {
    g_metalView = SDL_Metal_CreateView(window);
    if (!g_metalView) {
        throw std::runtime_error(std::string("SDL_Metal_CreateView failed: ") + SDL_GetError());
    }

#if TARGET_OS_IPHONE
    // SDL's Metal view may not auto-resize on rotation. Set flexible sizing
    // so it fills its parent view regardless of orientation.
    UIView* view = (__bridge UIView*)g_metalView;
    view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    if (view.superview) {
        view.frame = view.superview.bounds;
        [view.superview layoutIfNeeded];
    }
    SPDLOG_INFO("Metal view created: frame={}x{} superview={}x{}",
                view.frame.size.width, view.frame.size.height,
                view.superview.bounds.size.width, view.superview.bounds.size.height);
#else
    SPDLOG_INFO("Metal view created");
#endif

    void* metalLayer = SDL_Metal_GetLayer(g_metalView);
    WGPUSurfaceSourceMetalLayer metalSource = WGPU_SURFACE_SOURCE_METAL_LAYER_INIT;
    metalSource.layer = metalLayer;

    WGPUSurfaceDescriptor surfaceDesc{};
    surfaceDesc.nextInChain = reinterpret_cast<WGPUChainedStruct*>(&metalSource);

    return wgpuInstanceCreateSurface(instance, &surfaceDesc);
}

void syncDrawableSize(SDL_Window* window, int* w, int* h) {
#if TARGET_OS_IPHONE
    if (g_metalView) {
        UIView* view = (__bridge UIView*)g_metalView;
        if (view.superview) {
            view.frame = view.superview.bounds;
            [view.superview layoutIfNeeded];
        }

        CGFloat scale = view.window.screen.scale;
        CGSize bounds = view.bounds.size;
        int pw = static_cast<int>(bounds.width * scale);
        int ph = static_cast<int>(bounds.height * scale);

        CAMetalLayer* layer = (__bridge CAMetalLayer*)SDL_Metal_GetLayer(g_metalView);
        layer.drawableSize = CGSizeMake(pw, ph);

        SPDLOG_INFO("syncDrawableSize: frame={}x{} superview={}x{} scale={} pixels={}x{}",
                     view.frame.size.width, view.frame.size.height,
                     view.superview.bounds.size.width, view.superview.bounds.size.height,
                     scale, pw, ph);

        *w = pw;
        *h = ph;
        return;
    }
#endif

    int pw = 0, ph = 0;
    SDL_GetWindowSizeInPixels(window, &pw, &ph);

    if (g_metalView) {
        CAMetalLayer* layer = (__bridge CAMetalLayer*)SDL_Metal_GetLayer(g_metalView);
        layer.drawableSize = CGSizeMake(pw, ph);
    }

    *w = pw;
    *h = ph;
}

} // namespace platform
