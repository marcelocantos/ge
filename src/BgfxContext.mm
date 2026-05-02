// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Platform-specific bgfx init:
//   Apple (macOS, iOS)  → Metal backend via CAMetalLayer
//   Android             → OpenGL ES 3.1 backend via SDL's ANativeWindow
//
// Kept in a single .mm file with #ifdef branches so the public API
// (BgfxContext) stays identical across platforms. On Android, the build
// system compiles this as plain C++ (the #import lines are inside the
// __APPLE__ branch so the Objective-C runtime isn't required).

#include <ge/BgfxContext.h>
#include <ge/Signal.h>

#include <bgfx/bgfx.h>
#include <bgfx/platform.h>
#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>

#if defined(__APPLE__)
#include <SDL3/SDL_metal.h>
#include <TargetConditionals.h>
#import <Metal/Metal.h>
#import <QuartzCore/QuartzCore.h>
#if !TARGET_OS_OSX
#import <UIKit/UIKit.h>
#endif
#endif

namespace ge {

struct BgfxContext::M {
    int width, height;
    bool headless;
    SDL_Window* window = nullptr;

    ~M() {
        bgfx::shutdown();
        if (window) SDL_DestroyWindow(window);
        SPDLOG_INFO("BgfxContext destroyed");
    }
};

BgfxContext::BgfxContext(const BgfxConfig& config)
    : m(std::make_unique<M>()) {
    m->width = config.width;
    m->height = config.height;
    m->headless = config.headless;

    ge::installSignalHandlers();

    if (!SDL_Init(SDL_INIT_VIDEO | SDL_INIT_SENSOR)) {
        SPDLOG_ERROR("SDL_Init failed: {}", SDL_GetError());
        return;
    }

    bgfx::Init init;
    init.resolution.width = config.width;
    init.resolution.height = config.height;

#if defined(__APPLE__)
    init.type = bgfx::RendererType::Metal;

    if (config.headless) {
        id<MTLDevice> device = MTLCreateSystemDefaultDevice();
        CAMetalLayer* layer = [CAMetalLayer layer];
        layer.device = device;
        layer.pixelFormat = MTLPixelFormatBGRA8Unorm;
        layer.drawableSize = CGSizeMake(config.width, config.height);

        init.platformData.nwh = (__bridge void*)layer;
        init.resolution.reset = 0;
    } else {
        const char* title = (config.title && *config.title) ? config.title : "ge";
        m->window = SDL_CreateWindow(title,
            config.width, config.height,
            SDL_WINDOW_METAL | SDL_WINDOW_RESIZABLE |
            SDL_WINDOW_HIGH_PIXEL_DENSITY);
        if (!m->window) {
            SPDLOG_ERROR("SDL_CreateWindow failed: {}", SDL_GetError());
            return;
        }

        SDL_MetalView view = SDL_Metal_CreateView(m->window);
        CAMetalLayer* metalLayer =
            (__bridge CAMetalLayer*)SDL_Metal_GetLayer(view);
        init.platformData.nwh = (__bridge void*)metalLayer;
        init.resolution.reset = BGFX_RESET_VSYNC;

        // Paint the Metal layer and every UIView/UIWindow above it opaque
        // black. During the iOS orientation-change animation the system
        // snapshots the view hierarchy and cross-fades — if any parent
        // view's backgroundColor is nil/undefined it shows as a pink
        // flash. Walk up the hierarchy setting black on everything.
#if !TARGET_OS_OSX
        CGFloat black[] = {0.f, 0.f, 0.f, 1.f};
        CGColorSpaceRef cs = CGColorSpaceCreateDeviceRGB();
        CGColorRef blackCG = CGColorCreate(cs, black);
        metalLayer.backgroundColor = blackCG;
        metalLayer.opaque = YES;
        CGColorRelease(blackCG);
        CGColorSpaceRelease(cs);
        UIView* uiView = (__bridge UIView*)view;
        for (UIView* v = uiView; v != nil; v = v.superview) {
            v.backgroundColor = [UIColor blackColor];
            v.opaque = YES;
        }
        UIWindow* uiWindow = uiView.window;
        if (uiWindow) {
            uiWindow.backgroundColor = [UIColor blackColor];
        }
#endif

        // On iOS (and macOS with Retina), the underlying surface size can
        // differ from the caller's config hint — the window is created
        // fullscreen on iOS regardless of the requested size. Pick up the
        // real pixel dimensions so bgfx and callers see the actual
        // backbuffer size.
        int actualW = 0, actualH = 0;
        if (SDL_GetWindowSizeInPixels(m->window, &actualW, &actualH)
            && actualW > 0 && actualH > 0) {
            m->width = actualW;
            m->height = actualH;
            init.resolution.width  = actualW;
            init.resolution.height = actualH;
        }
    }
#elif defined(__ANDROID__)
    // Vulkan on Android. bgfx loads libvulkan.so dynamically and creates
    // its own swap-chain from the ANativeWindow*. This avoids the EGL GLES
    // path entirely, which is necessary because the Android emulator's
    // Apple-Metal-backed EGL translator only supports GLES 3.0 — requesting
    // a 3.1 context triggers EGL_BAD_CONFIG → bgfx fatal on all AVDs running
    // on macOS Apple Silicon. SPIRV shaders (compiled with -p spirv) bypass
    // the glsl-optimizer and work cleanly with the Vulkan backend.
    init.type = bgfx::RendererType::Vulkan;

    const char* title = (config.title && *config.title) ? config.title : "ge";
    // Android: ask for a fullscreen surface. Passing non-fullscreen
    // config dimensions here would make SDL pin the underlying
    // SurfaceView buffer to those dimensions (`holder.setFixedSize`),
    // producing a small EGL surface stretched across the physical
    // screen. SDL_WINDOW_FULLSCREEN lets the ANativeWindow use the
    // native display resolution.
    m->window = SDL_CreateWindow(title,
        config.width, config.height,
        SDL_WINDOW_FULLSCREEN);
    if (!m->window) {
        SPDLOG_ERROR("SDL_CreateWindow failed: {}", SDL_GetError());
        return;
    }

    SDL_PropertiesID props = SDL_GetWindowProperties(m->window);
    init.platformData.nwh = SDL_GetPointerProperty(props,
        SDL_PROP_WINDOW_ANDROID_WINDOW_POINTER, nullptr);
    init.resolution.reset = BGFX_RESET_VSYNC;

    // Pick up the real (native) dimensions SDL gave us so bgfx and the
    // caller both see the actual backbuffer size rather than the
    // caller's config hint.
    int actualW = 0, actualH = 0;
    if (SDL_GetWindowSizeInPixels(m->window, &actualW, &actualH)
        && actualW > 0 && actualH > 0) {
        m->width = actualW;
        m->height = actualH;
        init.resolution.width  = actualW;
        init.resolution.height = actualH;
    }
#else
#error "BgfxContext: unsupported platform"
#endif

    if (!bgfx::init(init)) {
        SPDLOG_ERROR("bgfx::init failed");
        return;
    }

    // Backbuffer/swap-chain resize after init. On Android Vulkan the
    // native window size isn't fully reflected until reset() is called.
    bgfx::reset(m->width, m->height, init.resolution.reset);

    SPDLOG_INFO("BgfxContext: {}x{} {} {}",
                m->width, m->height,
                config.headless ? "headless" : "windowed",
                bgfx::getRendererName(bgfx::getRendererType()));
    // Android: also log via SDL so the message ends up in logcat.
    SDL_Log("ge: BgfxContext %dx%d %s %s",
            m->width, m->height,
            config.headless ? "headless" : "windowed",
            bgfx::getRendererName(bgfx::getRendererType()));
}

BgfxContext::~BgfxContext() = default;

int BgfxContext::width() const { return m->width; }
int BgfxContext::height() const { return m->height; }
bool BgfxContext::shouldQuit() const { return ge::shouldQuit(); }
SDL_Window* BgfxContext::window() const { return m->window; }

} // namespace ge
