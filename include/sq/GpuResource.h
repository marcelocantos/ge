#pragma once

#include <bgfx/bgfx.h>
#include <stdexcept>

// RAII wrapper for bgfx resources.
// Default construction creates an invalid (empty) handle.
// Explicit construction from a raw bgfx handle throws if the handle is invalid.
template<typename T>
class GpuResource {
public:
    GpuResource() : handle{BGFX_INVALID_HANDLE} {}

    explicit GpuResource(T h) : handle(h) {
        if (!bgfx::isValid(handle)) {
            throw std::runtime_error("bgfx resource creation failed");
        }
    }

    // Move semantics
    GpuResource(GpuResource&& other) noexcept : handle(other.handle) {
        other.handle = T{BGFX_INVALID_HANDLE};
    }

    GpuResource& operator=(GpuResource&& other) noexcept {
        if (this != &other) {
            reset();
            handle = other.handle;
            other.handle = T{BGFX_INVALID_HANDLE};
        }
        return *this;
    }

    // Delete copy semantics
    GpuResource(const GpuResource&) = delete;
    GpuResource& operator=(const GpuResource&) = delete;

    ~GpuResource() {
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
using VertexBufferHandle = GpuResource<bgfx::VertexBufferHandle>;
using IndexBufferHandle = GpuResource<bgfx::IndexBufferHandle>;
using ShaderHandle = GpuResource<bgfx::ShaderHandle>;
using ProgramHandle = GpuResource<bgfx::ProgramHandle>;
using TextureHandle = GpuResource<bgfx::TextureHandle>;
using UniformHandle = GpuResource<bgfx::UniformHandle>;
using FrameBufferHandle = GpuResource<bgfx::FrameBufferHandle>;
