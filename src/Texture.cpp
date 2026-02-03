#include <sq/Texture.h>
#include <sq/WgpuResource.h>
#include <SDL3_image/SDL_image.h>
#include <spdlog/spdlog.h>
#include <stdexcept>
#include <string>

namespace sq {

struct Texture::M {
    WgpuTexture texture;
    WgpuTextureView view;
    WgpuSampler sampler;
    int width = 0;
    int height = 0;
};

Texture::Texture() : m(std::make_unique<M>()) {}
Texture::~Texture() = default;
Texture::Texture(Texture&&) noexcept = default;
Texture& Texture::operator=(Texture&&) noexcept = default;
Texture::Texture(std::unique_ptr<M> impl) : m(std::move(impl)) {}

bool Texture::isValid() const { return m && m->texture.isValid(); }
int Texture::width() const { return m ? m->width : 0; }
int Texture::height() const { return m ? m->height : 0; }

wgpu::TextureView Texture::view() const {
    return m ? m->view.get() : nullptr;
}

wgpu::Sampler Texture::sampler() const {
    return m ? m->sampler.get() : nullptr;
}

Texture Texture::fromFile(wgpu::Device device, wgpu::Queue queue, const char* path) {
    SDL_Surface* surface = IMG_Load(path);
    if (!surface) {
        throw std::runtime_error(std::string("Failed to load texture ") + path + ": " + SDL_GetError());
    }

    int width = surface->w;
    int height = surface->h;

    // Convert to RGBA if needed
    if (surface->format != SDL_PIXELFORMAT_RGBA32) {
        SDL_Surface* converted = SDL_ConvertSurface(surface, SDL_PIXELFORMAT_RGBA32);
        SDL_DestroySurface(surface);
        if (!converted) {
            throw std::runtime_error(std::string("Failed to convert texture ") + path + ": " + SDL_GetError());
        }
        surface = converted;
    }

    // Create WebGPU texture
    wgpu::TextureDescriptor texDesc{
        .usage = wgpu::TextureUsage::TextureBinding | wgpu::TextureUsage::CopyDst,
        .dimension = wgpu::TextureDimension::e2D,
        .size = {static_cast<uint32_t>(width), static_cast<uint32_t>(height), 1},
        .format = wgpu::TextureFormat::RGBA8Unorm,
        .mipLevelCount = 1,
        .sampleCount = 1,
    };
    wgpu::Texture tex = device.CreateTexture(&texDesc);
    if (!tex) {
        SDL_DestroySurface(surface);
        throw std::runtime_error(std::string("Failed to create texture for ") + path);
    }

    // Upload pixel data
    wgpu::TexelCopyTextureInfo dst{
        .texture = tex,
        .mipLevel = 0,
        .origin = {0, 0, 0},
        .aspect = wgpu::TextureAspect::All,
    };
    wgpu::TexelCopyBufferLayout layout{
        .offset = 0,
        .bytesPerRow = static_cast<uint32_t>(width * 4),
        .rowsPerImage = static_cast<uint32_t>(height),
    };
    wgpu::Extent3D extent{static_cast<uint32_t>(width), static_cast<uint32_t>(height), 1};
    queue.WriteTexture(&dst, surface->pixels, width * height * 4, &layout, &extent);

    SDL_DestroySurface(surface);

    // Create texture view
    wgpu::TextureViewDescriptor viewDesc{
        .format = wgpu::TextureFormat::RGBA8Unorm,
        .dimension = wgpu::TextureViewDimension::e2D,
        .baseMipLevel = 0,
        .mipLevelCount = 1,
        .baseArrayLayer = 0,
        .arrayLayerCount = 1,
        .aspect = wgpu::TextureAspect::All,
    };
    wgpu::TextureView texView = tex.CreateView(&viewDesc);

    // Create sampler (clamp mode, linear filtering)
    wgpu::SamplerDescriptor samplerDesc{
        .addressModeU = wgpu::AddressMode::ClampToEdge,
        .addressModeV = wgpu::AddressMode::ClampToEdge,
        .addressModeW = wgpu::AddressMode::ClampToEdge,
        .magFilter = wgpu::FilterMode::Linear,
        .minFilter = wgpu::FilterMode::Linear,
        .mipmapFilter = wgpu::MipmapFilterMode::Nearest,
        .lodMinClamp = 0.0f,
        .lodMaxClamp = 1.0f,
        .maxAnisotropy = 1,
    };
    wgpu::Sampler sampler = device.CreateSampler(&samplerDesc);

    auto impl = std::make_unique<M>();
    impl->texture = WgpuTexture(std::move(tex));
    impl->view = WgpuTextureView(std::move(texView));
    impl->sampler = WgpuSampler(std::move(sampler));
    impl->width = width;
    impl->height = height;

    return Texture(std::move(impl));
}

} // namespace sq
