// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <box2d/box2d.h>
#include <memory>
#include <vector>

namespace tiltbuggy {

// World pose — y-up, radians, metres.
struct Pose { float x, y, angle; };

enum class SurfaceType { Asphalt, Ice, Dirt };
struct Surface {
    float l, t, r, b;   // AABB in world coords, y-up
    SurfaceType type;
};

class Scene {
public:
    // World is [-halfExtent, +halfExtent] on both axes.
    explicit Scene(float halfExtent);
    ~Scene();
    Scene(const Scene&) = delete;
    Scene& operator=(const Scene&) = delete;

    // Step physics by `dt` seconds. `gravity` drives the buggy — the car
    // has no throttle; it accelerates in whatever direction gravity points.
    void step(float dt, b2Vec2 gravity);

    // Pose of the buggy chassis in world coords.
    Pose buggyPose() const;

    // Extent of the world (walls at ±halfExtent).
    float halfExtent() const;

    // Static surface regions for rendering (includes ice, dirt).
    // Does NOT include the default asphalt background.
    std::vector<Surface> surfaces() const;

private:
    struct Impl;
    std::unique_ptr<Impl> i_;
};

} // namespace tiltbuggy
