// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Desktop / fallback AttitudeProvider — no sensor, parallax stays zero.

#include "Attitude.h"

namespace ge {

std::unique_ptr<AttitudeProvider> makeAttitudeProvider() {
    return nullptr;
}

} // namespace ge
