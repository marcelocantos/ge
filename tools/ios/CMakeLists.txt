cmake_minimum_required(VERSION 3.28)
project(Player LANGUAGES CXX OBJCXX)
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_XCODE_LINK_BUILD_PHASE_MODE KNOWN_LOCATION)

set(GE_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/../..)
set(DEPS_BUILD ${CMAKE_CURRENT_SOURCE_DIR}/build)

# Sources — iOS entry point + shared player + wire transport + QR scanner
set(SOURCES
    ${CMAKE_CURRENT_SOURCE_DIR}/main.mm
    ${GE_ROOT}/tools/player_core.cpp
    ${GE_ROOT}/tools/player_platform_apple.cpp
    ${GE_ROOT}/tools/AudioPlayer.cpp
    ${GE_ROOT}/src/WireTransport.cpp
    ${GE_ROOT}/src/WebSocketClient.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/QRScanner.mm
)

add_executable(Player MACOSX_BUNDLE ${SOURCES})

# player_platform_apple.cpp uses ObjC (CAMetalLayer) — compile as ObjC++
set_source_files_properties(${GE_ROOT}/tools/player_platform_apple.cpp PROPERTIES LANGUAGE OBJCXX)

target_compile_definitions(Player PRIVATE ASIO_STANDALONE GE_IOS)

# Headers (engine + header-only vendors + iOS-specific)
target_include_directories(Player PRIVATE
    ${GE_ROOT}/include
    ${GE_ROOT}/vendor/include
    ${GE_ROOT}/vendor/github.com/gabime/spdlog/include
    ${GE_ROOT}/vendor/dawn/include
    ${GE_ROOT}/vendor/github.com/chriskohlhoff/asio/include
    ${GE_ROOT}/vendor/github.com/libsdl-org/SDL/include
    ${GE_ROOT}/tools
    ${CMAKE_CURRENT_SOURCE_DIR}
)

# Libraries (static archives via SDK-conditional search paths)
target_link_libraries(Player PRIVATE -ldawn_proc -lwebgpu_dawn -ldawn_wire -lSDL3)

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
    "-framework OpenGLES"
    "-lobjc"
)

# SDK-conditional library search paths (device vs simulator)
set(DAWN_DEVICE_DIR ${GE_ROOT}/vendor/dawn/lib/ios-arm64)
set(DAWN_SIM_DIR    ${GE_ROOT}/vendor/dawn/lib/ios-arm64-simulator)
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
    "XCODE_ATTRIBUTE_LIBRARY_SEARCH_PATHS[sdk=iphoneos*]" "${DAWN_DEVICE_DIR} ${SDL_DEVICE_DIR}"
    "XCODE_ATTRIBUTE_LIBRARY_SEARCH_PATHS[sdk=iphonesimulator*]" "${DAWN_SIM_DIR} ${SDL_SIM_DIR}"
)
