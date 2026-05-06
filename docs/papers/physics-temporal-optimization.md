# Physics engine temporal optimisation — adaptive substepping

**Status:** research record. ge has no physics engine today; this document captures a design discussion for if/when one is needed (or when choosing a third-party library). The conclusions apply equally to evaluating Box2D, Bullet, PhysX, or writing something bespoke.
**Date:** 2026-04-19.

## One-line problem

A physics engine integrating at a fixed small `dt` wastes work on quiet frames; integrating at a fixed large `dt` breaks on fast motion (tunneling, joint explosions, integration blow-up). The question is how to make `dt` adapt to the scene cheaply and predictably.

## The approaches in the field

| Approach | Idea | Where it ships |
|---|---|---|
| Adaptive ODE integration (RKF45, Dormand-Prince) | Embed two different-order estimates, measure local truncation error, shrink/grow `dt` to stay under a tolerance. | Scientific ODE solvers. Rare in game physics — error estimate cost is non-trivial. |
| Fixed substepping | Fixed outer `dt`, subdivide into N inner steps every frame (or when velocity/penetration triggers it). | Bullet, PhysX, Havok, Box2D. The workhorse. |
| Time-of-impact (TOI) bisection | For fast-moving bodies, bisect on impact time, advance to the collision, resolve, continue. | Box2D (opt-in via `isBullet`), PhysX CCD path. |
| Speculative contacts | Expand contact manifold along predicted motion; feed predicted contact points into the normal constraint solver. All bodies get velocity-aware collision without classification. | Bullet (variant), Paul Firth's Wildbunny posts are the canonical write-up. |
| Post-hoc tunneling detection | Raycast between frames, detect sign-flip across a surface, rewind. | Rarely used — rollback cost usually dominates. |

## Box2D specifically

Box2D does **not** adapt the outer `dt`. The manual is emphatic: call `world.Step(dt, ...)` with a constant timestep (typically 1/60). Passing a large `dt` integrates the full interval in one go and explodes.

Box2D **does** automatically substep bodies flagged `isBullet = true`, via internal TOI bisection. No user intervention beyond setting the flag. Bodies not flagged run at the outer `dt`.

Erin Catto has written that auto-detection of bullet-class bodies has two costs:
- **False positives:** slow bodies near thin walls look "fast" relative to wall thickness.
- **Per-frame test cost** adds up across thousands of bodies.

The `isBullet` flag is a cheap hint: "this body earns the expensive path; skip the test for everyone else." For 2D games, this tradeoff beats speculative contacts' complexity.

## Cost model: adaptive vs fixed

Naive intuition says adaptive (start large, subdivide on demand) beats fixed small `dt` because most frames are quiet. Three caveats usually flip the answer:

1. **Rejected steps are wasted work.** If a large-`dt` attempt fails and you redo at `dt/2`, you've done 1.5× the work of just starting at `dt/2`. RKF45 mitigates this with an error estimate that's nearly free alongside the step. Without that, the "is this delta too large?" check has to be very cheap or the savings evaporate. Penetration depth and velocity change are the usual cheap proxies; full constraint residual is accurate but expensive.

2. **Stiffness kills it.** Stiff constraints (strong springs, heavy/light mass ratios, tight joints) need small `dt` *always*. You reject every large step and net out worse than fixed small `dt`. Rigid-body-only scenes are fine; soft bodies, cloth, and extreme mass ratios break the model.

3. **Frame pacing.** Games prefer predictable worst-case frame time over lower average. Adaptive produces jitter: quiet frame 2ms, busy frame 8ms, and VSync/display pipelines hate that. Fixed substepping tuned to the worst case is often chosen for this reason alone — even knowing it wastes cycles on idle frames.

**Net:** adaptive is a real win for offline sim, scientific ODE, and games with controlled content where stiffness is bounded. For general-purpose engines shipping to unknown scenes, fixed substepping's predictability usually wins — which is why Box2D/PhysX/Bullet went that way.

## Automating `isBullet`

Automation exists and ships; Box2D's manual flag is a design choice, not a limitation of the field.

