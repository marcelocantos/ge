#pragma once

#include <cstdint>
#include <memory>

class Mesh;
class Texture;
class Program;

// Render state flags - same bit values as BGFX for direct passthrough
namespace RenderState {
    constexpr uint64_t WriteR      = UINT64_C(0x0000000000000001);
    constexpr uint64_t WriteG      = UINT64_C(0x0000000000000002);
    constexpr uint64_t WriteB      = UINT64_C(0x0000000000000004);
    constexpr uint64_t WriteRGB    = WriteR | WriteG | WriteB;
    constexpr uint64_t WriteA      = UINT64_C(0x0000000000000008);
    constexpr uint64_t WriteZ      = UINT64_C(0x0000004000000000);
    constexpr uint64_t DepthTest   = UINT64_C(0x0000000000000010);  // DEPTH_TEST_LESS
    constexpr uint64_t BlendAlpha  = UINT64_C(0x0000000006565000);  // SRC_ALPHA, INV_SRC_ALPHA
    constexpr uint64_t CullCW      = UINT64_C(0x0000001000000000);
    constexpr uint64_t CullCCW     = UINT64_C(0x0000002000000000);
}

// Opaque uniform handle
class Uniform {
public:
    Uniform();
    ~Uniform();
    Uniform(Uniform&&) noexcept;
    Uniform& operator=(Uniform&&) noexcept;

    static Uniform createSampler(const char* name);
    static Uniform createVec4(const char* name);

    bool isValid() const;

private:
    struct M;
    std::unique_ptr<M> m;
    Uniform(std::unique_ptr<M> impl);

    friend void setUniformImpl(const Uniform&, const void*);
    friend void setTextureImpl(uint8_t, const Uniform&, const Texture&);
};

namespace sq::render {

// View setup
void setViewClear(uint16_t viewId, uint32_t rgba, float depth = 1.0f);
void setViewRect(uint16_t viewId, uint16_t x, uint16_t y, uint16_t width, uint16_t height);
void setViewTransform(uint16_t viewId, const float* view, const float* proj);

// Uniforms
void setUniform(const Uniform& uniform, const void* value);

// Texture binding
void setTexture(uint8_t stage, const Uniform& sampler, const Texture& texture);

// Mesh binding
void setVertexBuffer(const Mesh& mesh);
void setIndexBuffer(const Mesh& mesh);

// State and submit
void setState(uint64_t state);
void submit(uint16_t viewId, const Program& program);

// Frame management
void frame();
void reset(int width, int height);

} // namespace sq::render
