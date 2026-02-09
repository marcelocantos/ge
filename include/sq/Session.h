#pragma once

#include <sq/GpuContext.h>
#include <SDL3/SDL_events.h>
#include <functional>
#include <memory>

namespace sq {

// Unified session: wire mode (default) or direct native mode (SQ_DIRECT).
// Drop-in replacement for WireSession — same interface, backend selected
// at compile time. Two separate compilation units (SessionWire.cpp,
// SessionDirect.cpp) each guarded by #if, so the unused backend's
// dependencies never enter the final binary.
class Session {
public:
    Session();
    ~Session();

    Session(const Session&) = delete;
    Session& operator=(const Session&) = delete;

    GpuContext& gpu();
    int pixelRatio() const;
    void flush();

    // Returns true if the caller should loop (wire: receiver disconnected),
    // false if the session is done (direct: user quit).
    bool run(std::function<void(float dt)> onFrame,
             std::function<void(const SDL_Event&)> onEvent = {});

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace sq
