#include <doctest.h>
#include <sq/GpuContext.h>
#include <sq/Pipeline.h>
#include <sq/BindGroup.h>
#include <sq/CaptureTarget.h>
#include <sq/WireTransport.h>
#include <dawn/dawn_proc.h>
#include <dawn/native/DawnNative.h>
#include <SDL3/SDL.h>
#include <SDL3/SDL_metal.h>
#include <spdlog/spdlog.h>
#include <stdexcept>
#include <vector>
#include <fstream>
#include <sstream>

namespace {

class GpuTestFixture {
public:
    static constexpr int WIDTH = 64;
    static constexpr int HEIGHT = 64;

    SDL_Window* window = nullptr;
    SDL_MetalView metalView = nullptr;
    std::unique_ptr<sq::GpuContext> ctx;
    std::unique_ptr<sq::CaptureTarget> capture;

    void init() {
        if (!SDL_Init(SDL_INIT_VIDEO)) {
            throw std::runtime_error(std::string("SDL_Init failed: ") + SDL_GetError());
        }

        window = SDL_CreateWindow("Test", WIDTH, HEIGHT, SDL_WINDOW_HIDDEN | SDL_WINDOW_METAL);
        if (!window) {
            SDL_Quit();
            throw std::runtime_error(std::string("SDL_CreateWindow failed: ") + SDL_GetError());
        }

        metalView = SDL_Metal_CreateView(window);
        if (!metalView) {
            SDL_DestroyWindow(window);
            SDL_Quit();
            throw std::runtime_error(std::string("SDL_Metal_CreateView failed: ") + SDL_GetError());
        }

        void* metalLayer = SDL_Metal_GetLayer(metalView);
        ctx = std::make_unique<sq::GpuContext>(metalLayer, WIDTH, HEIGHT);
        capture = std::make_unique<sq::CaptureTarget>(ctx->device(), WIDTH, HEIGHT);

        SPDLOG_INFO("WebGPU test fixture initialized");
    }

    void shutdown() {
        capture.reset();
        ctx.reset();
        if (metalView) {
            SDL_Metal_DestroyView(metalView);
        }
        if (window) {
            SDL_DestroyWindow(window);
        }
        SDL_Quit();
    }

