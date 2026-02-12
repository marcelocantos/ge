#include <sq/Texture.h>
#include <sq/FileIO.h>
#include <sq/Resource.h>
#include <sq/SqTexFormat.h>
#include <sq/WgpuResource.h>
#include <SDL3_image/SDL_image.h>
#include <spdlog/spdlog.h>
#include <algorithm>
#include <cstring>
#include <filesystem>
#include <fstream>
#include <stdexcept>
#include <string>
#include <vector>

#ifdef SQ_HAS_TRANSCODER
#include <SDL3/SDL_filesystem.h>
#include <astcenc.h>
#include <ProcessRGB.hpp>
#endif

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

constexpr uint8_t kAstcMagic[4] = {0x13, 0xAB, 0xA1, 0x5C};

wgpu::TextureFormat gpuFormat(SqTexEncoding e) {
    switch (e) {
        case SqTexEncoding::Astc4x4:   return wgpu::TextureFormat::ASTC4x4Unorm;
        case SqTexEncoding::Etc2Rgba8: return wgpu::TextureFormat::ETC2RGBA8Unorm;
        case SqTexEncoding::Png:       return wgpu::TextureFormat::RGBA8Unorm;
    }
    throw std::runtime_error("Unknown SqTexEncoding");
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

// Returned by load helpers — fromFile wraps into Texture::M
struct TextureResult {
    wgpu::Texture tex;
    wgpu::TextureView view;
    wgpu::Sampler sampler;
    int width;
    int height;
};

wgpu::Sampler createSampler(wgpu::Device device, uint32_t mipCount) {
    wgpu::SamplerDescriptor desc{
        .addressModeU = wgpu::AddressMode::ClampToEdge,
        .addressModeV = wgpu::AddressMode::ClampToEdge,
        .addressModeW = wgpu::AddressMode::ClampToEdge,
        .magFilter = wgpu::FilterMode::Linear,
        .minFilter = wgpu::FilterMode::Linear,
        .mipmapFilter = mipCount > 1 ? wgpu::MipmapFilterMode::Linear
                                     : wgpu::MipmapFilterMode::Nearest,
        .lodMinClamp = 0.0f,
        .lodMaxClamp = static_cast<float>(mipCount),
        .maxAnisotropy = 1,
    };
    return device.CreateSampler(&desc);
}

#ifdef SQ_HAS_TRANSCODER

// Transcode an ASTC sqtex file to ETC2, writing the result to cachePath.
// srcPath is the logical asset path (resolved via sq::openFile).
// Returns true on success.
bool transcodeAstcToEtc2(const char* srcPath, const char* cachePath) {
    auto src = sq::openFile(srcPath, true);
    if (!src || !*src) return false;

    SqTexHeader hdr{};
    src->read(reinterpret_cast<char*>(&hdr), sizeof(hdr));
    if (!*src || std::memcmp(hdr.magic, kSqTexMagic, 4) != 0) return false;

    auto encoding = static_cast<SqTexEncoding>(hdr.encoding);
    if (encoding != SqTexEncoding::Astc4x4) return false;

    uint32_t w = hdr.width, h = hdr.height, mipCount = hdr.mipCount;

    // Read level sizes
    std::vector<uint32_t> levelSizes(mipCount);
    src->read(reinterpret_cast<char*>(levelSizes.data()),
              static_cast<std::streamsize>(mipCount * sizeof(uint32_t)));
    if (!*src) return false;

    // Set up astcenc decompress-only context
    astcenc_config config{};
    astcenc_error status = astcenc_config_init(
        ASTCENC_PRF_LDR, 4, 4, 1, 0.0f, ASTCENC_FLG_DECOMPRESS_ONLY, &config);
    if (status != ASTCENC_SUCCESS) {
        SPDLOG_ERROR("astcenc config_init failed: {}", astcenc_get_error_string(status));
        return false;
    }

    astcenc_context* ctx = nullptr;
    status = astcenc_context_alloc(&config, 1, &ctx);
    if (status != ASTCENC_SUCCESS) {
        SPDLOG_ERROR("astcenc context_alloc failed: {}", astcenc_get_error_string(status));
        return false;
    }

    astcenc_swizzle swizzle{ASTCENC_SWZ_R, ASTCENC_SWZ_G, ASTCENC_SWZ_B, ASTCENC_SWZ_A};

    // Transcode each mip level
    std::vector<std::vector<uint8_t>> etc2Levels(mipCount);

    for (uint32_t level = 0; level < mipCount; ++level) {
        uint32_t mw = std::max(1u, w >> level);
        uint32_t mh = std::max(1u, h >> level);

        // Read ASTC compressed data
        std::vector<uint8_t> astcData(levelSizes[level]);
        src->read(reinterpret_cast<char*>(astcData.data()),
                  static_cast<std::streamsize>(levelSizes[level]));
        if (!*src) {
            astcenc_context_free(ctx);
            return false;
        }

        // Decompress ASTC → RGBA8
        // Pad to block-aligned dimensions for the decompressor
        uint32_t pw = (mw + 3) & ~3u;
        uint32_t ph = (mh + 3) & ~3u;
        std::vector<uint8_t> rgba(static_cast<size_t>(pw) * ph * 4);

        astcenc_image image{};
        image.dim_x = pw;
        image.dim_y = ph;
        image.dim_z = 1;
        image.data_type = ASTCENC_TYPE_U8;
        void* slices[1] = {rgba.data()};
        image.data = slices;

        status = astcenc_decompress_image(ctx, astcData.data(), astcData.size(),
                                          &image, &swizzle, 0);
        if (status != ASTCENC_SUCCESS) {
            SPDLOG_ERROR("ASTC decompress failed (level {}): {}",
                         level, astcenc_get_error_string(status));
            astcenc_context_free(ctx);
            return false;
        }
        astcenc_decompress_reset(ctx);

        // Compress RGBA → ETC2 (etcpak expects BGRA)
        size_t blocksX = pw / 4;
        size_t blocksY = ph / 4;
        size_t totalBlocks = blocksX * blocksY;

        std::vector<uint32_t> bgra(static_cast<size_t>(pw) * ph);
        for (uint32_t i = 0; i < static_cast<uint32_t>(pw) * ph; ++i) {
            const uint8_t* p = rgba.data() + i * 4;
            bgra[i] = uint32_t(p[2])
                     | (uint32_t(p[1]) << 8)
                     | (uint32_t(p[0]) << 16)
                     | (uint32_t(p[3]) << 24);
        }

        etc2Levels[level].resize(totalBlocks * 16);
        CompressEtc2Rgba(bgra.data(),
                         reinterpret_cast<uint64_t*>(etc2Levels[level].data()),
                         static_cast<uint32_t>(totalBlocks),
                         static_cast<size_t>(pw), true);
    }

    astcenc_context_free(ctx);

    // Write cached ETC2 sqtex file
    std::filesystem::create_directories(std::filesystem::path(cachePath).parent_path());
    std::ofstream out(cachePath, std::ios::binary);
    if (!out) return false;

    SqTexHeader outHdr{};
    std::memcpy(outHdr.magic, kSqTexMagic, 4);
    outHdr.encoding = static_cast<uint16_t>(SqTexEncoding::Etc2Rgba8);
    outHdr.mipCount = static_cast<uint16_t>(mipCount);
    outHdr.width = w;
    outHdr.height = h;
    out.write(reinterpret_cast<const char*>(&outHdr), sizeof(outHdr));

    // Level sizes
    std::vector<uint32_t> outSizes(mipCount);
    for (uint32_t i = 0; i < mipCount; ++i) {
        outSizes[i] = static_cast<uint32_t>(etc2Levels[i].size());
    }
    out.write(reinterpret_cast<const char*>(outSizes.data()),
              static_cast<std::streamsize>(mipCount * sizeof(uint32_t)));

    // Level data
    for (uint32_t i = 0; i < mipCount; ++i) {
        out.write(reinterpret_cast<const char*>(etc2Levels[i].data()),
                  static_cast<std::streamsize>(etc2Levels[i].size()));
    }

    SPDLOG_INFO("Transcoded ASTC→ETC2: {}x{}, {} mip levels → {}", w, h, mipCount, cachePath);
    return true;
}

// Get the cache path for a transcoded texture.
std::string transcodeCachePath(const char* srcPath) {
    char* prefPath = SDL_GetPrefPath("squz", getprogname());
    std::string cacheDir = prefPath ? std::string(prefPath) + "texcache/" : "/tmp/squz-texcache/";
    SDL_free(prefPath);

    auto filename = std::filesystem::path(srcPath).filename().string();
    // Replace .astc.sqtex with .etc2.sqtex
    auto pos = filename.rfind(".astc.sqtex");
    if (pos != std::string::npos) {
        filename.replace(pos, 11, ".etc2.sqtex");
    }
    return cacheDir + filename;
}

#endif // SQ_HAS_TRANSCODER

TextureResult loadSqtex(wgpu::Device device, wgpu::Queue queue,
                         std::istream& file, const char* path) {
    // Magic already consumed; read rest of header
    SqTexHeader hdr{};
    std::memcpy(hdr.magic, kSqTexMagic, 4);
    file.read(reinterpret_cast<char*>(&hdr) + 4, sizeof(hdr) - 4);
    if (!file) {
        throw std::runtime_error(std::string("Truncated sqtex header in ") + path);
    }

    auto encoding = static_cast<SqTexEncoding>(hdr.encoding);
    auto format = gpuFormat(encoding);
    uint32_t w = hdr.width;
    uint32_t h = hdr.height;
    uint32_t mipCount = hdr.mipCount;

    auto encodingName = [&] {
        switch (encoding) {
            case SqTexEncoding::Astc4x4:   return "ASTC 4x4";
            case SqTexEncoding::Etc2Rgba8: return "ETC2 RGBA8";
            case SqTexEncoding::Png:       return "PNG";
        }
        return "unknown";
    }();
    SPDLOG_INFO("sqtex: {}x{}, {} mip levels, {} from {}",
                w, h, mipCount, encodingName, path);

    // Read level size table
    std::vector<uint32_t> levelSizes(mipCount);
    file.read(reinterpret_cast<char*>(levelSizes.data()),
              static_cast<std::streamsize>(mipCount * sizeof(uint32_t)));
    if (!file) {
        throw std::runtime_error(std::string("Truncated level sizes in ") + path);
    }

    // Create texture with all mip levels
    wgpu::TextureDescriptor texDesc{
        .usage = wgpu::TextureUsage::TextureBinding | wgpu::TextureUsage::CopyDst,
        .dimension = wgpu::TextureDimension::e2D,
        .size = {w, h, 1},
        .format = format,
        .mipLevelCount = mipCount,
        .sampleCount = 1,
    };
    wgpu::Texture tex = device.CreateTexture(&texDesc);
    if (!tex) {
        throw std::runtime_error(std::string("Failed to create texture for ") + path);
    }

    // Upload each mip level
    for (uint32_t level = 0; level < mipCount; ++level) {
        uint32_t mw = std::max(1u, w >> level);
        uint32_t mh = std::max(1u, h >> level);

        std::vector<uint8_t> data(levelSizes[level]);
        file.read(reinterpret_cast<char*>(data.data()),
                  static_cast<std::streamsize>(levelSizes[level]));
        if (!file) {
            throw std::runtime_error(std::string("Truncated level data in ") + path);
        }

        wgpu::TexelCopyTextureInfo dst{
            .texture = tex,
            .mipLevel = level,
            .origin = {0, 0, 0},
            .aspect = wgpu::TextureAspect::All,
        };

        if (encoding == SqTexEncoding::Astc4x4 || encoding == SqTexEncoding::Etc2Rgba8) {
            // For compressed textures, extent must be block-aligned (physical mip size)
            // Both ASTC 4x4 and ETC2 EAC RGBA8 use 16 bytes per 4x4 block
            uint32_t blocksX = (mw + 3) / 4;
            uint32_t blocksY = (mh + 3) / 4;
            wgpu::Extent3D extent{blocksX * 4, blocksY * 4, 1};
            wgpu::TexelCopyBufferLayout layout{
                .offset = 0,
                .bytesPerRow = blocksX * 16,
                .rowsPerImage = blocksY * 4,
            };
            queue.WriteTexture(&dst, data.data(), data.size(), &layout, &extent);
        } else {
            // Decode PNG blob to RGBA8
            SDL_IOStream* io = SDL_IOFromMem(data.data(), data.size());
            if (!io) {
                throw std::runtime_error(
                    std::string("Failed to create IO stream for mip level in ") + path);
            }
            SDL_Surface* surface = IMG_Load_IO(io, true);
            if (!surface) {
                throw std::runtime_error(
                    std::string("Failed to decode PNG mip level in ") + path +
                    ": " + SDL_GetError());
            }
            if (surface->format != SDL_PIXELFORMAT_RGBA32) {
                SDL_Surface* converted = SDL_ConvertSurface(surface, SDL_PIXELFORMAT_RGBA32);
                SDL_DestroySurface(surface);
                if (!converted) {
                    throw std::runtime_error(
                        std::string("Failed to convert PNG mip level in ") + path);
                }
                surface = converted;
            }
            wgpu::Extent3D extent{mw, mh, 1};
            wgpu::TexelCopyBufferLayout layout{
                .offset = 0,
                .bytesPerRow = mw * 4,
                .rowsPerImage = mh,
            };
            queue.WriteTexture(&dst, surface->pixels,
                               static_cast<size_t>(mw) * mh * 4,
                               &layout, &extent);
            SDL_DestroySurface(surface);
        }
    }

    // Create view spanning all mip levels
    wgpu::TextureViewDescriptor viewDesc{
        .format = format,
        .dimension = wgpu::TextureViewDimension::e2D,
        .baseMipLevel = 0,
        .mipLevelCount = mipCount,
        .baseArrayLayer = 0,
        .arrayLayerCount = 1,
        .aspect = wgpu::TextureAspect::All,
    };
    wgpu::TextureView texView = tex.CreateView(&viewDesc);

    return {
        std::move(tex),
        std::move(texView),
        createSampler(device, mipCount),
        static_cast<int>(w),
        static_cast<int>(h),
    };
}

TextureResult loadAstc(wgpu::Device device, wgpu::Queue queue,
                        std::istream& file, const char* path) {
    // Magic already consumed; seek back to read full header
    file.seekg(0);
    AstcHeader header{};
    file.read(reinterpret_cast<char*>(&header), sizeof(header));
    if (!file) {
        throw std::runtime_error(std::string("Truncated ASTC header in ") + path);
    }

    uint32_t width = read24(header.dim_x);
    uint32_t height = read24(header.dim_y);
    SPDLOG_INFO("ASTC texture: {}x{} block={}x{} from {}", width, height,
                 header.block_x, header.block_y, path);

    if (header.block_x != 4 || header.block_y != 4) {
        throw std::runtime_error(std::string("Unsupported ASTC block size in ") + path);
    }

    file.seekg(0, std::ios::end);
    size_t fileSize = static_cast<size_t>(file.tellg());
    size_t dataSize = fileSize - sizeof(AstcHeader);
    file.seekg(sizeof(AstcHeader));
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

    return {
        std::move(tex),
        std::move(texView),
        createSampler(device, 1),
        static_cast<int>(width),
        static_cast<int>(height),
    };
}

TextureResult loadSdlImage(wgpu::Device device, wgpu::Queue queue, const char* path) {
    SDL_Surface* surface = IMG_Load(path);
    if (!surface) {
        throw std::runtime_error(
            std::string("Failed to load texture ") + path + ": " + SDL_GetError());
    }

    int width = surface->w;
    int height = surface->h;

    if (surface->format != SDL_PIXELFORMAT_RGBA32) {
        SDL_Surface* converted = SDL_ConvertSurface(surface, SDL_PIXELFORMAT_RGBA32);
        SDL_DestroySurface(surface);
        if (!converted) {
            throw std::runtime_error(
                std::string("Failed to convert texture ") + path + ": " + SDL_GetError());
        }
        surface = converted;
    }

    // Calculate full mip chain so the wire filter can defer large mip levels
    // without creating invalid texture views.
    uint32_t mipCount = 1;
    {
        uint32_t mw = static_cast<uint32_t>(width), mh = static_cast<uint32_t>(height);
        while (mw > 1 || mh > 1) { mw = std::max(1u, mw / 2); mh = std::max(1u, mh / 2); mipCount++; }
    }

    wgpu::TextureDescriptor texDesc{
        .usage = wgpu::TextureUsage::TextureBinding | wgpu::TextureUsage::CopyDst,
        .dimension = wgpu::TextureDimension::e2D,
        .size = {static_cast<uint32_t>(width), static_cast<uint32_t>(height), 1},
        .format = wgpu::TextureFormat::RGBA8Unorm,
        .mipLevelCount = mipCount,
        .sampleCount = 1,
    };
    wgpu::Texture tex = device.CreateTexture(&texDesc);
    if (!tex) {
        SDL_DestroySurface(surface);
        throw std::runtime_error(std::string("Failed to create texture for ") + path);
    }

    // Upload mip level 0
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
    size_t pixelBytes = static_cast<size_t>(width) * height * 4;
    queue.WriteTexture(&dst, surface->pixels, pixelBytes, &layout, &extent);

    // Generate and upload lower mip levels (2x2 box filter)
    {
        std::vector<uint8_t> prev(static_cast<uint8_t*>(surface->pixels),
                                  static_cast<uint8_t*>(surface->pixels) + pixelBytes);
        SDL_DestroySurface(surface);
        uint32_t pw = static_cast<uint32_t>(width), ph = static_cast<uint32_t>(height);
        for (uint32_t level = 1; level < mipCount; ++level) {
            uint32_t mw = std::max(1u, pw / 2);
            uint32_t mh = std::max(1u, ph / 2);
            std::vector<uint8_t> mip(mw * mh * 4);
            for (uint32_t y = 0; y < mh; ++y) {
                for (uint32_t x = 0; x < mw; ++x) {
                    uint32_t sx = std::min(x * 2, pw - 1);
                    uint32_t sy = std::min(y * 2, ph - 1);
                    uint32_t sx1 = std::min(sx + 1, pw - 1);
                    uint32_t sy1 = std::min(sy + 1, ph - 1);
                    for (int c = 0; c < 4; ++c) {
                        uint32_t sum = prev[(sy * pw + sx) * 4 + c]
                                     + prev[(sy * pw + sx1) * 4 + c]
                                     + prev[(sy1 * pw + sx) * 4 + c]
                                     + prev[(sy1 * pw + sx1) * 4 + c];
                        mip[(y * mw + x) * 4 + c] = static_cast<uint8_t>(sum / 4);
                    }
                }
            }
            wgpu::TexelCopyTextureInfo mipDst{
                .texture = tex, .mipLevel = level,
                .origin = {0, 0, 0}, .aspect = wgpu::TextureAspect::All,
            };
            wgpu::TexelCopyBufferLayout mipLayout{
                .offset = 0, .bytesPerRow = mw * 4, .rowsPerImage = mh,
            };
            wgpu::Extent3D mipExtent{mw, mh, 1};
            queue.WriteTexture(&mipDst, mip.data(), mip.size(), &mipLayout, &mipExtent);
            prev = std::move(mip);
            pw = mw;
            ph = mh;
        }
    }

    wgpu::TextureViewDescriptor viewDesc{
        .format = wgpu::TextureFormat::RGBA8Unorm,
        .dimension = wgpu::TextureViewDimension::e2D,
        .baseMipLevel = 0,
        .mipLevelCount = mipCount,
        .baseArrayLayer = 0,
        .arrayLayerCount = 1,
        .aspect = wgpu::TextureAspect::All,
    };
    wgpu::TextureView texView = tex.CreateView(&viewDesc);

    return {
        std::move(tex),
        std::move(texView),
        createSampler(device, mipCount),
        width,
        height,
    };
}

} // namespace

