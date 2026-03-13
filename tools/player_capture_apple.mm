// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#import "player_capture_apple.h"
#import <objc/runtime.h>
#import <Metal/Metal.h>
#import <SDL3/SDL_metal.h>
#include <spdlog/spdlog.h>

static CaptureMetalLayer* g_captureLayer = nil;

@implementation CaptureMetalLayer

- (id<CAMetalDrawable>)nextDrawable {
    self.lastDrawable = [super nextDrawable];
    return self.lastDrawable;
}

@end

namespace capture {

void enableCapture(SDL_MetalView view) {
    CAMetalLayer* layer = (__bridge CAMetalLayer*)SDL_Metal_GetLayer(view);
    if (!layer) {
        SPDLOG_ERROR("enableCapture: SDL_Metal_GetLayer returned null");
        return;
    }
    layer.framebufferOnly = NO;
    object_setClass(layer, [CaptureMetalLayer class]);
    g_captureLayer = (CaptureMetalLayer*)layer;
    SPDLOG_INFO("Capture enabled ({}x{})",
                (int)layer.drawableSize.width,
                (int)layer.drawableSize.height);
}

bool hasDrawable() {
    return g_captureLayer && g_captureLayer.lastDrawable;
}

bool readLastFrame(uint8_t* dst, int width, int height, size_t bytesPerRow) {
    if (!g_captureLayer) return false;
    id<CAMetalDrawable> drawable = g_captureLayer.lastDrawable;
    if (!drawable) return false;
    id<MTLTexture> texture = drawable.texture;
    if (!texture) return false;

    NSUInteger readW = MIN((NSUInteger)width, texture.width);
    NSUInteger readH = MIN((NSUInteger)height, texture.height);

    [texture getBytes:dst
          bytesPerRow:bytesPerRow
           fromRegion:MTLRegionMake2D(0, 0, readW, readH)
          mipmapLevel:0];

    return true;
}

} // namespace capture
