#!/usr/bin/env bash
#
# visual-regression.sh — spyder-based visual regression helpers for matrix cells.
#
# Source this file from matrix-cell.sh or any script that needs visual regression
# checks. Do not execute it directly.
#
# Usage (after sourcing):
#   visual_regression_check <device> <cell-id> [pixel-tolerance]
#   visual_regression_update <device> <cell-id>
#
# Exit codes (visual_regression_check):
#   0  — screenshot matches baseline (or no baseline established yet — WARN, not FAIL)
#   51 — visual regression mismatch (pixel diff exceeds tolerance)
#   52 — spyder screenshot failed
#   53 — spyder diff returned unexpected error
#
# Exit code 51 is deliberately outside spyder's reserved 10–42 range.
#
# Environment variables:
#   VR_SUITE             Suite name for spyder baselines (default: ge-tiltbuggy)
#   VR_PIXEL_TOLERANCE   Default pixel tolerance 0–255 (default: 8)
#   VR_ARTIFACTS_DIR     Directory to write diff report + screenshot (default: /tmp)
#   VR_UPDATE_MODE       If set to 1, visual_regression_check calls baseline_update
#                        instead of diff. Used by `make update-baselines`.

# ── Defaults ──────────────────────────────────────────────────────────

VR_SUITE="${VR_SUITE:-ge-tiltbuggy}"
VR_PIXEL_TOLERANCE="${VR_PIXEL_TOLERANCE:-8}"
VR_ARTIFACTS_DIR="${VR_ARTIFACTS_DIR:-${TMPDIR:-/tmp}}"
VR_UPDATE_MODE="${VR_UPDATE_MODE:-0}"

# ── visual_regression_check ───────────────────────────────────────────
#
# Captures a screenshot of <device> via spyder, then either:
#   - compares against the stored baseline (normal mode), or
#   - updates the baseline (VR_UPDATE_MODE=1 / make update-baselines).
#
# Arguments:
#   $1  device    spyder device alias or ID
#   $2  cell_id   matrix cell name — used as the spyder case name
#   $3  tolerance pixel tolerance override (optional; defaults to VR_PIXEL_TOLERANCE)
#
# Returns 0 on pass/warn, 51 on mismatch, 52 on capture failure, 53 on diff error.

visual_regression_check() {
    local device="$1"
    local cell_id="$2"
    local tolerance="${3:-$VR_PIXEL_TOLERANCE}"
    local subcheck="visual-regression"

    # Require spyder.
    if ! command -v spyder >/dev/null 2>&1; then
        # Warn rather than fail: spyder not installed is a CI-infra gap, not a
        # rendering regression. Record as a warning so the cell still passes.
        warn_check "$subcheck" "spyder not found — install spyder to enable visual regression"
        return 0
    fi

    # Capture screenshot.
    local shot_path
    shot_path="$VR_ARTIFACTS_DIR/vr-${cell_id}-$(date +%s).png"
    local capture_stderr
    capture_stderr=$(mktemp)

    if ! spyder screenshot "$device" --output "$shot_path" 2>"$capture_stderr"; then
        local err
        err=$(cat "$capture_stderr" 2>/dev/null | head -3 | tr '\n' ' ')
        rm -f "$capture_stderr"
        if [[ $VR_UPDATE_MODE -eq 1 ]]; then
            echo "  visual-regression: screenshot failed during baseline update: $err" >&2
        else
            fail_check "$subcheck" "spyder screenshot failed: $err"
        fi
        return 52
    fi
    rm -f "$capture_stderr"

    if [[ ! -s "$shot_path" ]]; then
        if [[ $VR_UPDATE_MODE -eq 1 ]]; then
            echo "  visual-regression: screenshot empty during baseline update" >&2
        else
            fail_check "$subcheck" "screenshot empty"
        fi
        return 52
    fi

    # Update-baselines mode: call baseline_update instead of diff.
    if [[ $VR_UPDATE_MODE -eq 1 ]]; then
        if spyder baseline_update \
                --suite="$VR_SUITE" \
                --case="$cell_id" \
                --screenshot-path="$shot_path" 2>&1; then
            echo "  visual-regression: baseline updated for $VR_SUITE/$cell_id"
        else
            echo "  visual-regression: baseline_update failed for $VR_SUITE/$cell_id" >&2
            return 53
        fi
        return 0
    fi

    # Normal mode: diff against existing baseline.
    local report_path
    report_path="$VR_ARTIFACTS_DIR/vr-${cell_id}-report.json"
    local diff_exit=0
    local diff_out
    diff_out=$(spyder diff \
        --suite="$VR_SUITE" \
        --case="$cell_id" \
        --screenshot-path="$shot_path" \
        --pixel-tolerance="$tolerance" \
        2>&1) || diff_exit=$?

    # Write report for artifact inspection.
    printf '%s\n' "$diff_out" > "$report_path"

    if [[ $diff_exit -eq 0 ]]; then
        pass_check "$subcheck" "baseline match (suite=$VR_SUITE case=$cell_id tol=$tolerance)"
        return 0
    fi

    # Exit code 10 from spyder diff = no baseline exists yet.
    # Treat as a warning (no evidence of regression) rather than a hard failure.
    if [[ $diff_exit -eq 10 ]]; then
        warn_check "$subcheck" \
            "no baseline yet — run 'make update-baselines' to establish one (suite=$VR_SUITE case=$cell_id)"
        return 0
    fi

    # Any other non-zero exit = mismatch or error.
    # Log the first few lines of the diff report so it appears in CI output.
    local report_snippet
    report_snippet=$(printf '%s\n' "$diff_out" | head -5 | tr '\n' ' ')
    fail_check "$subcheck" \
        "pixel mismatch (exit=$diff_exit tol=$tolerance) — report: $report_path  $report_snippet"
    return 51
}

# ── visual_regression_update ──────────────────────────────────────────
#
# Unconditionally establishes or refreshes the baseline for <cell_id>.
# Intended for `make update-baselines`; not called during normal cell runs.
#
# Arguments:
#   $1  device    spyder device alias or ID
#   $2  cell_id   matrix cell name
#
# Returns 0 on success, non-zero on failure.

visual_regression_update() {
    local device="$1"
    local cell_id="$2"
    VR_UPDATE_MODE=1 visual_regression_check "$device" "$cell_id"
}
