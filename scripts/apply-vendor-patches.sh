#!/usr/bin/env bash
# Apply patches from vendor/patches/ to the corresponding vendored
# submodules. Idempotent: patches that already apply cleanly are
# considered already-applied and skipped.

set -eu

cd "$(dirname "$0")/.."

# Map patch file → submodule path where it applies.
# Keep this in sync with vendor/patches/README.md.
declare -A TARGETS=(
    [bgfx-drawable-as-truth.patch]="vendor/github.com/bkaradzic/bgfx"
)

status=0
for patch in vendor/patches/*.patch; do
    name=$(basename "$patch")
    target=${TARGETS[$name]:-}
    if [[ -z "$target" ]]; then
        echo "  WARN  $name — no target mapping, skipping" >&2
        continue
    fi
    if [[ ! -d "$target" ]]; then
        echo "  SKIP  $name — $target missing (submodule not cloned?)"
        continue
    fi
    if (cd "$target" && git apply --reverse --check "$OLDPWD/$patch") 2>/dev/null; then
        echo "  OK    $name — already applied"
        continue
    fi
    if (cd "$target" && git apply --check "$OLDPWD/$patch") 2>/dev/null; then
        (cd "$target" && git apply "$OLDPWD/$patch")
        echo "  APPLY $name → $target"
    else
        echo "  FAIL  $name → $target (neither applies nor reverse-applies)" >&2
        status=1
    fi
done

exit $status
