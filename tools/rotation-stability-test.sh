#!/usr/bin/env bash
#
# rotation-stability-test.sh — automated rotation-cycling stability
# test for iOS simulator and Android emulator.
#
# Verifies that after N orientation changes ending back at the
# starting orientation, the app is still running and renders the
# same content it did at the start. Targets the class of bug the
# vendored bgfx-drawable-as-truth patch addresses (iOS
# CAMetalLayer.drawableSize race) and any analogous Android
# SurfaceView resize handling.
#
# Physical devices are out of scope — programmatic rotation of a
# physical iPhone/iPad requires user interaction (or sensor spoofing
# that we don't currently do).
#
# Usage:
#   ge/tools/rotation-stability-test.sh --platform <ios-sim|android-emu> \
#       --app-id <bundle-id-or-package> [options]
#
# Options:
#   --platform <p>      Required. ios-sim or android-emu.
#   --app-id <id>       Required. iOS bundle id or Android package name.
#   --device <id>       Target-device disambiguator when multiple are booted.
#                         ios-sim:     simulator UDID (full, from `xcrun
#                                      simctl list devices booted`).
#                         android-emu: adb serial (e.g. emulator-5554).
#                       Omit when only one device is booted.
#   --install <path>    .app (ios-sim) or .apk (android-emu) to deploy first.
#   --cycles <n>        Portrait→landscape→portrait rotations (default 10).
#   --settle <secs>     Seconds to wait after each rotation before the
#                       next (default 1, raise for physical-device CI).
#   --rms <f>           imgdiff RMS threshold for baseline-vs-final
#                       comparison (default 0.08).
#   --imgdiff <path>    imgdiff binary to use (default looks in
#                       ../../bin/imgdiff relative to this script).
#   --keep-tmp          Don't delete the per-run tmpdir on exit
#                       (useful for inspecting screenshots).
#   --verbose           Echo sub-command output.
#
# Exit codes:
#   0 — PASS
#   1 — FAIL (app crashed, or final screenshot doesn't match baseline)
#   2 — SETUP error (missing device, missing tools, invalid args)

set -euo pipefail

# ── CLI ─────────────────────────────────────────────────────────────

PLATFORM=""
APP_ID=""
DEVICE=""
INSTALL=""
CYCLES=10
SETTLE=1
RMS=0.08
IMGDIFF=""
KEEP_TMP=0
VERBOSE=0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GE_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --platform) PLATFORM="$2"; shift 2 ;;
        --app-id)   APP_ID="$2"; shift 2 ;;
        --device)   DEVICE="$2"; shift 2 ;;
        --install)  INSTALL="$2"; shift 2 ;;
        --cycles)   CYCLES="$2"; shift 2 ;;
        --settle)   SETTLE="$2"; shift 2 ;;
        --rms)      RMS="$2"; shift 2 ;;
        --imgdiff)  IMGDIFF="$2"; shift 2 ;;
        --keep-tmp) KEEP_TMP=1; shift ;;
        --verbose)  VERBOSE=1; shift ;;
        -h|--help)
            sed -n '2,/^$/{ s/^# \{0,1\}//; p; }' "$0"
            exit 0
            ;;
        *) echo "Unknown option: $1" >&2; exit 2 ;;
    esac
done

[[ -n "$PLATFORM" && -n "$APP_ID" ]] || {
    echo "Usage: $0 --platform <ios-sim|android-emu> --app-id <id> [options]" >&2
    exit 2
}

# Resolve imgdiff default.
if [[ -z "$IMGDIFF" ]]; then
    # Walk up from the script's directory to find a bin/imgdiff — the
    # script is typically invoked from an app dir where make built it.
    for candidate in "$(pwd)/bin/imgdiff" "$GE_ROOT/bin/imgdiff"; do
        if [[ -x "$candidate" ]]; then IMGDIFF="$candidate"; break; fi
    done
fi
[[ -x "$IMGDIFF" ]] || {
    echo "imgdiff not found (tried $(pwd)/bin/imgdiff and $GE_ROOT/bin/imgdiff)." >&2
    echo "Pass --imgdiff <path>, or run 'make' in the app directory first." >&2
    exit 2
}

# ── Working state ───────────────────────────────────────────────────

