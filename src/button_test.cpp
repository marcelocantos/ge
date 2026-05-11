// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <doctest.h>
#include <ge/button.h>

#include <vector>

using ge::Button;
using ge::ButtonGroup;
using ge::PointerEvent;
using ge::Rect;
using ge::kMouseId;
using ge::rectHitTest;

namespace {

// Tiny helpers to keep test bodies focused on the state-machine flow,
// not on PointerEvent construction noise.
PointerEvent down(float x, float y, SDL_FingerID id = kMouseId) {
    return {.kind = PointerEvent::Down, .pos = {x, y}, .id = id};
}
PointerEvent move(float x, float y, SDL_FingerID id = kMouseId) {
    return {.kind = PointerEvent::Move, .pos = {x, y}, .id = id};
}
PointerEvent up(float x, float y, SDL_FingerID id = kMouseId) {
    return {.kind = PointerEvent::Up, .pos = {x, y}, .id = id};
}

} // namespace

TEST_CASE("Button: tap inside fires") {
    bool fired = false;
    bool highlighted = false;
    Button btn{
        .hitTest = rectHitTest({0, 0, 100, 100}),
        .onFire = [&]{ fired = true; },
        .onHighlightChange = [&](bool h){ highlighted = h; },
    };

    CHECK(btn.handleEvent(down(50, 50)));
    CHECK(highlighted);
    CHECK(btn.highlighted());
    CHECK(btn.tracking());
    CHECK_FALSE(fired);

    CHECK(btn.handleEvent(up(50, 50)));
    CHECK_FALSE(highlighted);
    CHECK_FALSE(btn.highlighted());
    CHECK_FALSE(btn.tracking());
    CHECK(fired);
}

TEST_CASE("Button: tap outside does not fire") {
    bool fired = false;
    Button btn{
        .hitTest = rectHitTest({0, 0, 100, 100}),
        .onFire = [&]{ fired = true; },
    };
    CHECK_FALSE(btn.handleEvent(down(200, 200)));
    CHECK_FALSE(btn.tracking());
    CHECK_FALSE(btn.handleEvent(up(200, 200)));
    CHECK_FALSE(fired);
}

TEST_CASE("Button: press inside, drag outside, release outside does not fire") {
    bool fired = false;
    bool highlighted = false;
    Button btn{
        .hitTest = rectHitTest({0, 0, 100, 100}),
        .onFire = [&]{ fired = true; },
        .onHighlightChange = [&](bool h){ highlighted = h; },
    };

    btn.handleEvent(down(50, 50));
    CHECK(highlighted);

    // Drag outside.
    btn.handleEvent(move(200, 50));
    CHECK_FALSE(highlighted);
    CHECK_FALSE(btn.highlighted());
    CHECK(btn.tracking());  // still tracking; the press is "live"

    btn.handleEvent(up(200, 50));
    CHECK_FALSE(btn.tracking());
    CHECK_FALSE(fired);
}

TEST_CASE("Button: press inside, drag outside, drag back in, release inside fires") {
    bool fired = false;
    std::vector<bool> highlights;
    Button btn{
        .hitTest = rectHitTest({0, 0, 100, 100}),
        .onFire = [&]{ fired = true; },
        .onHighlightChange = [&](bool h){ highlights.push_back(h); },
    };

    btn.handleEvent(down(50, 50));
    btn.handleEvent(move(200, 50));   // out
    btn.handleEvent(move(50, 50));    // back in
    btn.handleEvent(up(50, 50));

    CHECK(fired);
    // Expect highlight changes: on (press), off (drag out), on (drag back),
    // off (release fires + clears).
    CHECK(highlights == std::vector<bool>{true, false, true, false});
}

TEST_CASE("Button: cancel during press clears highlight without firing") {
    bool fired = false;
    bool highlighted = false;
    Button btn{
        .hitTest = rectHitTest({0, 0, 100, 100}),
        .onFire = [&]{ fired = true; },
        .onHighlightChange = [&](bool h){ highlighted = h; },
    };

    btn.handleEvent(down(50, 50));
    CHECK(highlighted);
    btn.cancel();
    CHECK_FALSE(highlighted);
    CHECK_FALSE(btn.tracking());
    CHECK_FALSE(fired);
}

TEST_CASE("Button: cancel while in PressedOutside doesn't double-fire highlight callback") {
    int highlightCount = 0;
    Button btn{
        .hitTest = rectHitTest({0, 0, 100, 100}),
        .onHighlightChange = [&](bool){ ++highlightCount; },
    };

    btn.handleEvent(down(50, 50));     // on
    btn.handleEvent(move(200, 50));    // off
    CHECK(highlightCount == 2);

    btn.cancel();   // already off; shouldn't fire onHighlightChange again
    CHECK(highlightCount == 2);
    CHECK_FALSE(btn.tracking());
}

