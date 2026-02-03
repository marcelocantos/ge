#pragma once
#include <SDL3/SDL.h>

// Measures elapsed time between successive tick() calls.
class DeltaTimer {
public:
    // Returns seconds elapsed since last tick() (or since construction/reset).
    float tick() {
        Uint64 now = SDL_GetTicks();
        float dt = (now - last_) / 1000.0f;
        last_ = now;
        return dt;
    }

    // Reset the timer so the next tick() measures from now.
    void reset() {
        last_ = SDL_GetTicks();
    }

private:
    Uint64 last_ = SDL_GetTicks();
};
