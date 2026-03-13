#pragma once

#include <ge/DampedRotation.h>
#include <SDL3/SDL_events.h>
#include <cmath>

namespace ge {

// Manages a spinnable globe: drag-to-rotate with inertia, and pinch-to-zoom.
// Handles mouse and single/two-finger touch input.
// All event coordinates are expected in pixels (the engine normalizes them before dispatch).
class GlobeController {
public:
    GlobeController(float damping = 0.90f, float sensitivity = 0.01f)
        : rotation_(damping), sensitivity_(sensitivity) {}

    // Feed an SDL event. Returns true if the event was handled.
    bool event(const SDL_Event& e) {
        switch (e.type) {
            case SDL_EVENT_FINGER_DOWN: {
                if (pinching_) return false;  // Ignore >2 fingers
                if (inputSource_ == InputSource::Finger) {
                    // Second finger: enter pinch mode, stop single-finger drag
                    pinching_ = true;
                    finger2Id_ = e.tfinger.fingerID;
                    finger2X_ = e.tfinger.x;
                    finger2Y_ = e.tfinger.y;
                    float dx = finger2X_ - finger1X_;
                    float dy = finger2Y_ - finger1Y_;
                    lastPinchDist_ = std::sqrt(dx*dx + dy*dy);
                    pinchDelta_ = 0.0f;
                    accumX_ = accumY_ = 0.0f;
                    return true;
                }
                if (inputSource_ != InputSource::None) return false;
                inputSource_ = InputSource::Finger;
                dragging_ = true;
                thresholdReached_ = false;
                finger1Id_ = e.tfinger.fingerID;
                finger1X_ = lastX_ = startX_ = e.tfinger.x;
                finger1Y_ = lastY_ = startY_ = e.tfinger.y;
                accumX_ = accumY_ = 0.0f;
                rotation_.setAngularVelocity({0, 0, 0});
                return true;
            }

            case SDL_EVENT_MOUSE_BUTTON_DOWN: {
                if (inputSource_ != InputSource::None) return false;
                inputSource_ = InputSource::Mouse;
                dragging_ = true;
                thresholdReached_ = false;
                lastX_ = startX_ = e.button.x;
                lastY_ = startY_ = e.button.y;
                accumX_ = accumY_ = 0.0f;
                rotation_.setAngularVelocity({0, 0, 0});
                return true;
            }

            case SDL_EVENT_FINGER_MOTION: {
                if (pinching_) {
                    // Update whichever finger moved and accumulate log-scale pinch delta
                    if (e.tfinger.fingerID == finger1Id_)
                        finger1X_ = e.tfinger.x, finger1Y_ = e.tfinger.y;
                    else if (e.tfinger.fingerID == finger2Id_)
                        finger2X_ = e.tfinger.x, finger2Y_ = e.tfinger.y;
                    else
                        return false;
                    float dx = finger2X_ - finger1X_;
                    float dy = finger2Y_ - finger1Y_;
                    float newDist = std::sqrt(dx*dx + dy*dy);
                    if (lastPinchDist_ > 0.1f)
                        pinchDelta_ += std::log(newDist / lastPinchDist_);
                    lastPinchDist_ = newDist;
                    return true;
                }
                if (inputSource_ != InputSource::Finger) return false;
                if (e.tfinger.fingerID != finger1Id_) return false;
                if (!thresholdReached_) {
                    float cdx = e.tfinger.x - startX_;
                    float cdy = e.tfinger.y - startY_;
                    if (cdx*cdx + cdy*cdy < kDragThreshold * kDragThreshold) {
                        lastX_ = e.tfinger.x;
                        lastY_ = e.tfinger.y;
                        return true;
                    }
                    thresholdReached_ = true;
                }
                float dx = e.tfinger.x - lastX_;
                float dy = e.tfinger.y - lastY_;
                rotation_.applyDrag(dx, dy, sensitivity_);
                accumX_ += dx;
                accumY_ += dy;
                lastX_ = e.tfinger.x;
                lastY_ = e.tfinger.y;
                return true;
            }

            case SDL_EVENT_MOUSE_MOTION: {
                if (inputSource_ != InputSource::Mouse) return false;
                if (!thresholdReached_) {
                    float cdx = e.motion.x - startX_;
                    float cdy = e.motion.y - startY_;
                    if (cdx*cdx + cdy*cdy < kDragThreshold * kDragThreshold) {
                        lastX_ = e.motion.x;
                        lastY_ = e.motion.y;
                        return true;
                    }
                    thresholdReached_ = true;
                }
                float dx = e.motion.x - lastX_;
                float dy = e.motion.y - lastY_;
                rotation_.applyDrag(dx, dy, sensitivity_);
                accumX_ += dx;
                accumY_ += dy;
                lastX_ = e.motion.x;
                lastY_ = e.motion.y;
                return true;
            }

            case SDL_EVENT_FINGER_UP: {
                if (pinching_) {
                    pinching_ = false;
                    if (e.tfinger.fingerID == finger1Id_) {
                        // Finger 1 lifted: promote finger 2 to single-finger drag
                        finger1Id_ = finger2Id_;
                        finger1X_ = lastX_ = startX_ = finger2X_;
                        finger1Y_ = lastY_ = startY_ = finger2Y_;
                    } else {
                        // Finger 2 lifted: stay with finger 1
                        lastX_ = startX_ = finger1X_;
                        lastY_ = startY_ = finger1Y_;
                    }
                    thresholdReached_ = true;  // Already past threshold from pinch
                    return true;
                }
                if (inputSource_ != InputSource::Finger) return false;
                if (e.tfinger.fingerID != finger1Id_) return false;
                dragging_ = false;
                inputSource_ = InputSource::None;
                return true;
            }

            case SDL_EVENT_MOUSE_BUTTON_UP:
                if (inputSource_ != InputSource::Mouse) return false;
                dragging_ = false;
                inputSource_ = InputSource::None;
                return true;

            default:
                return false;
        }
    }

