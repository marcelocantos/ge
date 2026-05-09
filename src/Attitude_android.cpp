// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Android AttitudeProvider — bridges to the Java side
// (Activity.getAttitude), which registers Sensor.TYPE_GAME_ROTATION_VECTOR
// in onResume/onPause and exposes the latest quaternion as a float[4]
// (x, y, z, w). See tools/android-template/app/src/main/java/Activity.java.in.
//
// The Java listener uses TYPE_GAME_ROTATION_VECTOR rather than
// TYPE_ROTATION_VECTOR so we don't pull in the magnetometer — the
// engine's EMA baseline absorbs whatever heading reference Android
// hands us, and indoor magnetic interference would otherwise muddy
// the quaternion.

#include "Attitude.h"

#include <SDL3/SDL.h>
#include <jni.h>

namespace ge {

namespace {

class AndroidAttitudeProvider final : public AttitudeProvider {
public:
    AndroidAttitudeProvider() {
        env_      = static_cast<JNIEnv*>(SDL_GetAndroidJNIEnv());
        activity_ = env_ ? static_cast<jobject>(SDL_GetAndroidActivity()) : nullptr;
        if (!activity_) return;
        jclass cls = env_->GetObjectClass(activity_);
        method_ = env_->GetMethodID(cls, "getAttitude", "()[F");
        env_->DeleteLocalRef(cls);
    }
    ~AndroidAttitudeProvider() override {
        if (activity_) {
            env_->DeleteGlobalRef(activity_);
            activity_ = nullptr;
        }
    }

    // valid() doubles as the per-frame poll. Cheap (one JNI call,
    // returns a pre-existing volatile float[4] from the listener) so
    // we don't bother batching.
    bool valid() const override {
        if (!activity_ || !method_) return false;
        jfloatArray arr = static_cast<jfloatArray>(
            env_->CallObjectMethod(activity_, method_));
        if (!arr) return cached_.valid;
        jfloat buf[4] = {0, 0, 0, 1};
        env_->GetFloatArrayRegion(arr, 0, 4, buf);
        env_->DeleteLocalRef(arr);
        cached_.q[0] = buf[0]; cached_.q[1] = buf[1];
        cached_.q[2] = buf[2]; cached_.q[3] = buf[3];
        cached_.valid = true;
        return true;
    }

    la::float4 quaternion() const override {
        return la::float4{cached_.q[0], cached_.q[1], cached_.q[2], cached_.q[3]};
    }

private:
    JNIEnv* env_ = nullptr;
    jobject activity_ = nullptr;
    jmethodID method_ = nullptr;
    // Mutable because valid() is a const accessor that doubles as the
    // per-frame JNI poll — see comment at valid().
    struct Cached {
        float q[4] = {0, 0, 0, 1};
        bool valid = false;
    };
    mutable Cached cached_;
};

} // namespace

std::unique_ptr<AttitudeProvider> makeAttitudeProvider() {
    auto p = std::make_unique<AndroidAttitudeProvider>();
    // No method on the Activity? Fall through to the stub semantics —
    // valid() will keep returning false and the engine will leave
    // parallax at zero.
    return p;
}

} // namespace ge
