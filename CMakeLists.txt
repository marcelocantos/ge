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

if(NOT SQ_DIRECT)
    target_include_directories(sq PUBLIC
        ${CMAKE_CURRENT_SOURCE_DIR}/vendor/github.com/chriskohlhoff/asio/include
        ${CMAKE_CURRENT_SOURCE_DIR}/vendor/github.com/nayuki/QR-Code-generator/cpp
    )
    target_compile_definitions(sq PUBLIC ASIO_STANDALONE)
endif()
