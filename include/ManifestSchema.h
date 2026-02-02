#pragma once

// Typed C++ schema for manifest.json serialization/deserialization.
// These are pure data types with no GPU dependencies — usable by both
// the engine loader (ManifestLoader) and offline tools (precompute).
//
// ModelDef and ManifestDoc are templated on the metadata type. The engine
// uses the default (nlohmann::json) to keep metadata opaque; the application
// layer can supply a concrete struct for typed access.

#include <map>
#include <nlohmann/json.hpp>
#include <string>
#include <vector>

namespace sq {

// A mesh reference within a model: mesh name + texture key.
struct MeshRef {
    std::string name;
    std::string texture;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(MeshRef, name, texture)

// A logical model: one or more mesh parts + metadata.
template<typename Meta = nlohmann::json>
struct ModelDef {
    std::vector<MeshRef> meshes;
    Meta meta{};
};

template<typename Meta>
void to_json(nlohmann::json& j, const ModelDef<Meta>& m) {
    j["meshes"] = m.meshes;
    j["meta"] = m.meta;
}

template<typename Meta>
void from_json(const nlohmann::json& j, ModelDef<Meta>& m) {
    j.at("meshes").get_to(m.meshes);
    if (j.contains("meta")) {
        j.at("meta").get_to(m.meta);
    }
}

// Top-level manifest document.
template<typename Meta = nlohmann::json>
struct ManifestDoc {
    int version = 1;
    std::string mesh_file;
    // std::map for deterministic JSON output
    std::map<std::string, std::string> textures;
    std::map<std::string, ModelDef<Meta>> models;
};

template<typename Meta>
void to_json(nlohmann::json& j, const ManifestDoc<Meta>& d) {
    j["version"] = d.version;
    j["mesh_file"] = d.mesh_file;
    j["textures"] = d.textures;
    j["models"] = d.models;
}

template<typename Meta>
void from_json(const nlohmann::json& j, ManifestDoc<Meta>& d) {
    j.at("version").get_to(d.version);
    j.at("mesh_file").get_to(d.mesh_file);
    j.at("textures").get_to(d.textures);
    j.at("models").get_to(d.models);
}

} // namespace sq
