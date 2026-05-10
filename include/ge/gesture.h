// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Gesture predicates over input deltas.
//
// These are pure math — no SDL or platform dependency, no internal
// state. The consumer accumulates per-frame deltas (or computes a
// total dx/dy from a touch-down + touch-up event pair) and asks "is
// this a horizontal/vertical swipe?". Routing the answer (tap vs
// swipe arbitration, direction → screen-change action) is the
// consumer's job.

#pragma once

namespace ge::gesture {

namespace detail {
constexpr float abs(float v) { return v < 0.0f ? -v : v; }
} // namespace detail

// True iff the (dx, dy) delta represents a horizontal swipe:
//   * `|dx|` exceeds `threshold` (the gesture is "big enough"), AND
//   * `|dx| > |dy| * dominanceRatio` (horizontal motion dominates
//     vertical).
//
// `threshold` is in the same units as `dx`/`dy` — typically pixels,
// possibly scaled by screen width (multimaze uses `screen.w * 0.15`).
//
// `dominanceRatio` defaults to 1.5 — the horizontal component must
// be at least 1.5× the vertical to register as a horizontal swipe.
// Lower values are more permissive (more likely to call diagonal
// motion "horizontal"); higher values insist on cleaner horizontals.
constexpr bool isHorizontalSwipe(float dx, float dy, float threshold,
                                  float dominanceRatio = 1.5f) {
    const float adx = detail::abs(dx);
    const float ady = detail::abs(dy);
    return adx > threshold && adx > ady * dominanceRatio;
}

// Mirror of isHorizontalSwipe with axes swapped. Same semantics.
constexpr bool isVerticalSwipe(float dx, float dy, float threshold,
                                float dominanceRatio = 1.5f) {
    return isHorizontalSwipe(dy, dx, threshold, dominanceRatio);
}

} // namespace ge::gesture
