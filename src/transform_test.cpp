// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/transform.h>

#include <doctest.h>

using ge::Rect;
using ge::frame;
namespace la = ::ge::la;

namespace {

// Apply a 4×4 to a 2D point (z = 0, w = 1).
la::float2 applyXY(const la::float4x4& m, float x, float y) {
    auto v = la::mul(m, la::float4{x, y, 0.f, 1.f});
    return {v.x, v.y};
}

} // namespace

TEST_CASE("frame: unit-square corners map to rect corners") {
    const Rect r{10.f, 20.f, 80.f, 60.f};
    auto m = frame(r);

    // (0,0) → (rect.x, rect.y) = (10, 20)
    auto p00 = applyXY(m, 0.f, 0.f);
    CHECK(p00.x == doctest::Approx(10.f));
    CHECK(p00.y == doctest::Approx(20.f));

    // (1,0) → (rect.x + rect.w, rect.y) = (90, 20)
    auto p10 = applyXY(m, 1.f, 0.f);
    CHECK(p10.x == doctest::Approx(90.f));
    CHECK(p10.y == doctest::Approx(20.f));

    // (1,1) → (rect.x + rect.w, rect.y + rect.h) = (90, 80)
    auto p11 = applyXY(m, 1.f, 1.f);
    CHECK(p11.x == doctest::Approx(90.f));
    CHECK(p11.y == doctest::Approx(80.f));

    // (0,1) → (rect.x, rect.y + rect.h) = (10, 80)
    auto p01 = applyXY(m, 0.f, 1.f);
    CHECK(p01.x == doctest::Approx(10.f));
    CHECK(p01.y == doctest::Approx(80.f));
}

TEST_CASE("frame: negative h flips the y basis (y-up convention)") {
    // For y-up rendering, the caller passes h<0 so unit-y=0 maps to the
    // larger world y (top in y-up).
    const Rect r{0.f, 100.f, 10.f, -40.f};   // y range 60..100 in y-up
    auto m = frame(r);

    // Unit (0, 0) → (0, 100) — top in y-up.
    auto top = applyXY(m, 0.f, 0.f);
    CHECK(top.y == doctest::Approx(100.f));

    // Unit (0, 1) → (0, 60) — bottom in y-up.
    auto bot = applyXY(m, 0.f, 1.f);
    CHECK(bot.y == doctest::Approx(60.f));
}

TEST_CASE("frame: inverse round-trips world points to unit-square") {
    const Rect r{50.f, 100.f, 200.f, 75.f};
    auto m   = frame(r);
    auto inv = la::inverse(m);

    // World point at the rect's centre should map to (0.5, 0.5) in unit space.
    auto centre = applyXY(inv,
                          r.x + r.w * 0.5f,
                          r.y + r.h * 0.5f);
    CHECK(centre.x == doctest::Approx(0.5f));
    CHECK(centre.y == doctest::Approx(0.5f));

    // World corner (rect.x + rect.w, rect.y + rect.h) → (1, 1).
    auto corner = applyXY(inv, r.x + r.w, r.y + r.h);
    CHECK(corner.x == doctest::Approx(1.f));
    CHECK(corner.y == doctest::Approx(1.f));
}

TEST_CASE("frame: rect-to-rect mapping is frame(b) * inverse(frame(a))") {
    const Rect a{0.f,   0.f,   100.f, 100.f};   // [0..100]²
    const Rect b{50.f, 200.f,   200.f,  50.f};  // [50..250] x [200..250]

    // Mapping a → b: a's centre (50, 50) should land at b's centre (150, 225).
    auto m_a_to_b = la::mul(frame(b), la::inverse(frame(a)));
    auto centreB = applyXY(m_a_to_b, 50.f, 50.f);
    CHECK(centreB.x == doctest::Approx(150.f));
    CHECK(centreB.y == doctest::Approx(225.f));

    // a's bottom-right (100, 100) → b's bottom-right (250, 250).
    auto br = applyXY(m_a_to_b, 100.f, 100.f);
    CHECK(br.x == doctest::Approx(250.f));
    CHECK(br.y == doctest::Approx(250.f));
}

TEST_CASE("frame: z passes through (identity z basis)") {
    // Identity z basis keeps the matrix invertible (det = w * h).
    // Common 2D usage is z=0 in / z=0 out, but z != 0 passes through.
    auto m = frame(Rect{0.f, 0.f, 1.f, 1.f});
    auto v = la::mul(m, la::float4{0.5f, 0.5f, 99.f, 1.f});
    CHECK(v.z == doctest::Approx(99.f));
}
