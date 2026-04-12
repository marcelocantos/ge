cmake_minimum_required(VERSION 3.22)
project(GeRemote LANGUAGES C CXX)
set(CMAKE_CXX_STANDARD 23)

set(GE_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/../../../../../..)

# SDL3 — built from source as part of the Gradle build
add_subdirectory(
    ${GE_ROOT}/vendor/github.com/libsdl-org/SDL
    ${CMAKE_CURRENT_BINARY_DIR}/SDL3
)

# Sources — Android entry point + shared H.264 player core + support
add_library(main SHARED
    ${CMAKE_CURRENT_SOURCE_DIR}/main.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/QRScanner_android.cpp
    ${GE_ROOT}/tools/player_core.cpp
    ${GE_ROOT}/tools/AudioPlayer.cpp
    ${GE_ROOT}/src/WebSocketClient.cpp
    ${GE_ROOT}/src/VideoDecoder_android.cpp
    ${GE_ROOT}/src/Signal.cpp
    ${GE_ROOT}/src/Resource.cpp
    ${GE_ROOT}/src/FileIO.cpp
    ${GE_ROOT}/vendor/src/sqlite3.c
    ${GE_ROOT}/vendor/src/sqlpipe.cpp
    ${GE_ROOT}/vendor/src/lz4.c
    ${GE_ROOT}/vendor/github.com/sqliteai/liteparser/src/arena.c
    ${GE_ROOT}/vendor/github.com/sqliteai/liteparser/src/liteparser.c
    ${GE_ROOT}/vendor/github.com/sqliteai/liteparser/src/lp_tokenize.c
    ${GE_ROOT}/vendor/github.com/sqliteai/liteparser/src/lp_unparse.c
    ${GE_ROOT}/vendor/github.com/sqliteai/liteparser/src/parse.c
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
    ${GE_ROOT}/vendor/github.com/libsdl-org/SDL/include
    ${GE_ROOT}/vendor/github.com/sqliteai/liteparser/src
    ${GE_ROOT}/tools
)

# SDL3 + Android system libs + MediaCodec
target_link_libraries(main PRIVATE
    SDL3::SDL3
    android
    log
    mediandk
)