    // Call once per frame. Flushes accumulated drag to velocity, applies inertia.
    void update(float dt) {
        if (dragging_ && dt > 0.001f && (accumX_ != 0.0f || accumY_ != 0.0f)) {
            rotation_.updateVelocityFromDrag(accumX_ / dt, accumY_ / dt, sensitivity_);
            accumX_ = accumY_ = 0.0f;
        }
        if (!dragging_) {
            rotation_.update(dt);
        }
    }

    DampedRotation& rotation() { return rotation_; }
    const DampedRotation& rotation() const { return rotation_; }
    bool dragging() const { return dragging_; }
    bool pinching() const { return pinching_; }

    // Returns accumulated log-scale pinch delta since last call, then resets.
    // Positive = fingers spreading (zoom in), negative = fingers closing (zoom out).
    float consumePinchDelta() {
        float d = pinchDelta_;
        pinchDelta_ = 0.0f;
        return d;
    }

private:
    // Minimum displacement (pixels) before drag rotates the globe.
    // Prevents accidental micro-rotations from taps.
    static constexpr float kDragThreshold = 10.0f;

    enum class InputSource { None, Mouse, Finger };

    DampedRotation rotation_;
    float sensitivity_;
    InputSource inputSource_ = InputSource::None;
    bool dragging_ = false;
    bool thresholdReached_ = false;
    float lastX_ = 0, lastY_ = 0;
    float startX_ = 0, startY_ = 0;
    float accumX_ = 0, accumY_ = 0;

    // Two-finger pinch state
    SDL_FingerID finger1Id_ = 0, finger2Id_ = 0;
    float finger1X_ = 0, finger1Y_ = 0;
    float finger2X_ = 0, finger2Y_ = 0;
    bool pinching_ = false;
    float lastPinchDist_ = 0;
    float pinchDelta_ = 0;
};

} // namespace ge
