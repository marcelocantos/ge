#include <sq/Texture.h>
#include <sq/WgpuResource.h>
#include <SDL3_image/SDL_image.h>
#include <spdlog/spdlog.h>
#include <cstring>
#include <fstream>
#include <stdexcept>
#include <string>
#include <vector>

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

namespace {

bool endsWithAstc(const char* path) {
    size_t len = std::strlen(path);
    return len > 5 && std::strcmp(path + len - 5, ".astc") == 0;
}

// ASTC file header: 4-byte magic, 3 bytes block_x/y/z, 3x3 bytes dim_x/y/z (24-bit LE)
struct AstcHeader {
    uint8_t magic[4];
    uint8_t block_x, block_y, block_z;
    uint8_t dim_x[3], dim_y[3], dim_z[3];
};
static_assert(sizeof(AstcHeader) == 16);

uint32_t read24(const uint8_t b[3]) {
    return uint32_t(b[0]) | (uint32_t(b[1]) << 8) | (uint32_t(b[2]) << 16);
}

} // namespace

Texture Texture::fromFile(wgpu::Device device, wgpu::Queue queue, const char* path) {
    if (endsWithAstc(path)) {
        std::ifstream file(path, std::ios::binary | std::ios::ate);
        if (!file) {
            throw std::runtime_error(std::string("Failed to open ASTC file ") + path);
        }
        auto fileSize = file.tellg();
        file.seekg(0);

        AstcHeader header{};
        file.read(reinterpret_cast<char*>(&header), sizeof(header));
        if (!file || header.magic[0] != 0x13 || header.magic[1] != 0xAB ||
            header.magic[2] != 0xA1 || header.magic[3] != 0x5C) {
            throw std::runtime_error(std::string("Invalid ASTC header in ") + path);
        }

        uint32_t width = read24(header.dim_x);
        uint32_t height = read24(header.dim_y);
        SPDLOG_INFO("ASTC texture: {}x{} block={}x{} from {}", width, height,
                     header.block_x, header.block_y, path);

        // Only ASTC 4x4 supported for now
        if (header.block_x != 4 || header.block_y != 4) {
            throw std::runtime_error(std::string("Unsupported ASTC block size in ") + path);
        }

        size_t dataSize = static_cast<size_t>(fileSize) - sizeof(AstcHeader);
        std::vector<uint8_t> data(dataSize);
        file.read(reinterpret_cast<char*>(data.data()), static_cast<std::streamsize>(dataSize));

        wgpu::TextureDescriptor texDesc{
            .usage = wgpu::TextureUsage::TextureBinding | wgpu::TextureUsage::CopyDst,
            .dimension = wgpu::TextureDimension::e2D,
            .size = {width, height, 1},
            .format = wgpu::TextureFormat::ASTC4x4Unorm,
            .mipLevelCount = 1,
            .sampleCount = 1,
        };
        wgpu::Texture tex = device.CreateTexture(&texDesc);
        if (!tex) {
            throw std::runtime_error(std::string("Failed to create ASTC texture for ") + path);
        }

        uint32_t blocksX = (width + 3) / 4;
        wgpu::TexelCopyTextureInfo dst{
            .texture = tex,
            .mipLevel = 0,
            .origin = {0, 0, 0},
            .aspect = wgpu::TextureAspect::All,
        };
        wgpu::TexelCopyBufferLayout layout{
            .offset = 0,
            .bytesPerRow = blocksX * 16,
            .rowsPerImage = height,
        };
        wgpu::Extent3D extent{width, height, 1};
        queue.WriteTexture(&dst, data.data(), dataSize, &layout, &extent);

        wgpu::TextureViewDescriptor viewDesc{
            .format = wgpu::TextureFormat::ASTC4x4Unorm,
            .dimension = wgpu::TextureViewDimension::e2D,
            .baseMipLevel = 0,
            .mipLevelCount = 1,
            .baseArrayLayer = 0,
            .arrayLayerCount = 1,
            .aspect = wgpu::TextureAspect::All,
        };
        wgpu::TextureView texView = tex.CreateView(&viewDesc);

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
        impl->width = static_cast<int>(width);
        impl->height = static_cast<int>(height);
        return Texture(std::move(impl));
    }

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
