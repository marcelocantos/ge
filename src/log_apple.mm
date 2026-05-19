// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Apple os_log sink for ge::log (🎯T66). Compiled on iOS / iPadOS /
// tvOS / watchOS only — macOS desktop keeps stderr.
//
// Key trick: spdlog formats each message into a memory buffer; we pass
// that already-rendered payload as a single `%{public}s` argument to
// os_log. Apple's privacy filter treats the whole payload as public,
// so consumer code keeps writing normal `SPDLOG_INFO("v={:.3f}", v)`
// without per-call %{public} annotations.
//
// The named subsystem (passed to os_log_create) is what `spyder log
// <udid> --process <CFBundleExecutable>` and Xcode Console use for
// capture-side filtering. Entries logged via OS_LOG_DEFAULT (no named
// subsystem) are filtered out of remote capture entirely.

#include <ge/log.h>

#if defined(__APPLE__)
#include <TargetConditionals.h>
#endif

#if defined(__APPLE__) && (TARGET_OS_IPHONE || TARGET_OS_TV || TARGET_OS_WATCH)

#import <Foundation/Foundation.h>
#include <os/log.h>

#include <spdlog/sinks/base_sink.h>
#include <spdlog/spdlog.h>

#include <mutex>
#include <string>

namespace ge::log {

namespace {

class AppleSink : public spdlog::sinks::base_sink<std::mutex> {
public:
    AppleSink(const std::string& subsystem, const std::string& category)
        : log_(os_log_create(subsystem.c_str(), category.c_str())) {}

protected:
    void sink_it_(const spdlog::details::log_msg& msg) override {
        spdlog::memory_buf_t buf;
        this->formatter_->format(msg, buf);
        // Strip trailing newline — the default spdlog pattern adds one
        // for stderr readability, but os_log records are line-oriented
        // by themselves.
        size_t n = buf.size();
        while (n > 0 && (buf.data()[n - 1] == '\n' || buf.data()[n - 1] == '\r')) --n;
        std::string payload(buf.data(), n);

        os_log_type_t type = OS_LOG_TYPE_DEFAULT;
        switch (msg.level) {
            case spdlog::level::trace:
            case spdlog::level::debug:    type = OS_LOG_TYPE_DEBUG;   break;
            case spdlog::level::info:     type = OS_LOG_TYPE_INFO;    break;
            case spdlog::level::warn:     type = OS_LOG_TYPE_DEFAULT; break;
            case spdlog::level::err:      type = OS_LOG_TYPE_ERROR;   break;
            case spdlog::level::critical: type = OS_LOG_TYPE_FAULT;   break;
            default:                      type = OS_LOG_TYPE_DEFAULT; break;
        }
        os_log_with_type(log_, type, "%{public}s", payload.c_str());
    }

    void flush_() override {}

private:
    os_log_t log_;
};

} // namespace

spdlog::sink_ptr makeAppleSink(const std::string& subsystem) {
    return std::make_shared<AppleSink>(subsystem, "ge");
}

std::string autoDetectSubsystemApple() {
    NSString* bundleId = [[NSBundle mainBundle] bundleIdentifier];
    if (bundleId) return std::string([bundleId UTF8String]);
    return {};
}

} // namespace ge::log

#endif // __APPLE__ && (TARGET_OS_IPHONE || TARGET_OS_TV || TARGET_OS_WATCH)
