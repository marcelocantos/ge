# TODO: Port from Dawn to bgfx. Currently broken — see T53.
cmake_minimum_required(VERSION 3.28)
project(Player LANGUAGES C CXX OBJCXX)
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_XCODE_LINK_BUILD_PHASE_MODE KNOWN_LOCATION)

set(GE_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/../..)
set(DEPS_BUILD ${CMAKE_CURRENT_SOURCE_DIR}/build)

# Sources — iOS entry point + shared H.264 player core + support
set(SOURCES
    ${CMAKE_CURRENT_SOURCE_DIR}/main.mm
    ${GE_ROOT}/tools/player_core.cpp
    ${GE_ROOT}/tools/AudioPlayer.cpp
    ${GE_ROOT}/src/bridge/PlayerWireBridge.cpp
    ${GE_ROOT}/src/bridge/WebSocketClient.cpp
    ${GE_ROOT}/src/bridge/VideoDecoder_apple.mm
    ${GE_ROOT}/src/render/PlayerRender.cpp
    ${GE_ROOT}/src/Signal.cpp
    ${GE_ROOT}/src/Resource.cpp
    ${GE_ROOT}/src/FileIO.cpp
    ${GE_ROOT}/vendor/src/sqlite3.c
    ${GE_ROOT}/vendor/src/sqlpipe.cpp
    ${GE_ROOT}/vendor/src/sqlift.cpp
    ${GE_ROOT}/vendor/src/lz4.c
    ${GE_ROOT}/tools/player_orientation_ios.mm
    ${CMAKE_CURRENT_SOURCE_DIR}/QRScanner.mm
    ${CMAKE_CURRENT_SOURCE_DIR}/KeychainStore.mm
)

add_executable(Player MACOSX_BUNDLE ${SOURCES})

target_compile_definitions(Player PRIVATE
    ASIO_STANDALONE
    GE_IOS
    SQLITE_ENABLE_SESSION
    SQLITE_ENABLE_PREUPDATE_HOOK
    SQLITE_ENABLE_DESERIALIZE
)

# Headers
target_include_directories(Player PRIVATE
    ${GE_ROOT}/include
    ${GE_ROOT}/vendor/include
    ${GE_ROOT}/vendor/github.com/gabime/spdlog/include
    ${GE_ROOT}/vendor/github.com/chriskohlhoff/asio/include
    ${GE_ROOT}/vendor/github.com/libsdl-org/SDL/include
    ${GE_ROOT}/vendor/sdl3/include
    ${GE_ROOT}/vendor/github.com/sqliteai/liteparser/src
    ${GE_ROOT}/tools
    ${CMAKE_CURRENT_SOURCE_DIR}
)

# Libraries
target_link_libraries(Player PRIVATE
    -lSDL3 -lSDL3_image -lSDL3_ttf
    -lfreetype -lharfbuzz -lplutosvg -lplutovg
)

# iOS frameworks
target_link_libraries(Player PRIVATE
    "-framework Foundation"
    "-framework UIKit"
    "-framework Metal"
    "-framework QuartzCore"
    "-framework IOKit"
    "-framework IOSurface"
    "-framework CoreGraphics"
    "-framework CoreServices"
    "-framework CoreFoundation"
    "-framework CoreBluetooth"
    "-framework CoreMedia"
    "-framework CoreVideo"
    "-framework AudioToolbox"
    "-framework AVFoundation"
    "-framework GameController"
    "-framework CoreHaptics"
    "-framework CoreMotion"
    "-framework VideoToolbox"
    "-framework Security"
    "-framework OpenGLES"
    "-framework ImageIO"
    "-lobjc"
)

# SDK-conditional library search paths (device vs simulator)
set(SDL_DEVICE_DIR  ${GE_ROOT}/vendor/sdl3/lib/ios-arm64)
set(SDL_SIM_DIR     ${GE_ROOT}/vendor/sdl3/lib/ios-arm64-simulator)

set_target_properties(Player PROPERTIES
    MACOSX_BUNDLE_GUI_IDENTIFIER com.squz.player
    MACOSX_BUNDLE_BUNDLE_VERSION 1
    MACOSX_BUNDLE_SHORT_VERSION_STRING "1.0"
    MACOSX_BUNDLE_INFO_PLIST ${CMAKE_CURRENT_SOURCE_DIR}/Info.plist
    XCODE_ATTRIBUTE_TARGETED_DEVICE_FAMILY "1,2"
    XCODE_ATTRIBUTE_SUPPORTED_PLATFORMS "iphoneos iphonesimulator"
    XCODE_ATTRIBUTE_PRODUCT_BUNDLE_IDENTIFIER "com.squz.player"
    XCODE_ATTRIBUTE_DEVELOPMENT_TEAM "SWA3H3N7TW"
    XCODE_ATTRIBUTE_CODE_SIGN_STYLE "Automatic"
    XCODE_GENERATE_SCHEME TRUE
    XCODE_SCHEME_ENABLE_GPU_API_VALIDATION OFF
    XCODE_ATTRIBUTE_IPHONEOS_DEPLOYMENT_TARGET 16.3
    "XCODE_ATTRIBUTE_LIBRARY_SEARCH_PATHS[sdk=iphoneos*]" "${SDL_DEVICE_DIR}"
    "XCODE_ATTRIBUTE_LIBRARY_SEARCH_PATHS[sdk=iphonesimulator*]" "${SDL_SIM_DIR}"
)
