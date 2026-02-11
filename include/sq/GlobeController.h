#pragma once

#include <sq/DampedRotation.h>
#include <SDL3/SDL_events.h>

namespace sq {

// Manages a spinnable globe: drag-to-rotate with inertia.
// Handles mouse and finger input, input source arbitration,
// per-frame velocity accumulation, and free-spin decay.
class GlobeController {
public:
    GlobeController(float damping = 0.92f, float sensitivity = 0.01f)
        : rotation_(damping), sensitivity_(sensitivity) {}

    // Feed an SDL event. Returns true if the event was handled.
    // viewWidth/viewHeight: surface size in pixels.
    // pixelRatio: device pixel ratio (for finger coord conversion).
    bool event(const SDL_Event& e, int viewWidth, int viewHeight, int pixelRatio) {
        switch (e.type) {
            case SDL_EVENT_FINGER_DOWN: {
                if (inputSource_ != InputSource::None) return false;
                float px = e.tfinger.x * float(viewWidth) / float(pixelRatio);
                float py = e.tfinger.y * float(viewHeight) / float(pixelRatio);
                inputSource_ = InputSource::Finger;
                dragging_ = true;
                lastX_ = px;
                lastY_ = py;
                accumX_ = accumY_ = 0.0f;
                rotation_.setAngularVelocity({0, 0, 0});
                return true;
            }

            case SDL_EVENT_MOUSE_BUTTON_DOWN: {
                if (inputSource_ != InputSource::None) return false;
                inputSource_ = InputSource::Mouse;
                dragging_ = true;
                lastX_ = e.button.x;
                lastY_ = e.button.y;
                accumX_ = accumY_ = 0.0f;
                rotation_.setAngularVelocity({0, 0, 0});
                return true;
            }

            case SDL_EVENT_FINGER_MOTION: {
                if (inputSource_ != InputSource::Finger) return false;
                float px = e.tfinger.x * float(viewWidth) / float(pixelRatio);
                float py = e.tfinger.y * float(viewHeight) / float(pixelRatio);
                float dx = px - lastX_;
                float dy = py - lastY_;
                rotation_.applyDrag(dx, dy, sensitivity_);
                accumX_ += dx;
                accumY_ += dy;
                lastX_ = px;
                lastY_ = py;
                return true;
            }

            case SDL_EVENT_MOUSE_MOTION: {
                if (inputSource_ != InputSource::Mouse) return false;
                float dx = e.motion.x - lastX_;
                float dy = e.motion.y - lastY_;
                rotation_.applyDrag(dx, dy, sensitivity_);
                accumX_ += dx;
                accumY_ += dy;
                lastX_ = e.motion.x;
                lastY_ = e.motion.y;
                return true;
            }

            case SDL_EVENT_FINGER_UP:
                if (inputSource_ != InputSource::Finger) return false;
                dragging_ = false;
                inputSource_ = InputSource::None;
                return true;

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

private:
    enum class InputSource { None, Mouse, Finger };

    DampedRotation rotation_;
    float sensitivity_;
    InputSource inputSource_ = InputSource::None;
    bool dragging_ = false;
    float lastX_ = 0, lastY_ = 0;
    float accumX_ = 0, accumY_ = 0;
};

} // namespace sq
