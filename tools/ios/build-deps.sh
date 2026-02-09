#!/bin/bash
# Cross-compile Dawn, SDL3, and SDL3_image for iOS (device and/or simulator).
# Run once (or after updating the Dawn version).
#
# Usage: cd sq/tools/ios && bash build-deps.sh [--device|--simulator|--all]
#   --device      Build for iOS device only (default)
#   --simulator   Build for iOS Simulator only
#   --all         Build for both device and simulator

set -euo pipefail
cd "$(dirname "$0")"

VENDOR="$(pwd)/../../vendor"
BUILD="$(pwd)/build"
JOBS=$(sysctl -n hw.ncpu)

# Parse arguments
BUILD_DEVICE=false
BUILD_SIM=false
case "${1:-}" in
    --simulator) BUILD_SIM=true ;;
    --all)       BUILD_DEVICE=true; BUILD_SIM=true ;;
    *)           BUILD_DEVICE=true ;;  # default: device only
esac

# Dawn version — update this commit hash when upgrading Dawn
DAWN_COMMIT="4764cd21387f41d979d6bdd662d08ec0f8bf267b"
DAWN_REPO="https://dawn.googlesource.com/dawn"

# Dawn's bundled jinja2 is incompatible with Python 3.13+.
# Pin to the system Python which ships a working version.
PYTHON=$(/usr/bin/python3 -c 'import sys; print(sys.executable)')

# Common Dawn CMake flags
DAWN_FLAGS=(
    -DPython3_EXECUTABLE="$PYTHON"
    -DCMAKE_BUILD_TYPE=Release
    -DCMAKE_SYSTEM_NAME=iOS
    -DCMAKE_OSX_ARCHITECTURES=arm64
    -DCMAKE_OSX_DEPLOYMENT_TARGET=16.0
    -DDAWN_BUILD_MONOLITHIC_LIBRARY=STATIC
    -DDAWN_BUILD_SAMPLES=OFF
    -DDAWN_BUILD_TESTS=OFF
    -DDAWN_BUILD_PROTOBUF=OFF
    -DTINT_BUILD_IR_BINARY=OFF
    -DTINT_BUILD_TESTS=OFF
    -DDAWN_ENABLE_METAL=ON
    -DDAWN_ENABLE_NULL=OFF
    -DDAWN_ENABLE_DESKTOP_GL=OFF
    -DDAWN_ENABLE_OPENGLES=OFF
    -DDAWN_ENABLE_D3D11=OFF
    -DDAWN_ENABLE_D3D12=OFF
    -DDAWN_ENABLE_VULKAN=OFF
    -DDAWN_USE_GLFW=OFF
    -DTINT_BUILD_CMD_TOOLS=OFF
    -DTINT_BUILD_GLSL_VALIDATOR=OFF
)

# ── Dawn source ──────────────────────────────────────

DAWN_SRC="$BUILD/dawn-src"

if [ ! -d "$DAWN_SRC/.git" ]; then
    echo "==> Cloning Dawn..."
    git clone "$DAWN_REPO" "$DAWN_SRC"
fi

echo "==> Checking out Dawn $DAWN_COMMIT..."
git -C "$DAWN_SRC" fetch origin
git -C "$DAWN_SRC" checkout "$DAWN_COMMIT"

echo "==> Fetching Dawn dependencies..."
python3 "$DAWN_SRC/tools/fetch_dawn_dependencies.py"

# ── Helper: build Dawn for a given sysroot ───────────

build_dawn() {
    local SYSROOT="$1"   # iphoneos or iphonesimulator
    local SUFFIX="$2"    # "" or "-simulator"
    local DAWN_B="$BUILD/dawn${SUFFIX}"
    local DEST="$VENDOR/dawn/lib/ios-arm64${SUFFIX}"

    echo "==> Configuring Dawn for iOS arm64 ($SYSROOT)..."
    cmake -S "$DAWN_SRC" -B "$DAWN_B" \
        "${DAWN_FLAGS[@]}" \
        -DCMAKE_OSX_SYSROOT="$SYSROOT"

    echo "==> Building Dawn ($SYSROOT)..."
    cmake --build "$DAWN_B" -j"$JOBS"

    mkdir -p "$DEST"
    cp "$DAWN_B/src/dawn/libdawn_proc.a" "$DEST/"
    cp "$DAWN_B/src/dawn/native/libwebgpu_dawn.a" "$DEST/"
    cp "$DAWN_B/src/dawn/wire/libdawn_wire.a" "$DEST/"
    echo "==> Dawn ($SYSROOT) installed to $DEST"
}

# ── Helper: build SDL3 for a given sysroot ───────────

