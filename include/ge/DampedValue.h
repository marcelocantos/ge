#pragma once

#include <ge/Linalg.h>

#include <cmath>

// A value with velocity that decays exponentially over time.
// Used for smooth inertial motion with friction.
class DampedValue {
public:
    constexpr DampedValue(float damping = 0.95f) : damping_(damping) {}

    constexpr float value() const { return value_; }
    constexpr float velocity() const { return velocity_; }

    constexpr void setValue(float v) { value_ = v; }
    constexpr void setVelocity(float v) { velocity_ = v; }

    // Add to value directly (during drag)
    constexpr void add(float delta) { value_ += delta; }

    // Advance simulation by dt seconds (assumed 60fps for damping calc)
    void update(float dt) {
        value_ += velocity_ * dt;
        // Exponential decay: v *= damping^(60*dt) to be framerate-independent
        velocity_ *= std::pow(damping_, 60.0f * dt);
        // Stop when velocity is negligible
        if (std::abs(velocity_) < 1e-6f) {
            velocity_ = 0.0f;
        }
    }

    constexpr bool isMoving() const { return velocity_ != 0.0f; }

private:
    float value_ = 0.0f;
    float velocity_ = 0.0f;
    float damping_;  // Per-frame damping factor (at 60fps)
};
