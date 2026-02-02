#pragma once

#include "BgfxResource.h"
#include <iosfwd>
#include <string>

// Pure asset class for mesh geometry - no rendering knowledge
class Mesh {
public:
    Mesh() = default;
    Mesh(VertexBufferHandle vbh, IndexBufferHandle ibh,
         uint32_t numIndices, std::string name);

    // Load a mesh from a binary stream.
    // Reads vertex_count (u32), index_count (u32), vertex data, index data.
    // The stream must be positioned right before vertex_count; any framing
    // (tags, application-specific metadata) should be consumed by the caller.
    static Mesh fromStream(std::istream& in, const std::string& name);

    bool isValid() const { return vbh_.isValid(); }
    bgfx::VertexBufferHandle vertexBuffer() const { return vbh_; }
    bgfx::IndexBufferHandle indexBuffer() const { return ibh_; }
    uint32_t numIndices() const { return numIndices_; }
    const std::string& name() const { return name_; }

private:
    VertexBufferHandle vbh_;
    IndexBufferHandle ibh_;
    uint32_t numIndices_ = 0;
    std::string name_;
};
