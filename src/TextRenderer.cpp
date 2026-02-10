#include <sq/TextRenderer.h>
#include <sq/GpuContext.h>
#include <sq/Pipeline.h>
#include <sq/BindGroup.h>
#include <sq/WgpuResource.h>
#include <spdlog/spdlog.h>

#include <SDL3_ttf/SDL_ttf.h>

#include <cmath>
#include <cstring>
#include <string>
#include <vector>

namespace sq {

// ─── WGSL shader for textured quads with alpha blending ────────────────────

static constexpr const char* kTextShaderSource = R"(
struct Uniforms {
    viewProj: mat4x4f,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

@group(1) @binding(0) var fontSampler: sampler;
@group(1) @binding(1) var fontTex: texture_2d<f32>;

struct VsIn {
    @location(0) pos: vec2f,
    @location(1) uv: vec2f,
};

struct VsOut {
    @builtin(position) pos: vec4f,
    @location(0) uv: vec2f,
};

@vertex fn vs_main(in: VsIn) -> VsOut {
    var out: VsOut;
    out.pos = uniforms.viewProj * vec4f(in.pos, 0.0, 1.0);
    out.uv = in.uv;
    return out;
}

@fragment fn fs_main(in: VsOut) -> @location(0) vec4f {
    let c = textureSample(fontTex, fontSampler, in.uv);
    return vec4f(c.rgb, c.a);
}
)";

// ─── Vertex layout ─────────────────────────────────────────────────────────

struct TextVertex {
    float x, y;   // position in world coords
    float u, v;   // UV into atlas
};

// ─── Glyph metrics stored per ASCII character ──────────────────────────────

struct GlyphInfo {
    float u0, v0, u1, v1; // UV coordinates in the atlas
    int w, h;              // Pixel dimensions of the glyph surface
    int advance;           // Horizontal advance in pixels
    bool valid = false;
};

// ─── Internal state ────────────────────────────────────────────────────────

static constexpr int kFirstChar = 32;
static constexpr int kLastChar = 126;
static constexpr int kGlyphCount = kLastChar - kFirstChar + 1;

struct TextRenderer::M {
    GpuContext* ctx = nullptr;

    // Pipeline for textured quads
    Pipeline pipeline;
    wgpu::BindGroupLayout textureLayout;
    wgpu::BindGroup textureBindGroup;

    // Font atlas GPU resources
    wgpu::Texture atlasTexture;
    wgpu::TextureView atlasView;
    wgpu::Sampler atlasSampler;

    // Glyph table (ASCII 32-126)
    GlyphInfo glyphs[kGlyphCount];

    // Atlas dimensions
    int atlasW = 0;
    int atlasH = 0;

    // Font pixel height (used to compute world-unit scaling)
    int fontPixelHeight = 0;

    // Per-frame quad batch
    std::vector<TextVertex> vertices;
    std::vector<uint32_t> indices;