Texture Texture::fromFile(wgpu::Device device, wgpu::Queue queue, const char* path) {
    // Detect format by magic header (first 4 bytes)
    auto file = sq::openFile(path, true);
    if (!file || !*file) {
        throw std::runtime_error(std::string("Failed to open texture ") + path);
    }

    uint8_t magic[4]{};
    file->read(reinterpret_cast<char*>(magic), 4);
    if (!*file) {
        throw std::runtime_error(std::string("Failed to read texture header from ") + path);
    }

    TextureResult r;
    if (std::memcmp(magic, kSqTexMagic, 4) == 0) {
#ifdef SQ_HAS_TRANSCODER
        // Check if this is an ASTC sqtex on a device without ASTC support
        if (!device.HasFeature(wgpu::FeatureName::TextureCompressionASTC)) {
            // Peek at the encoding field (bytes 4-5 of the header)
            uint16_t enc = 0;
            file->read(reinterpret_cast<char*>(&enc), sizeof(enc));
            file->seekg(4); // rewind to after magic

            if (static_cast<SqTexEncoding>(enc) == SqTexEncoding::Astc4x4) {
                file.reset();
                auto cachePath = transcodeCachePath(path);

                // Try loading cached ETC2 version
                std::ifstream cached(cachePath, std::ios::binary);
                if (cached) {
                    uint8_t cachedMagic[4]{};
                    cached.read(reinterpret_cast<char*>(cachedMagic), 4);
                    if (cached && std::memcmp(cachedMagic, kSqTexMagic, 4) == 0) {
                        SPDLOG_INFO("Loading cached ETC2 texture: {}", cachePath);
                        r = loadSqtex(device, queue, cached, cachePath.c_str());
                        goto done;
                    }
                }

                // Cache miss — transcode ASTC→ETC2
                if (!transcodeAstcToEtc2(path, cachePath.c_str())) {
                    throw std::runtime_error(
                        std::string("Failed to transcode ASTC→ETC2 for ") + path);
                }

                // Load the freshly-written cache file
                std::ifstream fresh(cachePath, std::ios::binary);
                if (!fresh) {
                    throw std::runtime_error(
                        std::string("Failed to open transcoded texture ") + cachePath);
                }
                uint8_t freshMagic[4]{};
                fresh.read(reinterpret_cast<char*>(freshMagic), 4);
                r = loadSqtex(device, queue, fresh, cachePath.c_str());
                goto done;
            }
        }
#endif
        r = loadSqtex(device, queue, *file, path);
    } else if (std::memcmp(magic, kAstcMagic, 4) == 0) {
        r = loadAstc(device, queue, *file, path);
    } else {
        file.reset();
        r = loadSdlImage(device, queue, path);
    }

#ifdef SQ_HAS_TRANSCODER
done:
#endif
    auto impl = std::make_unique<M>();
    impl->texture = WgpuTexture(std::move(r.tex));
    impl->view = WgpuTextureView(std::move(r.view));
    impl->sampler = WgpuSampler(std::move(r.sampler));
    impl->width = r.width;
    impl->height = r.height;
    return Texture(std::move(impl));
}

} // namespace sq
