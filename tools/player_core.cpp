// Player — shared stream player implementation.
// Platform-specific entry points: player.cpp (desktop), ios/main.mm (iOS).

#include "Player.h"
#include "AudioPlayer.h"
#include "QRScanner.h"
#include "player_platform.h"
#ifdef GE_IOS
#include "KeychainStore.h"
#endif

#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>

#include <ge/Protocol.h>
#include <ge/VideoDecoder.h>
#include <ge/VideoEncoder.h>
#include <sqlite3.h>
#include <sqlpipe.h>

// Engine headers for WebSocket
#include "../src/WebSocketClient.h"
#include "../src/WebSocketSerializer.h"

#include <filesystem>
#include <fstream>
#include <memory>
#include <mutex>
#include <string>
#include <vector>

namespace {

enum class ConnectionResult { Quit, Disconnected };

// Convert a safe area rect from surface-space to portrait-space.
// The server/game always works in portrait coordinates (min-dim × max-dim).
// SDL_GetWindowSafeArea returns values in the current orientation's coordinate
// system, so we apply the inverse of the viewport orientation transform.
void safeAreaToPortrait(wire::SafeAreaUpdate& sa,
                        int surfW, int surfH, int pr,
                        const SDL_Rect& rect,
                        SDL_DisplayOrientation orient) {
    int pw = std::min(surfW, surfH);  // portrait width in pixels
    int ph = std::max(surfW, surfH);  // portrait height in pixels
    int sx = rect.x * pr, sy = rect.y * pr;
    int sw = rect.w * pr, sh = rect.h * pr;

    switch (orient) {
        case SDL_ORIENTATION_LANDSCAPE:
            // Viewport fwd: (px,py,pw,ph) → (py, PW-px-pw, ph, pw)
            sa.safeX = uint16_t(pw - sy - sh);
            sa.safeY = uint16_t(sx);
            sa.safeW = uint16_t(sh);
            sa.safeH = uint16_t(sw);
            break;
        case SDL_ORIENTATION_LANDSCAPE_FLIPPED:
            // Viewport fwd: (px,py,pw,ph) → (PH-py-ph, px, ph, pw)
            sa.safeX = uint16_t(sy);
            sa.safeY = uint16_t(ph - sx - sw);
            sa.safeW = uint16_t(sh);
            sa.safeH = uint16_t(sw);
            break;
        case SDL_ORIENTATION_PORTRAIT_FLIPPED:
            // Viewport fwd: (px,py,pw,ph) → (PW-px-pw, PH-py-ph, pw, ph)
            sa.safeX = uint16_t(pw - sx - sw);
            sa.safeY = uint16_t(ph - sy - sh);
            sa.safeW = uint16_t(sw);
            sa.safeH = uint16_t(sh);
            break;
        default:  // portrait — identity
            sa.safeX = uint16_t(sx);
            sa.safeY = uint16_t(sy);
            sa.safeW = uint16_t(sw);
            sa.safeH = uint16_t(sh);
            break;
    }
}

// Address persistence: save/load the QR-discovered server address so the
// player can reconnect on next launch without re-scanning.
namespace fs = std::filesystem;

fs::path cacheProfileDir(const std::string& profile) {
    const char* home = std::getenv("HOME");
    if (!home) home = "/tmp";
    return fs::path(home) / ".cache" / "ge" / "profiles" / profile;
}

ge::ScanResult loadStoredAddress(const fs::path& profileDir) {
    std::string line;
#ifdef GE_IOS
    line = ge::keychainLoad("server-address");
#else
    auto path = profileDir / "address";
    std::ifstream f(path);
    if (!f.is_open()) return {};
    std::getline(f, line);
#endif
    if (line.empty()) return {};
    auto colon = line.rfind(':');
    if (colon == std::string::npos) return {line, kDefaultPort};
    uint16_t port = static_cast<uint16_t>(std::stoi(line.substr(colon + 1)));
    return {line.substr(0, colon), port};
}

void saveStoredAddress(const std::string& host, uint16_t port,
                       const fs::path& profileDir) {
    std::string addr = host + ":" + std::to_string(port);
#ifdef GE_IOS
    ge::keychainSave("server-address", addr);
    SPDLOG_INFO("Saved server address to keychain: {}", addr);
#else
    std::error_code ec;
    fs::create_directories(profileDir, ec);
    if (ec) return;
    auto path = profileDir / "address";
    std::ofstream out(path, std::ios::trunc);
    if (out.is_open()) {
        out << addr;
        SPDLOG_INFO("Saved server address: {}", addr);
    }
#endif
}

} // namespace

