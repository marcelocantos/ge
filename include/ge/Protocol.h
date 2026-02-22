#pragma once

#include <bit>
#include <cstdint>
#include <cstddef>

static_assert(std::endian::native == std::endian::little, "Little-endian required");

namespace wire {

// Magic numbers for message type identification (ASCII: "YW2x")
constexpr uint32_t kDeviceInfoMagic = 0x59573244;   // "YW2D"
constexpr uint32_t kSessionInitMagic = 0x59573253;  // "YW2S"
constexpr uint32_t kWireCommandMagic = 0x59573243;  // "YW2C"
constexpr uint32_t kWireResponseMagic = 0x59573252; // "YW2R"
constexpr uint32_t kSdlEventMagic = 0x59573249;    // "YW2I"
constexpr uint32_t kFrameEndMagic = 0x59573246;    // "YW2F" — server → player: frame boundary
constexpr uint32_t kFrameReadyMagic = 0x59573247;  // "YW2G" — player → server: ready for next
constexpr uint32_t kDeferredMipMagic = 0x59573248; // "YW2H" — server → player: deferred mip data
constexpr uint32_t kMipCacheHitMagic = 0x5957324A; // "YW2J" — player → server: cached mip found
constexpr uint32_t kMipCacheMissMagic = 0x5957324B; // "YW2K" — player → server: cached mip not found
constexpr uint32_t kSessionEndMagic = 0x5957324D;   // "YW2M" — ged → player: server disconnected
constexpr uint32_t kSensorConfigMagic = 0x5957324C; // "YW2L" — server → player: sensor config
constexpr uint32_t kAudioDataMagic = 0x59573241;    // "YW2A" — server → player: audio asset data
constexpr uint32_t kAudioCommandMagic = 0x59573242;  // "YW2B" — server → player: audio play/stop/volume

constexpr uint16_t kProtocolVersion = 2;
constexpr size_t kMaxMessageSize = 512 * 1024 * 1024;  // 512MB (initial resource uploads can be large)

// Sent by player after connecting to game server
struct DeviceInfo {
    uint32_t magic = kDeviceInfoMagic;
    uint16_t version = kProtocolVersion;
    uint16_t width;           // Device width in pixels (e.g., 390 for iPhone 14 Pro)
    uint16_t height;          // Device height in pixels (e.g., 844)
    uint16_t pixelRatio;      // Device pixel ratio (e.g., 3 for retina)
    uint16_t reserved = 0;
    uint32_t preferredFormat; // wgpu::TextureFormat value
};

// Wire handle (matches dawn::wire::Handle)
struct Handle {
    uint32_t id;
    uint32_t generation;
};

// Sent by game server after receiving DeviceInfo
// Contains reserved handles that the player should inject native resources into
struct SessionInit {
    uint32_t magic = kSessionInitMagic;
    uint16_t version = kProtocolVersion;
    uint16_t reserved = 0;
    // Reserved handles from WireClient that player should inject into
    Handle instanceHandle;
    Handle adapterHandle;
    Handle deviceHandle;
    Handle queueHandle;
    Handle surfaceHandle;
};

// Sent by player after injecting native resources
constexpr uint32_t kSessionReadyMagic = 0x59573259;  // "YW2Y"
struct SessionReady {
    uint32_t magic = kSessionReadyMagic;
    uint16_t version = kProtocolVersion;
    uint16_t reserved = 0;
};

// Header for wire command/response messages
struct MessageHeader {
    uint32_t magic;   // kWireCommandMagic, kWireResponseMagic, or kSdlEventMagic
    uint32_t length;  // Payload length in bytes
};

// Split boundary: first kMipHeadSize bytes of a WriteTexture wire command contain
// non-deterministic wire ObjectIds; the remainder is deterministic pixel data.
constexpr size_t kMipHeadSize = 128;

// Payload header for kDeferredMipMagic messages (follows MessageHeader)
struct DeferredMipHeader {
    uint32_t textureId;    // wire ObjectId of the texture
    uint32_t mipLevel;     // which mip level this delivers
    uint32_t commandSize;  // bytes following this header (head + tail or head + hash)
    uint8_t  hashOnly;     // 1 = probe (head[128] + hash[8]), 0 = full (head[128] + tail[])
    uint8_t  reserved[3] = {};
};

// Player → server response to a hash probe
struct MipCacheResponse {
    uint32_t textureId;
    uint32_t mipLevel;
};

// Sensor configuration (server → player)
struct SensorConfig {
    uint32_t magic = kSensorConfigMagic;
    uint8_t sensorType;   // SDL_SensorType value (e.g. SDL_SENSOR_ACCEL = 1)
    uint8_t enabled;      // 1 = enable, 0 = disable
    uint16_t reserved = 0;
};

// FNV-1a 64-bit hash (deterministic, used for mip cache probes)
inline uint64_t fnv1a64(const char* data, size_t size) {
    uint64_t hash = 0xcbf29ce484222325ULL;
    for (size_t i = 0; i < size; ++i) {
        hash ^= static_cast<uint8_t>(data[i]);
        hash *= 0x100000001b3ULL;
    }
    return hash;
}

// Audio data header (server → player, followed by raw file bytes)
struct AudioData {
    uint32_t audioId;     // 0-based clip index
    uint32_t format;      // 0 = WAV, 1 = MP3
    uint32_t flags;       // bit 0 = loop
    uint32_t dataLength;  // byte count of audio file data following this header
};

// Audio playback command (server → player)
struct AudioCommand {
    uint32_t command;     // 0 = play, 1 = stop, 2 = setVolume
    uint32_t audioId;
    float volume;         // 0.0 – 1.0
    uint32_t reserved = 0;
};

} // namespace wire
