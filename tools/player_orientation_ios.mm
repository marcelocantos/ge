// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// iOS orientation lock via prefersInterfaceOrientationLocked (iPadOS 26+).
// This is Apple's official replacement for UIRequiresFullScreen (TN3192).
// We swizzle UIViewController to override the property because SDL's
// view controller doesn't know about our SessionConfig.
//
// HOW THE LOCK ACTUALLY WORKS — read this before "simplifying" anything.
//
// The swizzle below alone CANNOT force a specific orientation. All it can do
// is freeze the current orientation against the user's swivel gesture, and
// the orientation it freezes to is bounded by supportedInterfaceOrientations
// (which on iPad UIKit derives from Info.plist UISupportedInterfaceOrientations).
//
// To get "always landscape, ignore device orientation at launch", you need
// BOTH pieces:
//   1. Narrow UISupportedInterfaceOrientations in Info.plist to just the
//      orientations you want. UIKit rotates the UI to a supported orientation
//      at launch if the device is held in an unsupported one. (iPad
//      multitasking ignores this list as a runtime restriction — the user
//      can still resize the window — but the launch rotation still happens
//      and the swizzle's lock is bounded by it.)
//   2. The swizzle below, which overrides
//      UIViewController.prefersInterfaceOrientationLocked (Apple TN3192,
//      iPadOS 26+) to return YES, locking the post-launch orientation
//      against swivel.
//
// Things that DON'T work and should not be re-tried:
//   * UIRequiresFullScreen                         — deprecated, ignored on iPad.
//   * SDL_HINT_ORIENTATIONS                        — limits the supported set
//                                                    only; no runtime force.
//   * UIWindowScene requestGeometryUpdate          — silently no-ops on iPad.
//   * setNeedsUpdateOfSupportedInterfaceOrientations alone — only flips
//                                                    UIKit's view of the
//                                                    supported set; doesn't
//                                                    create a lock.
// History: e0da016 reverted the "plist alone" experiment; 5c2f2a5 added
// this swizzle. Both commits are needed context if you're touching this.
//
// Direct-render apps (DirectRenderHost) call playerForceOrientation from
// DirectRenderHost::send when SessionConfig.orientation is non-zero.

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
