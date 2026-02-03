#pragma once

#include <webgpu/webgpu_cpp.h>
#include <sq/WgpuResource.h>
#include <memory>
#include <string_view>
#include <vector>

namespace sq {

// Vertex attribute description
struct VertexAttribute {
    wgpu::VertexFormat format;
    uint64_t offset;
    uint32_t shaderLocation;
};

// Returns vertex attributes for MeshVertex (position + texcoord)
std::vector<VertexAttribute> meshVertexAttributes();

// Blend mode presets
enum class BlendMode {
    None,       // No blending (opaque)
    Alpha,      // Standard alpha blending: src*srcAlpha + dst*(1-srcAlpha)
    Additive,   // Additive blending: src + dst
};

// Pipeline configuration
struct PipelineDesc {
    std::string_view wgslSource;
    std::string_view vsEntryPoint = "vs_main";
    std::string_view fsEntryPoint = "fs_main";

    // Vertex buffer layout
    std::vector<VertexAttribute> attributes;
    uint64_t vertexStride = 0;

    // Render state
    wgpu::TextureFormat colorFormat = wgpu::TextureFormat::BGRA8Unorm;
    wgpu::TextureFormat depthFormat = wgpu::TextureFormat::Undefined;
    BlendMode blendMode = BlendMode::None;
    wgpu::CullMode cullMode = wgpu::CullMode::None;
    bool depthWrite = false;
    wgpu::CompareFunction depthCompare = wgpu::CompareFunction::Always;

    // Bind group layouts (if not provided, auto-generated from shader reflection)
    std::vector<wgpu::BindGroupLayout> bindGroupLayouts;
};

// WebGPU render pipeline with associated layouts
class Pipeline {
public:
    Pipeline();
    ~Pipeline();
    Pipeline(Pipeline&&) noexcept;
    Pipeline& operator=(Pipeline&&) noexcept;

    // Create pipeline from WGSL source and configuration
    static Pipeline create(wgpu::Device device, const PipelineDesc& desc);

    // Load WGSL from file and create pipeline
    static Pipeline load(wgpu::Device device, const char* wgslPath, const PipelineDesc& desc);

    wgpu::RenderPipeline get() const;
    wgpu::PipelineLayout layout() const;
    wgpu::BindGroupLayout bindGroupLayout(uint32_t group) const;

    bool isValid() const;

private:
    struct M;
    std::unique_ptr<M> m;
    Pipeline(std::unique_ptr<M> impl);
};

} // namespace sq
