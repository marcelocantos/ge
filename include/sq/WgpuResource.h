#pragma once

#include <webgpu/webgpu_cpp.h>
#include <stdexcept>
#include <utility>

namespace sq {

// RAII wrapper for WebGPU resources.
// Dawn's wgpu::* types are already reference-counted, but this wrapper provides:
// - Consistent interface with the old BgfxResource
// - Validation on construction (throws if null when expected valid)
// - Explicit validity checking
template <typename T>
class WgpuResource {
public:
    WgpuResource() = default;

    explicit WgpuResource(T handle) : handle_(std::move(handle)) {
        if (handle_ == nullptr) {
            throw std::runtime_error("WebGPU resource creation failed");
        }
    }

    // Allow construction without validation (for optional resources)
    static WgpuResource fromNullable(T handle) {
        WgpuResource r;
        r.handle_ = std::move(handle);
        return r;
    }

    WgpuResource(WgpuResource&& other) noexcept
        : handle_(std::exchange(other.handle_, T{})) {}

    WgpuResource& operator=(WgpuResource&& other) noexcept {
        if (this != &other) {
            handle_ = std::exchange(other.handle_, T{});
        }
        return *this;
    }

    // Dawn objects are ref-counted, so copying is allowed but we disable
    // it to match BgfxResource semantics and encourage explicit sharing
    WgpuResource(const WgpuResource&) = delete;
    WgpuResource& operator=(const WgpuResource&) = delete;

    ~WgpuResource() = default;

    void reset() { handle_ = T{}; }

    T get() const { return handle_; }
    operator T() const { return handle_; }
    bool isValid() const { return handle_ != nullptr; }
    explicit operator bool() const { return isValid(); }

private:
    T handle_{};
};

// Type aliases for common WebGPU resources
using WgpuBuffer = WgpuResource<wgpu::Buffer>;
using WgpuTexture = WgpuResource<wgpu::Texture>;
using WgpuTextureView = WgpuResource<wgpu::TextureView>;
using WgpuSampler = WgpuResource<wgpu::Sampler>;
using WgpuBindGroup = WgpuResource<wgpu::BindGroup>;
using WgpuBindGroupLayout = WgpuResource<wgpu::BindGroupLayout>;
using WgpuPipelineLayout = WgpuResource<wgpu::PipelineLayout>;
using WgpuRenderPipeline = WgpuResource<wgpu::RenderPipeline>;
using WgpuShaderModule = WgpuResource<wgpu::ShaderModule>;

} // namespace sq
