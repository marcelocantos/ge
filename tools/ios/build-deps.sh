#!/bin/bash
# Cross-compile Dawn, SDL3, SDL3_image, and SDL3_ttf for iOS (device and/or simulator).
# When both device and simulator are built, creates xcframeworks.
# Run once (or after updating library versions).
#
# Usage: cd sq/tools/ios && bash build-deps.sh [--device|--simulator|--all]
#   --device      Build for iOS device only (default)
#   --simulator   Build for iOS Simulator only
#   --all         Build for both device and simulator (creates xcframeworks)

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

# ── Library versions ─────────────────────────────
# Keep in sync with macos/build-deps.sh and android/build-deps.sh

DAWN_COMMIT="4764cd21387f41d979d6bdd662d08ec0f8bf267b"
DAWN_REPO="https://dawn.googlesource.com/dawn"

SDL_IMAGE_TAG="release-3.4.0"
SDL_IMAGE_REPO="https://github.com/libsdl-org/SDL_image.git"

SDL_TTF_TAG="release-3.2.2"
SDL_TTF_REPO="https://github.com/libsdl-org/SDL_ttf.git"

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

# Common iOS CMake flags (non-Dawn)
IOS_FLAGS=(
    -DCMAKE_BUILD_TYPE=Release
    -DCMAKE_SYSTEM_NAME=iOS
    -DCMAKE_OSX_ARCHITECTURES=arm64
    -DCMAKE_OSX_DEPLOYMENT_TARGET=16.0
)

# ── Dawn source ──────────────────────────────────────

DAWN_SRC="$BUILD/dawn-src"

if [ ! -d "$DAWN_SRC/.git" ]; then
    echo "==> Cloning Dawn..."
    git clone "$DAWN_REPO" "$DAWN_SRC"
fi

echo "==> Checking out Dawn $DAWN_COMMIT..."
git -C "$DAWN_SRC" fetch --no-recurse-submodules origin
git -C "$DAWN_SRC" checkout --no-recurse-submodules "$DAWN_COMMIT"

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
        "${IOS_FLAGS[@]}" \
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
        "${IOS_FLAGS[@]}" \
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

# ── Helper: build SDL3_ttf for a given sysroot ───────

SDL_TTF_SRC="$BUILD/sdl3_ttf-src"

build_sdl_ttf() {
    local SYSROOT="$1"   # iphoneos or iphonesimulator
    local SUFFIX="$2"    # "" or "-simulator"
    local TTF_B="$BUILD/sdl3_ttf${SUFFIX}"
    local DEST="$VENDOR/sdl3/lib/ios-arm64${SUFFIX}"
    local SDL_PREFIX="$BUILD/sdl3-prefix${SUFFIX}"

    if [ ! -d "$SDL_TTF_SRC/.git" ]; then
        echo "==> Cloning SDL3_ttf..."
        git clone --branch "$SDL_TTF_TAG" --depth 1 --recurse-submodules "$SDL_TTF_REPO" "$SDL_TTF_SRC"
    fi

    echo "==> Configuring SDL3_ttf for iOS arm64 ($SYSROOT)..."
    cmake -S "$SDL_TTF_SRC" -B "$TTF_B" \
        "${IOS_FLAGS[@]}" \
        -DCMAKE_OSX_SYSROOT="$SYSROOT" \
        -DBUILD_SHARED_LIBS=OFF \
        -DSDL3_DIR="$SDL_PREFIX/lib/cmake/SDL3" \
        -DSDLTTF_VENDORED=ON \
        -DSDLTTF_HARFBUZZ=ON

    echo "==> Building SDL3_ttf ($SYSROOT)..."
    cmake --build "$TTF_B" -j"$JOBS"

    mkdir -p "$DEST"
    cp "$TTF_B/libSDL3_ttf.a" "$DEST/"

    # Copy vendored dependency static libs (needed for static linking)
    for DIR in freetype harfbuzz plutosvg plutovg; do
        for LIB in "$TTF_B/external/$DIR/"*.a; do
            [ -f "$LIB" ] && cp "$LIB" "$DEST/"
        done
    done

    # Install header alongside SDL3 headers
    local INC_DEST="$VENDOR/sdl3/include/SDL3_ttf"
    mkdir -p "$INC_DEST"
    cp "$SDL_TTF_SRC/include/SDL3_ttf/SDL_ttf.h" "$INC_DEST/"
    echo "==> SDL3_ttf ($SYSROOT) installed to $DEST"
}

