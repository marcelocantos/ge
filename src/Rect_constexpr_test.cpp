// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Regression test for 🎯T52: every method, ctor, and operator on
// `ge::Rect` and the `ge::frame(Rect)` transform must be `constexpr`.
//
// All exercise sites below are `static_assert`s — if anyone removes
// `constexpr` from any of these APIs, this TU fails to compile. There
// is no doctest TEST_CASE here because there are no runtime checks
// to do; the load-bearing assertion is that the TU compiles at all.

#include <ge/DampedRotation.h>
#include <ge/DampedValue.h>
#include <ge/SessionHost.h>
#include <ge/svg.h>
#include <ge/text.h>
#include <ge/transform.h>

namespace {

using ge::Rect;

// ── Constructors ─────────────────────────────────────────────────────
constexpr Rect kDefault{};
constexpr Rect k4Float{10, 20, 30, 40};
constexpr Rect kFromOriginSize{{.origin = {1, 2}, .size = {3, 4}}};
constexpr Rect kFromCorners{{.a = {0, 0}, .b = {10, 10}}};

static_assert(kDefault.x == 0.f && kDefault.w == 0.f);
static_assert(k4Float.x == 10.f && k4Float.h == 40.f);
static_assert(kFromOriginSize == Rect{1, 2, 3, 4});
static_assert(kFromCorners == Rect{0, 0, 10, 10});

// Sign-preserving Corners (reverse order yields negative w/h):
constexpr Rect kSigned{{.a = {40, 60}, .b = {10, 20}}};
static_assert(kSigned == Rect{40, 60, -30, -40});

// ── Direction-agnostic accessors ─────────────────────────────────────
static_assert(k4Float.x0y0().x == 10.f && k4Float.x0y0().y == 20.f);
static_assert(k4Float.x1y0().x == 40.f && k4Float.x1y0().y == 20.f);
static_assert(k4Float.x0y1().x == 10.f && k4Float.x0y1().y == 60.f);
static_assert(k4Float.x1y1().x == 40.f && k4Float.x1y1().y == 60.f);

// ── Computed values ──────────────────────────────────────────────────
static_assert(k4Float.size().x == 30.f && k4Float.size().y == 40.f);
static_assert(k4Float.halfExtents().x == 15.f);
static_assert(k4Float.center().x == 25.f && k4Float.center().y == 40.f);
static_assert(k4Float.area() == 1200.f);
static_assert(k4Float.aspect() == 30.f / 40.f);
static_assert(!k4Float.empty());
static_assert(kDefault.empty());
// Signed-area is non-empty.
static_assert(!kSigned.empty());
static_assert(kSigned.area() == 1200.f);

// ── Contextual-bool conversion ───────────────────────────────────────
static_assert(static_cast<bool>(k4Float));
static_assert(!static_cast<bool>(kDefault));
static_assert(!kDefault);    // operator!
static_assert(!!k4Float);    // operator! ∘ operator!

// ── normalized() ─────────────────────────────────────────────────────
constexpr Rect kNormalized = Rect{10, 20, -30, -40}.normalized();
static_assert(kNormalized == Rect{-20, -20, 30, 40});

// ── Containment / intersection / bbox ────────────────────────────────
static_assert(k4Float.contains(ge::la::float2{15, 25}));
static_assert(!k4Float.contains(ge::la::float2{50, 25}));
static_assert(k4Float.contains(Rect{15, 25, 5, 5}));
static_assert(!k4Float.contains(Rect{50, 50, 5, 5}));

static_assert(k4Float.intersects(Rect{20, 30, 50, 50}));
static_assert(!k4Float.intersects(Rect{200, 200, 5, 5}));

constexpr Rect kI = k4Float.intersect(Rect{20, 30, 50, 50});
static_assert(kI == Rect{20, 30, 20, 30});

constexpr Rect kU = Rect{0, 0, 10, 10}.bbox(Rect{20, 20, 10, 10});
static_assert(kU == Rect{0, 0, 30, 30});

// Empty inputs are absorbed by bbox.
static_assert(Rect{}.bbox(k4Float) == k4Float);
static_assert(k4Float.bbox(Rect{}) == k4Float);

// ── Mutations ────────────────────────────────────────────────────────
static_assert(k4Float.translated({1, 2}) == Rect{11, 22, 30, 40});
static_assert(k4Float.withOrigin({0, 0}) == Rect{0, 0, 30, 40});
static_assert(k4Float.withSize({1, 1}) == Rect{10, 20, 1, 1});
static_assert(k4Float.adjusted({1, 2, 3, 4}) == Rect{11, 22, 33, 44});

// adjusted + Corners is the unified inset/outset/edge-mutate primitive.
static_assert(Rect{0, 0, 100, 100}.adjusted({{.a = {5, 5}, .b = {-5, -5}}})
              == Rect{5, 5, 90, 90});

// ── Arithmetic operators ─────────────────────────────────────────────
static_assert(k4Float * 2.f == Rect{20, 40, 60, 80});
static_assert(k4Float / 2.f == Rect{5, 10, 15, 20});

// ── scaled ───────────────────────────────────────────────────────────
constexpr Rect kScaledVec    = k4Float.scaled({.scale = {2.f, 2.f}});
constexpr Rect kScaledScalar = k4Float.scaled({.scale = 2.f});
static_assert(kScaledVec == kScaledScalar);
static_assert(kScaledVec.w == 60.f && kScaledVec.h == 80.f);
// Default pivot is rect center, which therefore stays put.
static_assert(kScaledVec.center().x == k4Float.center().x);
static_assert(kScaledVec.center().y == k4Float.center().y);

// Scale around the origin corner.
constexpr Rect kScaledOrigin = k4Float.scaled({.scale = {2.f, 0.5f}, .center = {0.f, 0.f}});
static_assert(kScaledOrigin == Rect{10, 20, 60, 20});

// ── Static factories ─────────────────────────────────────────────────
constexpr Rect kCentered = Rect::centered({100, 50}, {40, 20});
static_assert(kCentered == Rect{80, 40, 40, 20});

// ── fitInside / fillInside ───────────────────────────────────────────
// Outer 200×100, content aspect 1:1 → fit yields 100×100 (height-bound),
// fill yields 200×200 (width-bound, overflows top/bottom).
constexpr Rect kOuter{0, 0, 200, 100};
constexpr Rect kFit  = kOuter.fitInside({1, 1});
constexpr Rect kFill = kOuter.fillInside({1, 1});
static_assert(kFit  == Rect{50,   0, 100, 100});
static_assert(kFill == Rect{ 0, -50, 200, 200});
// Same content aspect (1:1) → fit and fill collapse to outer.
constexpr Rect kSquare = Rect{0, 0, 100, 100};
static_assert(kSquare.fitInside({4, 4}) == kSquare);
static_assert(kSquare.fillInside({4, 4}) == kSquare);
// Result aspect always matches content aspect (within fp).
constexpr Rect kFit23 = kOuter.fitInside({2, 3});
static_assert(kFit23.w * 3.f == kFit23.h * 2.f);

// ── Equality ─────────────────────────────────────────────────────────
static_assert(Rect{1, 2, 3, 4} == Rect{1, 2, 3, 4});
static_assert(Rect{1, 2, 3, 4} != Rect{1, 2, 3, 5});

// ── ge::frame(Rect) — pure construction, constexpr ───────────────────
constexpr ge::la::float4x4 kM = ge::frame(k4Float);
static_assert(kM[0][0] == 30.f);   // x basis = w
static_assert(kM[1][1] == 40.f);   // y basis = h
static_assert(kM[2][2] == 1.f);    // z basis = identity
static_assert(kM[3][0] == 10.f);   // origin x
static_assert(kM[3][1] == 20.f);   // origin y

// ── DampedValue — non-pow methods are constexpr ──────────────────────
// Builds at compile time; getters / setters / add / isMoving evaluate
// inside a consteval lambda so a single static_assert can drive the
// state through the whole API.
static_assert([] {
    DampedValue v{0.9f};
    if (v.value() != 0.f) return false;
    if (v.velocity() != 0.f) return false;
    if (v.isMoving()) return false;
    v.setValue(3.5f);
    v.setVelocity(2.0f);
    if (v.value() != 3.5f) return false;
    if (v.velocity() != 2.0f) return false;
    if (!v.isMoving()) return false;
    v.add(1.5f);
    return v.value() == 5.0f;
}());

// ── DampedRotation — constexpr for ctor / getters / setters ──────────
static_assert([] {
    DampedRotation r{0.9f};
    if (r.orientation().w != 1.0f) return false;
    if (r.angularVelocity().x != 0.0f) return false;
    r.setAngularVelocity(float3{1.f, 2.f, 3.f});
    if (r.angularVelocity().z != 3.f) return false;
    r.setOrientation(float4{0.f, 0.f, 0.f, 1.f});
    r.setDamping(0.5f);
    return true;
}());

// ── SvgPixels::isNull / TextPixels::isNull — vector::empty() is constexpr ──
static_assert(ge::SvgPixels{}.isNull());
static_assert(ge::TextPixels{}.isNull());

}  // namespace
