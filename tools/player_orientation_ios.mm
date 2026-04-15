// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// iOS orientation lock via prefersInterfaceOrientationLocked (iPadOS 26+).
// This is Apple's official replacement for UIRequiresFullScreen (TN3192).
// We swizzle UIViewController to override the property because SDL's
// view controller doesn't know about our SessionConfig.

#include "player_orientation.h"

#import <UIKit/UIKit.h>
#import <objc/runtime.h>
#include <SDL3/SDL_video.h>

// Global flag — set by playerForceOrientation, read by the swizzled property.
static BOOL g_orientationLocked = NO;

@interface UIViewController (GeOrientationLock)
@end

@implementation UIViewController (GeOrientationLock)

+ (void)load {
    // Swizzle prefersInterfaceOrientationLocked if it exists (iPadOS 26+).
    SEL sel = @selector(prefersInterfaceOrientationLocked);
    Method orig = class_getInstanceMethod([UIViewController class], sel);
    if (!orig) return;
    IMP newImp = imp_implementationWithBlock(^BOOL(id self) {
        return g_orientationLocked;
    });
    method_setImplementation(orig, newImp);
}

@end

static bool g_deviceOrientationActive = false;

int playerGetPhysicalOrientation() {
    if (!g_deviceOrientationActive) {
        [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
        g_deviceOrientationActive = true;
    }
    // Real devices report physical orientation. Simulator returns Unknown
    // (no accelerometer), which falls through to portrait default.
    UIDeviceOrientation dev = [UIDevice currentDevice].orientation;
    switch (dev) {
    case UIDeviceOrientationPortrait:           return SDL_ORIENTATION_PORTRAIT;
    case UIDeviceOrientationPortraitUpsideDown: return SDL_ORIENTATION_PORTRAIT_FLIPPED;
    case UIDeviceOrientationLandscapeLeft:      return SDL_ORIENTATION_LANDSCAPE;
    case UIDeviceOrientationLandscapeRight:     return SDL_ORIENTATION_LANDSCAPE_FLIPPED;
    default:                                    return SDL_ORIENTATION_PORTRAIT;
    }
}

void playerForceOrientation(uint8_t orientation) {
    if (orientation == 0) return;

    // Start generating device orientation notifications early so that
    // UIDevice.current.orientation is populated by the time the first
    // keyboard tilt event arrives.
    if (!g_deviceOrientationActive) {
        [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
        g_deviceOrientationActive = true;
    }

    g_orientationLocked = YES;

    for (UIScene *s in UIApplication.sharedApplication.connectedScenes) {
        if (![s isKindOfClass:[UIWindowScene class]]) continue;
        UIWindowScene *scene = (UIWindowScene *)s;
        for (UIWindow *w in scene.windows) {
            UIViewController *vc = w.rootViewController;
            SEL updateSel =
                @selector(setNeedsUpdateOfPrefersInterfaceOrientationLocked);
            if ([vc respondsToSelector:updateSel]) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
                [vc performSelector:updateSel];
#pragma clang diagnostic pop
            } else {
                [vc setNeedsUpdateOfSupportedInterfaceOrientations];
            }
        }
    }
}
