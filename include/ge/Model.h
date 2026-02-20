#pragma once

#include <ge/Mesh.h>
#include <ge/Texture.h>
#include <string>

namespace ge {

// Associates a Mesh with a Texture for rendering
// Owns the Mesh, references shared Texture
class Model {
public:
    Model() = default;
    Model(Mesh mesh, const Texture* texture);

    bool isValid() const { return mesh_.isValid() && texture_ && texture_->isValid(); }

    const Mesh& mesh() const { return mesh_; }
    const Texture* texture() const { return texture_; }

    // Convenience accessors
    const std::string& name() const { return mesh_.name(); }

private:
    Mesh mesh_;
    const Texture* texture_ = nullptr;
};

} // namespace ge
