#pragma once

#include <linalg.h>
#include <cmath>

using namespace linalg::aliases;

// Damped 3D rotation with inertia.
// Stores orientation as a quaternion and angular velocity as a 3D vector.
class DampedRotation {
public:
    DampedRotation(float damping = 0.92f) : damping_(damping) {}

    const float4& orientation() const { return orientation_; }
    const float3& angularVelocity() const { return angularVelocity_; }

    void setOrientation(const float4& q) { orientation_ = q; }
    void setAngularVelocity(const float3& v) { angularVelocity_ = v; }

    // Apply incremental rotation (during drag)
    void rotate(const float3& axis, float angle) {
        if (angle == 0.0f) return;
        float4 delta = linalg::rotation_quat(axis, angle);
        orientation_ = linalg::qmul(delta, orientation_);
        orientation_ = linalg::normalize(orientation_);
    }

    // Apply rotation from screen-space drag delta
    // dx: horizontal mouse movement (rotates around world Z axis)
    // dy: vertical mouse movement (rotates around camera-right axis)
    void applyDrag(float dx, float dy, float sensitivity = 1.0f) {
        // Horizontal drag -> rotate around Z (world up)
        if (dx != 0.0f) {
            rotate(float3{0.0f, 0.0f, 1.0f}, dx * sensitivity);
        }
        // Vertical drag -> rotate around X (camera right, roughly)
        if (dy != 0.0f) {
            rotate(float3{1.0f, 0.0f, 0.0f}, dy * sensitivity);
        }
    }

    // Update angular velocity from drag speed (smoothed for inertia on release)
    void updateVelocityFromDrag(float dx, float dy, float sensitivity = 1.0f) {
        float3 instantVel = float3{dy * sensitivity, 0.0f, dx * sensitivity};
        // Exponential moving average to smooth out jitter on release
        constexpr float smoothing = 0.3f;
        angularVelocity_ = linalg::lerp(angularVelocity_, instantVel, smoothing);
    }

    // Advance simulation by dt seconds
    void update(float dt) {
        // Apply angular velocity as rotation
        float speed = linalg::length(angularVelocity_);
        if (speed > 1e-6f) {
            float3 axis = angularVelocity_ / speed;
            rotate(axis, speed * dt);

            // Exponential decay (framerate-independent)
            angularVelocity_ *= std::pow(damping_, 60.0f * dt);

            // Stop when velocity is negligible
            if (linalg::length(angularVelocity_) < 1e-5f) {
                angularVelocity_ = float3{0.0f, 0.0f, 0.0f};
            }
        }
    }

    bool isMoving() const {
        return linalg::length(angularVelocity_) > 1e-6f;
    }

    // Get rotation matrix for rendering
    float4x4 matrix() const {
        return linalg::rotation_matrix(orientation_);
    }

private:
    float4 orientation_ = float4{0.0f, 0.0f, 0.0f, 1.0f};  // Identity quaternion
    float3 angularVelocity_ = float3{0.0f, 0.0f, 0.0f};     // Axis * angular speed (rad/s)
    float damping_;
};
