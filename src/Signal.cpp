// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/Signal.h>

#if defined(__APPLE__)
#include <TargetConditionals.h>
#endif

#if defined(__ANDROID__)
#define GE_SIGNAL_SUPPORTED 0
#elif defined(__APPLE__) && TARGET_OS_IPHONE
#define GE_SIGNAL_SUPPORTED 0
#else
#define GE_SIGNAL_SUPPORTED 1
#endif

#if GE_SIGNAL_SUPPORTED
#include <csignal>
#include <atomic>

static std::atomic<bool> g_quit{false};
static void handler(int) { g_quit = true; }
#endif

namespace ge {

void installSignalHandlers() {
#if GE_SIGNAL_SUPPORTED
    std::signal(SIGINT, handler);
    std::signal(SIGTERM, handler);
#endif
}

bool shouldQuit() {
#if GE_SIGNAL_SUPPORTED
    return g_quit;
#else
    return false;
#endif
}

} // namespace ge
