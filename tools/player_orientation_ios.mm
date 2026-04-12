// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// iOS orientation lock — forces the app to a specific orientation via UIKit.
// SDL_HINT_ORIENTATIONS limits allowed orientations but doesn't force rotation;
// on iOS 16+ we need requestGeometryUpdateWithPreferences to actually rotate.

#include "player_orientation.h"

#include <ge/Protocol.h>

#import <UIKit/UIKit.h>
#import <os/log.h>

void playerForceOrientation(uint8_t orientation) {
    os_log_error(OS_LOG_DEFAULT, "MM2: playerForceOrientation called, orientation=%d", orientation);
    if (orientation == 0) return;

    UIInterfaceOrientationMask mask;
    switch (orientation) {
    case wire::kOrientationLandscape:        mask = UIInterfaceOrientationMaskLandscapeLeft; break;
    case wire::kOrientationLandscapeFlipped: mask = UIInterfaceOrientationMaskLandscapeRight; break;
    case wire::kOrientationPortrait:         mask = UIInterfaceOrientationMaskPortrait; break;
    case wire::kOrientationPortraitFlipped:  mask = UIInterfaceOrientationMaskPortraitUpsideDown; break;
    default: return;
    }

    // Run on the main thread synchronously. SDL's player loop runs on the
    // main thread, so dispatch_sync to main queue would deadlock. Instead,
    // call UIKit directly — we're already on the main thread.
    UIWindowScene *scene = nil;
    for (UIScene *s in UIApplication.sharedApplication.connectedScenes) {
        if ([s isKindOfClass:[UIWindowScene class]]) {
            scene = (UIWindowScene *)s;
            break;
        }
    }
    if (!scene) return;

    os_log_error(OS_LOG_DEFAULT, "MM2: scene=%{public}@, mask=0x%lx, windows=%lu",
                 scene, (unsigned long)mask, (unsigned long)scene.windows.count);

    UIWindowSceneGeometryPreferencesIOS *prefs =
        [[UIWindowSceneGeometryPreferencesIOS alloc]
            initWithInterfaceOrientations:mask];
    [scene requestGeometryUpdateWithPreferences:prefs
                                   errorHandler:^(NSError *error) {
        os_log_error(OS_LOG_DEFAULT, "MM2: requestGeometryUpdate FAILED: %{public}@", error);
    }];

    for (UIWindow *w in scene.windows) {
        os_log_error(OS_LOG_DEFAULT, "MM2: setNeedsUpdate on vc=%{public}@", w.rootViewController);
        [w.rootViewController setNeedsUpdateOfSupportedInterfaceOrientations];
    }
}
