#pragma once

#include <dawn/wire/Wire.h>
#include <dawn/wire/WireClient.h>
#include <dawn/wire/WireServer.h>
#include <webgpu/webgpu.h>
#include <memory>
#include <vector>

namespace sq {

// In-process wire transport connecting WireClient to WireServer via memory buffers.
// Commands flow: App → WireClient → clientToServer buffer → WireServer → native GPU
// Responses flow: WireServer → serverToClient buffer → WireClient → App
class WireTransport {
public:
    WireTransport();
    ~WireTransport();

    // Initialize with native Dawn procs (from dawn_native).
    // After this, use wireProcs() for all WebGPU calls.
    void initialize(const DawnProcTable& nativeProcs);

    // Get the proc table that routes through the wire.
    // Use this instead of native procs for all WebGPU calls.
    const DawnProcTable& wireProcs() const;

    // Get the native proc table (for creating resources to inject).
    const DawnProcTable& nativeProcs() const;

    // Reserve a client-side instance handle and inject the server-side instance.
    // Returns the client-side WGPUInstance to use.
    // Also stores the wire handle internally for surface injection.
    WGPUInstance injectInstance(WGPUInstance nativeInstance);

    // Reserve a client-side surface handle and inject the server-side surface.
    // Must be called after injectInstance.
    // Returns the client-side WGPUSurface to use.
    WGPUSurface injectSurface(WGPUSurface nativeSurface);

    // Flush pending commands from client to server and responses back.
    // Call this after batches of WebGPU operations.
    void flush();

    // Access underlying wire components (for advanced use)
    dawn::wire::WireClient& client();
    dawn::wire::WireServer& server();

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace sq
