// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Non-Android impl of ge::applyImmersive — no-op. iOS handles status-
// bar autohide in landscape and reads UIRequiresFullScreen from the
// app's Info.plist at launch (cannot be toggled at runtime). macOS /
// Linux / Windows have no equivalent runtime concept.

#include "Immersive.h"

namespace ge {

void applyImmersive(bool /*enabled*/) {}

} // namespace ge