TMPDIR="$(mktemp -d -t ge-rotation-XXXXXX)"
cleanup() {
    [[ $KEEP_TMP -eq 1 ]] && { echo "tmpdir preserved: $TMPDIR"; return; }
    rm -rf "$TMPDIR"
}
trap cleanup EXIT

run() {
    if [[ $VERBOSE -eq 1 ]]; then
        echo "+ $*" >&2
        "$@"
    else
        "$@" >/dev/null 2>&1
    fi
}

log() { echo "[$(date +%H:%M:%S)] $*"; }

# ── Platform: iOS simulator ─────────────────────────────────────────

ios_sim_device_udid() {
    if [[ -n "$DEVICE" ]]; then
        # Trust the user; verify it's actually booted.
        if xcrun simctl list devices booted -j 2>/dev/null \
            | jq -e --arg udid "$DEVICE" \
                '[.devices | to_entries[].value[]] | any(.udid == $udid)' \
            >/dev/null; then
            echo "$DEVICE"
            return
        fi
        echo "--device $DEVICE is not a booted iOS simulator" >&2
        return 2
    fi
    local booted
    booted=$(xcrun simctl list devices booted -j 2>/dev/null \
             | jq -r '[.devices | to_entries[].value[]] | map(.udid) | .[]')
    local count
    count=$(echo "$booted" | grep -c . || true)
    if [[ "$count" -eq 0 ]]; then
        echo "no booted iOS simulator (try: xcrun simctl boot <udid>)" >&2
        return 2
    fi
    if [[ "$count" -gt 1 ]]; then
        echo "multiple booted iOS simulators; pass --device <udid> to pick one" >&2
        return 2
    fi
    echo "$booted"
}

ios_sim_setup() {
    command -v xcrun >/dev/null 2>&1 || { echo "no xcrun" >&2; return 2; }
    command -v osascript >/dev/null 2>&1 || { echo "no osascript" >&2; return 2; }
    UDID=$(ios_sim_device_udid) || return 2

    if [[ -n "$INSTALL" ]]; then
        run xcrun simctl terminate "$UDID" "$APP_ID" || true
        run xcrun simctl install "$UDID" "$INSTALL" \
            || { echo "simctl install failed" >&2; return 2; }
    fi

    run xcrun simctl launch "$UDID" "$APP_ID" \
        || { echo "simctl launch failed" >&2; return 2; }

    # Bring the Simulator to the front so AppleScript key sends land.
    osascript -e 'tell application "Simulator" to activate' >/dev/null 2>&1 || true
    sleep 2
}

ios_sim_rotate_right() {
    # ⌘→ on the focused Simulator window. ASCII 29 = RIGHT ARROW.
    osascript -e 'tell application "Simulator" to activate' >/dev/null 2>&1 || true
    osascript -e 'tell application "System Events" to keystroke (ASCII character 29) using command down' >/dev/null 2>&1
}

ios_sim_rotate_left() {
    # ⌘← — ASCII 28.
    osascript -e 'tell application "Simulator" to activate' >/dev/null 2>&1 || true
    osascript -e 'tell application "System Events" to keystroke (ASCII character 28) using command down' >/dev/null 2>&1
}

ios_sim_screenshot() {
    xcrun simctl io "$UDID" screenshot "$1" >/dev/null 2>&1
}

ios_sim_is_running() {
    # xcrun simctl spawn <udid> launchctl print system | grep <bundle-id>
    # is too heavy. Check via the process list via `devicectl`-style
    # dvt would also be heavy. Use `xcrun simctl listapps` + a ps via
    # simctl spawn.
    xcrun simctl spawn "$UDID" launchctl list 2>/dev/null \
        | grep -q "$APP_ID"
}

# ── Platform: Android emulator ──────────────────────────────────────

android_emu_device_serial() {
    if [[ -n "$DEVICE" ]]; then
        if adb -s "$DEVICE" get-state 2>/dev/null | grep -q '^device$'; then
            echo "$DEVICE"
            return
        fi
        echo "--device $DEVICE is not a connected Android device" >&2
        return 2
    fi
    local list
    list=$(adb devices 2>/dev/null | awk '/emulator-[0-9]+\s+device$/ {print $1}')
    local count
    count=$(echo "$list" | grep -c . || true)
    if [[ "$count" -eq 0 ]]; then
        echo "no running Android emulator" >&2
        return 2
    fi
    if [[ "$count" -gt 1 ]]; then
        echo "multiple Android emulators; pass --device <serial> to pick one" >&2
        return 2
    fi
    echo "$list"
}