    void getAverageColor(const std::vector<uint8_t>& pixels, float& r, float& g, float& b) {
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

std::string loadShaderSource(const char* path) {
    std::ifstream f(path);
    if (!f) {
        throw std::runtime_error(std::string("shader not found: ") + path);
    }
    std::stringstream buf;
    buf << f.rdbuf();
    return buf.str();
}

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

} // namespace

// TODO: Dawn Metal backend async buffer mapping needs investigation
// The readPixels function hangs because device.Tick() doesn't process callbacks properly
TEST_CASE("WebGPU renders clear color correctly" * doctest::skip(true)) {
    GpuTestFixture fix;
    REQUIRE_NOTHROW(fix.init());

    wgpu::Device device = fix.ctx->device();
    wgpu::Queue queue = fix.ctx->queue();

    // Create command encoder and render pass with red clear color
    wgpu::CommandEncoder encoder = device.CreateCommandEncoder();

    wgpu::RenderPassColorAttachment colorAttachment{};
    colorAttachment.view = fix.capture->colorView();
    colorAttachment.loadOp = wgpu::LoadOp::Clear;
    colorAttachment.storeOp = wgpu::StoreOp::Store;
    colorAttachment.clearValue = {1.0f, 0.0f, 0.0f, 1.0f};  // Red

    wgpu::RenderPassDescriptor passDesc{};
    passDesc.colorAttachmentCount = 1;
    passDesc.colorAttachments = &colorAttachment;

    wgpu::RenderPassEncoder pass = encoder.BeginRenderPass(&passDesc);
    pass.End();

    wgpu::CommandBuffer commands = encoder.Finish();
    queue.Submit(1, &commands);

    // Read back pixels
    std::vector<uint8_t> pixels = fix.capture->readPixels(device, queue);

    float r, g, b;
    fix.getAverageColor(pixels, r, g, b);
    SPDLOG_INFO("Clear color test: R={:.2f} G={:.2f} B={:.2f}", r, g, b);

    CHECK(r > 0.9f);
    CHECK(g < 0.1f);
    CHECK(b < 0.1f);

    fix.shutdown();
}

// TODO: Dawn Metal backend async buffer mapping needs investigation
TEST_CASE("fragment shader uniform passing" * doctest::skip(true)) {
    GpuTestFixture fix;
    REQUIRE_NOTHROW(fix.init());

    wgpu::Device device = fix.ctx->device();
    wgpu::Queue queue = fix.ctx->queue();

    // Load test shader
    std::string shaderSource = loadShaderSource("sq/shaders/test.wgsl");

    // Create pipeline
    std::vector<sq::VertexAttribute> attrs = {
        {wgpu::VertexFormat::Float32x3, 0, 0},
    };

    sq::PipelineDesc pipelineDesc{};
    pipelineDesc.wgslSource = shaderSource;
    pipelineDesc.attributes = attrs;
    pipelineDesc.vertexStride = sizeof(float) * 3;
    pipelineDesc.colorFormat = fix.capture->format();

    sq::Pipeline pipeline = sq::Pipeline::create(device, pipelineDesc);
    REQUIRE(pipeline.isValid());

    // Create uniform buffer with green color
    sq::UniformBuffer uniformBuffer = sq::UniformBuffer::create(device, 16);
    float green[4] = {0.0f, 1.0f, 0.0f, 1.0f};
    uniformBuffer.write(queue, green, 16);

    // Create bind group
    wgpu::BindGroup bindGroup = sq::BindGroupBuilder(device)
        .buffer(0, uniformBuffer)
        .build(pipeline.bindGroupLayout(0));

    // Create vertex and index buffers
    wgpu::BufferDescriptor vbDesc{};
    vbDesc.size = sizeof(s_quadVertices);
    vbDesc.usage = wgpu::BufferUsage::Vertex | wgpu::BufferUsage::CopyDst;
    wgpu::Buffer vb = device.CreateBuffer(&vbDesc);
    queue.WriteBuffer(vb, 0, s_quadVertices, sizeof(s_quadVertices));

    wgpu::BufferDescriptor ibDesc{};
    ibDesc.size = sizeof(s_quadIndices);
    ibDesc.usage = wgpu::BufferUsage::Index | wgpu::BufferUsage::CopyDst;
    wgpu::Buffer ib = device.CreateBuffer(&ibDesc);
    queue.WriteBuffer(ib, 0, s_quadIndices, sizeof(s_quadIndices));

    // Render
    wgpu::CommandEncoder encoder = device.CreateCommandEncoder();

    wgpu::RenderPassColorAttachment colorAttachment{};
    colorAttachment.view = fix.capture->colorView();
    colorAttachment.loadOp = wgpu::LoadOp::Clear;
    colorAttachment.storeOp = wgpu::StoreOp::Store;
    colorAttachment.clearValue = {0.0f, 0.0f, 0.0f, 1.0f};

    wgpu::RenderPassDescriptor passDesc{};
    passDesc.colorAttachmentCount = 1;
    passDesc.colorAttachments = &colorAttachment;

    wgpu::RenderPassEncoder pass = encoder.BeginRenderPass(&passDesc);
    pass.SetPipeline(pipeline.get());
    pass.SetBindGroup(0, bindGroup);
    pass.SetVertexBuffer(0, vb);
    pass.SetIndexBuffer(ib, wgpu::IndexFormat::Uint16);
    pass.DrawIndexed(6);
    pass.End();

    wgpu::CommandBuffer commands = encoder.Finish();
    queue.Submit(1, &commands);

    // Read back and verify
    std::vector<uint8_t> pixels = fix.capture->readPixels(device, queue);

    float r, g, b;
    fix.getAverageColor(pixels, r, g, b);
    SPDLOG_INFO("Uniform test (green): R={:.2f} G={:.2f} B={:.2f}", r, g, b);

    CHECK_MESSAGE(g > 0.9f, "Green channel should be high if uniform passed correctly");
    CHECK_MESSAGE(r < 0.1f, "Red channel should be low");
    CHECK_MESSAGE(b < 0.1f, "Blue channel should be low");

    fix.shutdown();
}

TEST_CASE("dawnProcSetProcs with native procs") {
    // Set native Dawn procs - this is the normal desktop rendering path
    dawnProcSetProcs(&dawn::native::GetProcs());

    // Verify we can create a WebGPU instance through the proc table
    WGPUInstanceDescriptor desc{};
    WGPUInstance instance = wgpuCreateInstance(&desc);
    REQUIRE(instance != nullptr);

    wgpuInstanceRelease(instance);

    // Reset procs to null (good practice)
    dawnProcSetProcs(nullptr);

    SPDLOG_INFO("dawnProcSetProcs native test passed");
}

TEST_CASE("dawnProcSetProcs with wire procs") {
    // First set up native procs for the server side
    DawnProcTable nativeProcs = dawn::native::GetProcs();

    // Create wire transport
    sq::WireTransport transport;
    transport.initialize(nativeProcs);

    // Set wire procs globally - all wgpu* calls now go through wire
    dawnProcSetProcs(&transport.wireProcs());

    // Verify wire procs are active by checking the proc table
    CHECK(transport.wireProcs().createInstance != nullptr);

    // Reset procs to null
    dawnProcSetProcs(nullptr);

    SPDLOG_INFO("dawnProcSetProcs wire test passed");
}

TEST_CASE("dawnProcSetProcs GpuContext with native procs") {
    // Set native procs before creating GpuContext
    dawnProcSetProcs(&dawn::native::GetProcs());

    if (!SDL_Init(SDL_INIT_VIDEO)) {
        dawnProcSetProcs(nullptr);
        FAIL("SDL_Init failed");
        return;
    }

    SDL_Window* window = SDL_CreateWindow("Test", 64, 64, SDL_WINDOW_HIDDEN | SDL_WINDOW_METAL);
    REQUIRE(window != nullptr);

    SDL_MetalView metalView = SDL_Metal_CreateView(window);
    REQUIRE(metalView != nullptr);

    void* metalLayer = SDL_Metal_GetLayer(metalView);

    // GpuContext should work with native procs set
    std::unique_ptr<sq::GpuContext> ctx;
    REQUIRE_NOTHROW(ctx = std::make_unique<sq::GpuContext>(metalLayer, 64, 64));

    CHECK(ctx->device() != nullptr);
    CHECK(ctx->queue() != nullptr);

    SPDLOG_INFO("dawnProcSetProcs GpuContext test passed");

    ctx.reset();
    SDL_Metal_DestroyView(metalView);
    SDL_DestroyWindow(window);
    SDL_Quit();

    dawnProcSetProcs(nullptr);
}
