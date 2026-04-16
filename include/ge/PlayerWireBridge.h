// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// PlayerWireBridge — the wire half of the player (brokered modality).
//
// Counterpart to ServerWireBridge on the server side. Owns the player's
// WebSocket to ged, the H.264 decoder, and the AVCC parameter-set parser.
// Handles the SessionConfig → DeviceInfo handshake, buffers the latest
// decoded frame for the render subsystem to consume, and sends input
// events upstream to the server.
//
// Deliberately agnostic of SDL windowing / rendering — the player render
// subsystem (PlayerRender) owns all SDL state.
#pragma once

#include <ge/Protocol.h>

#include <SDL3/SDL_events.h>

#include <cstddef>
#include <cstdint>
#include <memory>
#include <string>
#include <vector>

namespace ge {

class PlayerWireBridge {
public:
    struct Config {
        std::string host;
        int port = 42069;
        std::string serverName = "server";
        int connectTimeoutMs = 2000;
    };

    // A decoded BGRA video frame ready for display.
    struct DecodedFrame {
        std::vector<uint8_t> bgra;
        int width = 0;
        int height = 0;
        size_t bytesPerRow = 0;
    };

    explicit PlayerWireBridge(Config);
    ~PlayerWireBridge();

    PlayerWireBridge(const PlayerWireBridge&) = delete;
    PlayerWireBridge& operator=(const PlayerWireBridge&) = delete;

    // Connect to ged and wait for SessionConfig. Blocks until received
    // or connection fails. Fills `outConfig` on success.
    bool connect(wire::SessionConfig& outConfig);

    // Send DeviceInfo upstream. Call after connect() and after the
    // render subsystem has decided window dimensions.
    bool sendDeviceInfo(const wire::DeviceInfo&);

    // Send an SDL event (coordinate-mapped by caller) to the server.
    void sendEvent(const SDL_Event&);

    // Drain available wire messages, decoding any H.264 frames into the
    // internal frame buffer. Returns false if the connection has closed.
    bool pump();

    // If a new decoded frame is available since the last call, move it
    // into `out` and return true. Returns false if no new frame.
    bool pollFrame(DecodedFrame& out);

    // Stats for the frame log in the main loop.
    struct PumpStats {
        int framesThisTick = 0;
        uint32_t lastSeq = 0;
    };
    PumpStats lastPumpStats() const;

    bool isOpen() const;
    void close();

private:
    struct Impl;
    std::unique_ptr<Impl> i_;
};

} // namespace ge
