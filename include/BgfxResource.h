#pragma once

#include <bgfx/bgfx.h>
#include <stdexcept>

// RAII wrapper for bgfx resources.
// Default construction creates an invalid (empty) handle.
// Explicit construction from a raw bgfx handle throws if the handle is invalid.
template<typename T>
class BgfxResource {
public:
    BgfxResource() : handle{BGFX_INVALID_HANDLE} {}

    explicit BgfxResource(T h) : handle(h) {
        if (!bgfx::isValid(handle)) {
            throw std::runtime_error("bgfx resource creation failed");
        }
    }

    // Move semantics
    BgfxResource(BgfxResource&& other) noexcept : handle(other.handle) {
        other.handle = T{BGFX_INVALID_HANDLE};
    }

    BgfxResource& operator=(BgfxResource&& other) noexcept {
        if (this != &other) {
            reset();
            handle = other.handle;
            other.handle = T{BGFX_INVALID_HANDLE};
        }
        return *this;
    }

    // Delete copy semantics
    BgfxResource(const BgfxResource&) = delete;
    BgfxResource& operator=(const BgfxResource&) = delete;

    ~BgfxResource() {
        reset();
    }

    void reset() {
        if (bgfx::isValid(handle)) {
            bgfx::destroy(handle);
            handle = T{BGFX_INVALID_HANDLE};
        }
    }

    T get() const { return handle; }
    operator T() const { return handle; }
    bool isValid() const { return bgfx::isValid(handle); }

private:
    T handle;
};

// Type aliases for common resources
using VertexBufferHandle = BgfxResource<bgfx::VertexBufferHandle>;
using IndexBufferHandle = BgfxResource<bgfx::IndexBufferHandle>;
using ShaderHandle = BgfxResource<bgfx::ShaderHandle>;
using ProgramHandle = BgfxResource<bgfx::ProgramHandle>;
using TextureHandle = BgfxResource<bgfx::TextureHandle>;
using UniformHandle = BgfxResource<bgfx::UniformHandle>;
using FrameBufferHandle = BgfxResource<bgfx::FrameBufferHandle>;
