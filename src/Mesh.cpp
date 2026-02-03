#include <sq/Mesh.h>
#include <sq/WgpuResource.h>
#include <sq/ModelFormat.h>
#include <spdlog/spdlog.h>
#include <istream>
#include <stdexcept>
#include <vector>
#include <cstring>

namespace sq {

struct Mesh::M {
    WgpuBuffer vertexBuffer;
    WgpuBuffer indexBuffer;
    uint32_t numVertices = 0;
    uint32_t numIndices = 0;
    std::string name;
};

Mesh::Mesh() : m(std::make_unique<M>()) {}
Mesh::~Mesh() = default;
Mesh::Mesh(Mesh&&) noexcept = default;
Mesh& Mesh::operator=(Mesh&&) noexcept = default;
Mesh::Mesh(std::unique_ptr<M> impl) : m(std::move(impl)) {}

bool Mesh::isValid() const { return m && m->vertexBuffer.isValid(); }
uint32_t Mesh::numIndices() const { return m ? m->numIndices : 0; }
uint32_t Mesh::numVertices() const { return m ? m->numVertices : 0; }

const std::string& Mesh::name() const {
    static const std::string empty;
    return m ? m->name : empty;
}

wgpu::Buffer Mesh::vertexBuffer() const {
    return m ? m->vertexBuffer.get() : nullptr;
}

wgpu::Buffer Mesh::indexBuffer() const {
    return m ? m->indexBuffer.get() : nullptr;
}

Mesh Mesh::fromStream(wgpu::Device device, std::istream& in, const std::string& name) {
    uint32_t vertexCount = 0;
    uint32_t indexCount = 0;
    in.read(reinterpret_cast<char*>(&vertexCount), sizeof(vertexCount));
    in.read(reinterpret_cast<char*>(&indexCount), sizeof(indexCount));

    size_t vertexBytes = vertexCount * sizeof(MeshVertex);
    size_t indexBytes = indexCount * sizeof(uint16_t);

    // Read vertex data
    std::vector<char> vertexData(vertexBytes);
    in.read(vertexData.data(), static_cast<std::streamsize>(vertexBytes));

    // Read index data
    std::vector<char> indexData(indexBytes);
    in.read(indexData.data(), static_cast<std::streamsize>(indexBytes));

    if (!in) {
        throw std::runtime_error("Failed to read mesh data for: " + name);
    }

    // Create vertex buffer
    wgpu::BufferDescriptor vbDesc{
        .usage = wgpu::BufferUsage::Vertex | wgpu::BufferUsage::CopyDst,
        .size = vertexBytes,
        .mappedAtCreation = true,
    };
    wgpu::Buffer vb = device.CreateBuffer(&vbDesc);
    if (!vb) {
        throw std::runtime_error("Failed to create vertex buffer for: " + name);
    }

    // Copy vertex data
    void* vbData = vb.GetMappedRange(0, vertexBytes);
    std::memcpy(vbData, vertexData.data(), vertexBytes);
    vb.Unmap();

    // Create index buffer (size must be aligned to 4 bytes for WebGPU)
    size_t alignedIndexBytes = (indexBytes + 3) & ~3u;
    wgpu::BufferDescriptor ibDesc{
        .usage = wgpu::BufferUsage::Index | wgpu::BufferUsage::CopyDst,
        .size = alignedIndexBytes,
        .mappedAtCreation = true,
    };
    wgpu::Buffer ib = device.CreateBuffer(&ibDesc);
    if (!ib) {
        throw std::runtime_error("Failed to create index buffer for: " + name);
    }

    // Copy index data
    void* ibData = ib.GetMappedRange(0, alignedIndexBytes);
    std::memcpy(ibData, indexData.data(), indexBytes);
    ib.Unmap();

    auto impl = std::make_unique<M>();
    impl->vertexBuffer = WgpuBuffer(std::move(vb));
    impl->indexBuffer = WgpuBuffer(std::move(ib));
    impl->numVertices = vertexCount;
    impl->numIndices = indexCount;
    impl->name = name;

    return Mesh(std::move(impl));
}

} // namespace sq
