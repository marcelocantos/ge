cmake_minimum_required(VERSION 3.22)
project(Receiver LANGUAGES CXX OBJCXX)
set(CMAKE_CXX_STANDARD 20)

set(SQ_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/../..)
set(DEPS_BUILD ${CMAKE_CURRENT_SOURCE_DIR}/build)

# Sources — receiver + CommandSerializer/CommandHandler base impls
set(SOURCES
    ${SQ_ROOT}/tools/receiver.cpp
    ${SQ_ROOT}/src/WireTransport.cpp
)

add_executable(Receiver MACOSX_BUNDLE ${SOURCES})

target_compile_definitions(Receiver PRIVATE ASIO_STANDALONE)

# Headers (engine + header-only vendors)
target_include_directories(Receiver PRIVATE
    ${SQ_ROOT}/include
    ${SQ_ROOT}/vendor/include
    ${SQ_ROOT}/vendor/spdlog/include
    ${SQ_ROOT}/vendor/dawn/include
    ${SQ_ROOT}/vendor/asio/include
    ${SQ_ROOT}/vendor/github.com/libsdl-org/SDL/include
)

# Dawn (iOS arm64 — built by build-deps.sh)
target_link_libraries(Receiver PRIVATE
    ${DEPS_BUILD}/dawn/src/dawn/libdawn_proc.a
    ${DEPS_BUILD}/dawn/src/dawn/native/libwebgpu_dawn.a
    ${DEPS_BUILD}/dawn/src/dawn/wire/libdawn_wire.a
)

# SDL3 (iOS arm64 — built by build-deps.sh)
target_link_libraries(Receiver PRIVATE
    ${DEPS_BUILD}/sdl3/libSDL3.a
)

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

set_target_properties(Receiver PROPERTIES
    MACOSX_BUNDLE_GUI_IDENTIFIER com.squz.receiver
    MACOSX_BUNDLE_BUNDLE_VERSION 1
    MACOSX_BUNDLE_SHORT_VERSION_STRING "1.0"
    MACOSX_BUNDLE_INFO_PLIST ${CMAKE_CURRENT_SOURCE_DIR}/Info.plist
    XCODE_ATTRIBUTE_TARGETED_DEVICE_FAMILY "1,2"
    XCODE_ATTRIBUTE_PRODUCT_BUNDLE_IDENTIFIER "com.squz.receiver"
)
