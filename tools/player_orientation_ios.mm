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

void playerForceOrientation(uint8_t orientation) {
    if (orientation == 0) return;

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
