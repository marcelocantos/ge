#include <sq/Model.h>

namespace sq {

Model::Model(Mesh mesh, const Texture* texture)
    : mesh_(std::move(mesh)), texture_(texture) {}

} // namespace sq
