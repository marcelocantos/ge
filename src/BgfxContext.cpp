#include "BgfxContext.h"
#include <bgfx/bgfx.h>
#include <bgfx/platform.h>
#include <spdlog/spdlog.h>

struct BgfxContext::M {
    bool initialized = false;
    int width = 0;
    int height = 0;
};

BgfxContext::BgfxContext(void* nativeWindowHandle, int width, int height)
    : m(std::make_unique<M>()) {

    m->width = width;
    m->height = height;

    bgfx::renderFrame();

    bgfx::Init init;
    init.platformData.nwh = nativeWindowHandle;
    init.resolution.width = width;
    init.resolution.height = height;
    init.resolution.reset = BGFX_RESET_VSYNC | BGFX_RESET_DEPTH_CLAMP;

    spdlog::info("Initializing bgfx...");
    if (!bgfx::init(init)) {
        spdlog::error("bgfx::init failed");
        return;
    }

    spdlog::info("Renderer: {}", bgfx::getRendererName(bgfx::getRendererType()));
    m->initialized = true;
}

BgfxContext::~BgfxContext() {
    if (m && m->initialized) {
        bgfx::shutdown();
    }
}

bool BgfxContext::isValid() const { return m->initialized; }
int BgfxContext::width() const { return m->width; }
int BgfxContext::height() const { return m->height; }
