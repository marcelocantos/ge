#include <ge/Session.h>
#include <ge/Audio.h>
#include <ge/WireSession.h>

namespace ge {

struct Session::M {
    WireSession wire;
};

Session::Session() : m(std::make_unique<M>()) {}
Session::~Session() = default;

HttpServer* Session::http() { return m->wire.http(); }
Audio& Session::audio() { return m->wire.audio(); }
void Session::connect() { m->wire.connect(); }
GpuContext& Session::gpu() { return m->wire.gpu(); }
int Session::pixelRatio() const { return m->wire.pixelRatio(); }
void Session::flush() { m->wire.flush(); }

bool Session::run(RunConfig config) {
    return m->wire.run({std::move(config.onUpdate), std::move(config.onRender), std::move(config.onEvent), std::move(config.onResize), config.sensors});
}

} // namespace ge
