#pragma once

#include <sq/GpuContext.h>
#include <SDL3/SDL_events.h>
#include <functional>
#include <memory>

namespace sq {

class Audio;
class HttpServer;

// Unified session: wire mode (default) or direct native mode (SQ_DIRECT).
// Drop-in replacement for WireSession — same interface, backend selected
// at compile time. Two separate compilation units (SessionWire.cpp,
// SessionDirect.cpp) each guarded by #if, so the unused backend's
// dependencies never enter the final binary.
class Session {
public:
    Session();
    ~Session();

    Session(const Session&) = delete;
    Session& operator=(const Session&) = delete;

    HttpServer* http();
    Audio& audio();
    void connect();
    GpuContext& gpu();
    int pixelRatio() const;
    void flush();

    // Render loop configuration.
    struct RunConfig {
        std::function<void(float dt)> onUpdate;
        std::function<void(wgpu::TextureView target, int w, int h)> onRender;
        std::function<void(const SDL_Event&)> onEvent;
        std::function<void(int w, int h)> onResize;
        uint32_t sensors = 0;  // bitmask of requested SDL_SensorType values
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

} // namespace sq