**Velocity/size heuristic.** Classic criterion: if `|v| · dt > min_extent / 2`, the body can tunnel this step. PhysX does roughly this — a body is opted into CCD at setup, but the engine decides per-frame whether to actually run the expensive path based on predicted motion vs thickness. Unity exposes this as Continuous / Continuous Dynamic modes.

**Speculative contacts.** The more interesting line — dissolves the classification problem entirely by making all contact detection velocity-aware. Downsides: can produce ghost contacts (response to near-misses), and solver tuning gets harder.

## A middle-ground design

Selective substepping, driven by a cheap velocity/size check plus a swept-AABB broadphase to bring in potential colliders. Avoids TOI root-finding; avoids the rollback cost of RKF45-style retry. Close to what PhysX does internally under the name "CCD pairs".

### Components

**1. Cheap per-body trigger.** For each body:
```
needs_substep = (|v_com| + |ω| · r_max) · dt > min_extent · safety_factor
```
Include angular term — a spinning rod has near-zero COM velocity but its tips move fast. Use the *smallest* extent, not the average — a sword moving point-first can tunnel a wall thinner than its length.

**2. Swept-AABB broadphase.** Expand each body's AABB along `v · dt` before the broadphase pass. Broadphase already does AABB work, so this is ~20% more expensive than the normal pass. Any pair involving a triggered body joins the substep set.

**3. Island promotion.** Physics engines group connected bodies into *islands* and solve each island's constraints together. If body A substeps at `dt/4` but body B (jointed to A) runs at `dt`, the constraint solver sees inconsistent state and the joint drifts or explodes. Fix: once any body in an island is triggered, the whole island substeps.

**4. Fixed N-way subdivision.** No retry loop. Once the substep set is determined, run those islands at `dt/N` for a fixed N (typically 2, 4, or 8). Predictable frame cost.

### Tradeoffs

| | Fixed substepping (all bodies) | Manual `isBullet` (Box2D) | Adaptive middle-ground |
|---|---|---|---|
| Per-frame cost | High and constant | Low, spikes on fast bodies | Moderate, spikes on fast bodies |
| Predictability | Excellent | Good | Good |
| Setup burden | None | Flag every fast body | None |
| False negatives | Impossible (everything substeps) | High (forgotten flags tunnel) | Low (automatic detection) |
| Implementation | Trivial | Trivial for user; TOI in engine | Moderate — needs swept broadphase + island promotion |
| Stiffness handling | Good if N chosen conservatively | Good if N chosen conservatively | Same as fixed |

Island promotion can over-include bodies (one fast body drags a crate of stationary bodies into the expensive path), so the substep set is larger than strictly necessary. Usually a good tradeoff — a few extra substeps beats the constraint-coupling bug.

## Recommendations for ge

ge has no physics today. If physics is added:

1. **Default to a mature third-party library** (Box2D for 2D, Jolt / PhysX / Bullet for 3D). Do not write one from scratch unless there's a specific reason.
2. **If Box2D:** adopt its `isBullet` flag for fast projectiles (bullets, thrown objects, fast-moving characters). Audit content for forgotten flags during QA.
3. **If writing bespoke or extending an engine:** the middle-ground design above (velocity/size trigger + swept-AABB + island promotion + fixed N-way subdivision) is the sweet spot between manual flags and full RKF45 adaptation. Predictable frame cost, automatic, no rollback.
4. **Never expose the outer `dt` to game logic.** Game code assumes fixed `dt`; the physics engine subdivides internally. Mixing variable `dt` into gameplay breaks determinism and replay.

## References

- Erin Catto, *Box2D manual* and talks — the `isBullet` design rationale.
- Paul Firth, *Speculative contacts* (Wildbunny blog) — the canonical write-up on dissolving CCD classification.
- Kenny Erleben, *Numerical Methods for Linear Complementarity Problems in Physical-Based Animation* — the academic reference on constraint solvers and stiffness.
- NVIDIA PhysX documentation — CCD pairs and the velocity/extent trigger.
- David Eberly, *Game Physics* — textbook coverage of adaptive integration and TOI.
