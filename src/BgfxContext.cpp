#include "BgfxContext.h"
#include <bgfx/bgfx.h>
#include <bgfx/platform.h>
#include <spdlog/spdlog.h>
#include <cstdlib>
#include <stdexcept>
#include <string_view>

struct BgfxContext::M {
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

    SPDLOG_INFO("Initializing bgfx...");
    if (!bgfx::init(init)) {
        throw std::runtime_error("bgfx::init failed");
    }

    SPDLOG_INFO("Renderer: {}", bgfx::getRendererName(bgfx::getRendererType()));

    // BGFX_DEBUG env: "wireframe"/"1" for wireframe, "stats" for stats overlay
    if (const char* debugEnv = std::getenv("BGFX_DEBUG")) {
        uint32_t debugFlags = 0;
        std::string_view debug = debugEnv;
        if (debug == "wireframe" || debug == "1") {
            debugFlags |= BGFX_DEBUG_WIREFRAME;
        }
        if (debug == "stats") {
            debugFlags |= BGFX_DEBUG_STATS;
        }
        if (debugFlags) {
            bgfx::setDebug(debugFlags);
        }
    }
}

BgfxContext::~BgfxContext() {
    if (m) {
        bgfx::shutdown();
    }
}

int BgfxContext::width() const { return m->width; }
int BgfxContext::height() const { return m->height; }
