// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// ge::log::install dispatcher.
// Platform-specific sinks live in:
//   * log_apple.mm    — os_log sink (iOS / iPadOS / tvOS / watchOS).
//   * log_android.cpp — logcat sink (Android).
// macOS desktop and other platforms get the spdlog default colour
// stderr sink (left untouched).

#include <ge/log.h>

#include <spdlog/sinks/stdout_color_sinks.h>
#include <spdlog/spdlog.h>

#if defined(__APPLE__)
#include <TargetConditionals.h>
#endif

#include <memory>
#include <mutex>
#include <string>
#include <vector>

namespace ge::log {

#if defined(__APPLE__) && (TARGET_OS_IPHONE || TARGET_OS_TV || TARGET_OS_WATCH)
// Defined in log_apple.mm.
spdlog::sink_ptr makeAppleSink(const std::string& subsystem);
std::string autoDetectSubsystemApple();
#endif

#if defined(__ANDROID__)
// Defined in log_android.cpp.
spdlog::sink_ptr makeAndroidSink(const std::string& subsystem);
std::string autoDetectSubsystemAndroid();
#endif

void install(std::string subsystem) {
    static std::once_flag flag;
    std::call_once(flag, [&] {
        // Resolve subsystem before constructing any sink — autodetect
        // dispatches per platform.
        if (subsystem.empty()) {
#if defined(__APPLE__) && (TARGET_OS_IPHONE || TARGET_OS_TV || TARGET_OS_WATCH)
            subsystem = autoDetectSubsystemApple();
#elif defined(__ANDROID__)
            subsystem = autoDetectSubsystemAndroid();
#endif
            if (subsystem.empty()) subsystem = "ge";
        }

        // Build the sink list. stderr stays as a sink everywhere so
        // local-dev console output isn't lost; the native sink fans
        // out to os_log / logcat on mobile.
        std::vector<spdlog::sink_ptr> sinks;
        sinks.push_back(std::make_shared<spdlog::sinks::stderr_color_sink_mt>());

#if defined(__APPLE__) && (TARGET_OS_IPHONE || TARGET_OS_TV || TARGET_OS_WATCH)
        sinks.push_back(makeAppleSink(subsystem));
#elif defined(__ANDROID__)
        sinks.push_back(makeAndroidSink(subsystem));
#endif

        // Replace the default logger so SPDLOG_INFO/WARN/ERROR macros
        // (which target spdlog::default_logger_raw()) fan out through
        // every sink in one shot.
        auto logger = std::make_shared<spdlog::logger>(
            "ge", sinks.begin(), sinks.end());
        logger->set_level(spdlog::level::info);
        logger->flush_on(spdlog::level::warn);
        spdlog::set_default_logger(std::move(logger));
    });
}

} // namespace ge::log
