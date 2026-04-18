// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Platform-specific bgfx init:
//   Apple (macOS, iOS)  → Metal backend via CAMetalLayer
//   Android             → Vulkan backend via SDL's ANativeWindow
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
#import <Metal/Metal.h>
#import <QuartzCore/QuartzCore.h>
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

    if (!SDL_Init(SDL_INIT_VIDEO)) {
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
            SDL_WINDOW_METAL | SDL_WINDOW_RESIZABLE);
        if (!m->window) {
            SPDLOG_ERROR("SDL_CreateWindow failed: {}", SDL_GetError());
            return;
        }

        SDL_MetalView view = SDL_Metal_CreateView(m->window);
        init.platformData.nwh = (__bridge void*)SDL_Metal_GetLayer(view);
        init.resolution.reset = BGFX_RESET_VSYNC;
    }
#elif defined(__ANDROID__)
    init.type = bgfx::RendererType::Vulkan;

    const char* title = (config.title && *config.title) ? config.title : "ge";
    m->window = SDL_CreateWindow(title,
        config.width, config.height,
        SDL_WINDOW_VULKAN | SDL_WINDOW_RESIZABLE);
    if (!m->window) {
        SPDLOG_ERROR("SDL_CreateWindow failed: {}", SDL_GetError());
        return;
    }

    SDL_PropertiesID props = SDL_GetWindowProperties(m->window);
    init.platformData.nwh = SDL_GetPointerProperty(props,
        SDL_PROP_WINDOW_ANDROID_WINDOW_POINTER, nullptr);
    init.resolution.reset = BGFX_RESET_VSYNC;
#else
#error "BgfxContext: unsupported platform"
#endif

    if (!bgfx::init(init)) {
        SPDLOG_ERROR("bgfx::init failed");
        return;
    }

    SPDLOG_INFO("BgfxContext: {}x{} {} {}",
                config.width, config.height,
                config.headless ? "headless" : "windowed",
                bgfx::getRendererName(bgfx::getRendererType()));
    // Android: also log via SDL so the message ends up in logcat.
    SDL_Log("ge: BgfxContext %dx%d %s %s",
            config.width, config.height,
            config.headless ? "headless" : "windowed",
            bgfx::getRendererName(bgfx::getRendererType()));
}

BgfxContext::~BgfxContext() = default;

int BgfxContext::width() const { return m->width; }
int BgfxContext::height() const { return m->height; }
bool BgfxContext::shouldQuit() const { return ge::shouldQuit(); }
SDL_Window* BgfxContext::window() const { return m->window; }

} // namespace ge
