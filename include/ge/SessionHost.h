#pragma once

#include <ge/Session.h>
#include <ge/StreamSession.h>
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

    // Factory called on a new thread when a player connects (wire mode).
    // Receives a ready-to-use Session; return RunConfig for the render loop.
    using Factory = std::function<Session::RunConfig(Session& session)>;

    // Factory for stream mode (local render + H.264 → player).
    // Receives a connected StreamSession; return RunConfig for the render loop.
    using StreamFactory = std::function<Session::RunConfig(StreamSession& session)>;

    // Blocks until SIGINT. Spawns a thread per player connection.
    // When GE_STREAM=1, creates StreamSession and uses streamFactory.
    // If streamFactory is not set, stream mode falls back to wire mode.
    void run(Factory factory, StreamFactory streamFactory = {});

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace ge