    void addQuad(float x, float y, float w, float h,
                 float u0, float v0, float u1, float v1) {
        uint32_t base = (uint32_t)vertices.size();
        vertices.push_back({x,     y,     u0, v0});
        vertices.push_back({x + w, y,     u1, v0});
        vertices.push_back({x + w, y + h, u1, v1});
        vertices.push_back({x,     y + h, u0, v1});
        indices.push_back(base);
        indices.push_back(base + 1);
        indices.push_back(base + 2);
        indices.push_back(base);
        indices.push_back(base + 2);
        indices.push_back(base + 3);
    }
};

// ─── Font path resolution ──────────────────────────────────────────────────

static TTF_Font* openSystemFont(const char* requestedPath, float ptSize) {
    if (requestedPath) {
        TTF_Font* font = TTF_OpenFont(requestedPath, ptSize);
        if (font) {
            SPDLOG_INFO("TextRenderer: Opened font {}", requestedPath);
            return font;
        }
    }
    static const char* kFontPaths[] = {
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/Menlo.ttc",
    };
    for (const char* path : kFontPaths) {
        TTF_Font* font = TTF_OpenFont(path, ptSize);
        if (font) {
            SPDLOG_INFO("TextRenderer: Opened font {}", path);
            return font;
        }
    }
    return nullptr;
}

// ─── Constructor: build font atlas ─────────────────────────────────────────

TextRenderer::TextRenderer(GpuContext& ctx, const char* fontPath, float ptSize)
    : m(std::make_unique<M>()) {
    m->ctx = &ctx;
    wgpu::Device device = ctx.device();
    wgpu::Queue queue = ctx.queue();

    // --- Initialize SDL_ttf and render glyphs to atlas ---

    if (!TTF_Init()) {
        SPDLOG_ERROR("TextRenderer: TTF_Init failed: {}", SDL_GetError());
        return;
    }

    TTF_Font* font = openSystemFont(fontPath, ptSize);
    if (!font) {
        SPDLOG_ERROR("TextRenderer: Failed to open any font");
        TTF_Quit();
        return;
    }

    m->fontPixelHeight = TTF_GetFontHeight(font);

    // First pass: render each glyph to get surfaces + metrics
    struct GlyphSurface {
        SDL_Surface* surface = nullptr;
        int advance = 0;
    };
    GlyphSurface surfaces[kGlyphCount];

    int maxHeight = 0;
    SDL_Color white = {255, 255, 255, 255};

    for (int i = 0; i < kGlyphCount; ++i) {
        char ch = (char)(kFirstChar + i);
        if (ch == ' ') {
            int adv = 0;
            TTF_GetGlyphMetrics(font, (Uint32)ch, nullptr, nullptr, nullptr, nullptr, &adv);
            surfaces[i].advance = adv;
            continue;
        }

        char buf[2] = {ch, 0};
        SDL_Surface* surf = TTF_RenderText_Blended(font, buf, 0, white);
        if (!surf) continue;

        if (surf->format != SDL_PIXELFORMAT_RGBA32) {
            SDL_Surface* converted = SDL_ConvertSurface(surf, SDL_PIXELFORMAT_RGBA32);
            SDL_DestroySurface(surf);
            surf = converted;
            if (!surf) continue;
        }

        int adv = 0;
        TTF_GetGlyphMetrics(font, (Uint32)ch, nullptr, nullptr, nullptr, nullptr, &adv);

        surfaces[i].surface = surf;
        surfaces[i].advance = adv > 0 ? adv : surf->w;
        if (surf->h > maxHeight) maxHeight = surf->h;
    }

    // Choose atlas dimensions (pack into rows, 512 wide)
    int atlasW = 512;
    {
        int rowW = 0;
        int rows = 1;
        for (int i = 0; i < kGlyphCount; ++i) {
            if (!surfaces[i].surface) continue;
            if (rowW + surfaces[i].surface->w + 1 > atlasW) {
                rows++;
                rowW = 0;
            }
            rowW += surfaces[i].surface->w + 1;
        }
        int atlasH = rows * (maxHeight + 1);
        // Round up to power of 2
        int h = 1;
        while (h < atlasH) h <<= 1;
        m->atlasW = atlasW;
        m->atlasH = h;
    }

    // Allocate RGBA pixel buffer and pack glyphs
    std::vector<uint8_t> atlasPixels(m->atlasW * m->atlasH * 4, 0);

    int cursorX = 0, cursorY = 0;
    for (int i = 0; i < kGlyphCount; ++i) {
        auto& g = m->glyphs[i];
        g.advance = surfaces[i].advance;

        if (!surfaces[i].surface) {
            g.valid = (g.advance > 0); // space is "valid" but has no quad
            g.w = 0;
            g.h = 0;
            continue;
        }

        SDL_Surface* surf = surfaces[i].surface;
        int sw = surf->w;
        int sh = surf->h;

        // Wrap to next row if needed
        if (cursorX + sw + 1 > m->atlasW) {
            cursorX = 0;
            cursorY += maxHeight + 1;
        }

        // Copy pixels into atlas
        const uint8_t* src = (const uint8_t*)surf->pixels;
        for (int row = 0; row < sh; ++row) {
            int dstOffset = ((cursorY + row) * m->atlasW + cursorX) * 4;
            int srcOffset = row * surf->pitch;
            std::memcpy(&atlasPixels[dstOffset], &src[srcOffset], sw * 4);
        }

        float invW = 1.0f / float(m->atlasW);
        float invH = 1.0f / float(m->atlasH);
        g.u0 = float(cursorX) * invW;
        g.v0 = float(cursorY) * invH;
        g.u1 = float(cursorX + sw) * invW;
        g.v1 = float(cursorY + sh) * invH;
        g.w = sw;
        g.h = sh;
        g.valid = true;

        cursorX += sw + 1;
        SDL_DestroySurface(surf);
    }

    TTF_CloseFont(font);
    TTF_Quit();

    // --- Create WebGPU texture from atlas (with mip chain for wire compatibility) ---

    // Calculate full mip chain count so the wire filter can defer large mip
    // levels without creating invalid texture views.
    uint32_t mipCount = 1;
    {
        uint32_t mw = (uint32_t)m->atlasW, mh = (uint32_t)m->atlasH;
        while (mw > 1 || mh > 1) { mw = std::max(1u, mw / 2); mh = std::max(1u, mh / 2); mipCount++; }
    }

    wgpu::TextureDescriptor texDesc{
        .usage = wgpu::TextureUsage::TextureBinding | wgpu::TextureUsage::CopyDst,
        .dimension = wgpu::TextureDimension::e2D,
        .size = {(uint32_t)m->atlasW, (uint32_t)m->atlasH, 1},
        .format = wgpu::TextureFormat::RGBA8Unorm,
        .mipLevelCount = mipCount,
        .sampleCount = 1,
    };
    m->atlasTexture = device.CreateTexture(&texDesc);

    // Upload mip level 0
    wgpu::TexelCopyTextureInfo dst{
        .texture = m->atlasTexture,
        .mipLevel = 0,
        .origin = {0, 0, 0},
        .aspect = wgpu::TextureAspect::All,
    };
    wgpu::TexelCopyBufferLayout layout{
        .offset = 0,
        .bytesPerRow = (uint32_t)(m->atlasW * 4),
        .rowsPerImage = (uint32_t)m->atlasH,
    };
    wgpu::Extent3D extent{(uint32_t)m->atlasW, (uint32_t)m->atlasH, 1};
    queue.WriteTexture(&dst, atlasPixels.data(), atlasPixels.size(), &layout, &extent);

    // Generate and upload lower mip levels (simple 2x2 box filter)
    {
        auto prev = atlasPixels;
        uint32_t pw = (uint32_t)m->atlasW, ph = (uint32_t)m->atlasH;
        for (uint32_t level = 1; level < mipCount; ++level) {
            uint32_t mw = std::max(1u, pw / 2);
            uint32_t mh = std::max(1u, ph / 2);
            std::vector<uint8_t> mip(mw * mh * 4);
            for (uint32_t y = 0; y < mh; ++y) {
                for (uint32_t x = 0; x < mw; ++x) {
                    uint32_t sx = std::min(x * 2, pw - 1);
                    uint32_t sy = std::min(y * 2, ph - 1);
                    uint32_t sx1 = std::min(sx + 1, pw - 1);
                    uint32_t sy1 = std::min(sy + 1, ph - 1);
                    for (int c = 0; c < 4; ++c) {
                        uint32_t sum = prev[(sy * pw + sx) * 4 + c]
                                     + prev[(sy * pw + sx1) * 4 + c]
                                     + prev[(sy1 * pw + sx) * 4 + c]
                                     + prev[(sy1 * pw + sx1) * 4 + c];
                        mip[(y * mw + x) * 4 + c] = (uint8_t)(sum / 4);
                    }
                }
            }
            wgpu::TexelCopyTextureInfo mipDst{
                .texture = m->atlasTexture, .mipLevel = level,
                .origin = {0, 0, 0}, .aspect = wgpu::TextureAspect::All,
            };
            wgpu::TexelCopyBufferLayout mipLayout{
                .offset = 0, .bytesPerRow = mw * 4, .rowsPerImage = mh,
            };
            wgpu::Extent3D mipExtent{mw, mh, 1};
            queue.WriteTexture(&mipDst, mip.data(), mip.size(), &mipLayout, &mipExtent);
            prev = std::move(mip);
            pw = mw;
            ph = mh;
        }
    }

    wgpu::TextureViewDescriptor viewDesc{
        .format = wgpu::TextureFormat::RGBA8Unorm,
        .dimension = wgpu::TextureViewDimension::e2D,
        .baseMipLevel = 0,
        .mipLevelCount = mipCount,
        .baseArrayLayer = 0,
        .arrayLayerCount = 1,
        .aspect = wgpu::TextureAspect::All,
    };
    m->atlasView = m->atlasTexture.CreateView(&viewDesc);

    wgpu::SamplerDescriptor samplerDesc{
        .addressModeU = wgpu::AddressMode::ClampToEdge,
        .addressModeV = wgpu::AddressMode::ClampToEdge,
        .addressModeW = wgpu::AddressMode::ClampToEdge,
        .magFilter = wgpu::FilterMode::Linear,
        .minFilter = wgpu::FilterMode::Linear,
        .mipmapFilter = wgpu::MipmapFilterMode::Linear,
        .lodMinClamp = 0.0f,
        .lodMaxClamp = static_cast<float>(mipCount),
        .maxAnisotropy = 1,
    };
    m->atlasSampler = device.CreateSampler(&samplerDesc);

    // --- Create pipeline ---

    m->textureLayout = createTextureLayout(device, 0, 1);

    wgpu::BindGroupLayout viewLayout =
        createUniformBufferLayout(device, 0, wgpu::ShaderStage::Vertex);

    PipelineDesc pipelineDesc{
        .wgslSource = kTextShaderSource,
        .attributes = {
            {wgpu::VertexFormat::Float32x2, offsetof(TextVertex, x), 0},
            {wgpu::VertexFormat::Float32x2, offsetof(TextVertex, u), 1},
        },
        .vertexStride = sizeof(TextVertex),
        .colorFormat = ctx.swapChainFormat(),
        .blendMode = BlendMode::Alpha,
        .bindGroupLayouts = {viewLayout, m->textureLayout},
    };
    m->pipeline = Pipeline::create(device, pipelineDesc);

    m->textureBindGroup = BindGroupBuilder(device)
        .sampler(0, m->atlasSampler)
        .texture(1, m->atlasView)
        .build(m->textureLayout);

    SPDLOG_INFO("TextRenderer: Atlas {}x{}, font height {} px",
                m->atlasW, m->atlasH, m->fontPixelHeight);
}

TextRenderer::~TextRenderer() = default;
TextRenderer::TextRenderer(TextRenderer&&) noexcept = default;
TextRenderer& TextRenderer::operator=(TextRenderer&&) noexcept = default;

bool TextRenderer::isValid() const {
    return m && m->pipeline.isValid() && m->fontPixelHeight > 0;
}

// ─── Measure ───────────────────────────────────────────────────────────────

float TextRenderer::measureText(const char* text, float height) const {
    if (!m || m->fontPixelHeight == 0) return 0;
    float scale = height / float(m->fontPixelHeight);
    float w = 0;
    for (const char* p = text; *p; ++p) {
        int idx = *p - kFirstChar;
        if (idx < 0 || idx >= kGlyphCount) continue;
        const auto& g = m->glyphs[idx];
        if (!g.valid) continue;
        w += float(g.advance) * scale;
    }
    return w;
}

// ─── Draw (batch) ──────────────────────────────────────────────────────────

void TextRenderer::drawText(wgpu::RenderPassEncoder& /*pass*/,
                            wgpu::BindGroup /*viewBindGroup*/,
                            const char* text, float x, float y, float height) {
    if (!isValid()) return;
    float scale = height / float(m->fontPixelHeight);
    float cx = x;
    for (const char* p = text; *p; ++p) {
        int idx = *p - kFirstChar;
        if (idx < 0 || idx >= kGlyphCount) continue;
        const auto& g = m->glyphs[idx];
        if (!g.valid) { cx += height * 0.4f; continue; }

        float qw = float(g.w) * scale;
        float qh = float(g.h) * scale;
        m->addQuad(cx, y, qw, qh, g.u0, g.v0, g.u1, g.v1);
        cx += float(g.advance) * scale;
    }
}

// ─── Flush ─────────────────────────────────────────────────────────────────

void TextRenderer::flush(wgpu::RenderPassEncoder& pass, wgpu::BindGroup viewBindGroup) {
    if (!isValid() || m->vertices.empty()) return;

    wgpu::Device device = m->ctx->device();

    wgpu::BufferDescriptor vbDesc{
        .usage = wgpu::BufferUsage::Vertex | wgpu::BufferUsage::CopyDst,
        .size = m->vertices.size() * sizeof(TextVertex),
        .mappedAtCreation = true,
    };
    wgpu::Buffer vb = device.CreateBuffer(&vbDesc);
    std::memcpy(vb.GetMappedRange(), m->vertices.data(), vbDesc.size);
    vb.Unmap();

    wgpu::BufferDescriptor ibDesc{
        .usage = wgpu::BufferUsage::Index | wgpu::BufferUsage::CopyDst,
        .size = m->indices.size() * sizeof(uint32_t),
        .mappedAtCreation = true,
    };
    wgpu::Buffer ib = device.CreateBuffer(&ibDesc);
    std::memcpy(ib.GetMappedRange(), m->indices.data(), ibDesc.size);
    ib.Unmap();

    pass.SetPipeline(m->pipeline.get());
    pass.SetBindGroup(0, viewBindGroup);
    pass.SetBindGroup(1, m->textureBindGroup);
    pass.SetVertexBuffer(0, vb);
    pass.SetIndexBuffer(ib, wgpu::IndexFormat::Uint32);
    pass.DrawIndexed((uint32_t)m->indices.size());

    m->vertices.clear();
    m->indices.clear();
}

} // namespace sq
