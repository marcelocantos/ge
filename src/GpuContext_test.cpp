#include "doctest.h"
#include <sq/BgfxResource.h>

#include <bgfx/bgfx.h>
#include <bgfx/platform.h>
#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>
#include <format>
#include <fstream>
#include <stdexcept>
#include <vector>

namespace {

ProgramHandle loadTestProgram(const char* vsPath, const char* fsPath) {
    auto loadShaderMem = [](const char* path) -> const bgfx::Memory* {
        std::ifstream file(path, std::ios::binary | std::ios::ate);
        if (!file) {
            throw std::runtime_error(std::format("shader not found: {}", path));
        }
        auto size = file.tellg();
        file.seekg(0);
        const bgfx::Memory* mem = bgfx::alloc(static_cast<uint32_t>(size) + 1);
        file.read(reinterpret_cast<char*>(mem->data), size);
        mem->data[size] = '\0';
        return mem;
    };

    ShaderHandle vsh(bgfx::createShader(loadShaderMem(vsPath)));
    ShaderHandle fsh(bgfx::createShader(loadShaderMem(fsPath)));
    return ProgramHandle(bgfx::createProgram(vsh, fsh, false));
}

class GpuTestFixture {
public:
    static constexpr int WIDTH = 64;
    static constexpr int HEIGHT = 64;

    SDL_Window* window = nullptr;
    bgfx::FrameBufferHandle fb = BGFX_INVALID_HANDLE;
    bgfx::TextureHandle fbTex = BGFX_INVALID_HANDLE;
    std::vector<uint8_t> pixels;

    void init() {
        if (!SDL_Init(SDL_INIT_VIDEO)) {
            throw std::runtime_error(std::format("SDL_Init failed: {}", SDL_GetError()));
        }

        window = SDL_CreateWindow("Test", WIDTH, HEIGHT, SDL_WINDOW_HIDDEN);
        if (!window) {
            SDL_Quit();
            throw std::runtime_error(std::format("SDL_CreateWindow failed: {}", SDL_GetError()));
        }

        SDL_PropertiesID props = SDL_GetWindowProperties(window);
        void* nativeWindow = SDL_GetPointerProperty(
            props,
            SDL_PROP_WINDOW_COCOA_WINDOW_POINTER,
            nullptr
        );

        bgfx::renderFrame();

        bgfx::Init bgfxInit;
        bgfxInit.platformData.nwh = nativeWindow;
        bgfxInit.resolution.width = WIDTH;
        bgfxInit.resolution.height = HEIGHT;
        bgfxInit.resolution.reset = BGFX_RESET_VSYNC;

        if (!bgfx::init(bgfxInit)) {
            SDL_DestroyWindow(window);
            SDL_Quit();
            throw std::runtime_error("bgfx::init failed");
        }

        SPDLOG_INFO("bgfx initialized: {}", bgfx::getRendererName(bgfx::getRendererType()));

        fbTex = bgfx::createTexture2D(
            WIDTH, HEIGHT, false, 1,
            bgfx::TextureFormat::RGBA8,
            BGFX_TEXTURE_RT | BGFX_TEXTURE_BLIT_DST
        );
        fb = bgfx::createFrameBuffer(1, &fbTex, true);

        if (!bgfx::isValid(fb)) {
            bgfx::shutdown();
            SDL_DestroyWindow(window);
            SDL_Quit();
            throw std::runtime_error("failed to create framebuffer");
        }

        bgfx::setViewFrameBuffer(0, fb);
        bgfx::setViewRect(0, 0, 0, WIDTH, HEIGHT);
        bgfx::setViewClear(0, BGFX_CLEAR_COLOR | BGFX_CLEAR_DEPTH, 0x000000FF, 1.0f, 0);

        pixels.resize(WIDTH * HEIGHT * 4);
    }

    void shutdown() {
        if (bgfx::isValid(fb)) {
            bgfx::destroy(fb);
        }
        bgfx::shutdown();
        if (window) {
            SDL_DestroyWindow(window);
        }
        SDL_Quit();
    }

