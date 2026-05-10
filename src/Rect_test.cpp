#include <doctest.h>
#include <ge/SessionHost.h>

using ge::Rect;
using ge::SafeAreaInsets;
using float2 = ge::la::float2;

TEST_CASE("Rect default-constructs empty") {
    Rect r;
    CHECK(r.empty());
    CHECK(r.size().x == 0.0f);
    CHECK(r.size().y == 0.0f);
}

TEST_CASE("Rect size and center") {
    Rect r{10, 20, 30, 40};
    CHECK_FALSE(r.empty());
    CHECK(r.size().x == 30.0f);
    CHECK(r.size().y == 40.0f);
    CHECK(r.center().x == 25.0f);  // 10 + 30/2
    CHECK(r.center().y == 40.0f);  // 20 + 40/2
}

TEST_CASE("Rect contains(point) is half-open") {
    Rect r{10, 20, 30, 40};
    CHECK(r.contains(float2{10, 20}));        // top-left inclusive
    CHECK(r.contains(float2{25, 35}));        // interior
    CHECK_FALSE(r.contains(float2{40, 35}));  // x == x+w exclusive
    CHECK_FALSE(r.contains(float2{25, 60}));  // y == y+h exclusive
    CHECK_FALSE(r.contains(float2{9.99f, 35}));
    CHECK_FALSE(r.contains(float2{25, 19.99f}));
}

TEST_CASE("Rect contains(other) requires full enclosure") {
    Rect outer{0, 0, 100, 100};
    CHECK(outer.contains(Rect{10, 10, 20, 20}));
    CHECK(outer.contains(Rect{0, 0, 100, 100}));   // self-contains
    CHECK_FALSE(outer.contains(Rect{50, 50, 60, 60}));  // exceeds right/bottom
    CHECK_FALSE(outer.contains(Rect{}));                 // empty isn't contained
}

TEST_CASE("Rect intersects requires positive overlap") {
    Rect a{0, 0, 100, 100};
    Rect b{50, 50, 100, 100};
    Rect c{200, 200, 10, 10};
    Rect touching{100, 0, 50, 100};  // shares an edge with a
    CHECK(a.intersects(b));
    CHECK(b.intersects(a));
    CHECK_FALSE(a.intersects(c));
    CHECK_FALSE(a.intersects(touching));  // boundary-touching doesn't count
    CHECK_FALSE(a.intersects(Rect{}));    // empty intersects nothing
}

TEST_CASE("Rect intersect returns the overlap") {
    Rect a{0, 0, 100, 100};
    Rect b{50, 50, 100, 100};
    Rect overlap = a.intersect(b);
    CHECK(overlap.x == 50.0f);
    CHECK(overlap.y == 50.0f);
    CHECK(overlap.w == 50.0f);
    CHECK(overlap.h == 50.0f);

    Rect none = a.intersect(Rect{200, 200, 10, 10});
    CHECK(none.empty());
}

TEST_CASE("Rect bbox bounds both") {
    Rect a{0, 0, 50, 50};
    Rect b{100, 100, 50, 50};
    Rect u = a.bbox(b);
    CHECK(u.x == 0.0f);
    CHECK(u.y == 0.0f);
    CHECK(u.w == 150.0f);
    CHECK(u.h == 150.0f);

    // Empty inputs are absorbed.
    CHECK(Rect{}.bbox(a) == a);
    CHECK(a.bbox(Rect{}) == a);
}

TEST_CASE("Rect inset(dx, dy) shrinks symmetrically; negative expands") {
    Rect r{10, 20, 100, 80};
    Rect padded = r.inset(5, 10);
    CHECK(padded.x == 15.0f);
    CHECK(padded.y == 30.0f);
    CHECK(padded.w == 90.0f);  // 100 - 2*5
    CHECK(padded.h == 60.0f);  // 80 - 2*10

    Rect expanded = r.inset(-2, -3);
    CHECK(expanded.x == 8.0f);
    CHECK(expanded.w == 104.0f);
}

TEST_CASE("Rect inset(SafeAreaInsets) shrinks per-edge") {
    Rect r{0, 0, 1000, 1000};
    SafeAreaInsets s{.top = 50, .bottom = 80, .left = 20, .right = 30};
    Rect inner = r.inset(s);
    CHECK(inner.x == 20.0f);
    CHECK(inner.y == 50.0f);
    CHECK(inner.w == 950.0f);   // 1000 - 20 - 30
    CHECK(inner.h == 870.0f);   // 1000 - 50 - 80
}

TEST_CASE("Rect translated moves without resizing") {
    Rect r{10, 20, 30, 40};
    Rect t = r.translated(float2{5, -10});
    CHECK(t.x == 15.0f);
    CHECK(t.y == 10.0f);
    CHECK(t.w == 30.0f);
    CHECK(t.h == 40.0f);
}

TEST_CASE("Rect equality is field-wise") {
    Rect a{1, 2, 3, 4};
    Rect b{1, 2, 3, 4};
    Rect c{1, 2, 3, 5};
    CHECK(a == b);
    CHECK(a != c);
}

