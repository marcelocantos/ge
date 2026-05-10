#include <doctest.h>
#include <ge/SessionHost.h>

using ge::Rect;
using ge::SafeAreaInsets;
using float2 = ge::la::float2;

// ─────────────────────────────────────────────────────────────────────
// Constructors
// ─────────────────────────────────────────────────────────────────────

TEST_CASE("Rect default-constructs to all-zero (and is empty)") {
    Rect r;
    CHECK(r.empty());
    CHECK(r.x == 0.f); CHECK(r.y == 0.f);
    CHECK(r.w == 0.f); CHECK(r.h == 0.f);
}

TEST_CASE("Rect 4-float constructor takes x,y,w,h directly") {
    Rect r{1, 2, 3, 4};
    CHECK(r.x == 1.f); CHECK(r.y == 2.f);
    CHECK(r.w == 3.f); CHECK(r.h == 4.f);
}

TEST_CASE("Rect{OriginSize{...}} ctor uses origin + size") {
    Rect r{{.origin = {10, 20}, .size = {30, 40}}};
    CHECK(r == Rect{10, 20, 30, 40});
}

TEST_CASE("Rect{Corners{...}} is sign-preserving") {
    // Forward-order corners: positive w/h.
    CHECK(Rect{{.a = {10, 20}, .b = {40, 60}}} == Rect{10, 20, 30, 40});

    // Reverse-order corners: negative w/h. NOT normalized — the
    // sign is preserved deliberately.
    CHECK(Rect{{.a = {40, 60}, .b = {10, 20}}} == Rect{40, 60, -30, -40});

    // Mixed: negative h only.
    CHECK(Rect{{.a = {10, 60}, .b = {40, 20}}} == Rect{10, 60, 30, -40});
}

TEST_CASE("Rect{Corners{a, b}}.normalized() is the bounding box of two points") {
    // Replaces the old `Rect::between(a, b)` factory.
    Rect r1 = Rect{{.a = {10, 20}, .b = {30, 50}}}.normalized();
    Rect r2 = Rect{{.a = {30, 50}, .b = {10, 20}}}.normalized();
    CHECK(r1 == r2);
    CHECK(r1 == Rect{10, 20, 20, 30});
}

// ─────────────────────────────────────────────────────────────────────
// Direction-agnostic accessors and computed values
// ─────────────────────────────────────────────────────────────────────

TEST_CASE("Rect corners x0y0/x1y0/x0y1/x1y1 are direction-agnostic") {
    Rect r{10, 20, 30, 40};
    CHECK(r.x0y0().x == 10.f); CHECK(r.x0y0().y == 20.f);
    CHECK(r.x1y0().x == 40.f); CHECK(r.x1y0().y == 20.f);
    CHECK(r.x0y1().x == 10.f); CHECK(r.x0y1().y == 60.f);
    CHECK(r.x1y1().x == 40.f); CHECK(r.x1y1().y == 60.f);
}

TEST_CASE("Rect size, halfExtents, center") {
    Rect r{10, 20, 30, 40};
    CHECK(r.size().x == 30.f);        CHECK(r.size().y == 40.f);
    CHECK(r.halfExtents().x == 15.f); CHECK(r.halfExtents().y == 20.f);
    CHECK(r.center().x == 25.f);      CHECK(r.center().y == 40.f);
}

TEST_CASE("Rect::area is signed w * h") {
    CHECK(Rect{0, 0, 10, 5}.area() == 50.f);
    CHECK(Rect{0, 0, -10, 5}.area() == -50.f);   // negative w
    CHECK(Rect{0, 0, 10, -5}.area() == -50.f);   // negative h
    CHECK(Rect{0, 0, -10, -5}.area() == 50.f);   // both negative
    CHECK(Rect{}.area() == 0.f);
}

TEST_CASE("Rect::aspect is w/h") {
    CHECK(Rect{0, 0, 16, 9}.aspect() == doctest::Approx(16.0f / 9.0f));
    CHECK(Rect{10, 20, 100, 100}.aspect() == 1.0f);
}

TEST_CASE("Rect::empty is true iff w==0 or h==0") {
    CHECK(Rect{}.empty());
    CHECK(Rect{0, 0, 10, 0}.empty());
    CHECK(Rect{0, 0, 0, 10}.empty());
    CHECK_FALSE(Rect{0, 0, 10, 10}.empty());
    // Signed-area rects are NOT empty — area is non-zero.
    CHECK_FALSE(Rect{0, 0, -10, -10}.empty());
    CHECK_FALSE(Rect{0, 0, 10, -10}.empty());
}

