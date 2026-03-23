// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/StreamSession.h>

#ifdef __APPLE__

#include <ge/Audio.h>
#include <ge/CaptureTarget.h>
#include <ge/SharedTexture.h>
#include <ge/DeltaTimer.h>
#include <ge/Protocol.h>
#include <ge/VideoEncoder.h>
#include <SDL3/SDL.h>
#include <SDL3/SDL_metal.h>
#include <dawn/dawn_proc.h>
#include <dawn/native/DawnNative.h>
#include <spdlog/spdlog.h>

#include "DaemonSink.h"
#include "WebSocketClient.h"
#include "WebSocketSerializer.h"

#include <algorithm>
#include <chrono>
#include <cstring>
#include <thread>

namespace ge {

struct StreamSession::M {
    std::string daemonHost;
    uint16_t daemonPort;
    std::string sessionId;
    std::shared_ptr<DaemonSink> daemonSink;

    // SDL hidden window + Metal (needed for native WebGPU)
    SDL_Window* window = nullptr;
    SDL_MetalView metalView = nullptr;
    bool ownsWindow = false;

    // Native GPU
    std::unique_ptr<GpuContext> gpu;
    Audio audio;

    // Offscreen capture + H.264 encoding
    std::unique_ptr<CaptureTarget> capture;
    std::unique_ptr<ge::SharedTexture> sharedTex;
    std::unique_ptr<VideoEncoder> encoder;

    // WebSocket to ged (per-session wire path)
    std::shared_ptr<WsConnection> wsConn;
    std::unique_ptr<WebSocketSerializer> serializer;

    // Player info (from DeviceInfo)
    int playerWidth = 0;
    int playerHeight = 0;
    int playerPixelRatio = 1;
    uint8_t playerDeviceClass = 0;
    uint8_t playerOrientation = 0;

    // Encode dimensions (even for H.264)
    int encodeW = 0;
    int encodeH = 0;

    bool sentParameterSets = false;
    int frameSkipCounter = 0;
    static constexpr int kEncodeEveryN = 2; // ~30fps encode at 60fps render

    M(const std::string& host, uint16_t port, const std::string& sid,
      std::shared_ptr<DaemonSink> sink)
        : daemonHost(host), daemonPort(port), sessionId(sid),
          daemonSink(std::move(sink)) {}

    ~M() {
        encoder.reset();
        sharedTex.reset();
        capture.reset();
        gpu.reset();
        if (metalView) SDL_Metal_DestroyView(metalView);
        if (ownsWindow && window) SDL_DestroyWindow(window);
    }

    void initGpu(int width, int height) {
        // Create a fresh hidden window at the exact dimensions needed.
        // This runs on the main thread (SessionHost::run drives the session).
        if (window) {
            // Destroy the pre-created window — we need one at the right size.
            SDL_DestroyWindow(window);
        }
        window = SDL_CreateWindow("ge-stream", width, height,
                                  SDL_WINDOW_HIDDEN | SDL_WINDOW_METAL);
        if (!window) {
            throw std::runtime_error(
                std::string("SDL_CreateWindow failed: ") + SDL_GetError());
        }
        ownsWindow = true;

        metalView = SDL_Metal_CreateView(window);
        if (!metalView) {
            SDL_DestroyWindow(window);
            window = nullptr;
            throw std::runtime_error(
                std::string("SDL_Metal_CreateView failed: ") + SDL_GetError());
        }

        void* metalLayer = SDL_Metal_GetLayer(metalView);
        gpu = std::make_unique<GpuContext>(metalLayer, width, height);

        // CaptureTarget must match the swap chain format (BGRA8Unorm) because
        // the app's pipelines are created with ctx.swapChainFormat().
        capture = std::make_unique<CaptureTarget>(
            gpu->device(), width, height, wgpu::TextureFormat::BGRA8Unorm);

        // SharedTexture for zero-copy H.264 encoding via IOSurface
        sharedTex = std::make_unique<ge::SharedTexture>(gpu->device(), width, height);

        SPDLOG_INFO("StreamSession GPU initialized: {}x{}", width, height);
    }

    void initEncoder(int width, int height) {
        encoder = std::make_unique<VideoEncoder>(
            width, height, 30,
            [this](VideoEncoder::Frame frame) {
                sendFrame(frame);
            });
    }