struct Player::M {
    std::string host;
    uint16_t port;
    int width;
    int height;
    int pixelWidth = 0;
    int pixelHeight = 0;
    int backoffMs = 10;
    bool maximized = false;
    bool headless = false;
    int maxRetries = -1;  // -1 = unlimited
    int connectTimeoutMs = 0;
    std::string profile = "default";
    std::string name;
    std::string serverPreference; // preferred server name (persisted)

    // Persistent state DB for sqlpipe sync
    std::string dbPath;
    sqlite3* stateDb = nullptr;
    std::unique_ptr<sqlpipe::Replica> replica;

    SDL_Window* window = nullptr;

    ~M() {
        // Clean up sqlpipe replica before closing the DB
        replica.reset();
        if (stateDb) {
            sqlite3_close(stateDb);
            stateDb = nullptr;
        }

        if (window) {
            SDL_DestroyWindow(window);
            window = nullptr;
        }
        // Balance the SDL_Init(SDL_INIT_VIDEO) in initWindow() so that the
        // subsystem ref count doesn't accumulate across playerLoop iterations.
        SDL_QuitSubSystem(SDL_INIT_VIDEO);
    }

    void initWindow();
    // Poll events while attempting WebSocket connection in background.
    // Returns the connection (nullptr on failure), or sets quit=true if user quit.
    std::shared_ptr<ge::WsConnection> connectWithUI(bool& quit);
    ConnectionResult connectAndRunStream();
};

Player::Player(std::string host, uint16_t port, int width, int height,
                   bool maximized, int maxRetries, bool headless,
                   std::string profile, std::string name, int connectTimeoutMs)
    : m(std::make_unique<M>()) {
    m->host = std::move(host);
    m->port = port;
    m->width = width;
    m->height = height;
    m->maximized = maximized;
    m->headless = headless;
    m->maxRetries = maxRetries;
    m->connectTimeoutMs = connectTimeoutMs;
    m->profile = std::move(profile);
    m->name = std::move(name);

    // Store profile base directory — DB opened when kStateRequestMagic arrives
    m->dbPath = cacheProfileDir(m->profile).string();

    // Load server preference
    auto prefPath = fs::path(m->dbPath) / "server-preference";
    std::ifstream prefFile(prefPath);
    if (prefFile.is_open()) {
        std::getline(prefFile, m->serverPreference);
        if (!m->serverPreference.empty())
            SPDLOG_INFO("Loaded server preference: {}", m->serverPreference);
    }
}

Player::~Player() = default;

int Player::run() {
    try {
        m->initWindow();

        int retries = 0;
        while (true) {
            auto result = m->connectAndRunStream();
            if (result == ConnectionResult::Quit)
                break;

            ++retries;
            if (m->maxRetries >= 0 && retries > m->maxRetries) {
                SPDLOG_INFO("Max retries ({}) exceeded, giving up", m->maxRetries);
                break;
            }

            // Backoff is handled inside connectWithUI() on the next iteration
            m->backoffMs = std::min(m->backoffMs * 2, 2000);
        }
        return 0;
    } catch (const std::exception& e) {
        SPDLOG_ERROR("Fatal error: {}", e.what());
        return 1;
    }
}

