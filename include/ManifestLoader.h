#pragma once

#include "ManifestSchema.h"
#include "Mesh.h"
#include "Texture.h"
#include <filesystem>
#include <format>
#include <fstream>
#include <memory>
#include <spdlog/spdlog.h>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <vector>

namespace sq {

namespace detail {
// Load all named meshes from a binary mesh pack into a map.
// Defined in ManifestLoader.cpp.
std::unordered_map<std::string, Mesh> loadMeshPack(const std::string& path);
} // namespace detail

template<typename Meta = nlohmann::json>
struct Manifest {
    // Textures keyed by manifest name, heap-allocated for pointer stability
    std::unordered_map<std::string, std::unique_ptr<Texture>> textures;

    // A single renderable part: one mesh + one texture
    struct Part {
        Mesh mesh;
        const Texture* texture = nullptr;
    };

    // A logical model with one or more renderable parts
    struct Entry {
        std::string name;
        std::vector<Part> parts;
        Meta metadata{};
    };
    std::vector<Entry> entries;
};

template<typename Meta = nlohmann::json>
std::unique_ptr<Manifest<Meta>> loadManifest(const std::string& path) {
    try {
        SPDLOG_INFO("Loading manifest: {}", path);

        std::ifstream f(path);
        if (!f) {
            throw std::runtime_error("file not found");
        }

        auto schema = nlohmann::json::parse(f).template get<ManifestDoc<Meta>>();
        auto baseDir = std::filesystem::path(path).parent_path();
        auto manifest = std::make_unique<Manifest<Meta>>();

        // Load textures
        for (const auto& [key, relPath] : schema.textures) {
            std::string texPath = (baseDir / relPath).string();
            manifest->textures.emplace(
                key, std::make_unique<Texture>(Texture::fromFile(texPath.c_str())));
        }

        // Load mesh pack
        std::unordered_map<std::string, Mesh> meshMap;
        if (!schema.mesh_file.empty()) {
            std::string meshPath = (baseDir / schema.mesh_file).string();
            meshMap = detail::loadMeshPack(meshPath);
        }

        // Build model entries
        for (auto& [modelName, modelDef] : schema.models) {
            typename Manifest<Meta>::Entry entry;
            entry.name = modelName;
            entry.metadata = std::move(modelDef.meta);

            for (const auto& meshRef : modelDef.meshes) {
                auto meshIt = meshMap.find(meshRef.name);
                if (meshIt == meshMap.end()) {
                    throw std::runtime_error(
                        std::format("mesh '{}' not found for model '{}'",
                                    meshRef.name, modelName));
                }

                auto texIt = manifest->textures.find(meshRef.texture);
                if (texIt == manifest->textures.end()) {
                    throw std::runtime_error(
                        std::format("texture '{}' not found for mesh '{}'",
                                    meshRef.texture, meshRef.name));
                }

                typename Manifest<Meta>::Part part;
                part.mesh = std::move(meshIt->second);
                part.texture = texIt->second.get();
                entry.parts.push_back(std::move(part));

                meshMap.erase(meshIt);
            }

            manifest->entries.push_back(std::move(entry));
        }

        if (!meshMap.empty()) {
            SPDLOG_WARN("{} meshes in pack not referenced by any model",
                        meshMap.size());
        }

        SPDLOG_INFO("Manifest loaded: {} models, {} textures",
                    manifest->entries.size(), manifest->textures.size());
        return manifest;
    } catch (const std::exception& e) {
        throw std::runtime_error(
            std::format("Failed to load manifest {}: {}", path, e.what()));
    }
}

} // namespace sq
