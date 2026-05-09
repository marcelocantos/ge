// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Engine-internal: query the platform for the device's sensor-fused
// attitude as a unit quaternion (qx, qy, qz, qw). Drives the parallax
// pipeline behind SessionHostConfig.parallaxFactor.
//
// Platforms:
//   * Apple — CMMotionManager.deviceMotion.attitude (Apple_attitude.mm).
//   * Android — Sensor.TYPE_GAME_ROTATION_VECTOR via JNI to the
//     activity's getAttitude() helper (Attitude_android.cpp).
//   * Desktop / fallback — Attitude_stub.cpp returns identity and
//     reports unsupported.
//
// The attitude reference frame is platform-specific (gravity-aligned
// with arbitrary heading) but the engine's EMA baseline absorbs it,
// so the choice of reference doesn't leak past the AttitudeProvider
// boundary.
#pragma once

#include <ge/Linalg.h>

#include <memory>

namespace ge {

class AttitudeProvider {
public:
    virtual ~AttitudeProvider() = default;

    // True when the platform has produced at least one valid reading.
    // Apps should treat false as "no parallax this frame" (Context's
    // setParallax is left at zero).
    virtual bool valid() const = 0;

    // Latest fused attitude as a unit quaternion. Result is undefined
    // when valid() is false.
    virtual la::float4 quaternion() const = 0;
};

// Construct the platform's AttitudeProvider, starting the underlying
// sensor pipeline. Returns nullptr if the platform doesn't support it
// (desktop, or a misconfigured device). Call once per session;
// shutdown happens in the destructor.
std::unique_ptr<AttitudeProvider> makeAttitudeProvider();

} // namespace ge
