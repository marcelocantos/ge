#include <sq/Render.h>
#include "MeshInternal.h"
#include "TextureInternal.h"
#include "ProgramInternal.h"
#include <bgfx/bgfx.h>

// Verify RenderState flags match BGFX constants
static_assert(RenderState::WriteR     == BGFX_STATE_WRITE_R);
static_assert(RenderState::WriteG     == BGFX_STATE_WRITE_G);
static_assert(RenderState::WriteB     == BGFX_STATE_WRITE_B);
static_assert(RenderState::WriteRGB   == BGFX_STATE_WRITE_RGB);
static_assert(RenderState::WriteA     == BGFX_STATE_WRITE_A);
static_assert(RenderState::WriteZ     == BGFX_STATE_WRITE_Z);
static_assert(RenderState::DepthTest  == BGFX_STATE_DEPTH_TEST_LESS);
static_assert(RenderState::BlendAlpha == BGFX_STATE_BLEND_ALPHA);
static_assert(RenderState::CullCW     == BGFX_STATE_CULL_CW);
static_assert(RenderState::CullCCW    == BGFX_STATE_CULL_CCW);

// Uniform implementation
struct Uniform::M {
    UniformHandle handle;
};

Uniform::Uniform() : m(std::make_unique<M>()) {}
Uniform::~Uniform() = default;
Uniform::Uniform(Uniform&&) noexcept = default;
Uniform& Uniform::operator=(Uniform&&) noexcept = default;
Uniform::Uniform(std::unique_ptr<M> impl) : m(std::move(impl)) {}

Uniform Uniform::createSampler(const char* name) {
    auto impl = std::make_unique<M>();
    impl->handle = UniformHandle(bgfx::createUniform(name, bgfx::UniformType::Sampler));
    return Uniform(std::move(impl));
}

Uniform Uniform::createVec4(const char* name) {
    auto impl = std::make_unique<M>();
    impl->handle = UniformHandle(bgfx::createUniform(name, bgfx::UniformType::Vec4));
    return Uniform(std::move(impl));
}

bool Uniform::isValid() const {
    return m && m->handle.isValid();
}

// Friend helper functions for internal access
void setUniformImpl(const Uniform& uniform, const void* value) {
    if (uniform.m && uniform.m->handle.isValid()) {
        bgfx::setUniform(uniform.m->handle.get(), value);
    }
}

void setTextureImpl(uint8_t stage, const Uniform& sampler, const Texture& texture) {
    if (sampler.m && sampler.m->handle.isValid() && texture.m) {
        bgfx::setTexture(stage, sampler.m->handle.get(), texture.m->handle.get());
    }
}

void setVertexBufferImpl(const Mesh& mesh) {
    if (mesh.m) {
        bgfx::setVertexBuffer(0, mesh.m->vbh.get());
    }
}

void setIndexBufferImpl(const Mesh& mesh) {
    if (mesh.m) {
        bgfx::setIndexBuffer(mesh.m->ibh.get());
    }
}

void submitImpl(uint16_t viewId, const Program& program) {
    if (program.m) {
        bgfx::submit(viewId, program.m->handle.get());
    }
}

namespace sq::render {

void setViewClear(uint16_t viewId, uint32_t rgba, float depth) {
    bgfx::setViewClear(viewId, BGFX_CLEAR_COLOR, rgba, depth, 0);
}

void setViewRect(uint16_t viewId, uint16_t x, uint16_t y, uint16_t width, uint16_t height) {
    bgfx::setViewRect(viewId, x, y, width, height);
}

void setViewTransform(uint16_t viewId, const float* view, const float* proj) {
    bgfx::setViewTransform(viewId, view, proj);
}

void setUniform(const Uniform& uniform, const void* value) {
    setUniformImpl(uniform, value);
}

void setTexture(uint8_t stage, const Uniform& sampler, const Texture& texture) {
    setTextureImpl(stage, sampler, texture);
}

void setVertexBuffer(const Mesh& mesh) {
    setVertexBufferImpl(mesh);
}

void setIndexBuffer(const Mesh& mesh) {
    setIndexBufferImpl(mesh);
}

void setState(uint64_t state) {
    bgfx::setState(state);
}

void submit(uint16_t viewId, const Program& program) {
    submitImpl(viewId, program);
}

void frame() {
    bgfx::frame();
}

void reset(int width, int height) {
    bgfx::reset(width, height, BGFX_RESET_VSYNC | BGFX_RESET_DEPTH_CLAMP);
}

} // namespace sq::render
