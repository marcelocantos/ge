#include <ge/Model.h>

namespace ge {

Model::Model(Mesh mesh, const Texture* texture)
    : mesh_(std::move(mesh)), texture_(texture) {}

} // namespace ge
