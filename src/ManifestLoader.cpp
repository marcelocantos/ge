#include <sq/ManifestLoader.h>
#include <sq/ModelFormat.h>
#include <cstring>
#include <stdexcept>

namespace sq::detail {

constexpr size_t kMeshNameSize = 32;

// Load all named meshes from a binary mesh pack into a map.
// Format: mesh_count(u32), then per mesh: name(char[32]) + fromStream data.
std::unordered_map<std::string, Mesh> loadMeshPack(wgpu::Device device, const std::string& path) {
    try {
        std::unordered_map<std::string, Mesh> meshes;

        std::ifstream f(path, std::ios::binary);
        if (!f) {
            throw std::runtime_error("file not found");
        }

        uint32_t meshCount = 0;
        f.read(reinterpret_cast<char*>(&meshCount), sizeof(meshCount));

        for (uint32_t i = 0; i < meshCount && f.good(); ++i) {
            char nameBuf[kMeshNameSize] = {};
            f.read(nameBuf, kMeshNameSize);
            std::string name(nameBuf);
            meshes.emplace(name, Mesh::fromStream(device, f, name));
        }

        SPDLOG_INFO("Loaded {} meshes from {}", meshes.size(), path);
        return meshes;
    } catch (const std::exception& e) {
        throw std::runtime_error(
            std::string("Failed to load mesh pack ") + path + ": " + e.what());
    }
}

} // namespace sq::detail