android_emu_setup() {
    command -v adb >/dev/null 2>&1 || { echo "no adb" >&2; return 2; }
    SERIAL=$(android_emu_device_serial) || return 2

    # Disable auto-rotation so our user_rotation writes actually stick.
    run adb -s "$SERIAL" shell settings put system accelerometer_rotation 0

    if [[ -n "$INSTALL" ]]; then
        run adb -s "$SERIAL" install -r "$INSTALL" \
            || { echo "adb install failed" >&2; return 2; }
    fi

    # Portrait baseline.
    run adb -s "$SERIAL" shell settings put system user_rotation 0
    sleep 0.5

    run adb -s "$SERIAL" shell monkey -p "$APP_ID" \
        -c android.intent.category.LAUNCHER 1 \
        || { echo "monkey launch failed" >&2; return 2; }
    sleep 3
}

android_emu_rotate_landscape() {
    # user_rotation: 0=portrait, 1=landscape-left, 2=upside-down, 3=landscape-right.
    adb -s "$SERIAL" shell settings put system user_rotation 1 >/dev/null 2>&1
}

android_emu_rotate_portrait() {
    adb -s "$SERIAL" shell settings put system user_rotation 0 >/dev/null 2>&1
}

android_emu_screenshot() {
    adb -s "$SERIAL" exec-out screencap -p > "$1" 2>/dev/null
}

android_emu_is_running() {
    adb -s "$SERIAL" shell pidof "$APP_ID" 2>/dev/null | grep -q '[0-9]'
}

# ── Dispatch ────────────────────────────────────────────────────────

case "$PLATFORM" in
    ios-sim)
        setup()        { ios_sim_setup; }
        rotate_to_landscape() { ios_sim_rotate_right; }
        rotate_to_portrait()  { ios_sim_rotate_left; }
        screenshot()   { ios_sim_screenshot "$1"; }
        is_running()   { ios_sim_is_running; }
        ;;
    android-emu)
        setup()        { android_emu_setup; }
        rotate_to_landscape() { android_emu_rotate_landscape; }
        rotate_to_portrait()  { android_emu_rotate_portrait; }
        screenshot()   { android_emu_screenshot "$1"; }
        is_running()   { android_emu_is_running; }
        ;;
    *)
        echo "Unknown platform: $PLATFORM" >&2
        exit 2
        ;;
esac

# ── Run ─────────────────────────────────────────────────────────────

log "setup: platform=$PLATFORM app-id=$APP_ID cycles=$CYCLES settle=${SETTLE}s"
setup || {
    log "setup failed"
    exit 2
}

BASELINE="$TMPDIR/baseline.png"
log "capturing baseline screenshot"
screenshot "$BASELINE" || { log "baseline screenshot failed"; exit 1; }
[[ -s "$BASELINE" ]]  || { log "baseline screenshot empty"; exit 1; }

log "cycling orientation $CYCLES times"
for ((i=1; i<=CYCLES; i++)); do
    rotate_to_landscape
    sleep "$SETTLE"
    if ! is_running; then
        log "FAIL: app died after landscape rotation #$i"
        exit 1
    fi
    rotate_to_portrait
    sleep "$SETTLE"
    if ! is_running; then
        log "FAIL: app died after portrait rotation #$i"
        exit 1
    fi
    printf '.'
done
echo

FINAL="$TMPDIR/final.png"
log "capturing final screenshot"
screenshot "$FINAL" || { log "final screenshot failed"; exit 1; }
[[ -s "$FINAL" ]]   || { log "final screenshot empty"; exit 1; }

log "diffing baseline vs final (RMS threshold $RMS)"
if rms=$("$IMGDIFF" "$BASELINE" "$FINAL" --threshold="$RMS" 2>/dev/null); then
    log "PASS: app survived $CYCLES rotation cycles; rms=$rms ≤ $RMS"
    exit 0
else
    log "FAIL: final screenshot differs from baseline (rms=$rms > $RMS)"
    [[ $KEEP_TMP -eq 0 ]] && log "(rerun with --keep-tmp to inspect screenshots at $TMPDIR)"
    exit 1
fi