TEST_CASE("Rect contextual-bool conversion mirrors !empty()") {
    Rect e;
    Rect r{0, 0, 10, 10};
    Rect signed_{0, 0, -5, -5};

    CHECK_FALSE(static_cast<bool>(e));
    CHECK(static_cast<bool>(r));
    CHECK(static_cast<bool>(signed_));   // signed-area is non-empty

    CHECK(!e);
    CHECK_FALSE(!r);
    CHECK_FALSE(!signed_);

    // In an `if` context, no cast needed.
    if (r) { CHECK(true); } else { CHECK(false); }
    if (e) { CHECK(false); } else { CHECK(true); }
}

TEST_CASE("Rect::normalized produces positive w/h preserving region") {
    // Already-positive: identity.
    CHECK(Rect{1, 2, 3, 4}.normalized() == Rect{1, 2, 3, 4});

    // Negative w: origin moves to opposite x-edge, w flips sign.
    CHECK(Rect{10, 20, -30, 40}.normalized() == Rect{-20, 20, 30, 40});

    // Negative h.
    CHECK(Rect{10, 20, 30, -40}.normalized() == Rect{10, -20, 30, 40});

    // Both.
    CHECK(Rect{10, 20, -30, -40}.normalized() == Rect{-20, -20, 30, 40});

    // Region preserved: corner set is the same.
    Rect signed_{10, 20, -30, -40};
    Rect norm = signed_.normalized();
    CHECK(norm.x0y0() == signed_.x1y1());
    CHECK(norm.x1y1() == signed_.x0y0());
}

// ─────────────────────────────────────────────────────────────────────
// Containment, intersection, bounding box
// ─────────────────────────────────────────────────────────────────────

TEST_CASE("Rect contains(point) is half-open") {
    Rect r{10, 20, 30, 40};
    CHECK(r.contains(float2{10, 20}));        // origin corner inclusive
    CHECK(r.contains(float2{25, 35}));        // interior
    CHECK_FALSE(r.contains(float2{40, 35}));  // x == x+w exclusive
    CHECK_FALSE(r.contains(float2{25, 60}));  // y == y+h exclusive
    CHECK_FALSE(r.contains(float2{9.99f, 35}));
    CHECK_FALSE(r.contains(float2{25, 19.99f}));
}

TEST_CASE("Rect contains(other) requires full enclosure") {
    Rect outer{0, 0, 100, 100};
    CHECK(outer.contains(Rect{10, 10, 20, 20}));
    CHECK(outer.contains(Rect{0, 0, 100, 100}));        // self-contains
    CHECK_FALSE(outer.contains(Rect{50, 50, 60, 60}));  // exceeds far edges
    CHECK_FALSE(outer.contains(Rect{}));                // empty isn't contained
}

TEST_CASE("Rect intersects requires positive overlap") {
    Rect a{0, 0, 100, 100};
    Rect b{50, 50, 100, 100};
    Rect c{200, 200, 10, 10};
    Rect touching{100, 0, 50, 100};
    CHECK(a.intersects(b));
    CHECK(b.intersects(a));
    CHECK_FALSE(a.intersects(c));
    CHECK_FALSE(a.intersects(touching));
    CHECK_FALSE(a.intersects(Rect{}));
}

TEST_CASE("Rect intersect returns the overlap") {
    Rect a{0, 0, 100, 100};
    Rect b{50, 50, 100, 100};
    Rect overlap = a.intersect(b);
    CHECK(overlap == Rect{50, 50, 50, 50});

    Rect none = a.intersect(Rect{200, 200, 10, 10});
    CHECK(none.empty());
}

TEST_CASE("Rect bbox bounds both") {
    Rect a{0, 0, 50, 50};
    Rect b{100, 100, 50, 50};
    CHECK(a.bbox(b) == Rect{0, 0, 150, 150});

    // Empty inputs are absorbed.
    CHECK(Rect{}.bbox(a) == a);
    CHECK(a.bbox(Rect{}) == a);
}

// ─────────────────────────────────────────────────────────────────────
// Mutation: translated, withOrigin/Size, adjusted, scaled, *  /  /
// ─────────────────────────────────────────────────────────────────────