TEST_CASE("Button: second finger ignored while tracking first") {
    bool fired = false;
    Button btn{
        .hitTest = rectHitTest({0, 0, 100, 100}),
        .onFire = [&]{ fired = true; },
    };

    // Finger 1 lands inside.
    CHECK(btn.handleEvent(down(50, 50, /*id=*/1)));

    // Finger 2 lands inside too — ignored.
    CHECK_FALSE(btn.handleEvent(down(60, 60, /*id=*/2)));

    // Finger 2 moves outside — should NOT pull the button into PressedOutside.
    btn.handleEvent(move(200, 60, /*id=*/2));
    CHECK(btn.highlighted());

    // Finger 2 releases — also ignored.
    CHECK_FALSE(btn.handleEvent(up(60, 60, /*id=*/2)));
    CHECK_FALSE(fired);

    // Finger 1 releases — fires.
    CHECK(btn.handleEvent(up(50, 50, /*id=*/1)));
    CHECK(fired);
}

TEST_CASE("Button: no hitTest set means no events are consumed") {
    Button btn;
    CHECK_FALSE(btn.handleEvent(down(50, 50)));
    CHECK_FALSE(btn.tracking());
}

TEST_CASE("Button: callbacks are optional (no-op if unset)") {
    Button btn{.hitTest = rectHitTest({0, 0, 100, 100})};
    // No callbacks — shouldn't crash, shouldn't throw.
    CHECK(btn.handleEvent(down(50, 50)));
    CHECK(btn.highlighted());
    CHECK(btn.handleEvent(up(50, 50)));
}

// ─────────────────────────────────────────────────────────────────────
// ButtonGroup
// ─────────────────────────────────────────────────────────────────────

TEST_CASE("ButtonGroup: routes events to the first matching button") {
    int firedA = 0, firedB = 0;
    Button a{
        .hitTest = rectHitTest({0, 0, 100, 100}),
        .onFire = [&]{ ++firedA; },
    };
    Button b{
        .hitTest = rectHitTest({200, 0, 100, 100}),
        .onFire = [&]{ ++firedB; },
    };
    ButtonGroup g{.buttons = {&a, &b}};

    g.handleEvent(down(50, 50));
    g.handleEvent(up(50, 50));
    CHECK(firedA == 1);
    CHECK(firedB == 0);

    g.handleEvent(down(250, 50));
    g.handleEvent(up(250, 50));
    CHECK(firedA == 1);
    CHECK(firedB == 1);
}

TEST_CASE("ButtonGroup: active button locks subsequent events while tracking") {
    int firedA = 0, firedB = 0;
    Button a{
        .hitTest = rectHitTest({0, 0, 100, 100}),
        .onFire = [&]{ ++firedA; },
    };
    Button b{
        .hitTest = rectHitTest({200, 0, 100, 100}),
        .onFire = [&]{ ++firedB; },
    };
    ButtonGroup g{.buttons = {&a, &b}};

    // Press inside A.
    CHECK(g.handleEvent(down(50, 50)));
    CHECK(g.active == &a);

    // Even a "tap" in B's region — same id — is locked out.
    CHECK(g.handleEvent(down(250, 50)));   // group claims it (lock)
    CHECK_FALSE(b.tracking());             // but B never sees it

    // Release at A's site fires A.
    CHECK(g.handleEvent(up(50, 50)));
    CHECK(g.active == nullptr);
    CHECK(firedA == 1);
    CHECK(firedB == 0);
}

TEST_CASE("ButtonGroup: lock releases when active button returns to idle") {
    Button a{.hitTest = rectHitTest({0, 0, 100, 100})};
    Button b{.hitTest = rectHitTest({200, 0, 100, 100})};
    ButtonGroup g{.buttons = {&a, &b}};

    g.handleEvent(down(50, 50));
    CHECK(g.active == &a);

    g.handleEvent(up(50, 50));
    CHECK(g.active == nullptr);

    // After release, group should re-dispatch to either button.
    g.handleEvent(down(250, 50));
    CHECK(g.active == &b);
}

TEST_CASE("ButtonGroup: misses both buttons returns false") {
    Button a{.hitTest = rectHitTest({0, 0, 100, 100})};
    Button b{.hitTest = rectHitTest({200, 0, 100, 100})};
    ButtonGroup g{.buttons = {&a, &b}};

    CHECK_FALSE(g.handleEvent(down(500, 500)));
    CHECK(g.active == nullptr);
}

TEST_CASE("ButtonGroup: cancel of active button does not corrupt group state") {
    Button a{.hitTest = rectHitTest({0, 0, 100, 100})};
    ButtonGroup g{.buttons = {&a}};

    g.handleEvent(down(50, 50));
    CHECK(g.active == &a);

    a.cancel();
    CHECK_FALSE(a.tracking());

    // Group's `active` pointer is stale until next event, then clears.
    g.handleEvent(move(60, 60));   // a is idle; move on stale pointer is no-op
    CHECK(g.active == nullptr);
}
