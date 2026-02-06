#!/bin/bash
# Cross-compile Dawn and SDL3 for iOS arm64.
# Run once (or after updating the Dawn version).
#
# Usage: cd sq/tools/ios && bash build-deps.sh

set -euo pipefail
cd "$(dirname "$0")"

VENDOR="$(pwd)/../../vendor"
BUILD="$(pwd)/build"
JOBS=$(sysctl -n hw.ncpu)

# Dawn version — update this commit hash when upgrading Dawn
DAWN_COMMIT="4764cd21387f41d979d6bdd662d08ec0f8bf267b"
DAWN_REPO="https://dawn.googlesource.com/dawn"

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

echo "==> Configuring Dawn for iOS arm64..."
cmake -S "$DAWN_SRC" -B "$DAWN_BUILD" \
    -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_SYSTEM_NAME=iOS \
    -DCMAKE_OSX_ARCHITECTURES=arm64 \
    -DCMAKE_OSX_DEPLOYMENT_TARGET=16.0 \
    -DDAWN_BUILD_MONOLITHIC_LIBRARY=STATIC \
    -DDAWN_BUILD_SAMPLES=OFF \
    -DDAWN_BUILD_TESTS=OFF \
    -DDAWN_BUILD_PROTOBUF=OFF \
    -DTINT_BUILD_IR_BINARY=OFF \
    -DTINT_BUILD_TESTS=OFF \
    -DDAWN_ENABLE_METAL=ON \
    -DDAWN_ENABLE_NULL=OFF \
    -DDAWN_ENABLE_DESKTOP_GL=OFF \
    -DDAWN_ENABLE_OPENGLES=OFF \
    -DDAWN_ENABLE_D3D11=OFF \
    -DDAWN_ENABLE_D3D12=OFF \
    -DDAWN_ENABLE_VULKAN=OFF \
    -DDAWN_USE_GLFW=OFF \
    -DTINT_BUILD_CMD_TOOLS=OFF \
    -DTINT_BUILD_GLSL_VALIDATOR=OFF

echo "==> Building Dawn (this takes a while)..."
cmake --build "$DAWN_BUILD" -j$JOBS

# ── Install Dawn libs to vendor ───────────────────────

DEST="$VENDOR/dawn/lib/ios-arm64"
mkdir -p "$DEST"
cp "$DAWN_BUILD/src/dawn/libdawn_proc.a" "$DEST/"
cp "$DAWN_BUILD/src/dawn/native/libwebgpu_dawn.a" "$DEST/"
cp "$DAWN_BUILD/src/dawn/wire/libdawn_wire.a" "$DEST/"

# ── SDL3 ──────────────────────────────────────────────

SDL_SRC="$VENDOR/github.com/libsdl-org/SDL"
SDL_BUILD="$BUILD/sdl3"

if [ ! -e "$SDL_SRC/.git" ]; then
    echo "ERROR: SDL submodule not initialised. Run:"
    echo "  cd sq && git submodule update --init vendor/github.com/libsdl-org/SDL"
    exit 1
fi

echo "==> Configuring SDL3 for iOS arm64..."
cmake -S "$SDL_SRC" -B "$SDL_BUILD" \
    -DCMAKE_BUILD_TYPE=Release \
    -DCMAKE_SYSTEM_NAME=iOS \
    -DCMAKE_OSX_ARCHITECTURES=arm64 \
    -DCMAKE_OSX_DEPLOYMENT_TARGET=16.0 \
    -DSDL_SHARED=OFF \
    -DSDL_STATIC=ON

echo "==> Building SDL3..."
cmake --build "$SDL_BUILD" -j$JOBS

echo ""
echo "Done. Libraries are in $BUILD/"
