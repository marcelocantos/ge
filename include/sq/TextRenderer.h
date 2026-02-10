#pragma once

#include <webgpu/webgpu_cpp.h>
#include <memory>

namespace sq {

class GpuContext;

// Bitmap font text renderer.
// Builds an ASCII glyph atlas (chars 32-126) from a system TrueType font at
// construction time using SDL3_ttf, then renders text as textured quads.
//
// Usage:
//   sq::TextRenderer text(ctx);
//   // Inside a render pass that already has a view-projection uniform at group(0):
//   text.drawText(pass, viewBindGroup, "Hello", 1.0f, 2.0f, 0.35f);
//   text.flush(pass);   // upload and draw the batched quads
//
// The caller is responsible for the orthographic projection in group(0).
// TextRenderer owns its pipeline and texture bind group at group(1).
class TextRenderer {
public:
    // Build font atlas and pipeline.  fontPath may be nullptr to use system
    // default (tries Helvetica, then Menlo).  ptSize controls rasterisation
    // quality (default 32).
    explicit TextRenderer(GpuContext& ctx, const char* fontPath = nullptr, float ptSize = 32.0f);
    ~TextRenderer();

    TextRenderer(TextRenderer&&) noexcept;
    TextRenderer& operator=(TextRenderer&&) noexcept;

    // Returns true if the atlas and pipeline were created successfully.
    bool isValid() const;

    // Measure the width (in world units) of a string at the given height.
    float measureText(const char* text, float height) const;

    // Queue a string for drawing.  (x, y) is the top-left corner in the
    // caller's coordinate space; height is the desired glyph height in the
    // same units.  Quads are accumulated until flush() is called.
    void drawText(wgpu::RenderPassEncoder& pass, wgpu::BindGroup viewBindGroup,
                  const char* text, float x, float y, float height);

    // Upload the accumulated quads and issue a single indexed draw call.
    // Resets the internal batch.  Does nothing if no text was queued.
    void flush(wgpu::RenderPassEncoder& pass, wgpu::BindGroup viewBindGroup);

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace sq
