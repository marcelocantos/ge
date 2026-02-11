#pragma once

#include <sq/GpuContext.h>
#include <SDL3/SDL_events.h>
#include <functional>
#include <memory>

namespace sq {

class HttpServer;

// Wire session: creates an HTTP+WebSocket server, waits for a player to
// connect via WebSocket, performs the Dawn wire handshake, and acquires
// WebGPU resources (adapter, device, queue) through the wire protocol.
// The resulting GpuContext is owned by the session.
//
// Listen address is resolved in this order:
//   1. SQ_WIRE_ADDR environment variable
//   2. Default: "42069"
// Format: "port" or "address:port"
class WireSession {
public:
    WireSession();
    ~WireSession();

    WireSession(const WireSession&) = delete;
    WireSession& operator=(const WireSession&) = delete;

    // Access the HTTP server for registering endpoints.
    // Available immediately after construction (before connect()).
    HttpServer& http();

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
        std::function<void(wgpu::TextureView target)> onRender;
        std::function<void(const SDL_Event&)> onEvent;
        std::function<void(int w, int h)> onResize;
    };

    // Run the render loop. Returns when the receiver disconnects.
    // Ctrl+C terminates the process via the default SIGINT handler.
    void run(RunConfig config);

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace sq
