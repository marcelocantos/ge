// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <doctest.h>
#include <ge/layout.h>

using ge::layout::gridY;
using ge::layout::gridX;

TEST_CASE("layout::gridY row 0 sits at topMargin") {
    CHECK(gridY(0, /*rowH=*/55.f, /*gap=*/10.f, /*topMargin=*/60.f) == 60.f);
}

TEST_CASE("layout::gridY consecutive rows are (rowH + gap) apart") {
    const float rowH = 55.f, gap = 10.f, top = 60.f;
    CHECK(gridY(1, rowH, gap, top) == 60.f + 65.f);
    CHECK(gridY(2, rowH, gap, top) == 60.f + 130.f);
    CHECK(gridY(3, rowH, gap, top) == 60.f + 195.f);
    // Difference between consecutive rows.
    CHECK(gridY(2, rowH, gap, top) - gridY(1, rowH, gap, top) ==
          gridY(1, rowH, gap, top) - gridY(0, rowH, gap, top));
}

TEST_CASE("layout::gridY honors negative rowIdx (positioning above row 0)") {
    CHECK(gridY(-1, /*rowH=*/40.f, /*gap=*/8.f, /*topMargin=*/100.f) ==
          100.f - 48.f);
    CHECK(gridY(-2, 40.f, 8.f, 100.f) == 100.f - 96.f);
}

TEST_CASE("layout::gridY with zero gap collapses to row-stack of `rowH`") {
    const float rowH = 30.f;
    CHECK(gridY(0, rowH, 0.f, 0.f) == 0.f);
    CHECK(gridY(3, rowH, 0.f, 0.f) == 90.f);
}

TEST_CASE("layout::gridX is axis-swapped sibling") {
    CHECK(gridX(0, 50.f, 5.f, 20.f) == 20.f);
    CHECK(gridX(2, 50.f, 5.f, 20.f) == 20.f + 110.f);
}

TEST_CASE("layout::gridY / gridX are constexpr") {
    static_assert(gridY(0, 10.f, 2.f, 5.f) == 5.f);
    static_assert(gridY(1, 10.f, 2.f, 5.f) == 17.f);
    static_assert(gridX(2, 10.f, 2.f, 5.f) == 29.f);
}
