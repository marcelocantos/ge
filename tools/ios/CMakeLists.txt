cmake_minimum_required(VERSION 3.28)
project(Player LANGUAGES CXX OBJCXX)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_XCODE_LINK_BUILD_PHASE_MODE KNOWN_LOCATION)

set(SQ_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/../..)
set(DEPS_BUILD ${CMAKE_CURRENT_SOURCE_DIR}/build)

# Sources — iOS entry point + shared player + wire transport + QR scanner
set(SOURCES
    ${CMAKE_CURRENT_SOURCE_DIR}/main.mm
    ${SQ_ROOT}/tools/player_core.cpp
    ${SQ_ROOT}/tools/player_platform_apple.cpp
    ${SQ_ROOT}/src/WireTransport.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/QRScanner.mm
)

add_executable(Player MACOSX_BUNDLE ${SOURCES})

# player_platform_apple.cpp uses ObjC (CAMetalLayer) — compile as ObjC++
set_source_files_properties(${SQ_ROOT}/tools/player_platform_apple.cpp PROPERTIES LANGUAGE OBJCXX)

target_compile_definitions(Player PRIVATE ASIO_STANDALONE SQ_IOS)

# Headers (engine + header-only vendors + iOS-specific)
target_include_directories(Player PRIVATE
    ${SQ_ROOT}/include
    ${SQ_ROOT}/vendor/include
    ${SQ_ROOT}/vendor/github.com/gabime/spdlog/include
    ${SQ_ROOT}/vendor/dawn/include
    ${SQ_ROOT}/vendor/github.com/chriskohlhoff/asio/include
    ${SQ_ROOT}/vendor/github.com/libsdl-org/SDL/include
    ${SQ_ROOT}/tools
    ${CMAKE_CURRENT_SOURCE_DIR}
)

# Libraries (xcframeworks — universal device + simulator)
target_link_libraries(Player PRIVATE
    ${SQ_ROOT}/vendor/dawn/xcframeworks/dawn_proc.xcframework
    ${SQ_ROOT}/vendor/dawn/xcframeworks/webgpu_dawn.xcframework
    ${SQ_ROOT}/vendor/dawn/xcframeworks/dawn_wire.xcframework
    ${SQ_ROOT}/vendor/sdl3/xcframeworks/SDL3.xcframework
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
    "-framework OpenGLES"
    "-lobjc"
)

set_target_properties(Player PROPERTIES
    MACOSX_BUNDLE_GUI_IDENTIFIER com.squz.player
    MACOSX_BUNDLE_BUNDLE_VERSION 1
    MACOSX_BUNDLE_SHORT_VERSION_STRING "1.0"
    MACOSX_BUNDLE_INFO_PLIST ${CMAKE_CURRENT_SOURCE_DIR}/Info.plist
    XCODE_ATTRIBUTE_TARGETED_DEVICE_FAMILY "1,2"
    XCODE_ATTRIBUTE_PRODUCT_BUNDLE_IDENTIFIER "com.squz.player"
    XCODE_ATTRIBUTE_DEVELOPMENT_TEAM "SWA3H3N7TW"
    XCODE_GENERATE_SCHEME TRUE
    XCODE_SCHEME_ENABLE_GPU_API_VALIDATION OFF
)
