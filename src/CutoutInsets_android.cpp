// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Android impl: JNI into the activity to read display-cutout insets.
// Activity exposes `int[] getDisplayCutoutInsets()` returning
// {left, right, top, bottom} populated from
// WindowInsets.Type.displayCutout() in an OnApplyWindowInsetsListener.
// If the activity doesn't define the method (apps that customise their
// activity from the ge template), we return zeros.

#include "CutoutInsets.h"

#include <SDL3/SDL_system.h>
#include <jni.h>
#include <spdlog/spdlog.h>

namespace ge {

SafeAreaInsets queryDisplayCutoutInsets() {
    SafeAreaInsets out{};
    JNIEnv* env = static_cast<JNIEnv*>(SDL_GetAndroidJNIEnv());
    if (!env) return out;
    jobject activity = static_cast<jobject>(SDL_GetAndroidActivity());
    if (!activity) return out;
    jclass cls = env->GetObjectClass(activity);
    jmethodID m = env->GetMethodID(cls, "getDisplayCutoutInsets", "()[I");
    if (!m) {
        env->ExceptionClear();
        env->DeleteLocalRef(cls);
        env->DeleteLocalRef(activity);
        return out;
    }
    jintArray arr = static_cast<jintArray>(env->CallObjectMethod(activity, m));
    if (env->ExceptionCheck()) {
        env->ExceptionDescribe();
        env->ExceptionClear();
        env->DeleteLocalRef(cls);
        env->DeleteLocalRef(activity);
        return out;
    }
    if (arr && env->GetArrayLength(arr) == 4) {
        jint vals[4] = {0, 0, 0, 0};
        env->GetIntArrayRegion(arr, 0, 4, vals);
        out.left   = vals[0];
        out.right  = vals[1];
        out.top    = vals[2];
        out.bottom = vals[3];
    }
    if (arr) env->DeleteLocalRef(arr);
    env->DeleteLocalRef(cls);
    env->DeleteLocalRef(activity);
    return out;
}

} // namespace ge
