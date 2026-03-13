#!/usr/bin/env bash
#
# Smoke test for ge mobile/desktop deployments.
#
# Verifies that the full stack is healthy before asking a human to check
# visual output. Designed to be called by Claude Code after building and
# deploying to a device/simulator.
#
# Usage:
#   ge/tools/smoke-test.sh --platform <platform> [options]
#
# Platforms:
#   ios-sim        iOS Simulator
#   ios-device     Physical iOS device
#   android-emu    Android emulator
#   android-device Physical Android device
#   desktop        Desktop player (macOS)
#
# Options:
#   --device <id>       Target device. Meaning varies by platform:
#                         ios-sim:  "phone" or "tablet" (picks latest booted sim
#                                   of that form factor). Omit to use any sole
#                                   booted sim.
#                         ios-device: device name or UDID (substring match,
#                                   case-insensitive). Omit for sole connected device.
#                         android:  serial or model substring. Omit for sole device.
#   --install <path>    Build artifact to deploy before testing. This ensures the
#                       device runs the latest build (terminate → install → launch).
#                         ios-sim:     path to .app bundle
#                         ios-device:  path to .app bundle (uses devicectl)
#                         android:     path to .apk file
#                       Without --install, the script only checks passively.
#   --bundle-id <id>    iOS bundle identifier (default: com.squz.yourworld2)
#   --package <pkg>     Android package name (default: com.squz.player)
#   --ged-port <port>   ged daemon port (default: 42069)
#   --timeout <secs>    Max seconds to wait for player connection (default: 15)
#   --server-pid <pid>  Game server PID to verify is running
#
# Exit codes:
#   0  All checks passed
#   1  One or more checks failed (details in output)

set -euo pipefail

# Defaults
PLATFORM=""
BUNDLE_ID="com.squz.yourworld2"
PACKAGE="com.squz.player"
GED_PORT=42069
TIMEOUT=15
SERVER_PID=""
DEVICE=""
INSTALL=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --platform)    PLATFORM="$2"; shift 2 ;;
        --bundle-id)   BUNDLE_ID="$2"; shift 2 ;;
        --package)     PACKAGE="$2"; shift 2 ;;
        --ged-port)    GED_PORT="$2"; shift 2 ;;
        --timeout)     TIMEOUT="$2"; shift 2 ;;
        --server-pid)  SERVER_PID="$2"; shift 2 ;;
        --device)      DEVICE="$2"; shift 2 ;;
        --install)     INSTALL="$2"; shift 2 ;;
        -h|--help)
            sed -n '2,/^$/{ s/^# \{0,1\}//; p; }' "$0"
            exit 0
            ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

if [[ -z "$PLATFORM" ]]; then
    echo "Error: --platform is required"
    echo "Run with --help for usage"
    exit 1
fi

# ── Output helpers ──────────────────────────────────────────────────

PASS=0
FAIL=0
WARN=0

pass() { echo "  PASS  $1"; PASS=$((PASS + 1)); }
fail() { echo "  FAIL  $1"; FAIL=$((FAIL + 1)); }
warn() { echo "  WARN  $1"; WARN=$((WARN + 1)); }
info() { echo "  ....  $1"; }

# ── Check: ged reachable ────────────────────────────────────────────

check_ged() {
    echo "── ged daemon (port $GED_PORT) ──"

    # Is anything listening on the port?
    if ! lsof -iTCP:"$GED_PORT" -sTCP:LISTEN -P -n >/dev/null 2>&1; then
        fail "Nothing listening on port $GED_PORT — is ged running?"
        return
    fi
    pass "Port $GED_PORT is listening"

    # Query the info API
    local response
    if ! response=$(curl -sf --max-time 3 "http://localhost:$GED_PORT/api/info" 2>/dev/null); then
        fail "ged /api/info unreachable (curl failed)"
        return
    fi
    pass "ged /api/info responded"

    # Parse response
    local connected sessions
    connected=$(echo "$response" | jq -r '.connected // false')
    sessions=$(echo "$response" | jq -r '.sessions // 0')

    if [[ "$connected" == "true" ]]; then
        pass "Game server connected to ged"
    else
        fail "No game server connected to ged"
    fi

    info "Active sessions: $sessions"
    echo "$response" | jq -r '
        .servers // [] | to_entries[] |
        "  ....  Server: \(.value.name // "unknown") (pid \(.value.pid // "?"), sessions: \(.value.sessions // 0))"
    ' 2>/dev/null || true
}

