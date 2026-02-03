#pragma once

#include <webgpu/webgpu_cpp.h>
#include <sq/WgpuResource.h>
#include <memory>
#include <cstddef>

namespace sq {

// GPU buffer for uniform data
class UniformBuffer {
public:
    UniformBuffer();
    ~UniformBuffer();
    UniformBuffer(UniformBuffer&&) noexcept;
    UniformBuffer& operator=(UniformBuffer&&) noexcept;

    // Create a uniform buffer with given size
    static UniformBuffer create(wgpu::Device device, size_t size);

    // Write data to the buffer (via queue)
    void write(wgpu::Queue queue, const void* data, size_t size, size_t offset = 0);

    // Template helper for typed writes
    template <typename T>
    void write(wgpu::Queue queue, const T& data) {
        write(queue, &data, sizeof(T), 0);
    }

    wgpu::Buffer get() const;
    size_t size() const;
    bool isValid() const;

private:
    struct M;
    std::unique_ptr<M> m;
    UniformBuffer(std::unique_ptr<M> impl);
};

// Bind group entry types for building bind groups
struct BufferBinding {
    uint32_t binding;
    wgpu::Buffer buffer;
    size_t offset = 0;
    size_t size = 0;  // 0 means whole buffer
};

struct TextureBinding {
    uint32_t binding;
    wgpu::TextureView view;
};

struct SamplerBinding {
    uint32_t binding;
    wgpu::Sampler sampler;
};

// Builder for creating bind groups
class BindGroupBuilder {
public:
    explicit BindGroupBuilder(wgpu::Device device);

    BindGroupBuilder& buffer(uint32_t binding, wgpu::Buffer buffer, size_t offset = 0, size_t size = 0);
    BindGroupBuilder& buffer(uint32_t binding, const UniformBuffer& ub);
    BindGroupBuilder& texture(uint32_t binding, wgpu::TextureView view);
    BindGroupBuilder& sampler(uint32_t binding, wgpu::Sampler sampler);

    // Build the bind group using the given layout
    wgpu::BindGroup build(wgpu::BindGroupLayout layout);

private:
    wgpu::Device device_;
    std::vector<BufferBinding> buffers_;
    std::vector<TextureBinding> textures_;
    std::vector<SamplerBinding> samplers_;
};

// Create a bind group layout from entries
wgpu::BindGroupLayout createBindGroupLayout(
    wgpu::Device device,
    std::initializer_list<wgpu::BindGroupLayoutEntry> entries);

// Common bind group layout helpers
wgpu::BindGroupLayout createUniformBufferLayout(wgpu::Device device, uint32_t binding, wgpu::ShaderStage visibility);
wgpu::BindGroupLayout createTextureLayout(wgpu::Device device, uint32_t samplerBinding, uint32_t textureBinding);

} // namespace sq
