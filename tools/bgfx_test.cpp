// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Minimal bgfx spike: init Metal backend, clear to purple, render until quit.

#include <bgfx/bgfx.h>
#include <bgfx/platform.h>
#include <bx/bx.h>

#include <SDL3/SDL.h>

#include <spdlog/spdlog.h>

int main(int argc, char* argv[]) {
    (void)argc; (void)argv;

    if (!SDL_Init(SDL_INIT_VIDEO)) {
        SPDLOG_CRITICAL("SDL_Init failed: {}", SDL_GetError());
        return 1;
    }

    SDL_Window* window = SDL_CreateWindow(
        "bgfx spike", 800, 600, SDL_WINDOW_RESIZABLE);
    if (!window) {
        SPDLOG_CRITICAL("SDL_CreateWindow failed: {}", SDL_GetError());
        return 1;
    }

    // Get the native NSWindow handle for bgfx
    SDL_PropertiesID props = SDL_GetWindowProperties(window);
    void* nsWindow = SDL_GetPointerProperty(props, SDL_PROP_WINDOW_COCOA_WINDOW_POINTER, nullptr);
    if (!nsWindow) {
        SPDLOG_CRITICAL("Failed to get NSWindow from SDL");
        return 1;
    }
    SPDLOG_INFO("NSWindow handle: {}", nsWindow);

    // Single-threaded mode: call renderFrame() before init()
    bgfx::renderFrame();

    bgfx::Init init;
    init.type = bgfx::RendererType::Metal;
    init.platformData.nwh = nsWindow;
    init.resolution.width = 800;
    init.resolution.height = 600;
    init.resolution.reset = BGFX_RESET_VSYNC;

    SPDLOG_INFO("Calling bgfx::init()...");
    if (!bgfx::init(init)) {
        SPDLOG_CRITICAL("bgfx::init failed");
        return 1;
    }

    SPDLOG_INFO("bgfx initialized: renderer={}",
        bgfx::getRendererName(bgfx::getRendererType()));

    // Purple clear color: 0x6A0DADff
    bgfx::setViewClear(0, BGFX_CLEAR_COLOR | BGFX_CLEAR_DEPTH,
        0x6a0dadff, 1.0f, 0);
    bgfx::setViewRect(0, 0, 0, 800, 600);

    bool running = true;
    while (running) {
        SDL_Event event;
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_EVENT_QUIT) running = false;
            if (event.type == SDL_EVENT_KEY_DOWN &&
                event.key.key == SDLK_ESCAPE) running = false;
        }

        int w, h;
        SDL_GetWindowSizeInPixels(window, &w, &h);
        bgfx::reset(uint32_t(w), uint32_t(h), BGFX_RESET_VSYNC);
        bgfx::setViewRect(0, 0, 0, uint16_t(w), uint16_t(h));

        bgfx::touch(0);
        bgfx::frame();
    }

    bgfx::shutdown();
    SDL_DestroyWindow(window);
    SDL_Quit();

    SPDLOG_INFO("bgfx spike: clean shutdown");
    return 0;
}
