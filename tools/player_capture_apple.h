// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
#pragma once

#ifdef __OBJC__
#import <QuartzCore/CAMetalLayer.h>
#import <Metal/Metal.h>

@interface CaptureMetalLayer : CAMetalLayer
@property (atomic, strong) id<CAMetalDrawable> lastDrawable;
@end
#endif

#include <SDL3/SDL.h>
#include <cstdint>
#include <cstddef>

namespace capture {

// Swizzle the SDL Metal layer's class to CaptureMetalLayer, which
// intercepts nextDrawable to track the last presented drawable.
// Also sets framebufferOnly=NO to allow readback.
void enableCapture(SDL_MetalView view);

// Read the last presented frame's pixels into dst buffer.
// Returns true if successful, false if no drawable available.
bool readLastFrame(uint8_t* dst, int width, int height, size_t bytesPerRow);

// Returns true if a drawable is available for capture.
bool hasDrawable();

} // namespace capture
