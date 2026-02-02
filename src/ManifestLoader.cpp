#include "ManifestLoader.h"
#include "ModelFormat.h"
#include <cstring>
#include <stdexcept>

namespace sq::detail {

constexpr size_t kMeshNameSize = 32;

// Load all named meshes from a binary mesh pack into a map.
// Format: mesh_count(u32), then per mesh: name(char[32]) + fromStream data.
std::unordered_map<std::string, Mesh> loadMeshPack(const std::string& path) {
    std::unordered_map<std::string, Mesh> meshes;

    std::ifstream f(path, std::ios::binary);
    if (!f) {
        throw std::runtime_error("Failed to open mesh file: " + path);
    }

    uint32_t meshCount = 0;
    f.read(reinterpret_cast<char*>(&meshCount), sizeof(meshCount));

    for (uint32_t i = 0; i < meshCount && f.good(); ++i) {
        char nameBuf[kMeshNameSize] = {};
        f.read(nameBuf, kMeshNameSize);
        std::string name(nameBuf);

        Mesh mesh = Mesh::fromStream(f, name);
        if (mesh.isValid()) {
            meshes.emplace(std::move(name), std::move(mesh));
        } else {
            SPDLOG_WARN("Invalid mesh '{}' in {}", nameBuf, path);
        }
    }

    SPDLOG_INFO("Loaded {} meshes from {}", meshes.size(), path);
    return meshes;
}

} // namespace sq::detail
