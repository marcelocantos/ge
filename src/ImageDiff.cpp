#include "ImageDiff.h"
#include "ShaderUtil.h"
#include <vector>
#include <algorithm>
#include <cstring>

namespace imgdiff {

namespace {
    // Fullscreen quad vertices (position + UV)
    struct Vertex {
        float x, y;
        float u, v;
    };

    const Vertex kQuadVerts[] = {
        {-1.0f,  1.0f, 0.0f, 0.0f},
        { 1.0f,  1.0f, 1.0f, 0.0f},
        {-1.0f, -1.0f, 0.0f, 1.0f},
        { 1.0f, -1.0f, 1.0f, 1.0f},
    };

    const uint16_t kQuadIndices[] = {0, 2, 1, 1, 2, 3};

}

bool Comparator::init(const char* vsPath, const char* fsPath) {
    m_program = sq::loadProgram(vsPath, fsPath);

    m_texA = UniformHandle(bgfx::createUniform("s_texA", bgfx::UniformType::Sampler));
    m_texB = UniformHandle(bgfx::createUniform("s_texB", bgfx::UniformType::Sampler));

    m_layout.begin()
        .add(bgfx::Attrib::Position, 2, bgfx::AttribType::Float)
        .add(bgfx::Attrib::TexCoord0, 2, bgfx::AttribType::Float)
        .end();

    m_initialized = true;
    return true;
}

Result Comparator::compare(bgfx::TextureHandle texA, bgfx::TextureHandle texB,
                           uint16_t width, uint16_t height) {
    if (!m_initialized) return {0, 0, false};

    // Create render target
    bgfx::TextureHandle diffTex = bgfx::createTexture2D(
        width, height, true, 1,
        bgfx::TextureFormat::RGBA32F,
        BGFX_TEXTURE_RT | BGFX_SAMPLER_MIN_POINT | BGFX_SAMPLER_MAG_POINT
    );

    bgfx::FrameBufferHandle fb = bgfx::createFrameBuffer(1, &diffTex, false);
    if (!bgfx::isValid(fb)) {
        bgfx::destroy(diffTex);
        return {0, 0, false};
    }

    // Set up view for diff rendering
    const bgfx::ViewId viewId = 255;  // Use high view ID to avoid conflicts
    bgfx::setViewFrameBuffer(viewId, fb);
    bgfx::setViewRect(viewId, 0, 0, width, height);
    bgfx::setViewClear(viewId, BGFX_CLEAR_COLOR, 0x000000ff);

    // Create vertex/index buffers
    bgfx::TransientVertexBuffer tvb;
    bgfx::TransientIndexBuffer tib;
    bgfx::allocTransientVertexBuffer(&tvb, 4, m_layout);
    bgfx::allocTransientIndexBuffer(&tib, 6);
    std::memcpy(tvb.data, kQuadVerts, sizeof(kQuadVerts));
    std::memcpy(tib.data, kQuadIndices, sizeof(kQuadIndices));

    // Render diff
    bgfx::setVertexBuffer(0, &tvb);
    bgfx::setIndexBuffer(&tib);
    bgfx::setTexture(0, m_texA, texA);
    bgfx::setTexture(1, m_texB, texB);
    bgfx::setState(BGFX_STATE_WRITE_RGB | BGFX_STATE_WRITE_A);
    bgfx::submit(viewId, m_program);

    // Render and wait
    bgfx::frame();
    bgfx::frame();

    // Read back the smallest mip level (1x1)
    // Note: bgfx doesn't directly support reading specific mip levels easily
    // For now, read full texture and compute on CPU
    // TODO: Use compute shader or readback specific mip when bgfx supports it

    std::vector<float> pixels(width * height * 4);
    bgfx::readTexture(diffTex, pixels.data());
    bgfx::frame();
    bgfx::frame();

    // Compute average (mipmap reduction on CPU for now)
    double sum = 0;
    float maxDiff = 0;
    for (size_t i = 0; i < pixels.size(); i += 4) {
        float sq = pixels[i + 3];  // Alpha channel has sum of squared RGB diffs
        sum += sq;
        maxDiff = std::max(maxDiff, std::sqrt(sq / 3.0f));  // Approx max per-channel
    }

    float rms = static_cast<float>(std::sqrt(sum / (width * height * 3)));

    bgfx::destroy(fb);
    bgfx::destroy(diffTex);

    return {rms, maxDiff, true};
}

Result Comparator::compare(const uint8_t* dataA, const uint8_t* dataB,
                           uint16_t width, uint16_t height) {
    // Upload textures
    bgfx::TextureHandle texA = bgfx::createTexture2D(
        width, height, false, 1,
        bgfx::TextureFormat::RGBA8,
        BGFX_SAMPLER_U_CLAMP | BGFX_SAMPLER_V_CLAMP,
        bgfx::copy(dataA, width * height * 4)
    );

    bgfx::TextureHandle texB = bgfx::createTexture2D(
        width, height, false, 1,
        bgfx::TextureFormat::RGBA8,
        BGFX_SAMPLER_U_CLAMP | BGFX_SAMPLER_V_CLAMP,
        bgfx::copy(dataB, width * height * 4)
    );

    Result result = compare(texA, texB, width, height);

    bgfx::destroy(texA);
    bgfx::destroy(texB);

    return result;
}

} // namespace imgdiff
