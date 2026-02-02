#include "Mesh.h"

Mesh::Mesh(bgfx::VertexBufferHandle vbh, bgfx::IndexBufferHandle ibh,
           uint32_t numIndices, std::string name)
    : vbh_(vbh), ibh_(ibh), numIndices_(numIndices), name_(std::move(name)) {}

Mesh::~Mesh() {
    if (bgfx::isValid(vbh_)) {
        bgfx::destroy(vbh_);
    }
    if (bgfx::isValid(ibh_)) {
        bgfx::destroy(ibh_);
    }
}

Mesh::Mesh(Mesh&& other) noexcept
    : vbh_(other.vbh_), ibh_(other.ibh_),
      numIndices_(other.numIndices_), name_(std::move(other.name_)) {
    other.vbh_ = BGFX_INVALID_HANDLE;
    other.ibh_ = BGFX_INVALID_HANDLE;
    other.numIndices_ = 0;
}

Mesh& Mesh::operator=(Mesh&& other) noexcept {
    if (this != &other) {
        if (bgfx::isValid(vbh_)) {
            bgfx::destroy(vbh_);
        }
        if (bgfx::isValid(ibh_)) {
            bgfx::destroy(ibh_);
        }
        vbh_ = other.vbh_;
        ibh_ = other.ibh_;
        numIndices_ = other.numIndices_;
        name_ = std::move(other.name_);
        other.vbh_ = BGFX_INVALID_HANDLE;
        other.ibh_ = BGFX_INVALID_HANDLE;
        other.numIndices_ = 0;
    }
    return *this;
}
