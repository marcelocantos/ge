#pragma once

#include <ge/GpuContext.h>
#include <SDL3/SDL_events.h>
#include <linalg.h>
#include <cstdint>
#include <functional>
#include <memory>
#include <span>
#include <string>
#include <vector>

#ifndef GE_DIRECT
class DaemonSink;
#endif

namespace ge {

class Audio;

// Unified session: wire mode (default) or direct native mode (GE_DIRECT).
// Drop-in replacement for WireSession -- same interface, backend selected
// at compile time. Two separate compilation units (SessionWire.cpp,
// SessionDirect.cpp) each guarded by #if, so the unused backend's
// dependencies never enter the final binary.
class Session {
public:
#ifdef GE_DIRECT
    Session();
#else
    // Hosted mode: SessionHost owns the sideband; this session connects
    // its wire WS to /ws/server/wire/{sessionId}.
    Session(const std::string& daemonHost, uint16_t daemonPort,
            const std::string& sessionId,
            std::shared_ptr<DaemonSink> sharedSink);
#endif

    // Headless mode: wraps an existing GpuContext for testing.
    // Pass-through viewport, no SDL window or wire transport.
    explicit Session(GpuContext& ctx);

    ~Session();

    Session(const Session&) = delete;
    Session& operator=(const Session&) = delete;

    Audio& audio();
    void connect();
    GpuContext& gpu();
    int width() const;   // Safe-area-adjusted width (portrait-space if portraitLock)
    int height() const;  // Safe-area-adjusted height (portrait-space if portraitLock)
    int pixelRatio() const;
    uint8_t deviceClass() const;
    uint8_t orientation() const;

    // Smooth orientation angle (radians) tracking physical device orientation.
    // 0 = portrait, π/2 = landscape left, -π/2 = landscape right, π = upside-down.
    // Animated with S-curve easing when orientation changes. Updated each frame
    // before onUpdate. Always 0 on desktop.
    float orientationAngle() const;

    // Counter-rotation matrix for clip space. Compensates for iOS window
    // rotation so portrait content appears upright. Identity in portrait.
    linalg::aliases::float4x4 orientationRot() const;

    // Viewport helpers: accept portrait-space coordinates and translate to
    // real surface coordinates based on current orientation. When portraitLock
    // is off, these are pass-through.
    void setViewport(wgpu::RenderPassEncoder& pass,
                     float x, float y, float w, float h,
                     float minDepth = 0.f, float maxDepth = 1.f);
    void setScissorRect(wgpu::RenderPassEncoder& pass,
                        uint32_t x, uint32_t y, uint32_t w, uint32_t h);

    void setSessionFlags(uint16_t flags);
    void flush();

    // Render loop configuration.
    struct RunConfig {
        std::function<void(float dt)> onUpdate;
        std::function<void(wgpu::TextureView target, int w, int h)> onRender;
        std::function<void(const SDL_Event&)> onEvent;
        std::function<void(int w, int h)> onResize;
        bool portraitLock = false;  // Keep surface at portrait dimensions; transform touch events
        bool ignoreSafeArea = false;  // When true, use full surface (ignore OS safe area insets)
        uint32_t sensors = 0;  // bitmask of requested SDL_SensorType values

        // State sync (wire mode only). If onStateReceived is set, the
        // session sends kStateRequestMagic (with appId as payload) after
        // handshake, waits for kStateDataMagic, and calls onStateReceived
        // with the raw bytes before the render loop.
        std::string appId;
        std::function<void(std::vector<char> dbBytes)> onStateReceived;

        // Called after each frame. Returns serialized messages to send to
        // the player as kSqlpipeMsgMagic frames. Empty = nothing to send.
        std::function<std::vector<std::vector<uint8_t>>()> drainMessages;

        // Called when a kSqlpipeMsgMagic frame arrives from the player.
        std::function<void(std::span<const uint8_t>)> onMessage;
    };

    // Sensor request bitmask constants (1 << SDL_SensorType)
    static constexpr uint32_t kSensorAccelerometer = (1u << 1); // SDL_SENSOR_ACCEL
    static constexpr uint32_t kSensorGyroscope     = (1u << 2); // SDL_SENSOR_GYRO

    // Returns true if the caller should loop (wire: receiver disconnected),
    // false if the session is done (direct: user quit).
    bool run(RunConfig config);

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace ge
