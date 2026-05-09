// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Apple AttitudeProvider — CoreMotion sensor-fused attitude quaternion.
// CMMotionManager is iOS / iPadOS / tvOS / watchOS only; on macOS the
// header isn't available at all, so we compile-out everything and the
// factory returns nullptr (engine treats as "no parallax", same as
// Attitude_stub).

#include "Attitude.h"

#include <TargetConditionals.h>

#if TARGET_OS_IOS
#import <CoreMotion/CoreMotion.h>
#endif

namespace ge {

#if TARGET_OS_IOS

namespace {

class AppleAttitudeProvider final : public AttitudeProvider {
public:
    AppleAttitudeProvider() {
        manager_ = [[CMMotionManager alloc] init];
        manager_.deviceMotionUpdateInterval = 1.0 / 60.0;
        [manager_ startDeviceMotionUpdates];
    }
    ~AppleAttitudeProvider() override {
        [manager_ stopDeviceMotionUpdates];
        manager_ = nil;
    }

    bool valid() const override {
        return manager_.deviceMotion != nil;
    }
    la::float4 quaternion() const override {
        CMQuaternion q = manager_.deviceMotion.attitude.quaternion;
        return la::float4{float(q.x), float(q.y), float(q.z), float(q.w)};
    }

private:
    CMMotionManager* manager_ = nil;
};

} // namespace

std::unique_ptr<AttitudeProvider> makeAttitudeProvider() {
    CMMotionManager* probe = [[CMMotionManager alloc] init];
    bool available = probe.deviceMotionAvailable;
    probe = nil;
    if (!available) return nullptr;
    return std::make_unique<AppleAttitudeProvider>();
}

#else // !TARGET_OS_IOS — macOS: no CoreMotion sensors

std::unique_ptr<AttitudeProvider> makeAttitudeProvider() {
    return nullptr;
}

#endif

} // namespace ge
