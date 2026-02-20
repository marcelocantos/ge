# ge engine — static library for CMake consumers (iOS, etc.)
# Desktop builds use Module.mk instead.
#
# Options:
#   GE_DIRECT  — Build for direct rendering (no wire/networking). Default: OFF.

cmake_minimum_required(VERSION 3.22)
if(CMAKE_SYSTEM_NAME STREQUAL "Android")
    project(ge LANGUAGES CXX)
else()
    project(ge LANGUAGES CXX OBJCXX)
endif()
set(CMAKE_CXX_STANDARD 20)

option(GE_DIRECT "Direct rendering mode (no wire/networking)" OFF)

# ── Sources ──────────────────────────────────────────

set(GE_CORE_SOURCES
    src/GpuContext.cpp
    src/Texture.cpp
    src/Mesh.cpp
    src/Model.cpp
    src/ManifestLoader.cpp
    src/Pipeline.cpp
    src/BindGroup.cpp
    src/Resource.cpp
    src/FileIO.cpp
    src/WireTransport.cpp
)

# Platform-specific sources
if(CMAKE_SYSTEM_NAME STREQUAL "Android")
    list(APPEND GE_CORE_SOURCES src/SdlContext_android.cpp src/NativeSurface_android.cpp)
else()
    list(APPEND GE_CORE_SOURCES src/SdlContext.cpp src/NativeSurface_apple.cpp)
endif()

if(GE_DIRECT)
    set(GE_SOURCES ${GE_CORE_SOURCES} src/SessionDirect.cpp)
else()
    set(GE_SOURCES ${GE_CORE_SOURCES}
        src/SessionWire.cpp
        src/WireSession.cpp
        src/CaptureTarget.cpp
        vendor/github.com/nayuki/QR-Code-generator/cpp/qrcodegen.cpp
    )
endif()

# Prepend our directory so paths resolve when included via add_subdirectory
list(TRANSFORM GE_SOURCES PREPEND "${CMAKE_CURRENT_SOURCE_DIR}/"
     REGEX "^[^/]")

add_library(ge STATIC ${GE_SOURCES})

# ── ObjC++ for files that use ObjC types (Apple only) ─────────────

if(NOT CMAKE_SYSTEM_NAME STREQUAL "Android")
    set_source_files_properties(
        ${CMAKE_CURRENT_SOURCE_DIR}/src/SdlContext.cpp
        ${CMAKE_CURRENT_SOURCE_DIR}/src/NativeSurface_apple.cpp
        PROPERTIES LANGUAGE OBJCXX
    )
endif()

# ── Public include directories (inherited by consumers) ──

target_include_directories(ge PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/vendor/include
    ${CMAKE_CURRENT_SOURCE_DIR}/vendor/github.com/gabime/spdlog/include
    ${CMAKE_CURRENT_SOURCE_DIR}/vendor/dawn/include
    ${CMAKE_CURRENT_SOURCE_DIR}/vendor/github.com/libsdl-org/SDL/include
    ${CMAKE_CURRENT_SOURCE_DIR}/vendor/sdl3/include
)

