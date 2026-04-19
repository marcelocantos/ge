# Vendored-library patches

Patches we maintain against upstream vendored libraries. They live here
(not in the upstream submodules) so submodule updates don't overwrite
them silently. Re-apply after pulling a new vendored revision.

## Applying

From the repo root:

```sh
scripts/apply-vendor-patches.sh
```

The script is idempotent — it uses `git apply --check` before applying
and skips already-applied patches.

## Patches

### `bgfx-drawable-as-truth.patch`

**Target:** `vendor/github.com/bkaradzic/bgfx/src/renderer_mtl.cpp`

**Why:** bgfx's Metal backend assumes the app is the single source of
truth for the swap-chain resolution and view rects, synchronised via
`bgfx::reset()` / `bgfx::setViewRect()`. On desktop with an app-owned
NSWindow that holds; on iOS with an SDL-managed `CAMetalLayer` it does
not. UIKit mutates `CAMetalLayer.drawableSize` from the main thread
during orientation changes, at any moment relative to the bgfx
render-thread's processing of an in-flight submit. When the drawable
resizes between the submit and its processing:

- bgfx builds the render pass at the new drawable's texture dims.
- bgfx sets viewport/scissor from the submit's stored view rects,
  which still reflect the old orientation.
- Metal validation: `scissor.y + scissor.height > render pass height` →
  crash (debug) or uninitialised GPU memory presented as a magenta
  strip (release).

**Fix:** two-part change at the top of `RendererContextMtl::submit()`:

1. **Drawable-as-truth.** When the app has submitted draws this
   frame, acquire the drawable immediately (via
   `SwapChainMtl::currentDrawableTexture()`) and adopt its texture
   dimensions as the canonical resolution for this submit. The
   drawable's texture size is frozen once acquired, so every
   downstream reader sees the same pass size. Gated on
   `_render->m_numRenderItems > 0` — acquiring on an idle/init frame
   forces `flip()` to present an undrawn (magenta) drawable.

2. **View-rect reconciliation.** Walk the submit's views. For
   swap-chain views (invalid framebuffer handle), if the stored rect
   doesn't exactly match the drawable dims, replace it with the full
   drawable. Stretches one transition frame's content across the new
   drawable (masked by UIKit's rotate/crossfade animation) instead of
   leaving a strip of uncleared GPU memory. The `(0,0,1,1)` default
   from `View::reset` is left alone so bgfx's own init frames don't
   open an encoder without a clear. Framebuffer-backed views clamp to
   their own framebuffer dims.

**Upstreaming:** not yet. A PR would generalise this (probably gate
the layer-size query on `bgfx::PlatformData` configuration), but we're
keeping it local for now.
