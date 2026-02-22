#pragma once

#include <ge/Session.h>
#include <functional>
#include <memory>

namespace ge {

// Multi-session host for daemon mode.
// Manages the sideband connection to ged and spawns a thread per player.
// In standalone mode (no daemon), falls back to single-session behavior.
class SessionHost {
public:
    SessionHost();
    ~SessionHost();

    SessionHost(const SessionHost&) = delete;
    SessionHost& operator=(const SessionHost&) = delete;

    // Factory called on a new thread when a player connects.
    // Receives a ready-to-use Session; return RunConfig for the render loop.
    // The session thread exits when run() returns (player disconnect).
    using Factory = std::function<Session::RunConfig(Session& session)>;

    // Blocks until SIGINT. Spawns a thread per player connection.
    // In standalone mode (no daemon), falls back to single-session behavior.
    void run(Factory factory);

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace ge