# ── Check: game server process ──────────────────────────────────────

check_server() {
    echo "── Game server ──"

    if [[ -n "$SERVER_PID" ]]; then
        if kill -0 "$SERVER_PID" 2>/dev/null; then
            pass "Server process $SERVER_PID is running"
        else
            fail "Server process $SERVER_PID is not running"
        fi
    else
        info "No --server-pid given, skipping process check"
    fi
}

# ── iOS Simulator ───────────────────────────────────────────────────

# Resolve --device for ios-sim. Sets SIM_UDID.
#   "phone"  → latest booted iPhone sim
#   "tablet" → latest booted iPad sim
#   (empty)  → any sole booted sim (error if multiple)
# Returns: 0=found, 1=not found, 2=ambiguous (multiple)
resolve_sim_device() {
    SIM_UDID=""

    # Validate --device value early
    if [[ -n "$DEVICE" ]]; then
        case "${DEVICE,,}" in
            phone|tablet) ;;
            *)
                fail "--device for ios-sim must be 'phone' or 'tablet', got '$DEVICE'"
                return 1
                ;;
        esac
    fi

    local all_booted
    all_booted=$(xcrun simctl list devices booted -j 2>/dev/null) || return 1

    local booted_json
    booted_json=$(echo "$all_booted" | jq -c '[
        [to_entries[] | .key as $runtime | .value[] | select(.state == "Booted") | . + {runtime: $runtime}]
        | sort_by(.runtime) | reverse | .[]
    ] ' <<< "$(echo "$all_booted" | jq '.devices')")

    local count
    count=$(echo "$booted_json" | jq 'length')
    if [[ "$count" -eq 0 ]]; then
        return 1
    fi

    case "${DEVICE,,}" in
        phone)
            # Latest booted iPhone simulator
            local match
            match=$(echo "$booted_json" | jq -r '[.[] | select(.name | test("iPhone"; "i"))][0] // empty')
            if [[ -n "$match" && "$match" != "null" ]]; then
                SIM_UDID=$(echo "$match" | jq -r '.udid')
                local name
                name=$(echo "$match" | jq -r '.name')
                info "$name ($SIM_UDID)"
                return 0
            fi
            # No booted iPhone — list what's booted
            info "No booted iPhone simulator found. Booted simulators:"
            echo "$booted_json" | jq -r '.[] | "  ....  \(.name) (\(.udid))"'
            return 1
            ;;
        tablet)
            # Latest booted iPad simulator
            local match
            match=$(echo "$booted_json" | jq -r '[.[] | select(.name | test("iPad"; "i"))][0] // empty')
            if [[ -n "$match" && "$match" != "null" ]]; then
                SIM_UDID=$(echo "$match" | jq -r '.udid')
                local name
                name=$(echo "$match" | jq -r '.name')
                info "$name ($SIM_UDID)"
                return 0
            fi
            # No booted iPad — list what's booted
            info "No booted iPad simulator found. Booted simulators:"
            echo "$booted_json" | jq -r '.[] | "  ....  \(.name) (\(.udid))"'
            return 1
            ;;
        "")
            # No preference — require exactly one booted sim
            if [[ "$count" -gt 1 ]]; then
                echo "$booted_json" | jq -r '.[] | "  ....  \(.name) (\(.udid))"'
                return 2
            fi
            SIM_UDID="booted"
            echo "$booted_json" | jq -r '.[] | "  ....  \(.name) (\(.udid))"'
            return 0
            ;;
    esac
}