TEST_CASE("Rect translated moves without resizing") {
    Rect r{10, 20, 30, 40};
    CHECK(r.translated(float2{5, -10}) == Rect{15, 10, 30, 40});
}

TEST_CASE("Rect withOrigin replaces origin only") {
    Rect r{10, 20, 100, 80};
    CHECK(r.withOrigin({99, 88}) == Rect{99, 88, 100, 80});
}

TEST_CASE("Rect withSize replaces size only") {
    Rect r{10, 20, 100, 80};
    CHECK(r.withSize({5, 6}) == Rect{10, 20, 5, 6});
}

TEST_CASE("Rect::adjusted is component-wise add") {
    Rect r{10, 20, 30, 40};
    CHECK(r.adjusted({1, 2, 3, 4}) == Rect{11, 22, 33, 44});

    // Translation idiom.
    CHECK(r.adjusted({5, -5, 0, 0}) == r.translated({5, -5}));
}

TEST_CASE("adjusted + Corners expresses inset/outset/edge-mutate uniformly") {
    Rect r{0, 0, 100, 100};

    // Symmetric inset by 5 on all sides.
    CHECK(r.adjusted({{.a = {5, 5}, .b = {-5, -5}}}) == Rect{5, 5, 90, 90});

    // Symmetric outset by 5 on all sides (negate the origin corner,
    // positive far corner).
    CHECK(r.adjusted({{.a = {-5, -5}, .b = {5, 5}}}) == Rect{-5, -5, 110, 110});

    // Per-edge inset (l=20, t=50, r=30, b=80).
    CHECK(r.adjusted({{.a = {20, 50}, .b = {-30, -80}}}) ==
          Rect{20, 50, 50, -30});  // 100 - 20 - 30 = 50; 100 - 50 - 80 = -30

    // Translate-only via adjusted: same as translated().
    CHECK(r.adjusted({{.a = {5, -5}, .b = {5, -5}}}) == r.translated({5, -5}));
}

TEST_CASE("Rect operator*(float) and operator/(float) round-trip") {
    Rect r{2, 4, 6, 8};
    CHECK(r * 0.5f == Rect{1, 2, 3, 4});
    CHECK(r / 2.0f == Rect{1, 2, 3, 4});
    CHECK((Rect{3, 7, 11, 13} * 4.5f) / 4.5f == Rect{3, 7, 11, 13});
}

TEST_CASE("Rect::scaled with default center scales around the rect's center") {
    Rect r{10, 20, 100, 80};
    Rect doubled = r.scaled({.scale = {2.f, 2.f}});
    CHECK(doubled.center().x == doctest::Approx(r.center().x));
    CHECK(doubled.center().y == doctest::Approx(r.center().y));
    CHECK(doubled.w == 200.f);
    CHECK(doubled.h == 160.f);
}

TEST_CASE("Rect::scaled with center {0,0} scales around the origin corner") {
    Rect r{10, 20, 100, 80};
    Rect s = r.scaled({.scale = {2.f, 0.5f}, .center = {0.f, 0.f}});
    CHECK(s == Rect{10, 20, 200, 40});
}

TEST_CASE("Rect::scaled with center {1,1} scales around the far corner") {
    Rect r{10, 20, 100, 80};
    Rect s = r.scaled({.scale = {2.f, 2.f}, .center = {1.f, 1.f}});
    CHECK(s.x + s.w == doctest::Approx(110.f));
    CHECK(s.y + s.h == doctest::Approx(100.f));
    CHECK(s.w == 200.f);
    CHECK(s.h == 160.f);
}

TEST_CASE("Rect::scaled scalar overload matches isotropic vec scaling") {
    Rect r{10, 20, 100, 80};
    CHECK(r.scaled({.scale = 2.f}) == r.scaled({.scale = {2.f, 2.f}}));
    CHECK(r.scaled({.scale = 0.5f, .center = {0.f, 0.f}}) ==
          r.scaled({.scale = {0.5f, 0.5f}, .center = {0.f, 0.f}}));
}

// ─────────────────────────────────────────────────────────────────────
// Factories and equality
// ─────────────────────────────────────────────────────────────────────

TEST_CASE("Rect::centered builds a rect of given size at given center") {
    Rect r = Rect::centered({100, 50}, {40, 20});
    CHECK(r == Rect{80, 40, 40, 20});
    CHECK(r.center().x == 100.f);
    CHECK(r.center().y == 50.f);
}

