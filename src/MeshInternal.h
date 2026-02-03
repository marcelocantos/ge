#pragma once
// Internal header - only for sq/ implementation files

#include <sq/Mesh.h>
#include <sq/BgfxResource.h>

struct Mesh::M {
    VertexBufferHandle vbh;
    IndexBufferHandle ibh;
    uint32_t numIndices = 0;
    std::string name;
};
