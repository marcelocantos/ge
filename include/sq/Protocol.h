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
constexpr uint32_t kFrameEndMagic = 0x59573246;    // "YW2F" — server → receiver: frame boundary
constexpr uint32_t kFrameReadyMagic = 0x59573247;  // "YW2G" — receiver → server: ready for next

constexpr uint16_t kProtocolVersion = 2;
constexpr size_t kMaxMessageSize = 512 * 1024 * 1024;  // 512MB (initial resource uploads can be large)

// Sent by receiver after connecting to game server
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
// Contains reserved handles that the receiver should inject native resources into
struct SessionInit {
    uint32_t magic = kSessionInitMagic;
    uint16_t version = kProtocolVersion;
    uint16_t reserved = 0;
    // Reserved handles from WireClient that receiver should inject into
    Handle instanceHandle;
    Handle adapterHandle;
    Handle deviceHandle;
    Handle queueHandle;
    Handle surfaceHandle;
};

// Sent by receiver after injecting native resources
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

} // namespace wire
