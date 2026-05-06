// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Engine-internal: apply the SessionHostConfig.immersive flag.
// Platform impls live in Immersive_android.cpp / Immersive_apple.mm /
// Immersive_stub.cpp.
#pragma once

namespace ge {

// Hide system chrome (Android status + navigation bars). Called once
// from runDirect after the host is constructed. No-op on iOS / desktop
// — see SessionHostConfig.immersive comment for platform notes.
void applyImmersive(bool enabled);

} // namespace ge