SDL_SRC="$VENDOR/github.com/libsdl-org/SDL"

build_sdl() {
    local SYSROOT="$1"   # iphoneos or iphonesimulator
    local SUFFIX="$2"    # "" or "-simulator"
    local SDL_B="$BUILD/sdl3${SUFFIX}"
    local SDL_PREFIX="$BUILD/sdl3-prefix${SUFFIX}"
    local DEST="$VENDOR/sdl3/lib/ios-arm64${SUFFIX}"

    if [ ! -e "$SDL_SRC/.git" ]; then
        echo "ERROR: SDL submodule not initialised. Run:"
        echo "  cd sq && git submodule update --init vendor/github.com/libsdl-org/SDL"
        exit 1
    fi

    echo "==> Configuring SDL3 for iOS arm64 ($SYSROOT)..."
    cmake -S "$SDL_SRC" -B "$SDL_B" \
        -DCMAKE_BUILD_TYPE=Release \
        -DCMAKE_SYSTEM_NAME=iOS \
        -DCMAKE_OSX_ARCHITECTURES=arm64 \
        -DCMAKE_OSX_DEPLOYMENT_TARGET=16.0 \
        -DCMAKE_OSX_SYSROOT="$SYSROOT" \
        -DCMAKE_INSTALL_PREFIX="$SDL_PREFIX" \
        -DSDL_SHARED=OFF \
        -DSDL_STATIC=ON

    echo "==> Building SDL3 ($SYSROOT)..."
    cmake --build "$SDL_B" -j"$JOBS"

    echo "==> Installing SDL3 to staging prefix..."
    cmake --install "$SDL_B"

    mkdir -p "$DEST"
    cp "$SDL_B/libSDL3.a" "$DEST/"
    echo "==> SDL3 ($SYSROOT) installed to $DEST"
}

# ── Helper: build SDL3_image for a given sysroot ─────

SDL_IMAGE_TAG="release-3.4.0"
SDL_IMAGE_REPO="https://github.com/libsdl-org/SDL_image.git"
SDL_IMAGE_SRC="$BUILD/sdl3_image-src"

build_sdl_image() {
    local SYSROOT="$1"   # iphoneos or iphonesimulator
    local SUFFIX="$2"    # "" or "-simulator"
    local IMG_B="$BUILD/sdl3_image${SUFFIX}"
    local DEST="$VENDOR/sdl3/lib/ios-arm64${SUFFIX}"
    local SDL_PREFIX="$BUILD/sdl3-prefix${SUFFIX}"

    if [ ! -d "$SDL_IMAGE_SRC/.git" ]; then
        echo "==> Cloning SDL3_image..."
        git clone --branch "$SDL_IMAGE_TAG" --depth 1 "$SDL_IMAGE_REPO" "$SDL_IMAGE_SRC"
    fi

    echo "==> Configuring SDL3_image for iOS arm64 ($SYSROOT)..."
    cmake -S "$SDL_IMAGE_SRC" -B "$IMG_B" \
        -DCMAKE_BUILD_TYPE=Release \
        -DCMAKE_SYSTEM_NAME=iOS \
        -DCMAKE_OSX_ARCHITECTURES=arm64 \
        -DCMAKE_OSX_DEPLOYMENT_TARGET=16.0 \
        -DCMAKE_OSX_SYSROOT="$SYSROOT" \
        -DBUILD_SHARED_LIBS=OFF \
        -DSDL3_DIR="$SDL_PREFIX/lib/cmake/SDL3"

    echo "==> Building SDL3_image ($SYSROOT)..."
    cmake --build "$IMG_B" -j"$JOBS"

    mkdir -p "$DEST"
    cp "$IMG_B/libSDL3_image.a" "$DEST/"

    # Install header alongside SDL3 headers
    local INC_DEST="$VENDOR/sdl3/include/SDL3_image"
    mkdir -p "$INC_DEST"
    cp "$SDL_IMAGE_SRC/include/SDL3_image/SDL_image.h" "$INC_DEST/"
    echo "==> SDL3_image ($SYSROOT) installed to $DEST"
}

# ── Build ────────────────────────────────────────────

if $BUILD_DEVICE; then
    build_dawn     "iphoneos" ""
    build_sdl      "iphoneos" ""
    build_sdl_image "iphoneos" ""
fi

if $BUILD_SIM; then
    build_dawn     "iphonesimulator" "-simulator"
    build_sdl      "iphonesimulator" "-simulator"
    build_sdl_image "iphonesimulator" "-simulator"
fi

echo ""
echo "Done. Libraries are in $VENDOR/dawn/lib/ and $VENDOR/sdl3/lib/"
