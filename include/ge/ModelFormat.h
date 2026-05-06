#pragma once

#include <ge/Linalg.h>

// ge model binary format — vertex layout.

namespace ge {

struct MeshVertex {
    float x, y, z;
    float u, v;
};

static_assert(sizeof(MeshVertex) == 20, "MeshVertex must be 20 bytes");

} // namespace ge
