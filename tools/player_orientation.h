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

#ifdef __cplusplus
}
#endif
