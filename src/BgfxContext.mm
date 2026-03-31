// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/BgfxContext.h>
#include <ge/Signal.h>

#include <bgfx/bgfx.h>
#include <bgfx/platform.h>
#include <SDL3/SDL.h>
#include <SDL3/SDL_metal.h>
#import <Metal/Metal.h>
#import <QuartzCore/QuartzCore.h>
#include <spdlog/spdlog.h>

namespace ge {

struct BgfxContext::M {
    int width, height;
    bool headless;
    SDL_Window* window = nullptr;
    void* nativeHandle = nullptr;  // CAMetalLayer*

    ~M() {
        bgfx::shutdown();
        if (window) {
            SDL_DestroyWindow(window);
        }
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
    init.type = bgfx::RendererType::Metal;
    init.resolution.width = config.width;
    init.resolution.height = config.height;

    if (config.headless) {
        // Bare CAMetalLayer — no window, no vsync.
        // framebufferOnly=NO enables pixel readback for H.264 capture.
        id<MTLDevice> device = MTLCreateSystemDefaultDevice();
        CAMetalLayer* layer = [CAMetalLayer layer];
        layer.device = device;
        layer.pixelFormat = MTLPixelFormatBGRA8Unorm;
        layer.framebufferOnly = NO;
        layer.drawableSize = CGSizeMake(config.width, config.height);

        m->nativeHandle = (__bridge void*)layer;
        init.platformData.nwh = m->nativeHandle;
        init.resolution.reset = 0;
    } else {
        // SDL window — vsync to match the display refresh rate.
        m->window = SDL_CreateWindow("Your World",
            config.width, config.height,
            SDL_WINDOW_METAL | SDL_WINDOW_RESIZABLE);
        if (!m->window) {
            SPDLOG_ERROR("SDL_CreateWindow failed: {}", SDL_GetError());
            return;
        }

        SDL_MetalView view = SDL_Metal_CreateView(m->window);
        m->nativeHandle = (__bridge void*)SDL_Metal_GetLayer(view);
        init.platformData.nwh = m->nativeHandle;
        init.resolution.reset = BGFX_RESET_VSYNC;
    }

    if (!bgfx::init(init)) {
        SPDLOG_ERROR("bgfx::init failed");
        return;
    }

    SPDLOG_INFO("BgfxContext: {}x{} {} {}",
                config.width, config.height,
                config.headless ? "headless" : "windowed",
                bgfx::getRendererName(bgfx::getRendererType()));
}

BgfxContext::~BgfxContext() = default;

int BgfxContext::width() const { return m->width; }
int BgfxContext::height() const { return m->height; }
SDL_Window* BgfxContext::window() const { return m->window; }
void* BgfxContext::nativeHandle() const { return m->nativeHandle; }

} // namespace ge
