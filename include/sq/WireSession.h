#pragma once

#include <sq/GpuContext.h>
#include <functional>
#include <memory>
#include <string>

namespace sq {

// TCP wire session: listens for a receiver connection, performs the wire
// handshake, and acquires WebGPU resources (adapter, device, queue) through
// the Dawn wire protocol.  The resulting GpuContext is owned by the session.
class WireSession {
public:
    // Listen on listenAddr ("port" or "address:port"), accept one receiver,
    // perform handshake, acquire adapter/device.  Blocks until ready.
    // shouldContinue is polled during async waits — return false to abort.
    explicit WireSession(const std::string& listenAddr,
                         std::function<bool()> shouldContinue = {});
    ~WireSession();

    WireSession(const WireSession&) = delete;
    WireSession& operator=(const WireSession&) = delete;

    // Access the GpuContext created from wire resources.
    GpuContext& gpu();

    // Flush wire commands to receiver and process responses.
    // Call once per frame after rendering.
    void flush();

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace sq
