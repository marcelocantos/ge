// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// SDL_Event → ge::PointerEvent converter. Lives in ge so consumers
// adopting ge::Button / ge::ButtonGroup don't reimplement the same
// SDL pointer-event boilerplate every time.

#pragma once

#include <ge/button.h>     // ge::PointerEvent, ge::kMouseId

#include <SDL3/SDL_events.h>

#include <optional>

namespace ge::input {

// Convert an SDL event into a `ge::PointerEvent` in render-surface
// pixel space.
//
// Returns `std::nullopt` if:
//   - The event isn't a pointer event (key down, gamepad, sensor, …).
//   - The event is a touch-synthetic mouse event (filtered by
//     `SDL_TOUCH_MOUSEID`) — SDL emits both a finger event and a
//     mock mouse event on mobile, and forwarding both would
//     double-pump the state machine.
//
// `surfaceSize` is the render-surface pixel dimensions; finger
// events use it to denormalize SDL's (0..1) touch coords. Mouse
// events use the SDL window's own point→pixel scaling (queried via
// `SDL_GetWindowSize` / `SDL_GetWindowSizeInPixels`) and ignore
// `surfaceSize` — the two coord systems converge on render-surface
// pixels.
//
// Touch `fingerID` is propagated as-is; mouse synthesises a single
// virtual finger with `ge::kMouseId`.
std::optional<PointerEvent> fromSdl(const SDL_Event& ev,
                                    la::float2 surfaceSize);

} // namespace ge::input
