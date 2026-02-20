#include <ge/BindGroup.h>
#include <stdexcept>

namespace ge {

// UniformBuffer implementation
struct UniformBuffer::M {
    WgpuBuffer buffer;
    size_t size = 0;
};

UniformBuffer::UniformBuffer() : m(std::make_unique<M>()) {}
UniformBuffer::~UniformBuffer() = default;
UniformBuffer::UniformBuffer(UniformBuffer&&) noexcept = default;
UniformBuffer& UniformBuffer::operator=(UniformBuffer&&) noexcept = default;
UniformBuffer::UniformBuffer(std::unique_ptr<M> impl) : m(std::move(impl)) {}

UniformBuffer UniformBuffer::create(wgpu::Device device, size_t size) {
    wgpu::BufferDescriptor desc{
        .usage = wgpu::BufferUsage::Uniform | wgpu::BufferUsage::CopyDst,
        .size = size,
        .mappedAtCreation = false,
    };
    auto impl = std::make_unique<M>();
    impl->buffer = WgpuBuffer(device.CreateBuffer(&desc));
    impl->size = size;

    if (!impl->buffer.isValid()) {
        throw std::runtime_error("Failed to create uniform buffer");
    }

    return UniformBuffer(std::move(impl));
}

void UniformBuffer::write(wgpu::Queue queue, const void* data, size_t size, size_t offset) {
    if (m && m->buffer.isValid()) {
        queue.WriteBuffer(m->buffer.get(), offset, data, size);
    }
}

wgpu::Buffer UniformBuffer::get() const {
    return m ? m->buffer.get() : nullptr;
}

size_t UniformBuffer::size() const {
    return m ? m->size : 0;
}

bool UniformBuffer::isValid() const {
    return m && m->buffer.isValid();
}

// BindGroupBuilder implementation
BindGroupBuilder::BindGroupBuilder(wgpu::Device device) : device_(device) {}

BindGroupBuilder& BindGroupBuilder::buffer(uint32_t binding, wgpu::Buffer buffer, size_t offset, size_t size) {
    buffers_.push_back({binding, buffer, offset, size});
    return *this;
}

BindGroupBuilder& BindGroupBuilder::buffer(uint32_t binding, const UniformBuffer& ub) {
    return buffer(binding, ub.get(), 0, ub.size());
}

BindGroupBuilder& BindGroupBuilder::texture(uint32_t binding, wgpu::TextureView view) {
    textures_.push_back({binding, view});
    return *this;
}

BindGroupBuilder& BindGroupBuilder::sampler(uint32_t binding, wgpu::Sampler sampler) {
    samplers_.push_back({binding, sampler});
    return *this;
}

wgpu::BindGroup BindGroupBuilder::build(wgpu::BindGroupLayout layout) {
    std::vector<wgpu::BindGroupEntry> entries;
    entries.reserve(buffers_.size() + textures_.size() + samplers_.size());

    for (const auto& b : buffers_) {
        entries.push_back({
            .binding = b.binding,
            .buffer = b.buffer,
            .offset = b.offset,
            .size = b.size > 0 ? b.size : b.buffer.GetSize(),
        });
    }

    for (const auto& t : textures_) {
        entries.push_back({.binding = t.binding, .textureView = t.view});
    }

    for (const auto& s : samplers_) {
        entries.push_back({.binding = s.binding, .sampler = s.sampler});
    }

    wgpu::BindGroupDescriptor desc{.layout = layout, .entryCount = entries.size(), .entries = entries.data()};
    return device_.CreateBindGroup(&desc);
}

// Helper functions
wgpu::BindGroupLayout createBindGroupLayout(
    wgpu::Device device,
    std::initializer_list<wgpu::BindGroupLayoutEntry> entries) {

    std::vector<wgpu::BindGroupLayoutEntry> entryVec(entries);
    wgpu::BindGroupLayoutDescriptor desc{.entryCount = entryVec.size(), .entries = entryVec.data()};
    return device.CreateBindGroupLayout(&desc);
}

wgpu::BindGroupLayout createUniformBufferLayout(wgpu::Device device, uint32_t binding, wgpu::ShaderStage visibility) {
    wgpu::BindGroupLayoutEntry entry{
        .binding = binding,
        .visibility = visibility,
        .buffer = {
            .type = wgpu::BufferBindingType::Uniform,
            .hasDynamicOffset = false,
            .minBindingSize = 0,
        },
    };
    return createBindGroupLayout(device, {entry});
}

wgpu::BindGroupLayout createTextureLayout(wgpu::Device device, uint32_t samplerBinding, uint32_t textureBinding) {
    wgpu::BindGroupLayoutEntry samplerEntry{
        .binding = samplerBinding,
        .visibility = wgpu::ShaderStage::Fragment,
        .sampler = {.type = wgpu::SamplerBindingType::Filtering},
    };
    wgpu::BindGroupLayoutEntry textureEntry{
        .binding = textureBinding,
        .visibility = wgpu::ShaderStage::Fragment,
        .texture = {
            .sampleType = wgpu::TextureSampleType::Float,
            .viewDimension = wgpu::TextureViewDimension::e2D,
            .multisampled = false,
        },
    };
    return createBindGroupLayout(device, {samplerEntry, textureEntry});
}

} // namespace ge
