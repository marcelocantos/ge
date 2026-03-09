#include <ge/Session.h>
#include <ge/Audio.h>
#include <ge/WireSession.h>

#include <SDL3/SDL_video.h>
#include <cmath>

namespace ge {

namespace {

// Map SDL_DisplayOrientation to radians.
float orientationToRadians(int sdlOrientation) {
    switch (static_cast<SDL_DisplayOrientation>(sdlOrientation)) {
        case SDL_ORIENTATION_LANDSCAPE:          return float(M_PI / 2);
        case SDL_ORIENTATION_LANDSCAPE_FLIPPED:  return float(-M_PI / 2);
        case SDL_ORIENTATION_PORTRAIT:           return 0.0f;
        case SDL_ORIENTATION_PORTRAIT_FLIPPED:   return float(M_PI);
        default:                                 return 0.0f;
    }
}

// Shortest-path angle delta, clamped to [-π, π].
float angleDelta(float from, float to) {
    float d = std::fmod(to - from + 3.0f * float(M_PI), 2.0f * float(M_PI)) - float(M_PI);
    return d;
}

// Smootherstep: 6t⁵ - 15t⁴ + 10t³ (zero first and second derivative at endpoints).
float smootherstep(float t) {
    if (t < 0.0f) t = 0.0f;
    if (t > 1.0f) t = 1.0f;
    return t * t * t * (t * (t * 6.0f - 15.0f) + 10.0f);
}

} // namespace

struct Session::M {
    WireSession wire;

    // Smooth orientation angle state.
    float orientAngle = 0.0f;       // current interpolated angle
    float orientStart = 0.0f;       // angle at transition start
    float orientTarget = 0.0f;      // target angle
    float orientProgress = 1.0f;    // 0..1, 1 = arrived
    static constexpr float kOrientDuration = 0.35f; // seconds

    // Portrait lock state.
    bool portraitLock = false;
    bool ignoreSafeArea = false;
    int discreteOrientation = 0;    // raw SDL_DisplayOrientation value
    int portraitW = 0, portraitH = 0; // canonical portrait dimensions (min x max)

    M(const std::string& daemonHost, uint16_t daemonPort,
      const std::string& sessionId,
      std::shared_ptr<DaemonSink> sharedSink)
        : wire(daemonHost, daemonPort, sessionId, std::move(sharedSink)) {}

    void initOrientAngle() {
        orientAngle = orientationToRadians(wire.orientation());
        orientTarget = orientAngle;
        orientStart = orientAngle;
        orientProgress = 1.0f;
    }

    void onOrientationEvent(int sdlOrientation) {
        float newTarget = orientationToRadians(sdlOrientation);
        float delta = angleDelta(orientAngle, newTarget);
        if (std::abs(delta) < 1e-4f) return;
        orientStart = orientAngle;
        orientTarget = orientAngle + delta; // use unwrapped target for smooth path
        orientProgress = 0.0f;
    }