void Player::M::initWindow() {
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        throw std::runtime_error(std::string("SDL_Init failed: ") + SDL_GetError());
    }

    SPDLOG_INFO("SDL3 initialized");

    // Set allowed orientations based on device class
    switch (platform::deviceClass()) {
        case 1: // phone: portrait only
            SDL_SetHint(SDL_HINT_ORIENTATIONS, "Portrait");
            break;
        case 2: // tablet: all orientations
            SDL_SetHint(SDL_HINT_ORIENTATIONS, "Portrait LandscapeLeft LandscapeRight PortraitUpsideDown");
            break;
        default: // desktop: no hint needed
            break;
    }

    SDL_WindowFlags flags = platform::windowFlags();
    if (maximized) flags |= SDL_WINDOW_MAXIMIZED | SDL_WINDOW_RESIZABLE;
    if (headless) flags |= SDL_WINDOW_HIDDEN;
    flags |= SDL_WINDOW_RESIZABLE;
    window = SDL_CreateWindow("ge player", width, height, flags);
    if (!window) {
        SDL_Quit();
        throw std::runtime_error(std::string("SDL_CreateWindow failed: ") + SDL_GetError());
    }

    // Activate after SDL_Init + window creation so NSApp exists on macOS
    platform::activateApp();

    SDL_GetWindowSizeInPixels(window, &pixelWidth, &pixelHeight);
    SPDLOG_INFO("Window created: {}x{} ({}x{} pixels)", width, height, pixelWidth, pixelHeight);
}

std::shared_ptr<ge::WsConnection> Player::M::connectWithUI(bool& quit) {
    quit = false;

    // Show connecting status in window title (no GPU rendering — surface
    // stays unconfigured so the wire session gets a pristine surface).
    std::string title = "ge player \xe2\x80\x94 Connecting to " + host + ":" + std::to_string(port) + "...";
    SDL_SetWindowTitle(window, title.c_str());

    // Backoff delay: poll events while waiting before next attempt
    if (backoffMs > 10) {
        SPDLOG_INFO("Reconnecting in {}ms...", backoffMs);
        auto waitUntil = SDL_GetTicks() + backoffMs;
        while (SDL_GetTicks() < waitUntil) {
            SDL_Event ev;
            while (SDL_PollEvent(&ev)) {
                if (ev.type == SDL_EVENT_QUIT ||
                    (ev.type == SDL_EVENT_KEY_DOWN && ev.key.key == SDLK_Q)) {
                    SDL_SetWindowTitle(window, "ge player");
                    quit = true;
                    return nullptr;
                }
                if (ev.type == SDL_EVENT_WINDOW_PIXEL_SIZE_CHANGED)
                    SDL_GetWindowSizeInPixels(window, &pixelWidth, &pixelHeight);
            }
            SDL_Delay(16);
        }
    }

    // Launch connection in background thread
    std::shared_ptr<ge::WsConnection> result;
    std::atomic<bool> done{false};
    std::thread connThread([&] {
        auto wsPath = name.empty() ? "/ws/wire" : "/ws/wire?name=" + name;
        result = ge::connectWebSocket(host, port, wsPath, connectTimeoutMs);
        done.store(true, std::memory_order_release);
    });

    // Poll events while waiting for connection
    while (!done.load(std::memory_order_acquire)) {
        SDL_Event ev;
        while (SDL_PollEvent(&ev)) {
            if (ev.type == SDL_EVENT_QUIT ||
                (ev.type == SDL_EVENT_KEY_DOWN && ev.key.key == SDLK_Q)) {
                connThread.join();
                SDL_SetWindowTitle(window, "ge player");
                quit = true;
                return nullptr;
            }
            if (ev.type == SDL_EVENT_WINDOW_PIXEL_SIZE_CHANGED)
                SDL_GetWindowSizeInPixels(window, &pixelWidth, &pixelHeight);
        }
        SDL_Delay(16);
    }

    connThread.join();

    if (result) {
        SPDLOG_INFO("Connected via WebSocket");
        backoffMs = 10;
    }
    return result;
}

