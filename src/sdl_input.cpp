// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/sdl_input.h>

#include <SDL3/SDL_video.h>

namespace ge::input {

namespace {

// Scale SDL mouse window-point coords to render-surface pixel coords
// using the SDL window's intrinsic point↔pixel ratio. Falls back to
// identity (no scaling) if the window lookup fails.
la::float2 mouseToPixel(SDL_WindowID windowID, la::float2 pt) {
    SDL_Window* win = SDL_GetWindowFromID(windowID);
    if (!win) return pt;
    int pixW = 0, pixH = 0, ptW = 0, ptH = 0;
    SDL_GetWindowSizeInPixels(win, &pixW, &pixH);
    SDL_GetWindowSize(win, &ptW, &ptH);
    const float sx = ptW > 0 ? float(pixW) / float(ptW) : 1.0f;
    const float sy = ptH > 0 ? float(pixH) / float(ptH) : 1.0f;
    return {pt.x * sx, pt.y * sy};
}

} // namespace

std::optional<PointerEvent> fromSdl(const SDL_Event& ev, la::float2 surfaceSize) {
    switch (ev.type) {
    case SDL_EVENT_MOUSE_BUTTON_DOWN:
    case SDL_EVENT_MOUSE_BUTTON_UP:
        // Drop touch-synthetic mouse events — the consumer already
        // receives the corresponding SDL_EVENT_FINGER_* event.
        if (ev.button.which == SDL_TOUCH_MOUSEID) return std::nullopt;
        return PointerEvent{
            .kind = ev.type == SDL_EVENT_MOUSE_BUTTON_DOWN
                    ? PointerEvent::Down : PointerEvent::Up,
            .pos  = mouseToPixel(ev.button.windowID,
                                 {ev.button.x, ev.button.y}),
            .id   = kMouseId,
        };

    case SDL_EVENT_MOUSE_MOTION:
        if (ev.motion.which == SDL_TOUCH_MOUSEID) return std::nullopt;
        return PointerEvent{
            .kind = PointerEvent::Move,
            .pos  = mouseToPixel(ev.motion.windowID,
                                 {ev.motion.x, ev.motion.y}),
            .id   = kMouseId,
        };

    case SDL_EVENT_FINGER_DOWN:
    case SDL_EVENT_FINGER_UP:
    case SDL_EVENT_FINGER_MOTION:
        return PointerEvent{
            .kind = ev.type == SDL_EVENT_FINGER_DOWN ? PointerEvent::Down
                  : ev.type == SDL_EVENT_FINGER_UP   ? PointerEvent::Up
                                                    : PointerEvent::Move,
            .pos  = {ev.tfinger.x * surfaceSize.x,
                     ev.tfinger.y * surfaceSize.y},
            .id   = ev.tfinger.fingerID,
        };
    }
    return std::nullopt;
}

} // namespace ge::input
