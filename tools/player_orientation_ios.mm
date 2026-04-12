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
#import <os/log.h>

// Global flag — set by playerForceOrientation, read by the swizzled property.
static BOOL g_orientationLocked = NO;

@interface UIViewController (GeOrientationLock)
@end

@implementation UIViewController (GeOrientationLock)

+ (void)load {
    // Swizzle prefersInterfaceOrientationLocked if it exists (iPadOS 26+).
    SEL sel = @selector(prefersInterfaceOrientationLocked);
    Method orig = class_getInstanceMethod([UIViewController class], sel);
    if (!orig) {
        os_log_error(OS_LOG_DEFAULT,
            "MM2: prefersInterfaceOrientationLocked not available");
        return;
    }
    IMP newImp = imp_implementationWithBlock(^BOOL(id self) {
        return g_orientationLocked;
    });
    method_setImplementation(orig, newImp);
    os_log_error(OS_LOG_DEFAULT,
        "MM2: swizzled prefersInterfaceOrientationLocked");
}

@end

void playerForceOrientation(uint8_t orientation) {
    if (orientation == 0) return;

    g_orientationLocked = YES;
    os_log_error(OS_LOG_DEFAULT,
        "MM2: orientation lock enabled (orientation=%d)", orientation);

    // Tell all view controllers to re-query the lock.
    for (UIScene *s in UIApplication.sharedApplication.connectedScenes) {
        if (![s isKindOfClass:[UIWindowScene class]]) continue;
        UIWindowScene *scene = (UIWindowScene *)s;
        for (UIWindow *w in scene.windows) {
            UIViewController *vc = w.rootViewController;
            // iPadOS 26+: setNeedsUpdateOfPrefersInterfaceOrientationLocked
            SEL updateSel =
                @selector(setNeedsUpdateOfPrefersInterfaceOrientationLocked);
            if ([vc respondsToSelector:updateSel]) {
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
                [vc performSelector:updateSel];
#pragma clang diagnostic pop
                os_log_error(OS_LOG_DEFAULT,
                    "MM2: setNeedsUpdateOfPrefersInterfaceOrientationLocked");
            } else {
                [vc setNeedsUpdateOfSupportedInterfaceOrientations];
                os_log_error(OS_LOG_DEFAULT,
                    "MM2: fallback setNeedsUpdateOfSupportedInterfaceOrientations");
            }
        }
    }
}
