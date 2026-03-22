#pragma once

#include <webgpu/webgpu_cpp.h>
#include <memory>

namespace ge {

// Pure asset class for textures
class Texture {
public:
    Texture();
    ~Texture();
    Texture(Texture&&) noexcept;
    Texture& operator=(Texture&&) noexcept;

    // Load texture from image file (PNG, etc.) - requires device and queue
    // maxMipLevels: 0 = full mip chain (default), 1 = no mipmaps, N = at most N levels
    static Texture fromFile(wgpu::Device device, wgpu::Queue queue, const char* path,
                            uint32_t maxMipLevels = 0);

    bool isValid() const;
    int width() const;
    int height() const;

    // WebGPU accessors for bind group creation
    wgpu::TextureView view() const;
    wgpu::Sampler sampler() const;

private:
    struct M;
    std::unique_ptr<M> m;

    Texture(std::unique_ptr<M> impl);
};

} // namespace ge
