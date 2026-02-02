#pragma once

#include <cmath>

// A value with velocity that decays exponentially over time.
// Used for smooth inertial motion with friction.
class DampedValue {
public:
    DampedValue(float damping = 0.95f) : damping_(damping) {}

    float value() const { return value_; }
    float velocity() const { return velocity_; }

    void setValue(float v) { value_ = v; }
    void setVelocity(float v) { velocity_ = v; }

    // Add to value directly (during drag)
    void add(float delta) { value_ += delta; }

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

    bool isMoving() const { return velocity_ != 0.0f; }

private:
    float value_ = 0.0f;
    float velocity_ = 0.0f;
    float damping_;  // Per-frame damping factor (at 60fps)
};
