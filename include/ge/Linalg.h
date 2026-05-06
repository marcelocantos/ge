// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Re-exports linalg's full alias set into `ge::la`. Every public ge
// header includes this so games can write `ge::la::float2` /
// `ge::la::float4x4` / `ge::la::int3` no matter which ge header they
// pulled in. `using namespace ge::la;` brings the short forms in
// unqualified for game code that wants them.
//
// Sub-namespace `la` (not directly into `ge::`) is deliberate —
// keeps linalg's 96 aliases out of `ge::`'s autocomplete and
// preserves a clean visual marker at use sites that the type came
// from linalg, not ge proper.
#pragma once

#include <linalg.h>

namespace ge::la {
using namespace linalg::aliases;
}
