cmake_minimum_required(VERSION 3.22)
project(SquzRemote LANGUAGES CXX)
set(CMAKE_CXX_STANDARD 20)

set(SQ_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/../../../../../..)

# SDL3 — built from source as part of this build
add_subdirectory(
    ${SQ_ROOT}/vendor/github.com/libsdl-org/SDL
    ${CMAKE_CURRENT_BINARY_DIR}/SDL3
)

# Sources — Android entry point + shared player + wire transport + platform + QR
add_library(main SHARED
    ${CMAKE_CURRENT_SOURCE_DIR}/main.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/QRScanner_android.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/player_platform_android.cpp
    ${SQ_ROOT}/tools/player_core.cpp
    ${SQ_ROOT}/src/WireTransport.cpp
    ${SQ_ROOT}/src/HttpServer.cpp
)

target_compile_definitions(main PRIVATE ASIO_STANDALONE)

target_include_directories(main PRIVATE
    ${SQ_ROOT}/include
    ${SQ_ROOT}/vendor/include
    ${SQ_ROOT}/vendor/github.com/gabime/spdlog/include
    ${SQ_ROOT}/vendor/dawn/include
    ${SQ_ROOT}/vendor/github.com/chriskohlhoff/asio/include
    ${SQ_ROOT}/tools
)

# Dawn (Android arm64 — built by build-deps.sh, committed to vendor)
set(DAWN_LIB_DIR ${SQ_ROOT}/vendor/dawn/lib/android-arm64)
target_link_libraries(main PRIVATE
    ${DAWN_LIB_DIR}/libdawn_proc.a
    ${DAWN_LIB_DIR}/libwebgpu_dawn.a
    ${DAWN_LIB_DIR}/libdawn_wire.a
)

# SDL3 + Android system libs
target_link_libraries(main PRIVATE
    SDL3::SDL3
    android
    log
)
