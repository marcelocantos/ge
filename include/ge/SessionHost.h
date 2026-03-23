#pragma once

#include <ge/StreamSession.h>
#include <functional>
#include <memory>

namespace ge {

// Multi-session host for daemon mode.
// Manages the sideband connection to ged and spawns a thread per player.
class SessionHost {
public:
    SessionHost();
    ~SessionHost();

    SessionHost(const SessionHost&) = delete;
    SessionHost& operator=(const SessionHost&) = delete;

    // Factory called on a new thread when a player connects.
    // Receives a connected StreamSession; return RunConfig for the render loop.
    using StreamFactory = std::function<Session::RunConfig(StreamSession& session)>;

    // Blocks until SIGINT. Spawns a thread per player connection.
    void run(StreamFactory factory);

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace ge