// ─────────────────────────────────────────────────────────────────────
// Enrichments — operator*/operator/, centered/between factories,
// halfExtents, single-arg inset, outset.
// ─────────────────────────────────────────────────────────────────────

TEST_CASE("Rect halfExtents is half of size") {
    Rect r{10, 20, 30, 40};
    CHECK(r.halfExtents().x == 15.0f);
    CHECK(r.halfExtents().y == 20.0f);
}

TEST_CASE("Rect operator*(float) scales all four fields uniformly") {
    Rect r{2, 4, 6, 8};
    Rect s = r * 0.5f;
    CHECK(s.x == 1.0f);
    CHECK(s.y == 2.0f);
    CHECK(s.w == 3.0f);
    CHECK(s.h == 4.0f);
}

TEST_CASE("Rect operator/(float) is the reciprocal of operator*") {
    Rect r{16, 32, 64, 128};
    Rect s = r / 16.0f;
    CHECK(s.x == 1.0f);
    CHECK(s.y == 2.0f);
    CHECK(s.w == 4.0f);
    CHECK(s.h == 8.0f);
}

TEST_CASE("Rect operator* and operator/ round-trip") {
    Rect r{3, 7, 11, 13};
    Rect roundtrip = (r * 4.5f) / 4.5f;
    CHECK(roundtrip == r);
}

TEST_CASE("Rect::centered builds a rect of given size at given center") {
    Rect r = Rect::centered({100, 50}, {40, 20});
    CHECK(r.x == 80.0f);
    CHECK(r.y == 40.0f);
    CHECK(r.w == 40.0f);
    CHECK(r.h == 20.0f);
    // Round-trip: center() returns the original center.
    CHECK(r.center().x == 100.0f);
    CHECK(r.center().y == 50.0f);
}

TEST_CASE("Rect::between is order-independent and produces non-negative size") {
    Rect r1 = Rect::between({10, 20}, {30, 50});
    Rect r2 = Rect::between({30, 50}, {10, 20});
    CHECK(r1 == r2);
    CHECK(r1.x == 10.0f);
    CHECK(r1.y == 20.0f);
    CHECK(r1.w == 20.0f);
    CHECK(r1.h == 30.0f);
}

TEST_CASE("Rect::between with diagonal points still yields positive w/h") {
    Rect r = Rect::between({50, 10}, {10, 50});
    CHECK(r.x == 10.0f);
    CHECK(r.y == 10.0f);
    CHECK(r.w == 40.0f);
    CHECK(r.h == 40.0f);
}

TEST_CASE("Rect::inset(d) is symmetric inset(d, d)") {
    Rect r{10, 20, 100, 80};
    CHECK(r.inset(5.0f) == r.inset(5.0f, 5.0f));
    Rect inner = r.inset(5.0f);
    CHECK(inner.x == 15.0f);
    CHECK(inner.y == 25.0f);
    CHECK(inner.w == 90.0f);
    CHECK(inner.h == 70.0f);
}

TEST_CASE("Rect::outset is the antonym of inset") {
    Rect r{10, 20, 100, 80};
    CHECK(r.outset(5.0f)        == r.inset(-5.0f));
    CHECK(r.outset(3.0f, 7.0f)  == r.inset(-3.0f, -7.0f));
    Rect bigger = r.outset(5.0f);
    CHECK(bigger.x == 5.0f);
    CHECK(bigger.y == 15.0f);
    CHECK(bigger.w == 110.0f);
    CHECK(bigger.h == 90.0f);
}

// ─────────────────────────────────────────────────────────────────────
// v0.17.0 helpers — aspect, withOrigin/withSize, inset(la::float4),
// adjusted, scaled.
// ─────────────────────────────────────────────────────────────────────

TEST_CASE("Rect::aspect is w/h") {
    CHECK(Rect{0, 0, 16, 9}.aspect() == doctest::Approx(16.0f / 9.0f));
    CHECK(Rect{10, 20, 100, 100}.aspect() == 1.0f);
}

TEST_CASE("Rect::withOrigin replaces origin only") {
    Rect r{10, 20, 100, 80};
    Rect moved = r.withOrigin({99, 88});
    CHECK(moved == Rect{99, 88, 100, 80});
}

TEST_CASE("Rect::withSize replaces size only") {
    Rect r{10, 20, 100, 80};
    Rect resized = r.withSize({5, 6});
    CHECK(resized == Rect{10, 20, 5, 6});
}

TEST_CASE("Rect::inset(la::float4) treats components as {top, right, bottom, left}") {
    // CSS order matches la::float4 = {x, y, z, w} = {top, right, bottom, left}.
    Rect r{0, 0, 100, 100};
    Rect inner = r.inset(ge::la::float4{5, 10, 15, 20});
    CHECK(inner.x == 20.0f);                 // x + left
    CHECK(inner.y == 5.0f);                  // y + top
    CHECK(inner.w == 100.0f - 20.0f - 10.0f); // w - left - right
    CHECK(inner.h == 100.0f - 5.0f - 15.0f);  // h - top - bottom

    // Negative values expand.
    Rect bigger = r.inset(ge::la::float4{-1, -2, -3, -4});
    CHECK(bigger.x == -4.0f);
    CHECK(bigger.y == -1.0f);
    CHECK(bigger.w == 100.0f + 4.0f + 2.0f);
    CHECK(bigger.h == 100.0f + 1.0f + 3.0f);
}

