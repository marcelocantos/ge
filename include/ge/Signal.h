// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Signal handling for macOS CLI binaries (server and player).
// No-op on iOS/Android where the OS manages app lifecycle.
#pragma once

namespace ge {

// Install SIGINT/SIGTERM handlers. Call once at startup.
void installSignalHandlers();

// True after SIGINT or SIGTERM received.
bool shouldQuit();

} // namespace ge
