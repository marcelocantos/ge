// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include "Scene.h"

#include <memory>

namespace tiltbuggy {

// ----------------------------------------------------------------------------
// Impl
// ----------------------------------------------------------------------------

struct Scene::Impl {
    float halfExtent;

    b2WorldId worldId;

    b2BodyId groundId;
    b2BodyId chassisId;
    b2BodyId steeringId;

    // Wheel joints: rearLeft, rearRight, frontLeft, frontRight
    b2JointId wheelJoints[4];

    // Revolute joint connecting steering body to chassis
    b2JointId steeringJoint;

    // Sensor shapes for surface patches
    b2ShapeId iceShapeId;
    b2ShapeId dirtShapeId;

    // Remembered surface bounds for surfaces()
    float iceL, iceT, iceR, iceB;
    float dirtL, dirtT, dirtR, dirtB;

    explicit Impl(float halfExtent_) : halfExtent(halfExtent_) {
        // ------------------------------------------------------------------
        // World
        // ------------------------------------------------------------------
        b2WorldDef wdef = b2DefaultWorldDef();
        // Gravity is supplied per-step via b2World_SetGravity; start at zero.
        wdef.gravity = {0.0f, 0.0f};
        worldId = b2CreateWorld(&wdef);

        // ------------------------------------------------------------------
        // Ground (static body that owns walls and sensor patches)
        // ------------------------------------------------------------------
        {
            b2BodyDef bdef = b2DefaultBodyDef();
            bdef.type = b2_staticBody;
            groundId = b2CreateBody(worldId, &bdef);
        }

        // Walls — four edge segments at ±halfExtent
        {
            const float e = halfExtent;
            const b2Vec2 corners[4] = {
                {-e, -e}, { e, -e}, { e,  e}, {-e,  e}
            };
            b2ShapeDef sdef = b2DefaultShapeDef();
            sdef.material.friction = 0.8f;
            sdef.material.restitution = 0.5f;
            for (int i = 0; i < 4; ++i) {
                b2Segment seg = { corners[i], corners[(i + 1) % 4] };
                b2CreateSegmentShape(groundId, &sdef, &seg);
            }
        }

        // ------------------------------------------------------------------
        // Chassis — 1.0 × 0.5 m rectangle, starts at origin
        // ------------------------------------------------------------------
        {
            b2BodyDef bdef = b2DefaultBodyDef();
            bdef.type = b2_dynamicBody;
            bdef.position = {0.0f, 0.0f};
            bdef.linearDamping = 0.5f;
            bdef.angularDamping = 2.0f;
            bdef.enableSleep = false;  // gravity changes must always take effect
            chassisId = b2CreateBody(worldId, &bdef);

            b2Polygon box = b2MakeBox(0.5f, 0.25f); // half-extents
            b2ShapeDef sdef = b2DefaultShapeDef();
            sdef.density = 1.0f;
            sdef.material.friction = 0.8f;
            b2CreatePolygonShape(chassisId, &sdef, &box);
        }

        // Steering body and wheel joints removed for stage-2-minimum:
        // chassis slides freely under gravity to validate render+physics.
        // Re-add steering + wheels as separate bodies with proper vehicle
        // dynamics in a later pass.

        // ------------------------------------------------------------------
        // Surface sensor patches
        // ------------------------------------------------------------------

        // Ice patch: upper-centre, x∈[-3,3], y∈[2,6]
        iceL = -3.0f; iceB = 2.0f; iceR = 3.0f; iceT = 6.0f;
        {
            float hw = (iceR - iceL) * 0.5f;
            float hh = (iceT - iceB) * 0.5f;
            b2Vec2 centre = {(iceL + iceR) * 0.5f, (iceB + iceT) * 0.5f};
            b2Polygon box = b2MakeOffsetBox(hw, hh, centre, b2Rot_identity);
            b2ShapeDef sdef = b2DefaultShapeDef();
            sdef.isSensor = true;
            iceShapeId = b2CreatePolygonShape(groundId, &sdef, &box);
        }

        // Dirt patch: left strip, x∈[-halfExtent, -halfExtent/2], y∈[-halfExtent, halfExtent]
        dirtL = -halfExtent;
        dirtB = -halfExtent;
        dirtR = -halfExtent * 0.5f;
        dirtT =  halfExtent;
        {
            float hw = (dirtR - dirtL) * 0.5f;
            float hh = (dirtT - dirtB) * 0.5f;
            b2Vec2 centre = {(dirtL + dirtR) * 0.5f, (dirtB + dirtT) * 0.5f};
            b2Polygon box = b2MakeOffsetBox(hw, hh, centre, b2Rot_identity);
            b2ShapeDef sdef = b2DefaultShapeDef();
            sdef.isSensor = true;
            dirtShapeId = b2CreatePolygonShape(groundId, &sdef, &box);
        }
    }

    ~Impl() {
        b2DestroyWorld(worldId);
    }
};

// ----------------------------------------------------------------------------
// Scene
// ----------------------------------------------------------------------------

Scene::Scene(float halfExtent) : i_(std::make_unique<Impl>(halfExtent)) {}
Scene::~Scene() = default;

void Scene::step(float dt, b2Vec2 gravity) {
    b2World_SetGravity(i_->worldId, gravity);
    b2World_Step(i_->worldId, dt, 4);
}

Pose Scene::buggyPose() const {
    b2Vec2 pos = b2Body_GetPosition(i_->chassisId);
    b2Rot  rot = b2Body_GetRotation(i_->chassisId);
    return { pos.x, pos.y, b2Rot_GetAngle(rot) };
}

float Scene::halfExtent() const {
    return i_->halfExtent;
}

std::vector<Surface> Scene::surfaces() const {
    return {
        { i_->iceL,  i_->iceT,  i_->iceR,  i_->iceB,  SurfaceType::Ice  },
        { i_->dirtL, i_->dirtT, i_->dirtR, i_->dirtB, SurfaceType::Dirt },
    };
}

} // namespace tiltbuggy
