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

#include <cstring>
#include <vector>

namespace ge {

struct BgfxContext::M {
    int width, height;
    bool headless;
    SDL_Window* window = nullptr;

    bgfx::FrameBufferHandle fb = BGFX_INVALID_HANDLE;
    bgfx::TextureHandle renderTex = BGFX_INVALID_HANDLE;

    static constexpr int kNumReadback = 2;
    struct ReadbackSlot {
        bgfx::TextureHandle tex = BGFX_INVALID_HANDLE;
        std::vector<uint8_t> buf;
        uint32_t readyFrame = 0;
        bool pending = false;
    };
    ReadbackSlot readback[kNumReadback];
    int submitIdx = 0;

    ~M() {
        for (auto& slot : readback)
            if (bgfx::isValid(slot.tex)) bgfx::destroy(slot.tex);
        if (bgfx::isValid(fb)) bgfx::destroy(fb);
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
    init.type = bgfx::RendererType::Metal;
    init.resolution.width = config.width;
    init.resolution.height = config.height;

    if (config.headless) {
        id<MTLDevice> device = MTLCreateSystemDefaultDevice();
        CAMetalLayer* layer = [CAMetalLayer layer];
        layer.device = device;
        layer.pixelFormat = MTLPixelFormatBGRA8Unorm;
        layer.drawableSize = CGSizeMake(config.width, config.height);

        init.platformData.nwh = (__bridge void*)layer;
        init.resolution.reset = 0;
    } else {
        m->window = SDL_CreateWindow("Your World",
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

    if (!bgfx::init(init)) {
        SPDLOG_ERROR("bgfx::init failed");
        return;
    }

    SPDLOG_INFO("BgfxContext: {}x{} {} {}",
                config.width, config.height,
                config.headless ? "headless" : "windowed",
                bgfx::getRendererName(bgfx::getRendererType()));

    if (config.headless) {
        m->renderTex = bgfx::createTexture2D(
            config.width, config.height, false, 1,
            bgfx::TextureFormat::BGRA8,
            BGFX_TEXTURE_RT | BGFX_TEXTURE_BLIT_DST);

        bgfx::TextureHandle attachments[] = { m->renderTex };
        m->fb = bgfx::createFrameBuffer(1, attachments, false);

        size_t frameBytes = config.width * config.height * 4;
        for (auto& slot : m->readback) {
            slot.tex = bgfx::createTexture2D(
                config.width, config.height, false, 1,
                bgfx::TextureFormat::BGRA8,
                BGFX_TEXTURE_BLIT_DST | BGFX_TEXTURE_READ_BACK);
            slot.buf.resize(frameBytes);
        }

        SPDLOG_INFO("Capture: offscreen FB + double-buffered readback");
    }
}

BgfxContext::~BgfxContext() = default;

int BgfxContext::width() const { return m->width; }
int BgfxContext::height() const { return m->height; }
bool BgfxContext::shouldQuit() const { return ge::shouldQuit(); }
SDL_Window* BgfxContext::window() const { return m->window; }

bool BgfxContext::isCaptureEnabled() const {
    return m->headless && bgfx::isValid(m->fb);
}

uint16_t BgfxContext::captureFrameBuffer() const {
    return m->fb.idx;
}

void BgfxContext::submitCaptureBlit() {
    if (!isCaptureEnabled()) return;

    auto& slot = m->readback[m->submitIdx];
    if (slot.pending) return;

    bgfx::setViewFrameBuffer(255, BGFX_INVALID_HANDLE);
    bgfx::blit(255, slot.tex, 0, 0, m->renderTex);
    slot.readyFrame = bgfx::readTexture(slot.tex, slot.buf.data());
    slot.pending = true;

    m->submitIdx = (m->submitIdx + 1) % M::kNumReadback;
}

bool BgfxContext::readCapturedFrame(uint32_t currentFrame, uint8_t* dst, size_t dstSize) {
    size_t frameSize = m->width * m->height * 4;
    if (dstSize < frameSize) return false;

    for (auto& slot : m->readback) {
        if (slot.pending && currentFrame >= slot.readyFrame) {
            slot.pending = false;
            std::memcpy(dst, slot.buf.data(), frameSize);
            return true;
        }
    }
    return false;
}

} // namespace ge
