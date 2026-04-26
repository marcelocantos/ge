# Visual Regression Baselines

## Why baselines are not in this directory

ge's visual regression uses spyder's `screenshot` + `diff` infrastructure. Baselines
are managed by spyder and stored on the developer's local machine at:

```
~/.spyder/visualdiff/ge-tiltbuggy/<cell-id>/baseline.png
```

They are **not** committed to ge's source tree. This was a deliberate choice:

- PNG baselines are binary blobs. Committing them requires large-binary git
  practice (Git LFS, careful attribute configuration). That infrastructure
  does not yet exist in ge.
- spyder's baseline directory is spyder's source of truth. Duplicating baselines
  into ge's tree would create a two-source-of-truth problem.
- The downside is that baselines are not visible as image diffs in PR review.
  The PR body for changes that affect visual appearance should note what changed
  and include inline screenshots where the diff matters.

## Establishing or refreshing baselines

From the app directory (e.g. `sample/tiltbuggy/`):

```bash
make update-baselines
```

This re-runs `ios-sim-tablet-dist` and `android-emu-tablet-dist` with
`VR_UPDATE_MODE=1`, capturing a screenshot at the known-stable post-soak point
and writing it as the new baseline via `spyder baseline_update`.

Prerequisites:
- spyder installed (`brew install spyder` or equivalent)
- `spyder serve` running, or spyder configured to auto-start
- iOS Simulator (tablet form factor) booted
- Android emulator running

## Cell coverage

| Cell | Suite | Case | Capture point |
|---|---|---|---|
| `ios-sim-tablet-dist` | `ge-tiltbuggy` | `ios-sim-tablet-dist` | Post-soak, post-bg/fg, pre-clean-exit |
| `android-emu-tablet-dist` | `ge-tiltbuggy` | `android-emu-tablet-dist` | Post-soak, post-bg/fg, pre-clean-exit |

## Exit codes

| Code | Meaning |
|---|---|
| 0 | Baseline match (or no baseline yet — WARN, not FAIL) |
| 51 | Pixel mismatch (visual regression) |
| 52 | spyder screenshot failed |
| 53 | spyder diff/baseline_update returned unexpected error |

Code 51 is deliberately outside spyder's reserved range (10–42).

## Pixel tolerance

Default: `VR_PIXEL_TOLERANCE=8` (on a 0–255 scale). Override per-run:

```bash
VR_PIXEL_TOLERANCE=12 make cell.ios-sim-tablet-dist
VR_PIXEL_TOLERANCE=12 make update-baselines
```

## Coexistence with imgdiff

ge also ships `imgdiff` (built via `make ge/imgdiff`), which performs pixel-exact
RMS comparison against reference images committed to `test/refs/`. The two systems
serve different purposes:

- **spyder diff** — full-frame device-level screenshots, high-level visual regression
- **imgdiff** — pixel-exact comparison of specific rendered outputs

Neither replaces the other; both can run in the same cell.