    void sendFrame(const VideoEncoder::Frame& frame) {
        if (!serializer) return;

        // Wire format: [1-byte flags] [AV1 frame data]
        // flags: bit 0 = keyframe
        std::vector<char> msg;
        msg.reserve(1 + frame.size);
        uint8_t flags = frame.isKeyframe ? 0x01 : 0x00;
        msg.push_back(static_cast<char>(flags));
        msg.insert(msg.end(),
                   reinterpret_cast<const char*>(frame.data),
                   reinterpret_cast<const char*>(frame.data + frame.size));

        try {
            serializer->sendMessage(wire::kVideoStreamMagic,
                                    msg.data(), msg.size());
        } catch (const std::exception&) {
            SPDLOG_WARN("Failed to send video frame");
        }
    }
};

StreamSession::StreamSession(const std::string& daemonHost, uint16_t daemonPort,
                             const std::string& sessionId,
                             std::shared_ptr<DaemonSink> sharedSink,
                             SDL_Window* gpuWindow)
    : m(std::make_unique<M>(daemonHost, daemonPort, sessionId,
                            std::move(sharedSink))) {
    m->window = gpuWindow;
}

StreamSession::~StreamSession() = default;

Audio& StreamSession::audio() { return m->audio; }
GpuContext& StreamSession::gpu() { return *m->gpu; }
int StreamSession::width() const { return m->playerWidth; }
int StreamSession::height() const { return m->playerHeight; }
int StreamSession::pixelRatio() const { return m->playerPixelRatio; }
uint8_t StreamSession::deviceClass() const { return m->playerDeviceClass; }
uint8_t StreamSession::orientation() const { return m->playerOrientation; }

void StreamSession::connect() {
    // Connect per-session WebSocket to ged
    std::string wsPath = "/ws/server/wire/" + m->sessionId;
    SPDLOG_INFO("StreamSession '{}': connecting to {}:{}{}",
                m->sessionId, m->daemonHost, m->daemonPort, wsPath);

    m->wsConn = connectWebSocket(m->daemonHost, m->daemonPort, wsPath);
    if (!m->wsConn) {
        throw std::runtime_error("StreamSession: WebSocket connect failed");
    }

    m->serializer = std::make_unique<WebSocketSerializer>(
        m->wsConn, wire::kWireCommandMagic);

    // --- Handshake: receive DeviceInfo from player ---
    wire::MessageHeader devHdr{};
    std::vector<char> devPayload;
    if (!m->serializer->recvMessage(devHdr, devPayload)) {
        throw std::runtime_error("StreamSession: failed to receive DeviceInfo");
    }

    if (devPayload.size() < sizeof(wire::DeviceInfo)) {
        throw std::runtime_error("StreamSession: DeviceInfo too short");
    }

    wire::DeviceInfo deviceInfo{};
    std::memcpy(&deviceInfo, devPayload.data(), sizeof(deviceInfo));

    if (deviceInfo.magic != wire::kDeviceInfoMagic) {
        throw std::runtime_error("StreamSession: invalid DeviceInfo magic");
    }

    m->playerWidth = deviceInfo.width;
    m->playerHeight = deviceInfo.height;
    m->playerPixelRatio = deviceInfo.pixelRatio > 0 ? deviceInfo.pixelRatio : 1;
    m->playerDeviceClass = deviceInfo.deviceClass;
    m->playerOrientation = deviceInfo.orientation;

    // Ensure even dimensions for H.264 encoder
    m->encodeW = m->playerWidth & ~1;
    m->encodeH = m->playerHeight & ~1;

    SPDLOG_INFO("StreamSession '{}': player {}x{} @{}x device={} orient={}, encode {}x{}",
                m->sessionId, m->playerWidth, m->playerHeight,
                m->playerPixelRatio, m->playerDeviceClass, m->playerOrientation,
                m->encodeW, m->encodeH);

    // Initialize local GPU at player dimensions
    m->initGpu(m->encodeW, m->encodeH);

    // Send SessionInit -- for stream mode, the reserved handles are unused
    // (no wire injection), but we send them to keep the protocol compatible.
    wire::SessionInit sessionInit{};
    sessionInit.flags = 0;
    m->serializer->sendMessage(wire::kSessionInitMagic,
                               &sessionInit, sizeof(sessionInit));
    SPDLOG_INFO("StreamSession '{}': sent SessionInit", m->sessionId);

    // Wait for SessionReady
    wire::MessageHeader readyHdr{};
    std::vector<char> readyPayload;
    for (;;) {
        if (!m->serializer->recvMessage(readyHdr, readyPayload)) {
            throw std::runtime_error("StreamSession: lost connection waiting for SessionReady");
        }
        if (readyHdr.magic == wire::kSessionReadyMagic) break;
        SPDLOG_DEBUG("StreamSession '{}': skipping magic 0x{:08X} while waiting for SessionReady",
                     m->sessionId, readyHdr.magic);
    }
    SPDLOG_INFO("StreamSession '{}': connected and ready", m->sessionId);
}

bool StreamSession::run(Session::RunConfig config) {
    if (!m->gpu) {
        SPDLOG_ERROR("StreamSession::run called before connect()");
        return false;
    }

    // In stream mode, the server renders locally — no player DB to sync.
    // Call onStateReceived with empty data so the app can initialize.
    if (config.onStateReceived) {
        config.onStateReceived({});
    }

    // Initialize H.264 encoder
    m->initEncoder(m->encodeW, m->encodeH);

    // --- Render + encode loop ---
    DeltaTimer timer;

    auto& gpu = *m->gpu;
    auto& capture = *m->capture;
    auto& wsConn = *m->wsConn;

    for (;;) {
        // Check connection
        if (!wsConn.isOpen()) {
            SPDLOG_INFO("StreamSession '{}': player disconnected", m->sessionId);
            break;
        }

        // Poll for incoming messages — only if substantial data is available.
        // WebSocket framing means available() can report partial frames;
        // require enough bytes for a WebSocket header + wire MessageHeader.
        while (wsConn.available() >= 20) {
            wire::MessageHeader hdr{};
            std::vector<char> payload;
            if (!m->serializer->recvMessage(hdr, payload)) {
                SPDLOG_INFO("StreamSession '{}': connection closed during recv",
                            m->sessionId);
                goto done;
            }

            if (hdr.magic == wire::kSdlEventMagic) {
                if (payload.size() >= sizeof(SDL_Event) && config.onEvent) {
                    SDL_Event event{};
                    std::memcpy(&event, payload.data(), sizeof(event));
                    config.onEvent(event);
                }
            } else if (hdr.magic == wire::kSqlpipeMsgMagic) {
                if (config.onMessage && !payload.empty()) {
                    config.onMessage(std::span<const uint8_t>(
                        reinterpret_cast<const uint8_t*>(payload.data()),
                        payload.size()));
                }
            } else if (hdr.magic == wire::kSafeAreaMagic) {
                // Could update safe area; ignore for now
            }
        }

        // Update
        float dt = timer.tick();
        if (config.onUpdate) config.onUpdate(dt);

        // Render to shared texture (zero-copy path for H.264 encoding)
        if (config.onRender) {
            auto view = m->sharedTex ? m->sharedTex->colorView() : capture.colorView();
            config.onRender(view, m->encodeW, m->encodeH);

            // Present the hidden window surface to trigger Metal's swap chain
            // completion handling, which releases ephemeral resources
            // (createImmediateUniform buffers). Without this, resources
            // accumulate and eventually exhaust Metal buffer handles.
            auto surfaceView = gpu.currentFrameView();
            gpu.present();
        }

        // Encode every Nth frame — zero-copy via SharedTexture's IOSurface
        if (++m->frameSkipCounter >= M::kEncodeEveryN) {
            m->frameSkipCounter = 0;
            m->encoder->encode(m->sharedTex->pixelBuffer());
        }

        // Drain outbound sqlpipe messages
        if (config.drainMessages) {
            auto msgs = config.drainMessages();
            for (auto& msg : msgs) {
                try {
                    m->serializer->sendMessage(wire::kSqlpipeMsgMagic,
                                               msg.data(), msg.size());
                } catch (...) {}
            }
        }

        // Brief sleep to target ~60fps render rate
        std::this_thread::sleep_for(std::chrono::milliseconds(16));
    }

done:
    // Flush encoder
    if (m->encoder) m->encoder->flush();

    SPDLOG_INFO("StreamSession '{}': exiting", m->sessionId);
    return true; // Player disconnected; SessionHost can accept new players
}

} // namespace ge

#else // !__APPLE__

#include <stdexcept>

// StreamSession is only available on macOS (requires VideoToolbox).
namespace ge {

struct StreamSession::M {};

StreamSession::StreamSession(const std::string&, uint16_t, const std::string&,
                             std::shared_ptr<DaemonSink>)
    : m(nullptr) {
    throw std::runtime_error("StreamSession requires macOS (VideoToolbox)");
}
StreamSession::~StreamSession() = default;
void StreamSession::connect() {}
Audio& StreamSession::audio() { throw std::runtime_error("not available"); }
GpuContext& StreamSession::gpu() { throw std::runtime_error("not available"); }
int StreamSession::width() const { return 0; }
int StreamSession::height() const { return 0; }
int StreamSession::pixelRatio() const { return 1; }
uint8_t StreamSession::deviceClass() const { return 0; }
uint8_t StreamSession::orientation() const { return 0; }
bool StreamSession::run(Session::RunConfig) { return false; }

} // namespace ge

#endif
