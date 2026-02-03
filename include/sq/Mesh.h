#pragma once

#include <webgpu/webgpu_cpp.h>
#include <cstdint>
#include <iosfwd>
#include <memory>
#include <string>

namespace sq {

// Pure asset class for mesh geometry
class Mesh {
public:
    Mesh();
    ~Mesh();
    Mesh(Mesh&&) noexcept;
    Mesh& operator=(Mesh&&) noexcept;

    // Load a mesh from a binary stream (requires device for buffer creation)
    // Reads vertex_count (u32), index_count (u32), vertex data, index data.
    static Mesh fromStream(wgpu::Device device, std::istream& in, const std::string& name);

    bool isValid() const;
    uint32_t numIndices() const;
    uint32_t numVertices() const;
    const std::string& name() const;

    // WebGPU buffer accessors (for render pass binding)
    wgpu::Buffer vertexBuffer() const;
    wgpu::Buffer indexBuffer() const;

private:
    struct M;
    std::unique_ptr<M> m;

    Mesh(std::unique_ptr<M> impl);
};

} // namespace sq
