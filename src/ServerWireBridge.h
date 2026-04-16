// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// ServerWireBridge — RenderHost for the brokered (player) modality,
// server side.
//
// Owns a per-session WebSocket wire to a single attached player, the
// headless bgfx framebuffer that captures the engine's draw output, and
// the H.264 encoder that streams frames over the wire. Receives SDL
// events from the wire and dispatches them to the engine.
//
// The sideband orchestration (listening for player_attached/detached,
// lazy global bgfx init, per-session lifecycle) stays in SessionHost.mm
// — that's a multi-session concern outside the per-session contract.
#pragma once

#include <ge/RenderHost.h>
#include <ge/VideoEncoder.h>
#include <ge/WebSocketClient.h>

#include <bgfx/bgfx.h>

#include <memory>
#include <string>

namespace ge {

class ServerWireBridge : public RenderHost {
public:
    ServerWireBridge(std::string sessionId, std::shared_ptr<WsConnection> wire);
    ~ServerWireBridge() override;

    ServerWireBridge(const ServerWireBridge&) = delete;
    ServerWireBridge& operator=(const ServerWireBridge&) = delete;

    // Drain wire messages. On DeviceInfo arrival, dimensions become valid
    // (caller should then call initialise()). On later SDL events, invokes
    // the registered handler. Returns false if the wire is closed.
    bool pumpWire();

    // True after DeviceInfo arrives — width()/height() are valid; capture
    // can be initialised. False before that.
    bool hasDimensions() const;

    // Initialise capture framebuffer + encoder. Caller must have inited
    // bgfx first. After this call, isReady() returns true.
    void initialise();

    // True after initialise() — ready to render.
    bool isReady() const;

    const std::string& id() const;
    bgfx::FrameBufferHandle framebuffer() const;

    // RenderHost
    int width() const override;
    int height() const override;
    DeviceClass deviceClass() const override;

    void send(const wire::SessionConfig&) override;
    void setEventHandler(std::function<void(const SDL_Event&)>) override;
    void pumpEvents() override;  // alias for pumpWire
    void beginFrame() override;
    void endFrame(uint32_t bgfxFrameNumber) override;
    bool shouldQuit() const override;

    // Final cleanup: destroy bgfx resources, flush encoder.
    void shutdown();

private:
    struct Impl;
    std::unique_ptr<Impl> i_;
};

} // namespace ge
