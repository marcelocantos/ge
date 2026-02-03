#pragma once

#include <cstdint>
#include <iosfwd>
#include <memory>
#include <string>

class Renderer;

// Pure asset class for mesh geometry - no rendering knowledge exposed in header
class Mesh {
public:
    Mesh();
    ~Mesh();
    Mesh(Mesh&&) noexcept;
    Mesh& operator=(Mesh&&) noexcept;

    // Load a mesh from a binary stream.
    // Reads vertex_count (u32), index_count (u32), vertex data, index data.
    static Mesh fromStream(std::istream& in, const std::string& name);

    bool isValid() const;
    uint32_t numIndices() const;
    const std::string& name() const;

private:
    struct M;
    std::unique_ptr<M> m;

    Mesh(std::unique_ptr<M> impl);
    friend class Renderer;
    friend void setVertexBufferImpl(const Mesh&);
    friend void setIndexBufferImpl(const Mesh&);
};
