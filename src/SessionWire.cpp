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

void Session::setSessionFlags(uint16_t flags) { m->wire.setSessionFlags(flags); }
void Session::flush() { m->wire.flush(); }

bool Session::run(RunConfig config) {
    m->initOrientAngle();

    // Wrap user's onEvent to intercept orientation changes for smooth angle.
    auto userEvent = std::move(config.onEvent);
    auto wrappedEvent = [this,
                         userEvent = std::move(userEvent)](const SDL_Event& e) {
        if (e.type == SDL_EVENT_DISPLAY_ORIENTATION) {
            m->onOrientationEvent(e.display.data1);
        }
        if (userEvent) userEvent(e);
    };

    // Wrap onUpdate to advance orientation animation before the game sees it.
    auto userUpdate = std::move(config.onUpdate);
    auto wrappedUpdate = [this, userUpdate = std::move(userUpdate)](float dt) {
        m->updateOrientAngle(dt);
        if (userUpdate) userUpdate(dt);
    };

    return m->wire.run({
        std::move(wrappedUpdate),
        std::move(config.onRender),
        std::move(wrappedEvent),
        std::move(config.onResize),
        config.sensors,
        std::move(config.appId),
        std::move(config.onStateReceived),
        std::move(config.drainMessages),
        std::move(config.onMessage),
    });
}

} // namespace ge