ConnectionResult Player::M::connectAndRunStream() {
    SPDLOG_INFO("Stream mode: connecting to {}:{}...", host, port);

    bool quit = false;
    auto wsConn = connectWithUI(quit);
    if (quit) return ConnectionResult::Quit;
    if (!wsConn) {
        SPDLOG_WARN("WebSocket connection failed");
        return ConnectionResult::Disconnected;
    }

    // In stream mode we don't need Dawn — use SDL's 2D renderer
    SDL_GetWindowSizeInPixels(window, &pixelWidth, &pixelHeight);
    SDL_GetWindowSize(window, &width, &height);

    auto serializer = std::make_unique<ge::WebSocketSerializer>(
        wsConn, wire::kWireResponseMagic);

    // Send DeviceInfo (server needs to know our dimensions)
    wire::DeviceInfo deviceInfo{};
    deviceInfo.width = static_cast<uint16_t>(pixelWidth);
    deviceInfo.height = static_cast<uint16_t>(pixelHeight);
    deviceInfo.pixelRatio = static_cast<uint16_t>(width > 0 ? pixelWidth / width : 2);
    deviceInfo.deviceClass = platform::deviceClass();
    deviceInfo.preferredFormat = 0; // not relevant for stream mode
    serializer->sendMessage(wire::kDeviceInfoMagic, &deviceInfo, sizeof(deviceInfo));
    SPDLOG_INFO("Stream mode: sent DeviceInfo");

    // Create SDL renderer for displaying decoded frames
    SDL_Renderer* renderer = SDL_CreateRenderer(window, nullptr);
    if (!renderer) {
        SPDLOG_ERROR("SDL_CreateRenderer failed: {}", SDL_GetError());
        return ConnectionResult::Disconnected;
    }
    struct RendererGuard {
        SDL_Renderer* r;
        ~RendererGuard() { if (r) SDL_DestroyRenderer(r); }
    } rendererGuard{renderer};

    SDL_Texture* videoTexture = nullptr;
    int texW = 0, texH = 0;
    struct TextureGuard {
        SDL_Texture** t;
        ~TextureGuard() { if (*t) SDL_DestroyTexture(*t); }
    } textureGuard{&videoTexture};

    // Frame buffer shared between decoder callback and main thread
    std::mutex frameMutex;
    std::vector<uint8_t> latestFrame;
    int frameW = 0, frameH = 0;
    size_t frameBpr = 0;
    bool newFrameAvailable = false;

    auto decoder = std::make_unique<ge::VideoDecoder>(
        [&](const uint8_t* bgraPixels, int w, int h, size_t bytesPerRow) {
            std::lock_guard<std::mutex> lock(frameMutex);
            size_t totalBytes = bytesPerRow * h;
            latestFrame.resize(totalBytes);
            std::memcpy(latestFrame.data(), bgraPixels, totalBytes);
            frameW = w;
            frameH = h;
            frameBpr = bytesPerRow;
            newFrameAvailable = true;
        });

    backoffMs = 10;
    ConnectionResult exitResult = ConnectionResult::Disconnected;

    // Wait for SessionInit (the server still sends it even for stream mode
    // so ged can route the connection), then acknowledge with SessionReady
    while (wsConn->isOpen()) {
        wire::MessageHeader initHdr{};
        std::vector<char> initPayload;

        // Wait for SessionInit
        SDL_SetWindowTitle(window, ("ge player (stream) \xe2\x80\x94 Waiting for " + host + "...").c_str());
        bool gotSessionInit = false;
        while (true) {
            if (!wsConn->isOpen()) {
                SPDLOG_WARN("Connection lost waiting for SessionInit (stream)");
                return ConnectionResult::Disconnected;
            }
            if (wsConn->available() > 0) {
                if (!serializer->recvMessage(initHdr, initPayload)) {
                    SPDLOG_WARN("Failed to read SessionInit (stream)");
                    return ConnectionResult::Disconnected;
                }
                if (initHdr.magic == wire::kServerAssignedMagic) continue;
                if (initHdr.magic == wire::kSessionEndMagic) continue;
                if (initPayload.size() >= sizeof(wire::SessionInit)) {
                    gotSessionInit = true;
                    break;
                }
                SPDLOG_WARN("SessionInit too small (stream)");
                return ConnectionResult::Disconnected;
            }
            SDL_Event ev;
            while (SDL_PollEvent(&ev)) {
                if (ev.type == SDL_EVENT_QUIT ||
                    (ev.type == SDL_EVENT_KEY_DOWN && ev.key.key == SDLK_Q)) {
                    return ConnectionResult::Quit;
                }
            }
            SDL_Delay(16);
        }
        if (!gotSessionInit) continue;

        wire::SessionInit sessionInit{};
        std::memcpy(&sessionInit, initPayload.data(), sizeof(sessionInit));
        if (sessionInit.magic != wire::kSessionInitMagic ||
            sessionInit.version != wire::kProtocolVersion) {
            SPDLOG_WARN("Invalid SessionInit (stream)");
            return ConnectionResult::Disconnected;
        }
        SPDLOG_INFO("Stream mode: received SessionInit");

        // Send SessionReady (server expects it before starting the render loop)
        wire::SessionReady sessionReady{};
        serializer->sendMessage(wire::kSessionReadyMagic, &sessionReady, sizeof(sessionReady));
        SPDLOG_INFO("Stream mode: sent SessionReady, entering stream loop");
        SDL_SetWindowTitle(window, "ge player (stream)");

        bool exitLoop = false;
        bool sessionEnded = false;

        while (!exitLoop && !sessionEnded) {
            // Poll SDL events and send input back to server
            SDL_Event event;
            while (SDL_PollEvent(&event)) {
                switch (event.type) {
                    case SDL_EVENT_QUIT:
                        exitResult = ConnectionResult::Quit;
                        exitLoop = true;
                        break;
                    case SDL_EVENT_KEY_DOWN:
                        if (event.key.key == SDLK_Q) {
                            exitResult = ConnectionResult::Quit;
                            exitLoop = true;
                            break;
                        }
                        [[fallthrough]];
                    default:
                        try {
                            serializer->sendMessage(wire::kSdlEventMagic, &event, sizeof(event));
                        } catch (const std::exception&) {
                            SPDLOG_WARN("Connection lost (stream event send)");
                            exitLoop = true;
                        }
                        break;
                }
                if (exitLoop) break;
            }
            if (exitLoop) break;

            if (!wsConn->isOpen()) {
                SPDLOG_WARN("Connection closed (stream)");
                exitLoop = true;
                break;
            }

            // Receive and decode video frames
            while (wsConn->available() > 0) {
                wire::MessageHeader header{};
                std::vector<char> payload;
                if (!serializer->recvMessage(header, payload)) {
                    SPDLOG_WARN("Connection lost (stream message read)");
                    exitLoop = true;
                    break;
                }

                if (header.magic == wire::kVideoStreamMagic) {
                    if (payload.empty()) continue;

                    const auto* data = reinterpret_cast<const uint8_t*>(payload.data());
                    size_t size = payload.size();
                    size_t offset = 0;

                    // Parse flags byte
                    uint8_t flags = data[offset++];

                    // Parse optional SPS/PPS
                    if (flags & 0x02) {
                        if (offset + 2 > size) continue;
                        uint16_t spsLen = static_cast<uint16_t>(data[offset]) |
                                          (static_cast<uint16_t>(data[offset + 1]) << 8);
                        offset += 2;
                        if (offset + spsLen > size) continue;
                        const uint8_t* sps = data + offset;
                        offset += spsLen;

                        if (offset + 2 > size) continue;
                        uint16_t ppsLen = static_cast<uint16_t>(data[offset]) |
                                          (static_cast<uint16_t>(data[offset + 1]) << 8);
                        offset += 2;
                        if (offset + ppsLen > size) continue;
                        const uint8_t* pps = data + offset;
                        offset += ppsLen;

                        decoder->setParameterSets(sps, spsLen, pps, ppsLen);
                    }

                    // Decode the NAL unit
                    if (offset < size) {
                        decoder->decode(data + offset, size - offset);
                    }
                } else if (header.magic == wire::kSqlpipeMsgMagic) {
                    // Handle sqlpipe messages (game state sync) if replica is set up
                    if (replica && !payload.empty()) {
                        try {
                            auto msg = sqlpipe::deserialize(std::span<const uint8_t>(
                                reinterpret_cast<const uint8_t*>(payload.data()), payload.size()));
                            auto result = replica->handle_message(msg);
                            for (auto& resp : result.messages) {
                                auto bytes = sqlpipe::serialize(resp);
                                serializer->sendMessage(wire::kSqlpipeMsgMagic,
                                    reinterpret_cast<const char*>(bytes.data()), bytes.size());
                            }
                        } catch (const std::exception& e) {
                            SPDLOG_WARN("sqlpipe error (stream): {}", e.what());
                        }
                    }
                } else if (header.magic == wire::kFrameEndMagic) {
                    // Frame boundary — send ready for next
                    serializer->sendMessage(wire::kFrameReadyMagic);
                    break; // yield to rendering
                } else if (header.magic == wire::kSessionEndMagic) {
                    SPDLOG_INFO("Session ended (stream)");
                    sessionEnded = true;
                    break;
                } else if (header.magic == wire::kWireCommandMagic) {
                    // In stream mode, ignore wire commands (server may still
                    // send some during handshake before streaming starts)
                    SPDLOG_DEBUG("Stream mode: ignoring wire command ({} bytes)", payload.size());
                } else {
                    SPDLOG_DEBUG("Stream mode: ignoring message magic 0x{:08X}", header.magic);
                }
            }

            // Update SDL texture with latest decoded frame
            {
                std::lock_guard<std::mutex> lock(frameMutex);
                if (newFrameAvailable) {
                    // Recreate texture if dimensions changed
                    if (!videoTexture || frameW != texW || frameH != texH) {
                        if (videoTexture) SDL_DestroyTexture(videoTexture);
                        videoTexture = SDL_CreateTexture(
                            renderer,
                            SDL_PIXELFORMAT_BGRA32,
                            SDL_TEXTUREACCESS_STREAMING,
                            frameW, frameH);
                        if (!videoTexture) {
                            SPDLOG_ERROR("SDL_CreateTexture failed: {}", SDL_GetError());
                        } else {
                            texW = frameW;
                            texH = frameH;
                            SPDLOG_INFO("Stream: created {}x{} texture", frameW, frameH);
                        }
                    }

                    if (videoTexture) {
                        SDL_UpdateTexture(videoTexture, nullptr,
                                         latestFrame.data(),
                                         static_cast<int>(frameBpr));
                    }
                    newFrameAvailable = false;
                }
            }

            // Render
            SDL_SetRenderDrawColor(renderer, 0, 0, 0, 255);
            SDL_RenderClear(renderer);
            if (videoTexture) {
                SDL_RenderTexture(renderer, videoTexture, nullptr, nullptr);
            }
            SDL_RenderPresent(renderer);

            SDL_Delay(1);
        } // end stream render loop

        if (exitLoop) return exitResult;

        if (sessionEnded) {
            SPDLOG_INFO("Stream session ended — staying connected for reassignment");
            continue;
        }
    } // end outer while (wsConn->isOpen()) loop

    return ConnectionResult::Disconnected;
}

