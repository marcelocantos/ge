#pragma once

// sq model binary format — vertex layout.

namespace sq {

struct MeshVertex {
    float x, y, z;
    float u, v;
};

static_assert(sizeof(MeshVertex) == 20, "MeshVertex must be 20 bytes");

} // namespace sq