check_device_ios_sim() {
    echo "── iOS Simulator ──"

    local fail_before=$FAIL
    local rc=0
    resolve_sim_device || rc=$?
    if [[ $rc -eq 0 ]]; then
        if [[ -n "$DEVICE" ]]; then
            pass "Booted ${DEVICE} simulator found ($SIM_UDID)"
        else
            pass "Simulator booted"
        fi
    elif [[ $rc -eq 2 ]]; then
        fail "Multiple simulators booted — specify --device phone or --device tablet:"
    elif [[ $FAIL -eq $fail_before ]]; then
        # resolve_sim_device didn't call fail() itself
        if [[ -n "$DEVICE" ]]; then
            fail "No booted ${DEVICE} simulator found"
        else
            fail "No iOS Simulator is booted"
        fi
    fi
}

# ── iOS Physical Device ─────────────────────────────────────────────

# List all registered physical iOS devices via devicectl.
# Output: JSON array of {name, udid, model, state} objects.
list_physical_devices() {
    local tmpfile
    tmpfile=$(mktemp)
    trap "rm -f '$tmpfile'" RETURN

    xcrun devicectl list devices -j "$tmpfile" >/dev/null 2>&1 || return 1

    jq -r '[.result.devices[] | {
        name:  .deviceProperties.name,
        udid:  .identifier,
        model: .hardwareProperties.marketingName,
        state: .connectionProperties.tunnelState
    }]' "$tmpfile"
}

# Print a device list (JSON array) with connection state annotations.
print_device_list() {
    local devices_json="$1"
    echo "$devices_json" | jq -r '.[] |
        if .state == "connected" then
            "  ....  \(.name) — \(.model) (\(.udid)) [connected]"
        else
            "  ....  \(.name) — \(.model) (\(.udid)) [disconnected]"
        end
    '
}

