#include <ge/Session.h>
#include <ge/Audio.h>
#include <ge/WireSession.h>

namespace ge {

struct Session::M {
    WireSession wire;

    M(const std::string& daemonHost, uint16_t daemonPort,
      const std::string& sessionId,
      std::shared_ptr<DaemonSink> sharedSink)
        : wire(daemonHost, daemonPort, sessionId, std::move(sharedSink)) {}
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
void Session::flush() { m->wire.flush(); }

bool Session::run(RunConfig config) {
    return m->wire.run({
        std::move(config.onUpdate),
        std::move(config.onRender),
        std::move(config.onEvent),
        std::move(config.onResize),
        config.sensors,
        std::move(config.appId),
        std::move(config.onStateReceived),
        std::move(config.drainMessages),
        std::move(config.onMessage),
    });
}

} // namespace ge
