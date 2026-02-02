#include "Mesh.h"
#include "ModelFormat.h"
#include <istream>

Mesh::Mesh(bgfx::VertexBufferHandle vbh, bgfx::IndexBufferHandle ibh,
           uint32_t numIndices, std::string name)
    : vbh_(vbh), ibh_(ibh), numIndices_(numIndices), name_(std::move(name)) {}

Mesh::~Mesh() {
    if (bgfx::isValid(vbh_)) {
        bgfx::destroy(vbh_);
    }
    if (bgfx::isValid(ibh_)) {
        bgfx::destroy(ibh_);
    }
}

Mesh::Mesh(Mesh&& other) noexcept
    : vbh_(other.vbh_), ibh_(other.ibh_),
      numIndices_(other.numIndices_), name_(std::move(other.name_)) {
    other.vbh_ = BGFX_INVALID_HANDLE;
    other.ibh_ = BGFX_INVALID_HANDLE;
    other.numIndices_ = 0;
}

Mesh& Mesh::operator=(Mesh&& other) noexcept {
    if (this != &other) {
        if (bgfx::isValid(vbh_)) {
            bgfx::destroy(vbh_);
        }
        if (bgfx::isValid(ibh_)) {
            bgfx::destroy(ibh_);
        }
        vbh_ = other.vbh_;
        ibh_ = other.ibh_;
        numIndices_ = other.numIndices_;
        name_ = std::move(other.name_);
        other.vbh_ = BGFX_INVALID_HANDLE;
        other.ibh_ = BGFX_INVALID_HANDLE;
        other.numIndices_ = 0;
    }
    return *this;
}

Mesh Mesh::fromStream(std::istream& in, const std::string& name) {
    // Vertex layout matching sq::MeshVertex (pos3f + uv2f)
    static bgfx::VertexLayout layout = []() {
        bgfx::VertexLayout l;
        l.begin()
            .add(bgfx::Attrib::Position, 3, bgfx::AttribType::Float)
            .add(bgfx::Attrib::TexCoord0, 2, bgfx::AttribType::Float)
            .end();
        return l;
    }();

    uint32_t vertexCount = 0;
    uint32_t indexCount = 0;
    in.read(reinterpret_cast<char*>(&vertexCount), sizeof(vertexCount));
    in.read(reinterpret_cast<char*>(&indexCount), sizeof(indexCount));

    size_t vertexBytes = vertexCount * sizeof(sq::MeshVertex);
    size_t indexBytes = indexCount * sizeof(uint16_t);

    const bgfx::Memory* vertexMem = bgfx::alloc(static_cast<uint32_t>(vertexBytes));
    in.read(reinterpret_cast<char*>(vertexMem->data),
            static_cast<std::streamsize>(vertexBytes));

    const bgfx::Memory* indexMem = bgfx::alloc(static_cast<uint32_t>(indexBytes));
    in.read(reinterpret_cast<char*>(indexMem->data),
            static_cast<std::streamsize>(indexBytes));

    bgfx::VertexBufferHandle vbh = bgfx::createVertexBuffer(vertexMem, layout);
    bgfx::IndexBufferHandle ibh = bgfx::createIndexBuffer(indexMem);

    if (!bgfx::isValid(vbh) || !bgfx::isValid(ibh)) {
        if (bgfx::isValid(vbh)) bgfx::destroy(vbh);
        if (bgfx::isValid(ibh)) bgfx::destroy(ibh);
        return {};
    }

    return Mesh(vbh, ibh, indexCount, name);
}