# Resolve --device for ios-device. Sets IOS_DEVICE_UDID.
# Returns: 0=found+connected, 1=not found or not connected, 2=ambiguous
resolve_ios_device() {
    IOS_DEVICE_UDID=""

    local devices_json
    devices_json=$(list_physical_devices) || {
        info "(devicectl unavailable — is Xcode installed?)"
        return 1
    }

    local total
    total=$(echo "$devices_json" | jq 'length')
    if [[ "$total" -eq 0 ]]; then
        info "(no physical iOS devices registered)"
        return 1
    fi

    local connected_json
    connected_json=$(echo "$devices_json" | jq '[.[] | select(.state == "connected")]')
    local connected_count
    connected_count=$(echo "$connected_json" | jq 'length')

    if [[ -z "$DEVICE" ]]; then
        # No preference — list all devices, require exactly one connected
        print_device_list "$devices_json"
        if [[ "$connected_count" -eq 0 ]]; then
            return 1
        elif [[ "$connected_count" -gt 1 ]]; then
            return 2
        fi
        IOS_DEVICE_UDID=$(echo "$connected_json" | jq -r '.[0].udid')
        return 0
    fi

    # Match by name or UDID substring (case-insensitive) among ALL registered devices
    local match
    match=$(echo "$devices_json" | jq -r --arg d "$DEVICE" '
        [.[] | select(
            (.name | test($d; "i")) or
            (.udid | test($d; "i"))
        )][0] // empty
    ')

    if [[ -z "$match" || "$match" == "null" ]]; then
        # Not found — list all registered devices
        print_device_list "$devices_json"
        return 1
    fi

    local name state udid model
    name=$(echo "$match" | jq -r '.name')
    state=$(echo "$match" | jq -r '.state')
    udid=$(echo "$match" | jq -r '.udid')
    model=$(echo "$match" | jq -r '.model')

    if [[ "$state" == "connected" ]]; then
        info "$name — $model ($udid) [connected]"
        IOS_DEVICE_UDID="$udid"
        return 0
    else
        # Found but not connected — show the target and full list
        info "$name — $model ($udid) [disconnected]"
        info ""
        info "All registered devices:"
        print_device_list "$devices_json"
        return 1
    fi
}

check_device_ios_device() {
    echo "── iOS Device ──"

    local rc=0
    resolve_ios_device || rc=$?
    if [[ $rc -eq 0 ]]; then
        if [[ -n "$DEVICE" ]]; then
            pass "iOS device '$DEVICE' connected"
        else
            pass "iOS device connected"
        fi
    elif [[ $rc -eq 2 ]]; then
        fail "Multiple iOS devices connected — specify one with --device <name>:"
    elif [[ -n "$DEVICE" ]]; then
        fail "iOS device '$DEVICE' not connected"
    else
        fail "No iOS device connected"
    fi
}

# Deploy and verify on iOS physical device: terminate → install → launch → verify.
check_app_ios_device() {
    echo "── App ($BUNDLE_ID) on device ──"

    local device_id="${IOS_DEVICE_UDID:-}"
    if [[ -z "$device_id" ]]; then
        fail "No device resolved — cannot check app"
        return
    fi

    if [[ -n "$INSTALL" ]]; then
        if [[ ! -d "$INSTALL" ]]; then
            fail "Build artifact not found: $INSTALL"
            return
        fi

        # Terminate old instance (need PID first)
        info "Looking for running instance..."
        local tmpfile
        tmpfile=$(mktemp)
        if xcrun devicectl device info processes -d "$device_id" -j "$tmpfile" --quiet 2>/dev/null; then
            local old_pid
            old_pid=$(jq -r --arg b "$BUNDLE_ID" '
                [.result.runningProcesses[] | select(.bundleIdentifier == $b)][0].processIdentifier // empty
            ' "$tmpfile" 2>/dev/null || true)
            rm -f "$tmpfile"
            if [[ -n "$old_pid" ]]; then
                info "Terminating pid $old_pid..."
                xcrun devicectl device process terminate -d "$device_id" --pid "$old_pid" --quiet 2>/dev/null || true
                sleep 0.5
            else
                info "No running instance found"
            fi
        else
            rm -f "$tmpfile"
        fi

        info "Installing $INSTALL..."
        if ! xcrun devicectl device install app -d "$device_id" "$INSTALL" --quiet 2>&1; then
            fail "devicectl install failed"
            return
        fi
        pass "App installed from $INSTALL"

        info "Launching $BUNDLE_ID..."
        local launch_tmp
        launch_tmp=$(mktemp)
        if ! xcrun devicectl device process launch -d "$device_id" "$BUNDLE_ID" -j "$launch_tmp" --quiet 2>&1; then
            rm -f "$launch_tmp"
            fail "devicectl launch failed"
            return
        fi
        local new_pid
        new_pid=$(jq -r '.result.process.processIdentifier // empty' "$launch_tmp" 2>/dev/null || true)
        rm -f "$launch_tmp"
        if [[ -n "$new_pid" ]]; then
            pass "App launched (pid $new_pid)"
        else
            pass "App launched"
        fi
        return
    fi

    # Passive check: is the app running?
    local tmpfile
    tmpfile=$(mktemp)
    if xcrun devicectl device info processes -d "$device_id" -j "$tmpfile" --quiet 2>/dev/null; then
        local pid
        pid=$(jq -r --arg b "$BUNDLE_ID" '
            [.result.runningProcesses[] | select(.bundleIdentifier == $b)][0].processIdentifier // empty
        ' "$tmpfile" 2>/dev/null || true)
        rm -f "$tmpfile"
        if [[ -n "$pid" ]]; then
            pass "App is running (pid $pid)"
        else
            fail "App is not running on device"
        fi
    else
        rm -f "$tmpfile"
        warn "Could not query device processes"
    fi
}

# ── Android ─────────────────────────────────────────────────────────

# Resolve DEVICE to an Android serial. Sets ADB_SERIAL.
resolve_android_device() {
    ADB_SERIAL=""

    if [[ -z "$DEVICE" ]]; then
        local count
        count=$(adb devices 2>/dev/null | grep -c "device$" || true)
        if [[ "$count" -eq 0 ]]; then
            return 1
        fi
        adb devices -l 2>/dev/null | grep "device " | while read -r line; do
            info "$line"
        done
        if [[ "$count" -gt 1 ]]; then
            return 2  # multiple devices
        fi
        ADB_SERIAL=$(adb devices 2>/dev/null | grep "device$" | awk '{print $1}')
        return 0
    fi

    # Match by serial or model substring
    local match_line
    match_line=$(adb devices -l 2>/dev/null | grep "device " | grep -i "$DEVICE" | head -1) || true
    if [[ -n "$match_line" ]]; then
        ADB_SERIAL=$(echo "$match_line" | awk '{print $1}')
        info "$match_line"
        return 0
    fi

    # Not found — list what is available
    local available
    available=$(adb devices -l 2>/dev/null | grep "device " || true)
    if [[ -n "$available" ]]; then
        echo "$available" | while read -r line; do
            info "$line"
        done
    else
        info "(no Android devices connected)"
    fi
    return 1
}

check_device_android() {
    echo "── Android ($PLATFORM) ──"

    if ! command -v adb &>/dev/null; then
        fail "adb not found in PATH"
        return
    fi

    local rc=0
    resolve_android_device || rc=$?
    if [[ $rc -eq 0 ]]; then
        if [[ -n "$DEVICE" ]]; then
            pass "Android device '$DEVICE' connected"
        else
            pass "Android device connected"
        fi
    elif [[ $rc -eq 2 ]]; then
        fail "Multiple Android devices connected — specify one with --device <serial>:"
    elif [[ -n "$DEVICE" ]]; then
        fail "Android device '$DEVICE' not found — available devices:"
    else
        fail "No Android device/emulator connected"
    fi
}

# ── Check: app installed and running ────────────────────────────────

# Deploy and verify on iOS Simulator: terminate → install → launch → verify PID.
# Without --install, passively checks installation and freshness.
check_app_ios_sim() {
    echo "── App ($BUNDLE_ID) on Simulator ──"

    local target="${SIM_UDID:-booted}"

    if [[ -n "$INSTALL" ]]; then
        # Active deploy: terminate → install → launch
        if [[ ! -d "$INSTALL" ]]; then
            fail "Build artifact not found: $INSTALL"
            return
        fi

        info "Terminating old instance..."
        xcrun simctl terminate "$target" "$BUNDLE_ID" 2>/dev/null || true
        sleep 0.5

        info "Installing $INSTALL..."
        if ! xcrun simctl install "$target" "$INSTALL" 2>&1; then
            fail "simctl install failed"
            return
        fi
        pass "App installed from $INSTALL"

        info "Launching..."
        local launch_output
        if ! launch_output=$(xcrun simctl launch "$target" "$BUNDLE_ID" 2>&1); then
            fail "simctl launch failed: $launch_output"
            return
        fi
        # launch output is like "com.foo.bar: 12345"
        local launched_pid
        launched_pid=$(echo "$launch_output" | grep -oE '[0-9]+$' || true)
        if [[ -n "$launched_pid" ]]; then
            pass "App launched (pid $launched_pid)"
        else
            pass "App launched"
        fi
        return
    fi

    # Passive check: is the app installed and is it the latest build?
    local container
    container=$(xcrun simctl get_app_container "$target" "$BUNDLE_ID" 2>/dev/null) || {
        fail "App not installed on simulator ($target)"
        return
    }
    pass "App is installed"

    # Check if the app process is running
    if xcrun simctl spawn "$target" launchctl list 2>/dev/null | grep -qi "$BUNDLE_ID"; then
        pass "App appears to be running"
    else
        warn "Could not confirm app is running (may need manual launch)"
        return
    fi

    # Freshness check: compare installed binary mtime against build product
    # Find the executable name from the .app bundle's Info.plist
    local exec_name
    exec_name=$(defaults read "$container/Info" CFBundleExecutable 2>/dev/null || true)
    if [[ -z "$exec_name" ]]; then
        info "Could not determine executable name — skipping freshness check"
        return
    fi

    local installed_bin="$container/$exec_name"
    if [[ ! -f "$installed_bin" ]]; then
        info "Installed binary not found at $installed_bin — skipping freshness check"
        return
    fi

    # Check process start time vs binary mtime
    local bin_mtime
    bin_mtime=$(stat -f %m "$installed_bin" 2>/dev/null || true)
    local proc_pid
    proc_pid=$(xcrun simctl spawn "$target" launchctl list 2>/dev/null \
        | grep -i "$BUNDLE_ID" | awk '{print $1}' || true)

    if [[ -n "$proc_pid" && "$proc_pid" != "-" && -n "$bin_mtime" ]]; then
        # Get process start time (elapsed seconds via ps)
        local proc_start
        proc_start=$(xcrun simctl spawn "$target" ps -p "$proc_pid" -o lstart= 2>/dev/null || true)
        if [[ -n "$proc_start" ]]; then
            local proc_epoch
            proc_epoch=$(date -j -f "%a %b %d %T %Y" "$proc_start" +%s 2>/dev/null || true)
            if [[ -n "$proc_epoch" && "$proc_epoch" -lt "$bin_mtime" ]]; then
                fail "Running process (pid $proc_pid) started before the installed binary was updated — restart needed"
                return
            fi
        fi
    fi
}

check_app_android() {
    echo "── App ($PACKAGE) on Android ──"

    local adb_cmd="adb"
    [[ -n "${ADB_SERIAL:-}" ]] && adb_cmd="adb -s $ADB_SERIAL"

    if [[ -n "$INSTALL" ]]; then
        # Active deploy: force-stop → install → launch
        if [[ ! -f "$INSTALL" ]]; then
            fail "Build artifact not found: $INSTALL"
            return
        fi

        info "Stopping old instance..."
        $adb_cmd shell am force-stop "$PACKAGE" 2>/dev/null || true

        info "Installing $INSTALL..."
        if ! $adb_cmd install -r "$INSTALL" 2>&1; then
            fail "adb install failed"
            return
        fi
        pass "App installed from $INSTALL"

        # Derive activity name: last segment of package, capitalised, + "Activity"
        # Default to GeActivity for ge player
        local activity="${PACKAGE}/.GeActivity"
        info "Launching $activity..."
        if ! $adb_cmd shell am start -n "$activity" 2>&1; then
            fail "adb am start failed"
            return
        fi

        sleep 1
        local pid
        pid=$($adb_cmd shell pidof "$PACKAGE" 2>/dev/null || true)
        if [[ -n "$pid" ]]; then
            pass "App launched (pid $pid)"
        else
            fail "App did not start after install"
        fi
        return
    fi

    # Passive check
    if $adb_cmd shell pm list packages 2>/dev/null | grep -q "$PACKAGE"; then
        pass "App is installed"
    else
        fail "App ($PACKAGE) not installed"
        return
    fi

    local pid
    pid=$($adb_cmd shell pidof "$PACKAGE" 2>/dev/null || true)
    if [[ -n "$pid" ]]; then
        pass "App is running (pid $pid)"
    else
        fail "App is not running"
    fi
}

# ── Check: player connection (wait with timeout) ───────────────────

check_player_connection() {
    echo "── Player connection ──"

    local elapsed=0
    local interval=2

    while [[ $elapsed -lt $TIMEOUT ]]; do
        local response
        response=$(curl -sf --max-time 2 "http://localhost:$GED_PORT/api/info" 2>/dev/null) || {
            sleep "$interval"
            elapsed=$((elapsed + interval))
            continue
        }

        local sessions
        sessions=$(echo "$response" | jq -r '.sessions // 0')

        if [[ "$sessions" -gt 0 ]]; then
            pass "Player connected ($sessions active session(s))"
            return
        fi

        sleep "$interval"
        elapsed=$((elapsed + interval))
    done

    fail "No player connected after ${TIMEOUT}s — check player logs"
}

# ── Check: player-side logs for errors ──────────────────────────────

check_player_logs() {
    echo "── Player logs (recent errors) ──"

    case "$PLATFORM" in
        android-emu|android-device)
            local adb_cmd="adb"
            [[ -n "${ADB_SERIAL:-}" ]] && adb_cmd="adb -s $ADB_SERIAL"
            local errors
            errors=$($adb_cmd logcat -s "GePlayer" -d -v brief 2>/dev/null | grep -i "error\|fatal\|crash" | tail -5)
            if [[ -n "$errors" ]]; then
                fail "Errors in player logcat:"
                echo "$errors" | while read -r line; do
                    info "  $line"
                done
            else
                pass "No recent errors in player logcat"
            fi
            ;;
        ios-sim)
            # Check for crash reports
            local crash_dir="$HOME/Library/Logs/DiagnosticReports"
            local app_name
            app_name=$(echo "$BUNDLE_ID" | awk -F. '{print $NF}')
            local recent_crashes
            recent_crashes=$(find "$crash_dir" -name "${app_name}*" -mmin -5 2>/dev/null | head -3)
            if [[ -n "$recent_crashes" ]]; then
                fail "Recent crash report(s) found:"
                echo "$recent_crashes" | while read -r f; do
                    info "  $f"
                done
            else
                pass "No recent crash reports"
            fi
            ;;
        ios-device)
            # Check for crash reports (same dir, device crashes sync here)
            local crash_dir="$HOME/Library/Logs/DiagnosticReports"
            local app_name
            app_name=$(echo "$BUNDLE_ID" | awk -F. '{print $NF}')
            local recent_crashes
            recent_crashes=$(find "$crash_dir" -name "${app_name}*" -mmin -5 2>/dev/null | head -3)
            if [[ -n "$recent_crashes" ]]; then
                fail "Recent crash report(s) found:"
                echo "$recent_crashes" | while read -r f; do
                    info "  $f"
                done
            else
                pass "No recent crash reports"
            fi
            ;;
        desktop)
            info "Desktop player logs go to stderr — check the terminal"
            ;;
        *)
            info "Log checking not implemented for $PLATFORM"
            ;;
    esac
}

# ── Run checks ──────────────────────────────────────────────────────

echo "ge smoke test — platform: $PLATFORM${DEVICE:+, device: $DEVICE}"
echo

check_ged
check_server

case "$PLATFORM" in
    ios-sim)
        check_device_ios_sim
        check_app_ios_sim
        ;;
    ios-device)
        check_device_ios_device
        check_app_ios_device
        ;;
    android-emu|android-device)
        check_device_android
        check_app_android
        ;;
    desktop)
        info "Desktop player — no device checks needed"
        ;;
    *)
        fail "Unknown platform: $PLATFORM"
        ;;
esac

check_player_connection
check_player_logs

# ── Summary ─────────────────────────────────────────────────────────

echo
echo "── Summary ──"
echo "  $PASS passed, $FAIL failed, $WARN warnings"

if [[ $FAIL -gt 0 ]]; then
    echo
    echo "Fix the failures above before asking the user about visual output."
    exit 1
fi

if [[ $WARN -gt 0 ]]; then
    echo
    echo "Warnings present — investigate if visual output is unexpected."
fi

echo
echo "All critical checks passed. If visual verification is still needed,"
echo "ask the user what they see — but state what you already verified."
exit 0
