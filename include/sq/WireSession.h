#pragma once

#include <sq/GpuContext.h>
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

    // Run the render loop.  Installs SIGINT/SIGTERM handlers, calls onFrame
    // each iteration with the frame delta, and manages flush cadence.
    // Returns when the process receives a termination signal.
    void run(std::function<void(float dt)> onFrame);

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace sq