    void updateOrientAngle(float dt) {
        if (orientProgress >= 1.0f) return;
        orientProgress = std::min(orientProgress + dt / kOrientDuration, 1.0f);
        float t = smootherstep(orientProgress);
        orientAngle = orientStart + (orientTarget - orientStart) * t;
    }
};

Session::Session(const std::string& daemonHost, uint16_t daemonPort,
                 const std::string& sessionId,
                 std::shared_ptr<DaemonSink> sharedSink)
    : m(std::make_unique<M>(daemonHost, daemonPort, sessionId,
                            std::move(sharedSink))) {}

Session::~Session() = default;

Audio& Session::audio() { return m->wire.audio(); }
void Session::connect() { m->wire.connect(); }
GpuContext& Session::gpu() { return m->wire.gpu(); }
int Session::width() const {
    if (!m->ignoreSafeArea && m->wire.safeW() > 0) return m->wire.safeW();
    return m->portraitLock ? m->portraitW : m->wire.gpu().width();
}
int Session::height() const {
    if (!m->ignoreSafeArea && m->wire.safeH() > 0) return m->wire.safeH();
    return m->portraitLock ? m->portraitH : m->wire.gpu().height();
}
int Session::pixelRatio() const { return m->wire.pixelRatio(); }
uint8_t Session::deviceClass() const { return m->wire.deviceClass(); }
uint8_t Session::orientation() const { return m->wire.orientation(); }
float Session::orientationAngle() const { return m->orientAngle; }

linalg::aliases::float4x4 Session::orientationRot() const {
    float a = -m->orientAngle; // counter-rotate
    float c = std::cos(a), s = std::sin(a);
    return {
        linalg::aliases::float4{c, -s, 0, 0},
        linalg::aliases::float4{s,  c, 0, 0},
        linalg::aliases::float4{0,  0, 1, 0},
        linalg::aliases::float4{0,  0, 0, 1},
    };
}

void Session::setViewport(wgpu::RenderPassEncoder& pass,
                          float x, float y, float w, float h,
                          float minDepth, float maxDepth) {
    // Offset from safe-area-relative to portrait-absolute coordinates.
    // Safe area values are always in portrait-space (player converts them).
    if (!m->ignoreSafeArea && m->wire.safeW() > 0) {
        x += float(m->wire.safeX());
        y += float(m->wire.safeY());
    }

    if (!m->portraitLock) {
        pass.SetViewport(x, y, w, h, minDepth, maxDepth);
        return;
    }
    float pw = float(m->portraitW), ph = float(m->portraitH);
    float rx = x, ry = y, rw = w, rh = h;
    switch (static_cast<SDL_DisplayOrientation>(m->discreteOrientation)) {
        case SDL_ORIENTATION_LANDSCAPE:  // right side up — device rotated CCW
            rx = y; ry = pw - x - w; rw = h; rh = w;
            break;
        case SDL_ORIENTATION_LANDSCAPE_FLIPPED:  // left side up — device rotated CW
            rx = ph - y - h; ry = x; rw = h; rh = w;
            break;
        case SDL_ORIENTATION_PORTRAIT_FLIPPED:  // 180°
            rx = pw - x - w; ry = ph - y - h;
            break;
        default:  // portrait — identity
            break;
    }
    pass.SetViewport(rx, ry, rw, rh, minDepth, maxDepth);
}

void Session::setScissorRect(wgpu::RenderPassEncoder& pass,
                             uint32_t x, uint32_t y, uint32_t w, uint32_t h) {
    // Offset from safe-area-relative to portrait-absolute coordinates.
    if (!m->ignoreSafeArea && m->wire.safeW() > 0) {
        x += uint32_t(m->wire.safeX());
        y += uint32_t(m->wire.safeY());
    }

    uint32_t rx = x, ry = y, rw = w, rh = h;
    if (m->portraitLock) {
        uint32_t pw = uint32_t(m->portraitW), ph = uint32_t(m->portraitH);
        switch (static_cast<SDL_DisplayOrientation>(m->discreteOrientation)) {
            case SDL_ORIENTATION_LANDSCAPE:  // right side up — device rotated CCW
                rx = y; ry = pw - x - w; rw = h; rh = w;
                break;
            case SDL_ORIENTATION_LANDSCAPE_FLIPPED:  // left side up — device rotated CW
                rx = ph - y - h; ry = x; rw = h; rh = w;
                break;
            case SDL_ORIENTATION_PORTRAIT_FLIPPED:  // 180°
                rx = pw - x - w; ry = ph - y - h; rw = w; rh = h;
                break;
            default:  // portrait — identity
                break;
        }
    }

    // Clamp to surface bounds to prevent validation error.
    uint32_t sw = uint32_t(m->wire.gpu().width());
    uint32_t sh = uint32_t(m->wire.gpu().height());
    if (rx + rw > sw) rw = (rx < sw) ? sw - rx : 0;
    if (ry + rh > sh) rh = (ry < sh) ? sh - ry : 0;
    if (rw > 0 && rh > 0) {
        pass.SetScissorRect(rx, ry, rw, rh);
    }
}

void Session::setSessionFlags(uint16_t flags) { m->wire.setSessionFlags(flags); }
void Session::flush() { m->wire.flush(); }

// Transform a finger event from rotated screen coordinates to portrait coordinates.
static void transformFingerToPortrait(SDL_Event& e, int orientation) {
    float x = e.tfinger.x, y = e.tfinger.y;
    switch (static_cast<SDL_DisplayOrientation>(orientation)) {
        case SDL_ORIENTATION_LANDSCAPE:          // device rotated CCW
            e.tfinger.x = 1.0f - y;
            e.tfinger.y = x;
            break;
        case SDL_ORIENTATION_LANDSCAPE_FLIPPED:  // device rotated CW
            e.tfinger.x = y;
            e.tfinger.y = 1.0f - x;
            break;
        case SDL_ORIENTATION_PORTRAIT_FLIPPED:   // upside-down
            e.tfinger.x = 1.0f - x;
            e.tfinger.y = 1.0f - y;
            break;
        default:  // portrait — no transform
            break;
    }
}

bool Session::run(RunConfig config) {
    m->initOrientAngle();
    m->portraitLock = config.portraitLock;
    m->ignoreSafeArea = config.ignoreSafeArea;

    if (m->portraitLock) {
        m->discreteOrientation = m->wire.orientation();
        auto& gpu = m->wire.gpu();
        int w = gpu.width(), h = gpu.height();
        m->portraitW = std::min(w, h);
        m->portraitH = std::max(w, h);
    }

    // Wrap user's onEvent to intercept orientation changes for smooth angle,
    // transform touch events to portrait coordinates, and remap to safe area.
    auto userEvent = std::move(config.onEvent);
    bool portraitLock = m->portraitLock;
    bool useSafeArea = !m->ignoreSafeArea;
    auto wrappedEvent = [this, portraitLock, useSafeArea,
                         userEvent = std::move(userEvent)](const SDL_Event& e) {
        if (e.type == SDL_EVENT_DISPLAY_ORIENTATION) {
            m->onOrientationEvent(e.display.data1);
            if (portraitLock) {
                m->discreteOrientation = e.display.data1;
            }
        }
        bool isFinger = (e.type == SDL_EVENT_FINGER_DOWN ||
                         e.type == SDL_EVENT_FINGER_UP ||
                         e.type == SDL_EVENT_FINGER_MOTION);
        bool hasSafeArea = useSafeArea && m->wire.safeW() > 0;
        if (isFinger && (portraitLock || hasSafeArea)) {
            SDL_Event pe = e;
            if (portraitLock) {
                transformFingerToPortrait(pe, m->discreteOrientation);
            }
            // Remap from full-screen normalized coords to safe-area-relative coords.
            // The game thinks the screen is safeW × safeH, so touches outside the
            // safe area map to negative or >1 values (which the game can ignore).
            if (hasSafeArea) {
                float fullW = float(m->portraitLock ? m->portraitW : m->wire.gpu().width());
                float fullH = float(m->portraitLock ? m->portraitH : m->wire.gpu().height());
                float sx = float(m->wire.safeX()), sy = float(m->wire.safeY());
                float sw = float(m->wire.safeW()), sh = float(m->wire.safeH());
                pe.tfinger.x = (pe.tfinger.x * fullW - sx) / sw;
                pe.tfinger.y = (pe.tfinger.y * fullH - sy) / sh;
            }
            if (userEvent) userEvent(pe);
            return;
        }
        if (userEvent) userEvent(e);
    };

    // Wrap onUpdate to advance orientation animation before the game sees it.
    auto userUpdate = std::move(config.onUpdate);
    auto wrappedUpdate = [this, userUpdate = std::move(userUpdate)](float dt) {
        m->updateOrientAngle(dt);
        if (userUpdate) userUpdate(dt);
    };

    // Wrap onResize to keep discreteOrientation in sync with surface aspect
    // ratio. The resize event may arrive before the orientation event, so
    // infer landscape/portrait from dimensions to prevent setViewport from
    // using stale orientation (which causes out-of-bounds viewports).
    auto userResize = std::move(config.onResize);
    auto wrappedResize = [this, portraitLock,
                          userResize = std::move(userResize)](int w, int h) {
        if (portraitLock) {
            // Update portrait dims — the OS may resize the window (multitasking,
            // Stage Manager) to different dimensions than at connection time.
            m->portraitW = std::min(w, h);
            m->portraitH = std::max(w, h);

            // Infer orientation from surface aspect ratio to stay in sync
            // before the SDL_EVENT_DISPLAY_ORIENTATION event arrives.
            bool surfaceLandscape = w > h;
            auto cur = static_cast<SDL_DisplayOrientation>(m->discreteOrientation);
            bool wasLandscape = (cur == SDL_ORIENTATION_LANDSCAPE ||
                                 cur == SDL_ORIENTATION_LANDSCAPE_FLIPPED);
            if (surfaceLandscape && !wasLandscape) {
                // Default to landscape CW — corrected when orientation event arrives.
                m->discreteOrientation = SDL_ORIENTATION_LANDSCAPE;
            } else if (!surfaceLandscape && wasLandscape) {
                m->discreteOrientation = SDL_ORIENTATION_PORTRAIT;
            }
        }
        if (userResize) userResize(w, h);
    };

    // Wrap onRender to pass safe-area dims (or portrait dims if no safe area).
    auto userRender = std::move(config.onRender);
    auto wrappedRender = [this, useSafeArea,
                          userRender = std::move(userRender)](
            wgpu::TextureView target, int w, int h) {
        int rw = w, rh = h;
        if (m->portraitLock) {
            rw = std::min(w, h);
            rh = std::max(w, h);
        }
        if (useSafeArea && m->wire.safeW() > 0) {
            rw = m->wire.safeW();
            rh = m->wire.safeH();
        }
        if (userRender) userRender(target, rw, rh);
    };

    return m->wire.run({
        std::move(wrappedUpdate),
        std::move(wrappedRender),
        std::move(wrappedEvent),
        std::move(wrappedResize),
        config.portraitLock,
        config.sensors,
        std::move(config.appId),
        std::move(config.onStateReceived),
        std::move(config.drainMessages),
        std::move(config.onMessage),
    });
}

} // namespace ge