int playerLoop(std::function<ge::ScanResult()> checkOverride,
               std::function<ge::ScanResult()> discover,
               std::string name) {
    const std::string profile = "default";
    auto profileDir = cacheProfileDir(profile);

    for (;;) {
        // Phase 1: fast override (env var, simulator, debug property)
        auto addr = checkOverride();
        int maxRetries = -1;  // unlimited
        int timeoutMs = 0;    // OS default

        if (addr.host.empty()) {
            // Phase 2: try stored address from prior QR discovery
            addr = loadStoredAddress(profileDir);
            if (!addr.host.empty()) {
                SPDLOG_INFO("Trying stored address: {}:{}", addr.host, addr.port);
                maxRetries = 0;   // single attempt
                timeoutMs = 5000; // 5s timeout
            }
        }

        if (addr.host.empty()) {
            // Phase 3: QR scan (blocking)
            addr = discover();
            if (addr.host.empty()) {
                SPDLOG_INFO("Discovery cancelled, retrying...");
                continue;
            }
            // Save the discovered address for next launch
            uint16_t port = addr.port ? addr.port : kDefaultPort;
            saveStoredAddress(addr.host, port, profileDir);
        }

        uint16_t port = addr.port ? addr.port : kDefaultPort;
        SPDLOG_INFO("Target: {}:{}", addr.host, port);

        Player player(addr.host, port, kDefaultWidth, kDefaultHeight,
                      false, maxRetries, false, profile, name, timeoutMs);
        int result = player.run();
        if (result != 0) return result;

        SPDLOG_INFO("Disconnected, returning to discovery...");
    }
}
