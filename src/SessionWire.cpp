#include <sq/Session.h>
#include <sq/WireSession.h>

namespace sq {

struct Session::M {
    WireSession wire;
};

Session::Session() : m(std::make_unique<M>()) {}
Session::~Session() = default;

HttpServer& Session::http() { return m->wire.http(); }
void Session::connect() { m->wire.connect(); }
GpuContext& Session::gpu() { return m->wire.gpu(); }
int Session::pixelRatio() const { return m->wire.pixelRatio(); }
void Session::flush() { m->wire.flush(); }

bool Session::run(std::function<void(float dt)> onFrame,
                  std::function<void(const SDL_Event&)> onEvent) {
    m->wire.run(std::move(onFrame), std::move(onEvent));
    return true;  // Wire disconnect → reconnect
}

} // namespace sq
