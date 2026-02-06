#!/bin/bash
# Cross-compile Dawn and SDL3 for iOS arm64.
# Run once (or after updating submodules).
#
# Usage: cd sq/tools/ios && bash build-deps.sh

set -euo pipefail
cd "$(dirname "$0")"

VENDOR="$(pwd)/../../vendor"
BUILD="$(pwd)/build"
JOBS=$(sysctl -n hw.ncpu)

# ── Dawn ──────────────────────────────────────────────

DAWN_SRC="$VENDOR/github.com/google/dawn"
DAWN_BUILD="$BUILD/dawn"

if [ ! -e "$DAWN_SRC/.git" ]; then
    echo "ERROR: Dawn submodule not initialised. Run:"
    echo "  cd sq && git submodule update --init vendor/github.com/google/dawn"
    exit 1
fi

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