    void readPixels() {
        bgfx::readTexture(fbTex, pixels.data());
        bgfx::frame();
        bgfx::frame();
    }

    void getAverageColor(float& r, float& g, float& b) {
        uint64_t sumR = 0, sumG = 0, sumB = 0;
        for (int i = 0; i < WIDTH * HEIGHT; i++) {
            sumR += pixels[i * 4 + 0];
            sumG += pixels[i * 4 + 1];
            sumB += pixels[i * 4 + 2];
        }
        int count = WIDTH * HEIGHT;
        r = sumR / (float)count / 255.0f;
        g = sumG / (float)count / 255.0f;
        b = sumB / (float)count / 255.0f;
    }
};

struct PosVertex {
    float x, y, z;
};

PosVertex s_quadVertices[] = {
    {-1.0f,  1.0f, 0.0f},
    { 1.0f,  1.0f, 0.0f},
    {-1.0f, -1.0f, 0.0f},
    { 1.0f, -1.0f, 0.0f},
};

uint16_t s_quadIndices[] = {0, 2, 1, 1, 2, 3};

bgfx::VertexLayout s_posLayout;

void initVertexLayout() {
    s_posLayout.begin()
        .add(bgfx::Attrib::Position, 3, bgfx::AttribType::Float)
        .end();
}

} // namespace

TEST_CASE("bgfx renders clear color correctly") {
    GpuTestFixture fix;
    REQUIRE_NOTHROW(fix.init());

    bgfx::setViewClear(0, BGFX_CLEAR_COLOR, 0xFF0000FF, 1.0f, 0);
    bgfx::touch(0);
    bgfx::frame();
    fix.readPixels();

    float r, g, b;
    fix.getAverageColor(r, g, b);
    SPDLOG_INFO("Clear color test: R={:.2f} G={:.2f} B={:.2f}", r, g, b);

    CHECK(r > 0.9f);
    CHECK(g < 0.1f);
    CHECK(b < 0.1f);

    fix.shutdown();
}

TEST_CASE("fragment shader uniform passing") {
    GpuTestFixture fix;
    REQUIRE_NOTHROW(fix.init());

    initVertexLayout();

    auto program = loadTestProgram(
        "build/sq/shaders/test_vs.bin",
        "build/sq/shaders/test_fs.bin"
    );

    bgfx::UniformHandle u_color = bgfx::createUniform("u_color", bgfx::UniformType::Vec4);
    REQUIRE(bgfx::isValid(u_color));

    bgfx::VertexBufferHandle vbh = bgfx::createVertexBuffer(
        bgfx::makeRef(s_quadVertices, sizeof(s_quadVertices)),
        s_posLayout
    );
    bgfx::IndexBufferHandle ibh = bgfx::createIndexBuffer(
        bgfx::makeRef(s_quadIndices, sizeof(s_quadIndices))
    );

    bgfx::setViewClear(0, BGFX_CLEAR_COLOR, 0x000000FF, 1.0f, 0);

    float green[4] = {0.0f, 1.0f, 0.0f, 1.0f};
    bgfx::setUniform(u_color, green);

    bgfx::setVertexBuffer(0, vbh);
    bgfx::setIndexBuffer(ibh);
    bgfx::setState(BGFX_STATE_WRITE_RGB | BGFX_STATE_WRITE_A);
    bgfx::submit(0, program.get());
    bgfx::frame();

    fix.readPixels();

    float r, g, b;
    fix.getAverageColor(r, g, b);
    SPDLOG_INFO("Uniform test (green): R={:.2f} G={:.2f} B={:.2f}", r, g, b);

    CHECK_MESSAGE(g > 0.9f, "Green channel should be high if uniform passed correctly");
    CHECK_MESSAGE(r < 0.1f, "Red channel should be low");
    CHECK_MESSAGE(b < 0.1f, "Blue channel should be low");

    program.reset();
    bgfx::destroy(vbh);
    bgfx::destroy(ibh);
    bgfx::destroy(u_color);

    fix.shutdown();
}
