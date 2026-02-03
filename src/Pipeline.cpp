#include <sq/Pipeline.h>
#include <spdlog/spdlog.h>
#include <fstream>
#include <sstream>
#include <stdexcept>

namespace sq {

struct Pipeline::M {
    WgpuRenderPipeline pipeline;
    WgpuPipelineLayout layout;
    std::vector<WgpuBindGroupLayout> bindGroupLayouts;
};

Pipeline::Pipeline() : m(std::make_unique<M>()) {}
Pipeline::~Pipeline() = default;
Pipeline::Pipeline(Pipeline&&) noexcept = default;
Pipeline& Pipeline::operator=(Pipeline&&) noexcept = default;
Pipeline::Pipeline(std::unique_ptr<M> impl) : m(std::move(impl)) {}

bool Pipeline::isValid() const {
    return m && m->pipeline.isValid();
}

wgpu::RenderPipeline Pipeline::get() const {
    return m ? m->pipeline.get() : nullptr;
}

wgpu::PipelineLayout Pipeline::layout() const {
    return m ? m->layout.get() : nullptr;
}

wgpu::BindGroupLayout Pipeline::bindGroupLayout(uint32_t group) const {
    if (m && group < m->bindGroupLayouts.size()) {
        return m->bindGroupLayouts[group].get();
    }
    return nullptr;
}

namespace {

wgpu::BlendState makeBlendState(BlendMode mode) {
    switch (mode) {
    case BlendMode::Alpha:
        return {
            .color = {
                .operation = wgpu::BlendOperation::Add,
                .srcFactor = wgpu::BlendFactor::SrcAlpha,
                .dstFactor = wgpu::BlendFactor::OneMinusSrcAlpha,
            },
            .alpha = {
                .operation = wgpu::BlendOperation::Add,
                .srcFactor = wgpu::BlendFactor::One,
                .dstFactor = wgpu::BlendFactor::OneMinusSrcAlpha,
            },
        };

    case BlendMode::Additive:
        return {
            .color = {
                .operation = wgpu::BlendOperation::Add,
                .srcFactor = wgpu::BlendFactor::One,
                .dstFactor = wgpu::BlendFactor::One,
            },
            .alpha = {
                .operation = wgpu::BlendOperation::Add,
                .srcFactor = wgpu::BlendFactor::One,
                .dstFactor = wgpu::BlendFactor::One,
            },
        };

    case BlendMode::None:
    default:
        return {};
    }
}

} // anonymous namespace

Pipeline Pipeline::create(wgpu::Device device, const PipelineDesc& desc) {
    auto impl = std::make_unique<M>();

    // Create shader module from WGSL source
    wgpu::ShaderSourceWGSL wgslSource{};
    wgslSource.code = wgpu::StringView(desc.wgslSource.data(), desc.wgslSource.size());
    wgpu::ShaderModuleDescriptor shaderDesc{.nextInChain = &wgslSource};
    wgpu::ShaderModule shaderModule = device.CreateShaderModule(&shaderDesc);
    if (!shaderModule) {
        throw std::runtime_error("Failed to create shader module");
    }

    // Build vertex buffer layout
    std::vector<wgpu::VertexAttribute> vertexAttrs;
    vertexAttrs.reserve(desc.attributes.size());
    for (const auto& attr : desc.attributes) {
        vertexAttrs.push_back({
            .format = attr.format,
            .offset = attr.offset,
            .shaderLocation = attr.shaderLocation,
        });
    }
    wgpu::VertexBufferLayout vertexLayout{
        .stepMode = wgpu::VertexStepMode::Vertex,
        .arrayStride = desc.vertexStride,
        .attributeCount = vertexAttrs.size(),
        .attributes = vertexAttrs.data(),
    };

    // Create pipeline layout from provided bind group layouts
    if (!desc.bindGroupLayouts.empty()) {
        wgpu::PipelineLayoutDescriptor layoutDesc{
            .bindGroupLayoutCount = desc.bindGroupLayouts.size(),
            .bindGroupLayouts = desc.bindGroupLayouts.data(),
        };
        impl->layout = WgpuPipelineLayout(device.CreatePipelineLayout(&layoutDesc));
    }
    // If no layouts provided, use auto layout (nullptr)

    // Color target state
    wgpu::BlendState blendState = makeBlendState(desc.blendMode);
    wgpu::ColorTargetState colorTarget{
        .format = desc.colorFormat,
        .blend = (desc.blendMode != BlendMode::None) ? &blendState : nullptr,
        .writeMask = wgpu::ColorWriteMask::All,
    };

    // Fragment state
    wgpu::FragmentState fragmentState{
        .module = shaderModule,
        .entryPoint = wgpu::StringView(desc.fsEntryPoint.data(), desc.fsEntryPoint.size()),
        .targetCount = 1,
        .targets = &colorTarget,
    };

    // Depth stencil state (optional)
    bool useDepth = desc.depthFormat != wgpu::TextureFormat::Undefined;
    wgpu::DepthStencilState depthStencil{
        .format = desc.depthFormat,
        .depthWriteEnabled = desc.depthWrite,
        .depthCompare = desc.depthCompare,
    };

    // Render pipeline descriptor
    wgpu::RenderPipelineDescriptor pipelineDesc{
        .layout = impl->layout.get(),  // May be null for auto layout
        .vertex = {
            .module = shaderModule,
            .entryPoint = wgpu::StringView(desc.vsEntryPoint.data(), desc.vsEntryPoint.size()),
            .bufferCount = 1,
            .buffers = &vertexLayout,
        },
        .primitive = {
            .topology = wgpu::PrimitiveTopology::TriangleList,
            .frontFace = wgpu::FrontFace::CCW,
            .cullMode = desc.cullMode,
        },
        .depthStencil = useDepth ? &depthStencil : nullptr,
        .multisample = {.count = 1, .mask = ~0u},
        .fragment = &fragmentState,
    };

    impl->pipeline = WgpuRenderPipeline(device.CreateRenderPipeline(&pipelineDesc));
    if (!impl->pipeline.isValid()) {
        throw std::runtime_error("Failed to create render pipeline");
    }

    // If we used auto layout, retrieve the generated bind group layouts
    if (!impl->layout.isValid()) {
        // Store bind group layouts from pipeline for later use
        // Note: We can query up to 4 bind groups (WebGPU limit)
        for (uint32_t i = 0; i < 4; ++i) {
            auto bgl = impl->pipeline.get().GetBindGroupLayout(i);
            if (bgl) {
                impl->bindGroupLayouts.push_back(WgpuBindGroupLayout(bgl));
            }
        }
    }

    return Pipeline(std::move(impl));
}

Pipeline Pipeline::load(wgpu::Device device, const char* wgslPath, const PipelineDesc& baseDesc) {
    std::ifstream file(wgslPath);
    if (!file) {
        throw std::runtime_error(std::string("Failed to open shader file: ") + wgslPath);
    }

    std::stringstream buffer;
    buffer << file.rdbuf();
    std::string source = buffer.str();

    PipelineDesc desc = baseDesc;
    desc.wgslSource = source;

    SPDLOG_INFO("Loading pipeline from {}", wgslPath);
    return create(device, desc);
}

} // namespace sq
