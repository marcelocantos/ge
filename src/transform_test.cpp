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

// ─────────────────────────────────────────────────────────────────────
// frameCentered + frameRotated
// ─────────────────────────────────────────────────────────────────────

TEST_CASE("frameCentered matches frame(Rect::centered)") {
    const la::float2 c{100.f, 200.f};
    const la::float2 sz{40.f, 60.f};
    auto a = ge::frameCentered(c, sz);
    auto b = ge::frame(Rect::centered(c, sz));
    for (int col = 0; col < 4; ++col)
        for (int row = 0; row < 4; ++row)
            CHECK(a[col][row] == doctest::Approx(b[col][row]));
}

TEST_CASE("frameCentered: unit-square corners map to centered rect corners") {
    const la::float2 c{50.f, 100.f};
    const la::float2 sz{20.f, 40.f};
    auto m = ge::frameCentered(c, sz);

    // Center of unit square (0.5, 0.5) → (50, 100).
    auto cp = applyXY(m, 0.5f, 0.5f);
    CHECK(cp.x == doctest::Approx(50.f));
    CHECK(cp.y == doctest::Approx(100.f));

    // Top-left (0, 0) → (40, 80).
    auto tl = applyXY(m, 0.f, 0.f);
    CHECK(tl.x == doctest::Approx(40.f));
    CHECK(tl.y == doctest::Approx(80.f));

    // Bottom-right (1, 1) → (60, 120).
    auto br = applyXY(m, 1.f, 1.f);
    CHECK(br.x == doctest::Approx(60.f));
    CHECK(br.y == doctest::Approx(120.f));
}

TEST_CASE("frameRotated: angle = 0 matches frameCentered") {
    const la::float2 c{30.f, 40.f};
    const la::float2 sz{10.f, 20.f};
    auto rot0 = ge::frameRotated(c, sz, 0.f);
    auto cen  = ge::frameCentered(c, sz);
    for (int col = 0; col < 4; ++col)
        for (int row = 0; row < 4; ++row)
            CHECK(rot0[col][row] == doctest::Approx(cen[col][row]));
}

TEST_CASE("frameRotated: π/2 rotates 90° around center") {
    const la::float2 c{0.f, 0.f};
    const la::float2 sz{10.f, 4.f};
    constexpr float kHalfPi = 1.57079632679f;
    auto m = ge::frameRotated(c, sz, kHalfPi);

    // Local (0, 0) is the (-w/2, -h/2) corner pre-rotation = (-5, -2).
    // R(π/2) · (-5, -2) = (2, -5). Plus center (0, 0) → (2, -5).
    auto p = applyXY(m, 0.f, 0.f);
    CHECK(p.x == doctest::Approx( 2.f).epsilon(1e-5f));
    CHECK(p.y == doctest::Approx(-5.f).epsilon(1e-5f));

    // Center of unit square stays at center of world after rotation.
    auto cp = applyXY(m, 0.5f, 0.5f);
    CHECK(cp.x == doctest::Approx(0.f).epsilon(1e-5f));
    CHECK(cp.y == doctest::Approx(0.f).epsilon(1e-5f));
}

TEST_CASE("frameRotated: inverse round-trips world points to unit-square") {
    const la::float2 c{50.f, 80.f};
    const la::float2 sz{40.f, 30.f};
    constexpr float angle = 0.7f;   // arbitrary
    auto m   = ge::frameRotated(c, sz, angle);
    auto inv = la::inverse(m);

    // World center → unit (0.5, 0.5).
    auto unitCenter = applyXY(inv, c.x, c.y);
    CHECK(unitCenter.x == doctest::Approx(0.5f).epsilon(1e-5f));
    CHECK(unitCenter.y == doctest::Approx(0.5f).epsilon(1e-5f));

    // Round-trip an arbitrary unit-square point through m * inv.
    auto round = applyXY(la::mul(m, inv), 0.3f, 0.7f);
    CHECK(round.x == doctest::Approx(0.3f).epsilon(1e-5f));
    CHECK(round.y == doctest::Approx(0.7f).epsilon(1e-5f));
}

TEST_CASE("frameCentered is constexpr") {
    constexpr auto m = ge::frameCentered({100.f, 50.f}, {40.f, 20.f});
    static_assert(m[0][0] == 40.f);   // x basis = w
    static_assert(m[1][1] == 20.f);   // y basis = h
    static_assert(m[3][0] == 80.f);   // origin x = center.x - w/2
    static_assert(m[3][1] == 40.f);   // origin y = center.y - h/2
}
