#pragma once

// TODO: 🎯T11.1.1 — replace hand-rolled constants and structs in this file
// with generated bindings from protocol/ge_wire.yaml.
// Generated outputs (DO NOT EDIT — regenerate via `make protogen`):
//   C header:  include/ge/generated/gewire_gen.h
//   C impl:    src/generated/gewire_gen.c
//   Go:        protocol/gewire_gen.go
//   Swift:     tools/ios/generated/GeWireMachine.swift
//   Kotlin:    tools/android/generated/GeWireMachine.kt
//   TypeScript: web/src/GeWireMachine.ts

#include <SDL3/SDL_video.h>

#include <bit>
#include <cstdint>
#include <cstddef>

static_assert(std::endian::native == std::endian::little, "Little-endian required");

// Wire protocol for the H.264 streaming dev mode.
// The server renders headless via bgfx, encodes H.264 frames, and streams them
// to the player over a ged-brokered WebSocket. The player decodes and displays
// frames, and forwards SDL input back to the server over the same channel.
//
// The Dawn wire protocol that previously lived here has been removed along
// with the rest of the Dawn/WebGPU dependency.
namespace wire {

// Magic numbers for message type identification (ASCII: "GE2x")
constexpr uint32_t kDeviceInfoMagic     = 0x47453244;  // "GE2D" — player → ged: player dimensions/class
constexpr uint32_t kSdlEventMagic       = 0x47453249;  // "GE2I" — player → server: SDL input event
constexpr uint32_t kSessionEndMagic     = 0x4745324D;  // "GE2M" — ged → player: server disconnected
constexpr uint32_t kServerAssignedMagic = 0x4745324E;  // "GE2N" — ged → player: assigned server name
constexpr uint32_t kSqlpipeMsgMagic     = 0x47453254;  // "GE2T" — bidirectional sqlpipe messages
constexpr uint32_t kVideoStreamMagic    = 0x47453256;  // "GE2V" — server → ged: H.264 NALs
constexpr uint32_t kStreamStartMagic    = 0x47453257;  // "GE2W" — ged → player: start streaming
constexpr uint32_t kStreamStopMagic     = 0x47453258;  // "GE2X" — ged → player: stop streaming
constexpr uint32_t kSafeAreaMagic       = 0x47453245;  // "GE2E" — player → server: safe area update
constexpr uint32_t kAspectLockMagic     = 0x47453260;  // "GE2`" — server → player: lock aspect ratio
constexpr uint32_t kSessionConfigMagic  = 0x47453243;  // "GE2C" — server → player: session requirements

constexpr uint16_t kProtocolVersion = 6;  // Dawn wire removed
constexpr size_t   kMaxMessageSize = 512 * 1024 * 1024;  // 512MB (matches ged/bridge.go)

// Sent by player after connecting to the game server (via ged).
struct DeviceInfo {
    uint32_t magic = kDeviceInfoMagic;
    uint16_t version = kProtocolVersion;
    uint16_t width;           // Device width in pixels
    uint16_t height;          // Device height in pixels
    uint16_t pixelRatio;      // Device pixel ratio (e.g., 3 for retina)
    uint8_t  deviceClass = 0; // 0=unknown, 1=phone, 2=tablet, 3=desktop
    uint8_t  orientation = 0; // SDL_DisplayOrientation value (0-4)
    uint16_t safeX = 0;       // Safe area left edge in pixels
    uint16_t safeY = 0;       // Safe area top edge in pixels
    uint16_t safeW = 0;       // Safe area width in pixels (0 = use full width)
    uint16_t safeH = 0;       // Safe area height in pixels (0 = use full height)
};

// Safe area update (player → server, sent on orientation change).
struct SafeAreaUpdate {
    uint32_t magic = kSafeAreaMagic;
    uint16_t safeX;
    uint16_t safeY;
    uint16_t safeW;
    uint16_t safeH;
};

// Server → player: lock window aspect ratio. Send 0.0 to unlock.
struct AspectLock {
    uint32_t magic = kAspectLockMagic;
    float ratio;  // width/height (e.g. 0.6948 for 954:1373), 0 = unlock
};

// Server → player: session requirements (sensors, orientation).
// Sent once after session setup; player applies immediately.
struct SessionConfig {
    uint32_t magic = kSessionConfigMagic;
    uint8_t  sensors;       // Bitmask: kSensorAccelerometer
    uint8_t  orientation;   // kOrientation* value to lock, 0 = no lock
    uint8_t  _pad[2] = {};
};

constexpr uint8_t kSensorAccelerometer = 1;

// Orientation constants — assigned from SDL_DisplayOrientation.
constexpr uint8_t kOrientationLandscape        = SDL_ORIENTATION_LANDSCAPE;
constexpr uint8_t kOrientationLandscapeFlipped = SDL_ORIENTATION_LANDSCAPE_FLIPPED;
constexpr uint8_t kOrientationPortrait         = SDL_ORIENTATION_PORTRAIT;
constexpr uint8_t kOrientationPortraitFlipped  = SDL_ORIENTATION_PORTRAIT_FLIPPED;

// Header for binary wire messages.
struct MessageHeader {
    uint32_t magic;
    uint32_t length;  // Payload length in bytes
};

} // namespace wire
