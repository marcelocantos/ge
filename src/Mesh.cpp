#include "Mesh.h"
#include "ModelFormat.h"
#include <format>
#include <istream>
#include <stdexcept>

Mesh::Mesh(VertexBufferHandle vbh, IndexBufferHandle ibh,
           uint32_t numIndices, std::string name)
    : vbh_(std::move(vbh)), ibh_(std::move(ibh)),
      numIndices_(numIndices), name_(std::move(name)) {}

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
        VertexBufferHandle vbh(bgfx::createVertexBuffer(vertexMem, layout));
        IndexBufferHandle ibh(bgfx::createIndexBuffer(indexMem));
        return Mesh(std::move(vbh), std::move(ibh), indexCount, name);
    } catch (const std::exception& e) {
        throw std::runtime_error(std::format("Failed to create mesh {}: {}", name, e.what()));
    }
}
