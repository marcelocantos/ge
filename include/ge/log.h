// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Cross-platform spdlog sink that fans SPDLOG_INFO/WARN/ERROR/DEBUG/
// CRITICAL output to the native log channel:
//   * Apple — os_log_with_type via os_log_create(subsystem, "ge").
//     Captured by `spyder log <udid> --process <CFBundleExecutable>`
//     (and Xcode Console). The whole spdlog-rendered payload is
//     passed as a single `%{public}s` argument so every value is
//     visible without per-call %{public} boilerplate.
//   * Android — __android_log_print with tag = subsystem (truncated
//     to 23 chars per Android's TAG limit). Captured by `adb logcat`.
//   * Desktop — spdlog's default colour-stderr sink, unchanged.
//
// Why this lives in ge: Apple's privacy-by-default unified-log
// behaviour makes SPDLOG_INFO invisible on iOS without an
// os_log_create-based sink; capture also requires a named subsystem
// (not OS_LOG_DEFAULT). Encoding the workaround once in the engine
// saves every consumer game the same multi-day reverse-engineering
// puzzle that surfaced during multimaze2's 🎯T17 instrumentation
// push (2026-05-17 → 2026-05-19).
//
// spdlog level → native level mapping:
//   trace/debug → OS_LOG_TYPE_DEBUG  / ANDROID_LOG_VERBOSE-DEBUG
//   info        → OS_LOG_TYPE_INFO   / ANDROID_LOG_INFO
//   warn        → OS_LOG_TYPE_DEFAULT/ ANDROID_LOG_WARN
//   error       → OS_LOG_TYPE_ERROR  / ANDROID_LOG_ERROR
//   critical    → OS_LOG_TYPE_FAULT  / ANDROID_LOG_FATAL

#pragma once

#include <string>

namespace ge::log {

// Install the platform-native spdlog sink. Idempotent — second and
// later calls are no-ops. Normally called once from `ge::run` before
// any logging happens; consumer apps don't need to call it directly.
//
// `subsystem` is the logger name used for capture-side filtering.
// Empty string auto-detects:
//   * iOS — `[[NSBundle mainBundle] bundleIdentifier]`
//     (e.g. "com.squz.tiltbuggy").
//   * Android — `Activity.getPackageName()` via SDL's JNI bridge
//     (truncated to 23 chars for the logcat tag).
//   * Desktop — falls back to "ge"; subsystem isn't used by the
//     stderr sink so the value is informational only.
void install(std::string subsystem = "");

} // namespace ge::log
