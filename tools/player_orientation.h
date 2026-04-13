// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <cstdint>

#ifdef __cplusplus
extern "C" {
#endif

// Force the app to a specific orientation. Values match SessionConfig:
// 1=LandscapeLeft, 2=LandscapeRight, 3=Portrait, 4=PortraitUpsideDown, 0=no-op.
// On platforms without native orientation control, this is a no-op.
void playerForceOrientation(uint8_t orientation);

// Returns the physical device orientation as SDL_DisplayOrientation.
// On iOS, reads UIDevice.current.orientation (independent of interface lock).
// On other platforms, returns SDL_ORIENTATION_PORTRAIT.
int playerGetPhysicalOrientation();

#ifdef __cplusplus
}
#endif
