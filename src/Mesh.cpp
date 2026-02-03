#include "MeshInternal.h"
#include <sq/ModelFormat.h>
#include <bgfx/bgfx.h>
#include <format>
#include <istream>
#include <stdexcept>

Mesh::Mesh() : m(std::make_unique<M>()) {}
Mesh::~Mesh() = default;
Mesh::Mesh(Mesh&&) noexcept = default;
Mesh& Mesh::operator=(Mesh&&) noexcept = default;

Mesh::Mesh(std::unique_ptr<M> impl) : m(std::move(impl)) {}

bool Mesh::isValid() const { return m && m->vbh.isValid(); }
uint32_t Mesh::numIndices() const { return m ? m->numIndices : 0; }
const std::string& Mesh::name() const {
    static const std::string empty;
    return m ? m->name : empty;
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

    try {
        auto impl = std::make_unique<M>();
        impl->vbh = VertexBufferHandle(bgfx::createVertexBuffer(vertexMem, layout));
        impl->ibh = IndexBufferHandle(bgfx::createIndexBuffer(indexMem));
        impl->numIndices = indexCount;
        impl->name = name;
        return Mesh(std::move(impl));
    } catch (const std::exception& e) {
        throw std::runtime_error(std::format("Failed to create mesh {}: {}", name, e.what()));
    }
}