# ── Helper: create xcframework from device + simulator .a ──

create_xcframework() {
    local LIB_NAME="$1"       # e.g. "libdawn_proc.a"
    local DEVICE_DIR="$2"     # e.g. "$VENDOR/dawn/lib/ios-arm64"
    local SIM_DIR="$3"        # e.g. "$VENDOR/dawn/lib/ios-arm64-simulator"
    local OUTPUT_DIR="$4"     # e.g. "$VENDOR/dawn/xcframeworks"
    local FRAMEWORK_NAME="${LIB_NAME%.a}"
    FRAMEWORK_NAME="${FRAMEWORK_NAME#lib}"

    local OUTPUT="$OUTPUT_DIR/${FRAMEWORK_NAME}.xcframework"
    rm -rf "$OUTPUT"
    mkdir -p "$OUTPUT_DIR"

    echo "==> Creating ${FRAMEWORK_NAME}.xcframework..."
    xcodebuild -create-xcframework \
        -library "$DEVICE_DIR/$LIB_NAME" \
        -library "$SIM_DIR/$LIB_NAME" \
        -output "$OUTPUT"
}

# ── Build ────────────────────────────────────────────

if $BUILD_DEVICE; then
    build_dawn      "iphoneos" ""
    build_sdl       "iphoneos" ""
    build_sdl_image "iphoneos" ""
    build_sdl_ttf   "iphoneos" ""
fi

if $BUILD_SIM; then
    build_dawn      "iphonesimulator" "-simulator"
    build_sdl       "iphonesimulator" "-simulator"
    build_sdl_image "iphonesimulator" "-simulator"
    build_sdl_ttf   "iphonesimulator" "-simulator"
fi

# ── Create xcframeworks (when both variants are built) ──

DAWN_DEVICE="$VENDOR/dawn/lib/ios-arm64"
DAWN_SIM="$VENDOR/dawn/lib/ios-arm64-simulator"
SDL_DEVICE="$VENDOR/sdl3/lib/ios-arm64"
SDL_SIM="$VENDOR/sdl3/lib/ios-arm64-simulator"

if [ -f "$DAWN_DEVICE/libdawn_proc.a" ] && [ -f "$DAWN_SIM/libdawn_proc.a" ]; then
    echo ""
    echo "==> Packaging xcframeworks..."

    create_xcframework "libdawn_proc.a"   "$DAWN_DEVICE" "$DAWN_SIM" "$VENDOR/dawn/xcframeworks"
    create_xcframework "libwebgpu_dawn.a" "$DAWN_DEVICE" "$DAWN_SIM" "$VENDOR/dawn/xcframeworks"
    create_xcframework "libdawn_wire.a"   "$DAWN_DEVICE" "$DAWN_SIM" "$VENDOR/dawn/xcframeworks"

    create_xcframework "libSDL3.a"        "$SDL_DEVICE" "$SDL_SIM" "$VENDOR/sdl3/xcframeworks"
    create_xcframework "libSDL3_image.a"  "$SDL_DEVICE" "$SDL_SIM" "$VENDOR/sdl3/xcframeworks"
    create_xcframework "libSDL3_ttf.a"    "$SDL_DEVICE" "$SDL_SIM" "$VENDOR/sdl3/xcframeworks"

    # Package SDL3_ttf vendored dependency xcframeworks
    for DEP in freetype harfbuzz plutosvg plutovg; do
        for LIB in "$SDL_DEVICE"/lib${DEP}*.a; do
            [ -f "$LIB" ] && create_xcframework "$(basename "$LIB")" "$SDL_DEVICE" "$SDL_SIM" "$VENDOR/sdl3/xcframeworks"
        done
    done

    echo "==> xcframeworks created in $VENDOR/dawn/xcframeworks/ and $VENDOR/sdl3/xcframeworks/"
fi

echo ""
echo "Done. Libraries are in $VENDOR/dawn/lib/ and $VENDOR/sdl3/lib/"