TEST_CASE("Rect::adjusted is component-wise add") {
    Rect r{10, 20, 30, 40};
    Rect d = r.adjusted({1, 2, 3, 4});
    CHECK(d == Rect{11, 22, 33, 44});

    // Translation idiom.
    CHECK(r.adjusted({5, -5, 0, 0}) == r.translated({5, -5}));
}

TEST_CASE("Rect::scaled with default center scales around the rect's center") {
    Rect r{10, 20, 100, 80};
    Rect doubled = r.scaled({.scale = {2.f, 2.f}});
    // Center stays put.
    CHECK(doubled.center().x == doctest::Approx(r.center().x));
    CHECK(doubled.center().y == doctest::Approx(r.center().y));
    CHECK(doubled.w == 200.0f);
    CHECK(doubled.h == 160.0f);
}

TEST_CASE("Rect::scaled with center {0,0} scales around the top-left") {
    Rect r{10, 20, 100, 80};
    Rect s = r.scaled({.scale = {2.f, 0.5f}, .center = {0.f, 0.f}});
    CHECK(s.x == 10.0f);  // top-left fixed
    CHECK(s.y == 20.0f);
    CHECK(s.w == 200.0f);
    CHECK(s.h == 40.0f);
}

TEST_CASE("Rect::scaled with center {1,1} scales around the bottom-right") {
    Rect r{10, 20, 100, 80};
    Rect s = r.scaled({.scale = {2.f, 2.f}, .center = {1.f, 1.f}});
    // Bottom-right stays put: (110, 100).
    CHECK(s.x + s.w == doctest::Approx(110.0f));
    CHECK(s.y + s.h == doctest::Approx(100.0f));
    CHECK(s.w == 200.0f);
    CHECK(s.h == 160.0f);
}

TEST_CASE("Rect::scaled scalar overload matches isotropic vec scaling") {
    Rect r{10, 20, 100, 80};
    CHECK(r.scaled({.scale = 2.f}) == r.scaled({.scale = {2.f, 2.f}}));
    CHECK(r.scaled({.scale = 0.5f, .center = {0.f, 0.f}}) ==
          r.scaled({.scale = {0.5f, 0.5f}, .center = {0.f, 0.f}}));
}

// ─────────────────────────────────────────────────────────────────────
// v0.18.0 — direction-agnostic corners, area, originSize, normalized.
// ─────────────────────────────────────────────────────────────────────

TEST_CASE("Rect corners x0y0/x1y0/x0y1/x1y1 are direction-agnostic") {
    Rect r{10, 20, 30, 40};
    CHECK(r.x0y0().x == 10.f); CHECK(r.x0y0().y == 20.f);
    CHECK(r.x1y0().x == 40.f); CHECK(r.x1y0().y == 20.f);
    CHECK(r.x0y1().x == 10.f); CHECK(r.x0y1().y == 60.f);
    CHECK(r.x1y1().x == 40.f); CHECK(r.x1y1().y == 60.f);
}

TEST_CASE("Rect::area is signed w * h") {
    CHECK(Rect{0, 0, 10, 5}.area() == 50.f);
    CHECK(Rect{0, 0, -10, 5}.area() == -50.f);   // negative w
    CHECK(Rect{0, 0, 10, -5}.area() == -50.f);   // negative h
    CHECK(Rect{0, 0, -10, -5}.area() == 50.f);   // both negative
    CHECK(Rect{}.area() == 0.f);
}

TEST_CASE("Rect::originSize is direction-neutral construction") {
    Rect r = Rect::originSize({10, 20}, {30, 40});
    CHECK(r == Rect{10, 20, 30, 40});
}

TEST_CASE("Rect::normalized produces positive w/h preserving region") {
    // Already-positive: identity.
    CHECK(Rect{1, 2, 3, 4}.normalized() == Rect{1, 2, 3, 4});

    // Negative w: origin moves to opposite x-edge, w flips sign.
    CHECK(Rect{10, 20, -30, 40}.normalized() == Rect{-20, 20, 30, 40});

    // Negative h: origin moves to opposite y-edge, h flips sign.
    CHECK(Rect{10, 20, 30, -40}.normalized() == Rect{10, -20, 30, 40});

    // Both negative.
    CHECK(Rect{10, 20, -30, -40}.normalized() == Rect{-20, -20, 30, 40});

    // Region is preserved (the four corner positions are the same set).
    Rect signed_{10, 20, -30, -40};
    Rect norm = signed_.normalized();
    CHECK(norm.x0y0() == signed_.x1y1());   // origin of normalized = far corner of signed
    CHECK(norm.x1y1() == signed_.x0y0());
}
