// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include <ge/Linalg.h>
#include <ge/SessionHost.h>  // ge::Rect

namespace ge {

// A `Rect` as a 2D coordinate frame: origin at (rect.x, rect.y), x-basis
// = (rect.w, 0), y-basis = (0, rect.h). Maps the unit square (0..1)² in
// local space to the rect in parent space.
//
// Use as a model-to-parent transform — `bgfx::setTransform(&frame(r)[0][0])`.
// Apply `la::inverse(frame(r))` to map parent points back into local
// (unit-square) space; useful for hit testing.
//
// Mapping between two arbitrary rects is just composition. Use
// `la::mul` for matrix multiplication — linalg deprecates `operator*`
// between matrices (it does component-wise multiplication, not what
// you want):
//
//     auto m_a_to_b = la::mul(frame(b), la::inverse(frame(a)));
//
// `Rect.w` and `Rect.h` may be negative — that is how a caller in a y-up
// parent space flips the y basis so the local y=0 edge lines up with the
// rect's top in the parent's orientation. No separate y-up / y-down API.
//
// The z basis is identity (z passes through unchanged). The 2D-rect view
// is recovered by the common case where local-space z = 0; the identity
// z keeps the matrix invertible (det = w * h) so `la::inverse(frame(r))`
// is well-defined for hit-testing.
constexpr la::float4x4 frame(Rect r) {
    return {
        { r.w, 0.f, 0.f, 0.f },   // col 0: x basis
        { 0.f, r.h, 0.f, 0.f },   // col 1: y basis
        { 0.f, 0.f, 1.f, 0.f },   // col 2: z basis (identity)
        { r.x, r.y, 0.f, 1.f },   // col 3: origin
    };
}

} // namespace ge
