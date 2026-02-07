cmake_minimum_required(VERSION 3.22)
project(Receiver LANGUAGES CXX OBJCXX)
set(CMAKE_CXX_STANDARD 20)

set(SQ_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/../..)
set(DEPS_BUILD ${CMAKE_CURRENT_SOURCE_DIR}/build)

# Sources — iOS entry point + shared receiver + wire transport + QR scanner
set(SOURCES
    ${CMAKE_CURRENT_SOURCE_DIR}/main.mm
    ${SQ_ROOT}/tools/receiver_core.cpp
    ${SQ_ROOT}/tools/receiver_platform_apple.cpp
    ${SQ_ROOT}/src/WireTransport.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/QRScanner.mm
)

add_executable(Receiver MACOSX_BUNDLE ${SOURCES})

# receiver_platform_apple.cpp uses ObjC (CAMetalLayer) — compile as ObjC++
set_source_files_properties(${SQ_ROOT}/tools/receiver_platform_apple.cpp PROPERTIES LANGUAGE OBJCXX)

target_compile_definitions(Receiver PRIVATE ASIO_STANDALONE SQ_IOS)

# Headers (engine + header-only vendors + iOS-specific)
target_include_directories(Receiver PRIVATE
    ${SQ_ROOT}/include
    ${SQ_ROOT}/vendor/include
    ${SQ_ROOT}/vendor/github.com/gabime/spdlog/include
    ${SQ_ROOT}/vendor/dawn/include
    ${SQ_ROOT}/vendor/github.com/chriskohlhoff/asio/include
    ${SQ_ROOT}/vendor/github.com/libsdl-org/SDL/include
    ${SQ_ROOT}/tools
    ${CMAKE_CURRENT_SOURCE_DIR}
)

# Dawn + SDL3 — link by name, resolve paths per SDK at build time
target_link_libraries(Receiver PRIVATE -ldawn_proc -lwebgpu_dawn -ldawn_wire -lSDL3)

# iOS frameworks
target_link_libraries(Receiver PRIVATE
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

set(DAWN_DEVICE_DIR ${SQ_ROOT}/vendor/dawn/lib/ios-arm64)
set(DAWN_SIM_DIR    ${SQ_ROOT}/vendor/dawn/lib/ios-arm64-simulator)
set(SDL_DEVICE_DIR  ${DEPS_BUILD}/sdl3)
set(SDL_SIM_DIR     ${DEPS_BUILD}/sdl3-simulator)

set_target_properties(Receiver PROPERTIES
    MACOSX_BUNDLE_GUI_IDENTIFIER com.squz.receiver
    MACOSX_BUNDLE_BUNDLE_VERSION 1
    MACOSX_BUNDLE_SHORT_VERSION_STRING "1.0"
    MACOSX_BUNDLE_INFO_PLIST ${CMAKE_CURRENT_SOURCE_DIR}/Info.plist
    XCODE_ATTRIBUTE_TARGETED_DEVICE_FAMILY "1,2"
    XCODE_ATTRIBUTE_PRODUCT_BUNDLE_IDENTIFIER "com.squz.receiver"
    XCODE_ATTRIBUTE_DEVELOPMENT_TEAM "SWA3H3N7TW"
    "XCODE_ATTRIBUTE_LIBRARY_SEARCH_PATHS[sdk=iphoneos*]" "${DAWN_DEVICE_DIR} ${SDL_DEVICE_DIR}"
    "XCODE_ATTRIBUTE_LIBRARY_SEARCH_PATHS[sdk=iphonesimulator*]" "${DAWN_SIM_DIR} ${SDL_SIM_DIR}"
    XCODE_GENERATE_SCHEME TRUE
    XCODE_SCHEME_ENABLE_GPU_API_VALIDATION OFF
)
