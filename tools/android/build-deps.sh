#!/bin/bash
# Cross-compile Dawn for Android arm64-v8a.
# Run once (or after updating the Dawn version).
#
# Usage: cd sq/tools/android && bash build-deps.sh
#
# Prerequisites:
#   - Android NDK (via Android Studio SDK Manager or standalone)
#   - Set ANDROID_NDK_ROOT, or the script auto-detects from ~/Library/Android/sdk

set -euo pipefail
cd "$(dirname "$0")"

VENDOR="$(pwd)/../../vendor"
BUILD="$(pwd)/build"

# Dawn version — update this commit hash when upgrading Dawn
DAWN_COMMIT="4764cd21387f41d979d6bdd662d08ec0f8bf267b"
DAWN_REPO="https://dawn.googlesource.com/dawn"

# Detect CPU count (macOS or Linux)
if command -v sysctl &>/dev/null; then
    JOBS=$(sysctl -n hw.ncpu)
else
    JOBS=$(nproc)
fi

# ── Locate NDK ───────────────────────────────────────

if [ -z "${ANDROID_NDK_ROOT:-}" ]; then
    # Auto-detect from Android Studio SDK installation
    SDK_ROOT="${ANDROID_HOME:-${HOME}/Library/Android/sdk}"
    NDK_DIR="$SDK_ROOT/ndk"
    if [ -d "$NDK_DIR" ]; then
        # Pick the latest installed NDK version
        ANDROID_NDK_ROOT=$(ls -d "$NDK_DIR"/*/ 2>/dev/null | sort -V | tail -1)
        ANDROID_NDK_ROOT="${ANDROID_NDK_ROOT%/}"
    fi
fi

if [ -z "${ANDROID_NDK_ROOT:-}" ] || [ ! -d "$ANDROID_NDK_ROOT" ]; then
    echo "ERROR: Android NDK not found."
    echo "  Set ANDROID_NDK_ROOT or install via Android Studio SDK Manager."
    exit 1
fi

echo "Using NDK: $ANDROID_NDK_ROOT"

# ── Dawn ──────────────────────────────────────────────

DAWN_SRC="$BUILD/dawn-src"
DAWN_BUILD="$BUILD/dawn"

if [ ! -d "$DAWN_SRC/.git" ]; then
    echo "==> Cloning Dawn..."
    git clone "$DAWN_REPO" "$DAWN_SRC"
fi

echo "==> Checking out Dawn $DAWN_COMMIT..."
git -C "$DAWN_SRC" fetch origin
git -C "$DAWN_SRC" checkout "$DAWN_COMMIT"

echo "==> Fetching Dawn dependencies..."
python3 "$DAWN_SRC/tools/fetch_dawn_dependencies.py"

echo "==> Configuring Dawn for Android arm64-v8a..."
cmake -S "$DAWN_SRC" -B "$DAWN_BUILD" \
    -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_TOOLCHAIN_FILE="$ANDROID_NDK_ROOT/build/cmake/android.toolchain.cmake" \
    -DANDROID_ABI=arm64-v8a \
    -DANDROID_PLATFORM=android-26 \
    -DDAWN_BUILD_MONOLITHIC_LIBRARY=STATIC \
    -DDAWN_BUILD_SAMPLES=OFF \
    -DDAWN_BUILD_TESTS=OFF \
    -DDAWN_BUILD_PROTOBUF=OFF \
    -DTINT_BUILD_IR_BINARY=OFF \
    -DTINT_BUILD_TESTS=OFF \
    -DDAWN_ENABLE_VULKAN=ON \
    -DDAWN_ENABLE_METAL=OFF \
    -DDAWN_ENABLE_NULL=OFF \
    -DDAWN_ENABLE_DESKTOP_GL=OFF \
    -DDAWN_ENABLE_OPENGLES=OFF \
    -DDAWN_ENABLE_D3D11=OFF \
    -DDAWN_ENABLE_D3D12=OFF \
    -DDAWN_USE_GLFW=OFF \
    -DTINT_BUILD_CMD_TOOLS=OFF \
    -DTINT_BUILD_GLSL_VALIDATOR=OFF

echo "==> Building Dawn (this takes a while)..."
cmake --build "$DAWN_BUILD" -j$JOBS

# ── Install libs to vendor ────────────────────────────

DEST="$VENDOR/dawn/lib/android-arm64"
mkdir -p "$DEST"
cp "$DAWN_BUILD/src/dawn/libdawn_proc.a" "$DEST/"
cp "$DAWN_BUILD/src/dawn/native/libwebgpu_dawn.a" "$DEST/"
cp "$DAWN_BUILD/src/dawn/wire/libdawn_wire.a" "$DEST/"

echo ""
echo "Done. Libraries installed to $DEST/"
