#!/usr/bin/env bash
#
# Generate an Android direct-mode project for an ge game.
#
# Usage:
#   ge/tools/init-android.sh <package> <app-name>
#
# Example:
#   ge/tools/init-android.sh com.marcelocantos.mygame "My Game"
#
# Creates android/ at the project root with a complete Gradle project
# that builds a standalone APK (direct rendering via Vulkan/Dawn).

set -euo pipefail

if [ $# -lt 2 ]; then
    echo "Usage: $0 <package> <app-name>"
    echo "  package   — Java package / application ID (e.g. com.marcelocantos.mygame)"
    echo "  app-name  — display name shown on the device (e.g. \"My Game\")"
    exit 1
fi

PACKAGE="$1"
APP_NAME="$2"

# Derive names from app name (strip spaces for class/project names)
STRIPPED="$(echo "$APP_NAME" | tr -d ' ')"
ACTIVITY="${STRIPPED}Activity"
CMAKE_PROJECT="$STRIPPED"
# Java source directory: package dots → slashes
JAVA_DIR="$(echo "$PACKAGE" | tr '.' '/')"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMPLATE_DIR="$SCRIPT_DIR/android-template"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
OUT_DIR="$PROJECT_ROOT/android"

if [ -d "$OUT_DIR" ]; then
    echo "Error: android/ already exists. Remove it first to regenerate."
    exit 1
fi

echo "Generating Android project:"
echo "  Package:  $PACKAGE"
echo "  App name: $APP_NAME"
echo "  Activity: $PACKAGE.$ACTIVITY"
echo "  Output:   $OUT_DIR"
echo

# Copy static files
mkdir -p "$OUT_DIR"
cp -r "$TEMPLATE_DIR/gradle" "$OUT_DIR/"
cp "$TEMPLATE_DIR/gradlew" "$OUT_DIR/"
cp "$TEMPLATE_DIR/gradlew.bat" "$OUT_DIR/"
chmod +x "$OUT_DIR/gradlew"
cp "$TEMPLATE_DIR/build.gradle" "$OUT_DIR/"
cp "$TEMPLATE_DIR/settings.gradle" "$OUT_DIR/"
cp "$TEMPLATE_DIR/gradle.properties" "$OUT_DIR/"
cp "$TEMPLATE_DIR/.gitignore" "$OUT_DIR/"

# Generate templated files
subst() {
    sed -e "s|__PACKAGE__|$PACKAGE|g" \
        -e "s|__APP_NAME__|$APP_NAME|g" \
        -e "s|__ACTIVITY__|$ACTIVITY|g" \
        -e "s|__CMAKE_PROJECT__|$CMAKE_PROJECT|g" \
        "$1"
}

mkdir -p "$OUT_DIR/app"
subst "$TEMPLATE_DIR/app/build.gradle.in" > "$OUT_DIR/app/build.gradle"

mkdir -p "$OUT_DIR/app/src/main/cpp"
subst "$TEMPLATE_DIR/app/src/main/cpp/CMakeLists.txt.in" > "$OUT_DIR/app/src/main/cpp/CMakeLists.txt"

mkdir -p "$OUT_DIR/app/src/main"
subst "$TEMPLATE_DIR/app/src/main/AndroidManifest.xml.in" > "$OUT_DIR/app/src/main/AndroidManifest.xml"

mkdir -p "$OUT_DIR/app/src/main/res/values"
subst "$TEMPLATE_DIR/app/src/main/res/values/strings.xml.in" > "$OUT_DIR/app/src/main/res/values/strings.xml"

mkdir -p "$OUT_DIR/app/src/main/java/$JAVA_DIR"
subst "$TEMPLATE_DIR/app/src/main/java/Activity.java.in" > "$OUT_DIR/app/src/main/java/$JAVA_DIR/$ACTIVITY.java"

# Auto-detect Android SDK
if [ -d "$HOME/Library/Android/sdk" ]; then
    echo "sdk.dir=$HOME/Library/Android/sdk" > "$OUT_DIR/local.properties"
elif [ -n "${ANDROID_HOME:-}" ]; then
    echo "sdk.dir=$ANDROID_HOME" > "$OUT_DIR/local.properties"
fi

echo "Done. Build with:"
echo "  cd android && ./gradlew assembleDebug"
