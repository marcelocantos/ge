// Headless Session backend for testing.
// Provides pass-through viewport/scissor, no SDL window or wire transport.
// Link against this instead of SessionWire.o or SessionDirect.o for tests.

#include <ge/Session.h>
#include <ge/Audio.h>
#include <linalg.h>

namespace ge {

struct Session::M {
    GpuContext* gpu;
    Audio audio;
    M(GpuContext& g) : gpu(&g) {}
};

Session::Session(GpuContext& ctx) : m(std::make_unique<M>(ctx)) {}
Session::~Session() = default;

Audio& Session::audio() { return m->audio; }
void Session::connect() {}
GpuContext& Session::gpu() { return *m->gpu; }
int Session::width() const { return m->gpu->width(); }
int Session::height() const { return m->gpu->height(); }
int Session::pixelRatio() const { return 1; }
uint8_t Session::deviceClass() const { return 3; }
uint8_t Session::orientation() const { return 0; }
float Session::orientationAngle() const { return 0.0f; }
linalg::aliases::float4x4 Session::orientationRot() const { return linalg::identity; }

void Session::setViewport(wgpu::RenderPassEncoder& pass,
                           float x, float y, float w, float h,
                           float minDepth, float maxDepth) {
    pass.SetViewport(x, y, w, h, minDepth, maxDepth);
}

void Session::setScissorRect(wgpu::RenderPassEncoder& pass,
                              uint32_t x, uint32_t y, uint32_t w, uint32_t h) {
    pass.SetScissorRect(x, y, w, h);
}

void Session::resizeWindow(uint16_t, uint16_t) {}
void Session::setSessionFlags(uint16_t) {}
void Session::flush() {}

bool Session::run(RunConfig) { return false; }

} // namespace ge
