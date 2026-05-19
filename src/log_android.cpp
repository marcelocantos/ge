// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Android logcat sink for ge::log (🎯T66). Captured by `adb logcat`.
//
// Tag = subsystem (truncated to Android's 23-char TAG limit).
// Subsystem auto-detects to the app's package name via JNI to
// Activity.getPackageName(); SDL's android bridge provides the JNIEnv
// and current Activity object without extra wiring from the consumer.

#include <ge/log.h>

#if defined(__ANDROID__)

#include <android/log.h>

#include <SDL3/SDL_system.h>

#include <jni.h>
#include <spdlog/sinks/base_sink.h>
#include <spdlog/spdlog.h>

#include <mutex>
#include <string>

namespace ge::log {

namespace {

constexpr size_t kAndroidTagMax = 23;

std::string truncateTag(const std::string& s) {
    return (s.size() > kAndroidTagMax) ? s.substr(0, kAndroidTagMax) : s;
}

class AndroidSink : public spdlog::sinks::base_sink<std::mutex> {
public:
    explicit AndroidSink(std::string tag) : tag_(truncateTag(std::move(tag))) {}

protected:
    void sink_it_(const spdlog::details::log_msg& msg) override {
        spdlog::memory_buf_t buf;
        this->formatter_->format(msg, buf);
        size_t n = buf.size();
        while (n > 0 && (buf.data()[n - 1] == '\n' || buf.data()[n - 1] == '\r')) --n;
        std::string payload(buf.data(), n);

        int prio = ANDROID_LOG_INFO;
        switch (msg.level) {
            case spdlog::level::trace:    prio = ANDROID_LOG_VERBOSE; break;
            case spdlog::level::debug:    prio = ANDROID_LOG_DEBUG;   break;
            case spdlog::level::info:     prio = ANDROID_LOG_INFO;    break;
            case spdlog::level::warn:     prio = ANDROID_LOG_WARN;    break;
            case spdlog::level::err:      prio = ANDROID_LOG_ERROR;   break;
            case spdlog::level::critical: prio = ANDROID_LOG_FATAL;   break;
            default:                      prio = ANDROID_LOG_INFO;    break;
        }
        __android_log_print(prio, tag_.c_str(), "%s", payload.c_str());
    }

    void flush_() override {}

private:
    std::string tag_;
};

} // namespace

spdlog::sink_ptr makeAndroidSink(const std::string& subsystem) {
    return std::make_shared<AndroidSink>(subsystem);
}

std::string autoDetectSubsystemAndroid() {
    JNIEnv* env = static_cast<JNIEnv*>(SDL_GetAndroidJNIEnv());
    jobject activity = static_cast<jobject>(SDL_GetAndroidActivity());
    if (!env || !activity) return {};

    jclass cls = env->GetObjectClass(activity);
    if (!cls) {
        env->DeleteLocalRef(activity);
        return {};
    }
    jmethodID m = env->GetMethodID(cls, "getPackageName", "()Ljava/lang/String;");
    jstring pkg = nullptr;
    if (m) {
        pkg = static_cast<jstring>(env->CallObjectMethod(activity, m));
    }
    std::string out;
    if (pkg) {
        const char* c = env->GetStringUTFChars(pkg, nullptr);
        if (c) out.assign(c);
        env->ReleaseStringUTFChars(pkg, c);
        env->DeleteLocalRef(pkg);
    }
    env->DeleteLocalRef(cls);
    env->DeleteLocalRef(activity);
    return out;
}

} // namespace ge::log

#endif // __ANDROID__
