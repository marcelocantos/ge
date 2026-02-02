#pragma once

#include <bgfx/bgfx.h>
#include <string>

// Pure asset class for mesh geometry - no rendering knowledge
class Mesh {
public:
    Mesh() = default;
    Mesh(bgfx::VertexBufferHandle vbh, bgfx::IndexBufferHandle ibh,
         uint32_t numIndices, std::string name);
    ~Mesh();

    // Move only
    Mesh(Mesh&& other) noexcept;
    Mesh& operator=(Mesh&& other) noexcept;
    Mesh(const Mesh&) = delete;
    Mesh& operator=(const Mesh&) = delete;

    bool isValid() const { return bgfx::isValid(vbh_); }
    bgfx::VertexBufferHandle vertexBuffer() const { return vbh_; }
    bgfx::IndexBufferHandle indexBuffer() const { return ibh_; }
    uint32_t numIndices() const { return numIndices_; }
    const std::string& name() const { return name_; }

private:
    bgfx::VertexBufferHandle vbh_ = BGFX_INVALID_HANDLE;
    bgfx::IndexBufferHandle ibh_ = BGFX_INVALID_HANDLE;
    uint32_t numIndices_ = 0;
    std::string name_;
};
