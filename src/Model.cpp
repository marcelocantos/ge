#include "Model.h"

Model::Model(Mesh mesh, const Texture* texture)
    : mesh_(std::move(mesh)), texture_(texture) {}
