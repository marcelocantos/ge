#include <ge/TextureEncoder.h>
#include <ge/GeTexFormat.h>
#include <astcenc.h>
#include <ProcessRGB.hpp>
#include <stb_image_write.h>
#include <spdlog/spdlog.h>
#include <algorithm>
#include <cmath>
#include <cstring>
#include <fstream>
#include <stdexcept>
#include <string>
#include <vector>

namespace ge {

namespace {

// Downscale RGBA8 image by 2x using box filter (averages 2x2 pixel blocks).
// Handles odd dimensions by clamping source reads.
std::vector<uint8_t> downscale2x(const uint8_t* src, int w, int h) {
    int dw = std::max(1, w / 2);
    int dh = std::max(1, h / 2);
    std::vector<uint8_t> dst(dw * dh * 4);
    for (int y = 0; y < dh; ++y) {
        for (int x = 0; x < dw; ++x) {
            int r = 0, g = 0, b = 0, a = 0, n = 0;
            for (int sy = 0; sy < 2 && y * 2 + sy < h; ++sy) {
                for (int sx = 0; sx < 2 && x * 2 + sx < w; ++sx) {
                    const uint8_t* p = src + ((y * 2 + sy) * w + (x * 2 + sx)) * 4;
                    r += p[0]; g += p[1]; b += p[2]; a += p[3]; ++n;
                }
            }
            uint8_t* d = dst.data() + (y * dw + x) * 4;
            d[0] = static_cast<uint8_t>(r / n);
            d[1] = static_cast<uint8_t>(g / n);
            d[2] = static_cast<uint8_t>(b / n);
            d[3] = static_cast<uint8_t>(a / n);
        }
    }
    return dst;
}

int mipCount(int w, int h) {
    return static_cast<int>(std::floor(std::log2(std::max(w, h)))) + 1;
}

// ASTC-encode RGBA8 pixels. Returns compressed block data.
std::vector<uint8_t> astcEncode(const uint8_t* pixels, int w, int h) {
    astcenc_config config{};
    astcenc_error status = astcenc_config_init(
        ASTCENC_PRF_LDR, 4, 4, 1, ASTCENC_PRE_MEDIUM, 0, &config);
    if (status != ASTCENC_SUCCESS) {
        throw std::runtime_error(
            std::string("astcenc_config_init: ") + astcenc_get_error_string(status));
    }

    astcenc_context* ctx = nullptr;
    status = astcenc_context_alloc(&config, 1, &ctx);
    if (status != ASTCENC_SUCCESS) {
        throw std::runtime_error(
            std::string("astcenc_context_alloc: ") + astcenc_get_error_string(status));
    }

    uint8_t* slices = const_cast<uint8_t*>(pixels);
    astcenc_image image{};
    image.dim_x = static_cast<unsigned int>(w);
    image.dim_y = static_cast<unsigned int>(h);
    image.dim_z = 1;
    image.data_type = ASTCENC_TYPE_U8;
    image.data = reinterpret_cast<void**>(&slices);

    size_t blocksX = (static_cast<size_t>(w) + 3) / 4;
    size_t blocksY = (static_cast<size_t>(h) + 3) / 4;
    size_t compSize = blocksX * blocksY * 16;
    std::vector<uint8_t> comp(compSize);

    astcenc_swizzle swizzle{ASTCENC_SWZ_R, ASTCENC_SWZ_G, ASTCENC_SWZ_B, ASTCENC_SWZ_1};
    status = astcenc_compress_image(ctx, &image, &swizzle, comp.data(), compSize, 0);
    astcenc_context_free(ctx);

    if (status != ASTCENC_SUCCESS) {
        throw std::runtime_error(
            std::string("astcenc_compress_image: ") + astcenc_get_error_string(status));
    }

    return comp;
}

void pngWriteCallback(void* context, void* data, int size) {
    auto* vec = static_cast<std::vector<uint8_t>*>(context);
    auto* bytes = static_cast<const uint8_t*>(data);
    vec->insert(vec->end(), bytes, bytes + size);
}

// ETC2 EAC RGBA8 encode. Returns compressed block data (16 bytes per 4x4 block).
// etcpak expects BGRA pixel order (uint32_t = 0xAARRGGBB on little-endian),
// so we swizzle from our RGBA source and pad to block-aligned dimensions.
std::vector<uint8_t> etc2Encode(const uint8_t* pixels, int w, int h) {
    int pw = (w + 3) & ~3; // padded width (multiple of 4)
    int ph = (h + 3) & ~3; // padded height (multiple of 4)
    size_t blocksX = static_cast<size_t>(pw) / 4;
    size_t blocksY = static_cast<size_t>(ph) / 4;
    size_t totalBlocks = blocksX * blocksY;

    // Convert RGBA → BGRA and pad to block-aligned dimensions
    std::vector<uint32_t> bgra(static_cast<size_t>(pw) * ph, 0);
    for (int y = 0; y < h; ++y) {
        for (int x = 0; x < w; ++x) {
            const uint8_t* p = pixels + (y * w + x) * 4;
            bgra[y * pw + x] = uint32_t(p[2])
                              | (uint32_t(p[1]) << 8)
                              | (uint32_t(p[0]) << 16)
                              | (uint32_t(p[3]) << 24);
        }
    }

    // ETC2 EAC RGBA8: 16 bytes per block = 2 uint64_t per block
    std::vector<uint8_t> comp(totalBlocks * 16);
    CompressEtc2Rgba(bgra.data(), reinterpret_cast<uint64_t*>(comp.data()),
                     static_cast<uint32_t>(totalBlocks),
                     static_cast<size_t>(pw), true);
    return comp;
}

// PNG-encode RGBA8 pixels to memory. Returns PNG blob.
std::vector<uint8_t> pngEncode(const uint8_t* pixels, int w, int h) {
    std::vector<uint8_t> result;
    if (!stbi_write_png_to_func(pngWriteCallback, &result, w, h, 4, pixels, w * 4)) {
        throw std::runtime_error("stbi_write_png_to_func failed");
    }
    return result;
}

bool endsWith(const std::string& s, const std::string& suffix) {
    return s.size() >= suffix.size() &&
           s.compare(s.size() - suffix.size(), suffix.size(), suffix) == 0;
}

void writeSqtex(const char* path, GeTexEncoding encoding,
                const uint8_t* pixels, int w, int h) {
    int levels = mipCount(w, h);
    auto encodingName = [&] {
        switch (encoding) {
            case GeTexEncoding::Astc4x4:   return "ASTC 4x4";
            case GeTexEncoding::Etc2Rgba8: return "ETC2 RGBA8";
            case GeTexEncoding::Png:       return "PNG";
        }
        return "unknown";
    }();
    SPDLOG_INFO("Encoding {} ({}x{}, {} mip levels, {})", path, w, h, levels, encodingName);

    // Generate all mip levels
    std::vector<std::vector<uint8_t>> levelData;
    levelData.reserve(levels);

    std::vector<uint8_t> current(pixels, pixels + static_cast<size_t>(w) * h * 4);
    int mw = w, mh = h;

    for (int level = 0; level < levels; ++level) {
        if (encoding == GeTexEncoding::Astc4x4) {
            levelData.push_back(astcEncode(current.data(), mw, mh));
        } else if (encoding == GeTexEncoding::Etc2Rgba8) {
            levelData.push_back(etc2Encode(current.data(), mw, mh));
        } else {
            levelData.push_back(pngEncode(current.data(), mw, mh));
        }

        SPDLOG_INFO("  level {}: {}x{} → {} bytes", level, mw, mh, levelData.back().size());

        if (mw > 1 || mh > 1) {
            current = downscale2x(current.data(), mw, mh);
            mw = std::max(1, mw / 2);
            mh = std::max(1, mh / 2);
        }
    }

    // Write file
    std::ofstream out(path, std::ios::binary);
    if (!out) {
        throw std::runtime_error(std::string("Failed to open ") + path + " for writing");
    }

    GeTexHeader hdr{};
    std::memcpy(hdr.magic, kGeTexMagic, 4);
    hdr.encoding = static_cast<uint16_t>(encoding);
    hdr.mipCount = static_cast<uint16_t>(levels);
    hdr.width = static_cast<uint32_t>(w);
    hdr.height = static_cast<uint32_t>(h);
    out.write(reinterpret_cast<const char*>(&hdr), sizeof(hdr));

    // Level size table
    for (int level = 0; level < levels; ++level) {
        auto size = static_cast<uint32_t>(levelData[level].size());
        out.write(reinterpret_cast<const char*>(&size), sizeof(size));
    }

    // Level data
    for (int level = 0; level < levels; ++level) {
        out.write(reinterpret_cast<const char*>(levelData[level].data()),
                  static_cast<std::streamsize>(levelData[level].size()));
    }

    if (!out.good()) {
        throw std::runtime_error(std::string("Failed to write ") + path);
    }

    SPDLOG_INFO("Written: {}", path);
}

void writeSingleAstc(const char* path, const uint8_t* pixels, int w, int h) {
    SPDLOG_INFO("Encoding {} ({}x{}, single-level ASTC 4x4)", path, w, h);

    auto comp = astcEncode(pixels, w, h);

    std::ofstream out(path, std::ios::binary);
    if (!out) {
        throw std::runtime_error(std::string("Failed to open ") + path + " for writing");
    }

    // ASTC file header
    uint8_t magic[4] = {0x13, 0xAB, 0xA1, 0x5C};
    out.write(reinterpret_cast<const char*>(magic), 4);

    uint8_t blockDim[3] = {4, 4, 1};
    out.write(reinterpret_cast<const char*>(blockDim), 3);

    auto write24 = [&](uint32_t val) {
        uint8_t buf[3] = {
            static_cast<uint8_t>(val & 0xFF),
            static_cast<uint8_t>((val >> 8) & 0xFF),
            static_cast<uint8_t>((val >> 16) & 0xFF)};
        out.write(reinterpret_cast<const char*>(buf), 3);
    };
    write24(static_cast<uint32_t>(w));
    write24(static_cast<uint32_t>(h));
    write24(1);

    out.write(reinterpret_cast<const char*>(comp.data()),
              static_cast<std::streamsize>(comp.size()));

    if (!out.good()) {
        throw std::runtime_error(std::string("Failed to write ") + path);
    }

    SPDLOG_INFO("Written: {}", path);
}

void writeSinglePng(const char* path, const uint8_t* pixels, int w, int h) {
    SPDLOG_INFO("Encoding {} ({}x{}, single-level PNG)", path, w, h);
    if (!stbi_write_png(path, w, h, 4, pixels, w * 4)) {
        throw std::runtime_error(std::string("Failed to write PNG ") + path);
    }
    SPDLOG_INFO("Written: {}", path);
}

} // namespace

void textureToFile(const char* path, const uint8_t* pixels, int width, int height) {
    std::string p(path);

    if (endsWith(p, ".astc.getex")) {
        writeSqtex(path, GeTexEncoding::Astc4x4, pixels, width, height);
    } else if (endsWith(p, ".etc2.getex")) {
        writeSqtex(path, GeTexEncoding::Etc2Rgba8, pixels, width, height);
    } else if (endsWith(p, ".png.getex")) {
        writeSqtex(path, GeTexEncoding::Png, pixels, width, height);
    } else if (endsWith(p, ".astc")) {
        writeSingleAstc(path, pixels, width, height);
    } else if (endsWith(p, ".png")) {
        writeSinglePng(path, pixels, width, height);
    } else {
        throw std::runtime_error(
            std::string("Unknown texture format for path: ") + path);
    }
}

} // namespace ge
