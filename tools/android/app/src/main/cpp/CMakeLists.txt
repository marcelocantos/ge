# TODO: Port from Dawn to bgfx. Currently broken — see T53.
cmake_minimum_required(VERSION 3.22)
project(GeRemote LANGUAGES C CXX)
set(CMAKE_CXX_STANDARD 23)

set(GE_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/../../../../../..)

# SDL3 — built from source as part of this build
add_subdirectory(
    ${GE_ROOT}/vendor/github.com/libsdl-org/SDL
    ${CMAKE_CURRENT_BINARY_DIR}/SDL3
)

# Sources — Android entry point + wire transport + QR + sqlite3/sqlpipe
# NOTE: player_core.cpp and player_platform_android.cpp removed (deleted; need bgfx port)
add_library(main SHARED
    ${CMAKE_CURRENT_SOURCE_DIR}/main.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/QRScanner_android.cpp
    ${GE_ROOT}/tools/AudioPlayer.cpp
    ${GE_ROOT}/src/WebSocketClient.cpp
    ${GE_ROOT}/vendor/src/sqlite3.c
    ${GE_ROOT}/vendor/src/sqlpipe.cpp
)

target_compile_definitions(main PRIVATE
    ASIO_STANDALONE
    SQLITE_ENABLE_SESSION
    SQLITE_ENABLE_PREUPDATE_HOOK
    SQLITE_ENABLE_DESERIALIZE
)

target_include_directories(main PRIVATE
    ${GE_ROOT}/include
    ${GE_ROOT}/vendor/include
    ${GE_ROOT}/vendor/github.com/gabime/spdlog/include
    ${GE_ROOT}/vendor/github.com/chriskohlhoff/asio/include
    ${GE_ROOT}/tools
)

# SDL3 + Android system libs
target_link_libraries(main PRIVATE
    SDL3::SDL3
    android
    log
)
