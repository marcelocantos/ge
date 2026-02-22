#pragma once

#include <ge/GpuContext.h>
#include <SDL3/SDL_events.h>
#include <functional>
#include <memory>
#include <string>

class DaemonSink;

namespace ge {

class Audio;

class WireSession {
public:
    // Hosted mode: SessionHost owns the sideband; this session connects
    // its wire WS to /ws/server/wire/{sessionId}.
    WireSession(const std::string& daemonHost, uint16_t daemonPort,
                const std::string& sessionId,
                std::shared_ptr<DaemonSink> sharedSink);

    ~WireSession();

    WireSession(const WireSession&) = delete;
    WireSession& operator=(const WireSession&) = delete;

    // Access the audio system for loading and playing sounds.
    Audio& audio();

    // Block until a player connects via WebSocket and complete the
    // Dawn wire handshake.  After this, gpu() and pixelRatio() are valid.
    void connect();

    // Access the GpuContext created from wire resources.
    GpuContext& gpu();

    // Device pixel ratio (e.g. 3 for 3x retina). Available after connect().
    int pixelRatio() const;

    // Flush wire commands to receiver and process responses.
    void flush();

    // Render loop configuration.
    struct RunConfig {
        std::function<void(float dt)> onUpdate;
        std::function<void(wgpu::TextureView target, int w, int h)> onRender;
        std::function<void(const SDL_Event&)> onEvent;
        std::function<void(int w, int h)> onResize;
        uint32_t sensors = 0;  // bitmask of requested SDL_SensorType values
    };

    // Run the render loop. Returns true on player disconnect (reconnectable),
    // false on server stop (SIGINT).
    bool run(RunConfig config);

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace ge
