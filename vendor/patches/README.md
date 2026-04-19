# Vendored-library patches

Patches we maintain against upstream vendored libraries whose
submodules point at **upstream** remotes. They live here (not in
the upstream submodules) so submodule updates don't overwrite them
silently. Re-apply after pulling a new vendored revision.

## When to use this directory vs. a fork

- **Upstream-pinned submodule** → carry divergence as a `.patch`
  file here and register it in `scripts/apply-vendor-patches.sh`.
- **Fork-pinned submodule** (e.g. `squz/bgfx`) → commit the
  divergence to the fork branch directly; the submodule SHA then
  captures it with no apply step needed.

bgfx uses the fork approach. No patches in this directory currently
apply to it — see `vendor/github.com/bkaradzic/bgfx`, which is
pinned at `https://github.com/squz/bgfx.git`, branch
`ge-fork-upgrade`. Our delta against upstream bkaradzic/bgfx lives
as commits on that branch:

- `ge fork: Drawable-as-truth patch for iOS orientation races` —
  two-part fix at the top of `RendererContextMtl::submit()`:
  adopt the acquired drawable's dimensions as canonical pass size
  (gated on `_render->m_numRenderItems > 0`), then reconcile each
  swap-chain view's stored rect against those dims. Prevents a
  Metal-validation crash (debug) and magenta-strip artefact
  (release) when UIKit resizes `CAMetalLayer.drawableSize` mid-
  submit during orientation changes. Not yet upstreamed; see
  `docs/plans/upstream-bgfx-ios-rotation.md` for the plan.
- `Fix mobile crashes: guard iOS Metal query, disable Android
  timer queries` — mobile-platform guards on hot paths.
- `Add CMake build for shaderc (no GENie dependency)` — enables
  cross-platform shaderc builds without the GENie toolchain.

## Applying

From the repo root:

```sh
scripts/apply-vendor-patches.sh
```

The script is idempotent — it uses `git apply --check` before
applying and skips already-applied patches. With no patches
currently registered, it's a no-op.
