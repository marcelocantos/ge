#pragma once

#include <sq/GpuContext.h>
#include <SDL3/SDL_events.h>
#include <functional>
#include <memory>

namespace sq {

// TCP wire session: listens for a receiver connection, performs the wire
// handshake, and acquires WebGPU resources (adapter, device, queue) through
// the Dawn wire protocol.  The resulting GpuContext is owned by the session.
//
// Listen address is resolved in this order:
//   1. Explicit listenAddr argument (if non-empty)
//   2. SQ_WIRE_ADDR environment variable
//   3. Default: "42069"
// Format: "port" or "address:port"
class WireSession {
public:
    WireSession();
    ~WireSession();

    WireSession(const WireSession&) = delete;
    WireSession& operator=(const WireSession&) = delete;

    // Access the GpuContext created from wire resources.
    GpuContext& gpu();

    // Flush wire commands to receiver and process responses.
    void flush();

    enum class StopReason { Signal, Disconnected };

    // Run the render loop.  Installs SIGINT/SIGTERM handlers, calls onFrame
    // each iteration with the frame delta, and manages flush cadence.
    // onEvent (optional) is called for each SDL event received from the receiver.
    // Returns Signal on SIGINT/SIGTERM, Disconnected if the receiver drops.
    StopReason run(std::function<void(float dt)> onFrame,
                   std::function<void(const SDL_Event&)> onEvent = {});

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace sq