if(GE_DIRECT)
    # astcenc (decompress-only) for ASTC→RGBA decoding at runtime
    set(ASTCENC_DIR ${CMAKE_CURRENT_SOURCE_DIR}/vendor/github.com/ARM-software/astc-encoder/Source)
    file(GLOB ASTCENC_SOURCES ${ASTCENC_DIR}/astcenc_*.cpp)
    add_library(astcenc STATIC ${ASTCENC_SOURCES})
    target_include_directories(astcenc PUBLIC ${ASTCENC_DIR})
    target_compile_definitions(astcenc PUBLIC ASTCENC_DECOMPRESS_ONLY)
    target_compile_definitions(astcenc PRIVATE ASTCENC_SSE=0 ASTCENC_AVX=0 ASTCENC_POPCNT=0 ASTCENC_NEON=1)
    set_target_properties(astcenc PROPERTIES CXX_STANDARD 17)

    # etcpak for RGBA→ETC2 compression at runtime
    set(ETCPAK_DIR ${CMAKE_CURRENT_SOURCE_DIR}/vendor/github.com/wolfpld/etcpak)
    file(GLOB ETCPAK_SOURCES ${ETCPAK_DIR}/*.cpp)
    add_library(etcpak STATIC ${ETCPAK_SOURCES})
    target_include_directories(etcpak PUBLIC ${ETCPAK_DIR})

    target_link_libraries(ge PRIVATE astcenc etcpak)
    target_compile_definitions(ge PRIVATE GE_HAS_TRANSCODER)
else()
    target_include_directories(ge PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/vendor/github.com/chriskohlhoff/asio/include
        ${CMAKE_CURRENT_SOURCE_DIR}/vendor/github.com/nayuki/QR-Code-generator/cpp
    )
    target_compile_definitions(ge PUBLIC ASIO_STANDALONE)
endif()

# ── Platform-specific dependencies ────────────────────

if(CMAKE_SYSTEM_NAME STREQUAL "Android")
    # SDL3 — built from source (provides SDL3::SDL3 target)
    add_subdirectory(
        ${CMAKE_CURRENT_SOURCE_DIR}/vendor/github.com/libsdl-org/SDL
        ${CMAKE_BINARY_DIR}/SDL3
    )
    target_link_libraries(ge PUBLIC SDL3::SDL3)

    # SDL3_image — built from source
    set(SDL3IMAGE_VENDORED OFF)
    add_subdirectory(
        ${CMAKE_CURRENT_SOURCE_DIR}/vendor/github.com/libsdl-org/SDL_image
        ${CMAKE_BINARY_DIR}/SDL3_image
    )
    target_link_libraries(ge PUBLIC SDL3_image::SDL3_image)

    # Dawn — pre-built static libs (from build-deps.sh)
    set(DAWN_LIB_DIR ${CMAKE_CURRENT_SOURCE_DIR}/vendor/dawn/lib/android-arm64)
    target_link_libraries(ge INTERFACE
        ${DAWN_LIB_DIR}/libdawn_proc.a
        ${DAWN_LIB_DIR}/libwebgpu_dawn.a
        ${DAWN_LIB_DIR}/libdawn_wire.a
    )

    # Android system libs
    target_link_libraries(ge INTERFACE android log)

elseif(CMAKE_SYSTEM_NAME STREQUAL "iOS")
    set(GE_VENDOR ${CMAKE_CURRENT_SOURCE_DIR}/vendor)
    target_link_libraries(ge INTERFACE
        ${GE_VENDOR}/dawn/xcframeworks/dawn_proc.xcframework
        ${GE_VENDOR}/dawn/xcframeworks/webgpu_dawn.xcframework
        ${GE_VENDOR}/dawn/xcframeworks/dawn_wire.xcframework
        ${GE_VENDOR}/sdl3/xcframeworks/SDL3.xcframework
        ${GE_VENDOR}/sdl3/xcframeworks/SDL3_image.xcframework
        ${GE_VENDOR}/sdl3/xcframeworks/SDL3_ttf.xcframework
        ${GE_VENDOR}/sdl3/xcframeworks/freetype.xcframework
        ${GE_VENDOR}/sdl3/xcframeworks/harfbuzz.xcframework
        ${GE_VENDOR}/sdl3/xcframeworks/plutosvg.xcframework
        ${GE_VENDOR}/sdl3/xcframeworks/plutovg.xcframework
    )
    target_link_libraries(ge INTERFACE
        "-framework Foundation" "-framework UIKit" "-framework Metal"
        "-framework QuartzCore" "-framework IOKit" "-framework IOSurface"
        "-framework CoreGraphics" "-framework CoreServices"
        "-framework CoreFoundation" "-framework CoreBluetooth"
        "-framework AudioToolbox" "-framework AVFoundation"
        "-framework CoreMedia" "-framework CoreVideo"
        "-framework GameController" "-framework CoreHaptics"
        "-framework CoreMotion" "-framework ImageIO"
        "-framework OpenGLES" "-lobjc"
    )
endif()