TEST_CASE("Rect equality is field-wise") {
    CHECK(Rect{1, 2, 3, 4} == Rect{1, 2, 3, 4});
    CHECK(Rect{1, 2, 3, 4} != Rect{1, 2, 3, 5});
}

// ─────────────────────────────────────────────────────────────────────
// Aspect fit / fill (letterbox / cover)
// ─────────────────────────────────────────────────────────────────────

TEST_CASE("Rect::fitInside letterboxes content into a wider outer") {
    // Outer is wider than content (200×100 vs 1:1) → fit binds on
    // height. Result is 100×100 centered horizontally.
    Rect outer{0, 0, 200, 100};
    Rect r = outer.fitInside({1, 1});
    CHECK(r == Rect{50, 0, 100, 100});
}

TEST_CASE("Rect::fitInside pillarboxes content into a taller outer") {
    // Outer is taller than content (100×200 vs 1:1) → fit binds on
    // width. Result is 100×100 centered vertically.
    Rect outer{0, 0, 100, 200};
    Rect r = outer.fitInside({1, 1});
    CHECK(r == Rect{0, 50, 100, 100});
}

TEST_CASE("Rect::fitInside on the multimaze 320x480 case") {
    // 320×480 maze fits inside an iPad-shaped landscape area; height
    // is the binding axis. (1024 x 768 outer; 480 doesn't fit at full
    // width, so the maze scales to fit by height.)
    Rect outer{0, 0, 1024, 768};
    Rect r = outer.fitInside({320, 480});
    // Scale = min(1024/320, 768/480) = min(3.2, 1.6) = 1.6 → 512×768.
    CHECK(r == Rect{256, 0, 512, 768});
}

TEST_CASE("Rect::fitInside preserves content's aspect exactly") {
    Rect outer{0, 0, 200, 100};
    Rect r = outer.fitInside({2, 3});
    // 2:3 aspect → r.w / r.h == 2 / 3, so r.w * 3 == r.h * 2.
    CHECK(r.w * 3.f == r.h * 2.f);
}

TEST_CASE("Rect::fitInside is non-translating when content already matches outer aspect") {
    // 4:2 outer + 2:1 content → fit collapses to outer.
    Rect outer{10, 20, 200, 100};
    Rect r = outer.fitInside({2, 1});
    CHECK(r == outer);
}

TEST_CASE("Rect::fitInside ignores content's position — only aspect matters") {
    Rect outer{0, 0, 200, 100};
    CHECK(outer.fitInside({1, 1}) == outer.fitInside({{.origin = {99, 99}, .size = {1, 1}}}.size()));
}

TEST_CASE("Rect::fillInside covers a wider outer with overflow on width") {
    // Outer is wider than content (200×100 vs 1:1) → fill binds on
    // width. Result is 200×200 (overflows top/bottom by 50 each).
    Rect outer{0, 0, 200, 100};
    Rect r = outer.fillInside({1, 1});
    CHECK(r == Rect{0, -50, 200, 200});
}

TEST_CASE("Rect::fillInside covers a taller outer with overflow on height") {
    Rect outer{0, 0, 100, 200};
    Rect r = outer.fillInside({1, 1});
    CHECK(r == Rect{-50, 0, 200, 200});
}

TEST_CASE("fitInside and fillInside coincide when content matches outer aspect") {
    Rect outer{10, 20, 300, 150};
    CHECK(outer.fitInside({2, 1}) == outer.fillInside({2, 1}));
    CHECK(outer.fitInside({2, 1}) == outer);
}

TEST_CASE("fillInside contains outer; fitInside is contained by outer") {
    Rect outer{0, 0, 200, 100};
    Rect content{1, 2};  // arbitrary aspect

    Rect fit  = outer.fitInside({1, 2});
    Rect fill = outer.fillInside({1, 2});

    // Fit is contained by outer (≤ outer in both dims).
    CHECK(fit.w <= outer.w);
    CHECK(fit.h <= outer.h);
    // Fill contains outer (≥ outer in both dims).
    CHECK(fill.w >= outer.w);
    CHECK(fill.h >= outer.h);
    // Both are centered on outer.
    CHECK(fit.center().x == outer.center().x);
    CHECK(fit.center().y == outer.center().y);
    CHECK(fill.center().x == outer.center().x);
    CHECK(fill.center().y == outer.center().y);
}
