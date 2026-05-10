// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <doctest.h>
#include <ge/gesture.h>

using ge::gesture::isHorizontalSwipe;
using ge::gesture::isVerticalSwipe;

TEST_CASE("gesture::isHorizontalSwipe accepts clear horizontal motion") {
    // 100 right, 0 up → clean horizontal.
    CHECK(isHorizontalSwipe(100.f, 0.f, /*threshold=*/50.f));
    CHECK(isHorizontalSwipe(-100.f, 0.f, 50.f));   // leftward
    CHECK(isHorizontalSwipe(100.f, 30.f, 50.f));   // diagonal but horiz-dominant
}

TEST_CASE("gesture::isHorizontalSwipe rejects clear vertical motion") {
    CHECK_FALSE(isHorizontalSwipe(0.f, 100.f, 50.f));
    CHECK_FALSE(isHorizontalSwipe(20.f, 100.f, 50.f));   // small dx, big dy
}

TEST_CASE("gesture::isHorizontalSwipe rejects below-threshold motion") {
    // 30 right, 0 up, threshold 50 → too small.
    CHECK_FALSE(isHorizontalSwipe(30.f, 0.f, 50.f));
}

TEST_CASE("gesture::isHorizontalSwipe rejects ambiguous diagonal motion") {
    // Default dominance ratio 1.5. dx=80, dy=70 → adx > threshold but
    // adx (80) is not > ady (70) * 1.5 (= 105). Reject.
    CHECK_FALSE(isHorizontalSwipe(80.f, 70.f, 50.f));
}

TEST_CASE("gesture::isHorizontalSwipe respects dominanceRatio = 1.0") {
    // With ratio=1.0, adx just needs to exceed ady (and threshold).
    CHECK(isHorizontalSwipe(80.f, 70.f, 50.f, /*dominanceRatio=*/1.0f));
    // Equal magnitudes → adx == ady → strict-greater fails.
    CHECK_FALSE(isHorizontalSwipe(80.f, 80.f, 50.f, 1.0f));
}

TEST_CASE("gesture::isHorizontalSwipe respects strict dominanceRatio = 3.0") {
    // 100 right, 40 up: adx (100) > 3 * ady (120)? No (100 < 120). Reject.
    CHECK_FALSE(isHorizontalSwipe(100.f, 40.f, 50.f, /*dominanceRatio=*/3.0f));
    CHECK(isHorizontalSwipe(100.f, 30.f, 50.f, 3.0f));   // 100 > 90 ✓
}

TEST_CASE("gesture::isVerticalSwipe is the axis-swapped sibling") {
    CHECK(isVerticalSwipe(0.f, 100.f, 50.f));
    CHECK(isVerticalSwipe(0.f, -100.f, 50.f));
    CHECK_FALSE(isVerticalSwipe(100.f, 0.f, 50.f));
    CHECK_FALSE(isVerticalSwipe(0.f, 30.f, 50.f));   // below threshold
    CHECK_FALSE(isVerticalSwipe(80.f, 70.f, 50.f));  // diagonal, default ratio
}

TEST_CASE("gesture::is*Swipe is constexpr") {
    static_assert(isHorizontalSwipe(100.f, 0.f, 50.f));
    static_assert(!isHorizontalSwipe(30.f, 0.f, 50.f));
    static_assert(isVerticalSwipe(0.f, -100.f, 50.f));
}
