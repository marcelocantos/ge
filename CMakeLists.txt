# sq engine — static library for CMake consumers (iOS, etc.)
# Desktop builds use Module.mk instead.
#
# Options:
#   SQ_DIRECT  — Build for direct rendering (no wire/networking). Default: OFF.

cmake_minimum_required(VERSION 3.22)
project(sq LANGUAGES CXX OBJCXX)
set(CMAKE_CXX_STANDARD 20)

option(SQ_DIRECT "Direct rendering mode (no wire/networking)" OFF)

# ── Sources ──────────────────────────────────────────

set(SQ_CORE_SOURCES
    src/GpuContext.cpp
    src/SdlContext.cpp
    src/Texture.cpp
    src/Mesh.cpp
    src/Model.cpp
    src/ManifestLoader.cpp
    src/Pipeline.cpp
    src/BindGroup.cpp
    src/Resource.cpp
    src/WireTransport.cpp
)

if(SQ_DIRECT)
    set(SQ_SOURCES ${SQ_CORE_SOURCES} src/SessionDirect.cpp)
else()
    set(SQ_SOURCES ${SQ_CORE_SOURCES}
        src/SessionWire.cpp
        src/WireSession.cpp
        src/CaptureTarget.cpp
        vendor/github.com/nayuki/QR-Code-generator/cpp/qrcodegen.cpp
    )
endif()

# Prepend our directory so paths resolve when included via add_subdirectory
list(TRANSFORM SQ_SOURCES PREPEND "${CMAKE_CURRENT_SOURCE_DIR}/"
     REGEX "^[^/]")

add_library(sq STATIC ${SQ_SOURCES})

# ── ObjC++ for files that use ObjC types ─────────────

set_source_files_properties(
    ${CMAKE_CURRENT_SOURCE_DIR}/src/SdlContext.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/src/GpuContext.cpp
    PROPERTIES LANGUAGE OBJCXX
)

# ── Public include directories (inherited by consumers) ──

target_include_directories(sq PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
    ${CMAKE_CURRENT_SOURCE_DIR}/vendor/include
    ${CMAKE_CURRENT_SOURCE_DIR}/vendor/github.com/gabime/spdlog/include
    ${CMAKE_CURRENT_SOURCE_DIR}/vendor/dawn/include
    ${CMAKE_CURRENT_SOURCE_DIR}/vendor/github.com/libsdl-org/SDL/include
    ${CMAKE_CURRENT_SOURCE_DIR}/vendor/sdl3/include
)

if(SQ_DIRECT)
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

    target_link_libraries(sq PRIVATE astcenc etcpak)
    target_compile_definitions(sq PRIVATE SQ_HAS_TRANSCODER)
else()
    target_include_directories(sq PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/vendor/github.com/chriskohlhoff/asio/include
        ${CMAKE_CURRENT_SOURCE_DIR}/vendor/github.com/nayuki/QR-Code-generator/cpp
    )
    target_compile_definitions(sq PUBLIC ASIO_STANDALONE)
endif()

# ── iOS: propagate xcframeworks + system frameworks to consumers ──

if(CMAKE_SYSTEM_NAME STREQUAL "iOS")
    set(SQ_VENDOR ${CMAKE_CURRENT_SOURCE_DIR}/vendor)
    target_link_libraries(sq INTERFACE
        ${SQ_VENDOR}/dawn/xcframeworks/dawn_proc.xcframework
        ${SQ_VENDOR}/dawn/xcframeworks/webgpu_dawn.xcframework
        ${SQ_VENDOR}/dawn/xcframeworks/dawn_wire.xcframework
        ${SQ_VENDOR}/sdl3/xcframeworks/SDL3.xcframework
        ${SQ_VENDOR}/sdl3/xcframeworks/SDL3_image.xcframework
        ${SQ_VENDOR}/sdl3/xcframeworks/SDL3_ttf.xcframework
        ${SQ_VENDOR}/sdl3/xcframeworks/freetype.xcframework
        ${SQ_VENDOR}/sdl3/xcframeworks/harfbuzz.xcframework
        ${SQ_VENDOR}/sdl3/xcframeworks/plutosvg.xcframework
        ${SQ_VENDOR}/sdl3/xcframeworks/plutovg.xcframework
    )
    target_link_libraries(sq INTERFACE
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
