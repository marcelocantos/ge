// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <ge/GpuContext.h>
#include <ge/Protocol.h>
#include <ge/Session.h>
#include <SDL3/SDL_events.h>
#include <cstdint>
#include <functional>
#include <memory>
#include <span>
#include <string>
#include <vector>

class DaemonSink;

namespace ge {

class Audio;

// Streaming session: renders locally on a native GPU (like SessionDirect),
// captures frames, encodes H.264 via VideoToolbox, and streams NALs to a
// remote player via ged. Input events arrive from the player over the same
// WebSocket and are dispatched to the app's onEvent callback.
//
// Usage:
//   StreamSession stream(host, port, sessionId, sink);
//   stream.connect();     // WebSocket handshake + GPU init
//   // Now stream.gpu() is available for resource creation
//   auto config = factory(...);
//   stream.run(config);   // Render + encode + stream loop
class StreamSession {
public:
    // gpuWindow: pre-created hidden SDL_WINDOW_METAL window (must be created
    // on the main thread on macOS). Ownership is NOT transferred — caller
    // must keep it alive for the session's lifetime.
    StreamSession(const std::string& daemonHost, uint16_t daemonPort,
                  const std::string& sessionId,
                  std::shared_ptr<DaemonSink> sharedSink,
                  SDL_Window* gpuWindow);
    ~StreamSession();

    StreamSession(const StreamSession&) = delete;
    StreamSession& operator=(const StreamSession&) = delete;

    // Connect to ged, perform handshake with the player (receive DeviceInfo,
    // send SessionInit, wait for SessionReady), and initialize the local GPU
    // at the player's dimensions. After this call, gpu() is usable.
    // Throws on connection failure.
    void connect();

    Audio& audio();
    GpuContext& gpu();
    int width() const;
    int height() const;
    int pixelRatio() const;
    uint8_t deviceClass() const;
    uint8_t orientation() const;

    // Run the render + encode + stream loop using the same RunConfig shape
    // as Session::RunConfig. Returns true if the player disconnected (caller
    // should keep looping for reconnections), false on clean shutdown.
    bool run(Session::RunConfig config);

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace ge
