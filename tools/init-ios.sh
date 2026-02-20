#!/usr/bin/env bash
#
# Generate an iOS direct-mode project for an ge game.
#
# Usage:
#   ge/tools/init-ios.sh <bundle-id> <app-name> [dev-team]
#
# Example:
#   ge/tools/init-ios.sh com.squz.mygame "My Game" SWA3H3N7TW
#
# Creates ios/ at the project root with CMakeLists.txt and Info.plist.
# Generate the Xcode project with: make ios

set -euo pipefail

if [ $# -lt 2 ]; then
    echo "Usage: $0 <bundle-id> <app-name>"
    echo "  bundle-id — iOS bundle identifier (e.g. com.squz.mygame)"
    echo "  app-name  — display name shown on the device (e.g. \"My Game\")"
    exit 1
fi

BUNDLE_ID="$1"
APP_NAME="$2"
DEVELOPMENT_TEAM="${3:-}"

# CMake project name: app name with spaces stripped
CMAKE_PROJECT="$(echo "$APP_NAME" | tr -d ' ')"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMPLATE_DIR="$SCRIPT_DIR/ios-template"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
OUT_DIR="$PROJECT_ROOT/ios"

if [ -d "$OUT_DIR" ]; then
    echo "Error: ios/ already exists. Remove it first to regenerate."
    exit 1
fi

echo "Generating iOS project:"
echo "  Bundle ID: $BUNDLE_ID"
echo "  App name:  $APP_NAME"
echo "  Target:    $CMAKE_PROJECT"
echo "  Output:    $OUT_DIR"
echo

mkdir -p "$OUT_DIR"

subst() {
    sed -e "s|__BUNDLE_ID__|$BUNDLE_ID|g" \
        -e "s|__APP_NAME__|$APP_NAME|g" \
        -e "s|__CMAKE_PROJECT__|$CMAKE_PROJECT|g" \
        -e "s|__DEVELOPMENT_TEAM__|$DEVELOPMENT_TEAM|g" \
        "$1"
}

subst "$TEMPLATE_DIR/CMakeLists.txt.in" > "$OUT_DIR/CMakeLists.txt"
subst "$TEMPLATE_DIR/Info.plist.in" > "$OUT_DIR/Info.plist"

echo "Done. Generate Xcode project with:"
echo "  make ios"
