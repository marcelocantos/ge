# ge engine module
# Included by a consuming project's Makefile.
#
# Typical usage — a minimal app Makefile looks like:
#
#   ge          := ge
#   APP_NAME    := mygame
#   APP_SRC     := src/main.cpp src/Scene.cpp
#   APP_SHADERS := build/shaders/simple_vs.bin build/shaders/simple_fs.bin
#
#   -include $(ge)/Module.mk
#   $(ge)/Module.mk:
#           git submodule update --init --recursive
#
# Module.mk derives the binary path ($(APP)=bin/$(APP_NAME)), object list,
# link rule, compile rule, default `all` target and `run`/`clean`.
#
# The `ge` variable is the relative path from the app Makefile to the ge
# repository root. Submodule apps use the default `ge := ge`. In-tree
# samples that live inside the ge repo set it to `../..` etc.
#
# Output paths under $(BUILD_DIR) always use a literal `ge/` namespace
# so objects land in sane locations regardless of where `$(ge)` points.
ge ?= ge

# ────────────────────────────────────────────────
# Build configuration (app-overridable)
# ────────────────────────────────────────────────

BUILD_DIR ?= build
CXX       ?= clang++
CC        ?= clang

# ────────────────────────────────────────────────
# make controls
# ────────────────────────────────────────────────

MAKEFLAGS += -j$(shell sysctl -n hw.ncpu 2>/dev/null || nproc 2>/dev/null || echo 4)

# ────────────────────────────────────────────────
# Variables exported to parent
# ────────────────────────────────────────────────

ge/INCLUDES = \
	-I$(ge)/include \
	-I$(ge)/vendor/include \
	-I$(ge)/vendor/github.com/gabime/spdlog/include \
	-I$(ge)/vendor/github.com/libsdl-org/SDL/include \
	-I$(ge)/vendor/sdl3/include \
	-I$(ge)/vendor/github.com/erincatto/box2d/include \
	-I$(ge)/vendor/github.com/chriskohlhoff/asio/include \
	-I$(ge)/vendor/github.com/sqliteai/liteparser/src \
	-DSQLITE_ENABLE_SESSION -DSQLITE_ENABLE_PREUPDATE_HOOK -DSQLITE_ENABLE_DESERIALIZE

# bgfx + bx + bimg (vendored, compiled from source)
ge/BX_DIR = $(ge)/vendor/github.com/bkaradzic/bx
ge/BIMG_DIR = $(ge)/vendor/github.com/bkaradzic/bimg
ge/BGFX_DIR = $(ge)/vendor/github.com/bkaradzic/bgfx

ge/BX_INCLUDES = -I$(ge/BX_DIR)/include -I$(ge/BX_DIR)/include/compat/osx
ge/BIMG_INCLUDES = -I$(ge/BIMG_DIR)/include
ge/BGFX_INCLUDES = -I$(ge/BGFX_DIR)/include

ge/BGFX_ALL_INCLUDES = $(ge/BGFX_INCLUDES) $(ge/BX_INCLUDES) $(ge/BIMG_INCLUDES)
ge/BGFX_CXXFLAGS = -std=c++20 -O2 $(ge/BGFX_ALL_INCLUDES) -DBX_CONFIG_DEBUG=0 -DBGFX_CONFIG_RENDERER_METAL=1

# bx: platform abstraction (amalgamated minus crtnone.cpp — handled by #ifdef internally)
ge/BX_OBJ = $(BUILD_DIR)/ge/vendor/bx.o
ge/BX_LIB = $(BUILD_DIR)/libbx.a

# bimg: image processing (image.cpp + image_gnf.cpp — decode/encode not needed for bgfx runtime)
ge/BIMG_SRC = $(ge/BIMG_DIR)/src/image.cpp $(ge/BIMG_DIR)/src/image_gnf.cpp
ge/BIMG_OBJ = $(patsubst $(ge/BIMG_DIR)/src/%.cpp,$(BUILD_DIR)/ge/vendor/bimg_%.o,$(ge/BIMG_SRC))
ge/BIMG_LIB = $(BUILD_DIR)/libbimg.a

# bgfx: rendering
ge/BGFX_OBJ = $(BUILD_DIR)/ge/vendor/bgfx.o
ge/BGFX_LIB = $(BUILD_DIR)/libbgfx.a

ge/BGFX_LIBS = $(ge/BGFX_LIB) $(ge/BIMG_LIB) $(ge/BX_LIB)

# SDL3 libraries (static, vendored)
ge/SDL3_LIB = $(ge)/vendor/sdl3/lib/macos-arm64/libSDL3.a
ge/SDL3_IMAGE_LIB = $(ge)/vendor/sdl3/lib/macos-arm64/libSDL3_image.a
ge/SDL3_TTF_LIB = $(ge)/vendor/sdl3/lib/macos-arm64/libSDL3_ttf.a
ge/FREETYPE_LIB = $(ge)/vendor/sdl3/lib/macos-arm64/libfreetype.a
ge/HARFBUZZ_LIB = $(ge)/vendor/sdl3/lib/macos-arm64/libharfbuzz.a
ge/PLUTOSVG_LIB = $(ge)/vendor/sdl3/lib/macos-arm64/libplutosvg.a
ge/PLUTOVG_LIB = $(ge)/vendor/sdl3/lib/macos-arm64/libplutovg.a
ge/SDL_LIBS = $(ge/SDL3_LIB) $(ge/SDL3_IMAGE_LIB) $(ge/SDL3_TTF_LIB) $(ge/FREETYPE_LIB) $(ge/HARFBUZZ_LIB) $(ge/PLUTOSVG_LIB) $(ge/PLUTOVG_LIB)

# macOS frameworks needed by any ge desktop app (SDL3 + bgfx + VideoToolbox +
# CoreMotion). Apps can extend via FRAMEWORKS += ... after the include.
ge/FRAMEWORKS = \
    -framework Metal -framework MetalKit -framework QuartzCore \
    -framework Cocoa -framework IOKit -framework CoreFoundation \
    -framework Carbon -framework CoreAudio -framework AudioToolbox \
    -framework CoreHaptics -framework GameController -framework CoreVideo \
    -framework ForceFeedback -framework AVFoundation -framework CoreMedia \
    -framework UniformTypeIdentifiers -framework CoreGraphics \
    -framework VideoToolbox -framework CoreMotion

# Core engine sources — always needed. Split into "direct-only" (runs on
# any platform / modality) and "brokered" (only the server-side of the
# ged-paired modality) so mobile distribution builds can omit the latter.
ge/SRC_DIRECT = \
	$(ge)/src/Context.cpp \
	$(ge)/src/Resource.cpp \
	$(ge)/src/FileIO.cpp \
	$(ge)/src/FontLoader_apple.mm \
	$(ge)/src/BgfxContext.mm \
	$(ge)/src/Signal.cpp \
	$(ge)/src/SessionHost.mm \
	$(ge)/src/render/DirectRenderHost.mm

ge/SRC_BROKERED = \
	$(ge)/src/bridge/SessionHost_brokered.mm \
	$(ge)/src/render/PlayerRender.cpp \
	$(ge)/src/bridge/ServerWireBridge.mm \
	$(ge)/src/bridge/PlayerWireBridge.cpp \
	$(ge)/src/bridge/WebSocketClient.cpp \
	$(ge)/src/bridge/VideoEncoder_apple.mm \
	$(ge)/src/bridge/VideoDecoder_apple.mm

ge/SRC = $(ge/SRC_DIRECT) $(ge/SRC_BROKERED)

ge/OBJ = $(patsubst $(ge)/src/%.cpp,$(BUILD_DIR)/ge/src/%.o,$(filter %.cpp,$(ge/SRC))) \
         $(patsubst $(ge)/src/%.mm,$(BUILD_DIR)/ge/src/%.o,$(filter %.mm,$(ge/SRC)))
ge/LIB = $(BUILD_DIR)/libge.a

# Desktop player (H.264 receiver). Built on demand via `make player`.
ge/PLAYER_SRC = $(ge)/tools/player.cpp $(ge)/tools/player_core.cpp $(ge)/tools/player_orientation_stub.cpp
ge/PLAYER = bin/player

# Small helper CLIs, built on demand.
ge/IMGDIFF = bin/imgdiff

# bgfx shader compiler (vendored binaries for common hosts).
# Parent lists desired `.bin` outputs (e.g. `$(BUILD_DIR)/shaders/foo_vs.bin`);
# Module.mk's pattern rules compile them from matching `.sc` sources.
ge/SHADERC_HOST := $(shell uname -s | tr A-Z a-z)-$(shell uname -m | sed 's/aarch64/arm64/')
ge/SHADERC = $(ge)/bin/$(ge/SHADERC_HOST)/shaderc

# bgfx shader include directory (bgfx_shader.sh lives here).
ge/SHADERC_BGFX_INCLUDE = $(ge/BGFX_DIR)/src

# Target GPU profile (Metal on Apple platforms — the only renderer enabled).
ge/SHADERC_PROFILE ?= metal
ge/SHADERC_PLATFORM ?= osx

# Parent defines its shader source directory (default `shaders`) and varying def.
ge/SHADER_DIR ?= shaders
ge/SHADERC_VARYINGDEF ?= $(ge/SHADER_DIR)/varying.def.sc

# ge's own internal render shaders (compose pass for viewport tilt).
# Consumers depend on $(ge/RENDER_SHADERS) so the binaries exist on
# disk at runtime. DirectRenderHost loads them from "build/ge/shaders/".
ge/RENDER_SHADER_DIR = $(ge)/src/render/shaders
ge/RENDER_SHADERS = \
	$(BUILD_DIR)/ge/shaders/ge_compose_vs.bin \
	$(BUILD_DIR)/ge/shaders/ge_compose_fs.bin

# SPIR-V variants of the app's and ge's shaders, for Vulkan (Android).
# Consumed by the Android Gradle build's syncAssets task; deposited into
# the APK under assets/build/shaders/ at the same paths so the runtime
# lookup via ge::resource("build/shaders/*.bin") keeps working.
ge/APP_SHADERS_SPIRV    = $(patsubst $(BUILD_DIR)/$(ge/SHADER_DIR)/%.bin,$(BUILD_DIR)/$(ge/SHADER_DIR)-spirv/%.bin,$(APP_SHADERS))
ge/RENDER_SHADERS_SPIRV = $(patsubst $(BUILD_DIR)/ge/shaders/%.bin,$(BUILD_DIR)/ge/shaders-spirv/%.bin,$(ge/RENDER_SHADERS))

# Texture encoder (used by precompute tools, NOT part of libge.a)
ge/TEXTURE_ENCODER_SRC = $(ge)/src/TextureEncoder.cpp
ge/TEXTURE_ENCODER_OBJ = $(BUILD_DIR)/ge/src/TextureEncoder.o

# Box2D v3 physics library (C code)
ge/BOX2D_DIR = $(ge)/vendor/github.com/erincatto/box2d
ge/BOX2D_SRC = $(wildcard $(ge/BOX2D_DIR)/src/*.c)
ge/BOX2D_OBJ = $(patsubst $(ge/BOX2D_DIR)/src/%.c,$(BUILD_DIR)/ge/vendor/box2d/%.o,$(ge/BOX2D_SRC))
ge/BOX2D_CFLAGS = -I$(ge/BOX2D_DIR)/include -I$(ge/BOX2D_DIR)/src -O2 -std=c17

# SQLite3 (C code, vendored amalgamation — used by Tweak.h)
ge/SQLITE_SRC = $(ge)/vendor/src/sqlite3.c
ge/SQLITE_OBJ = $(BUILD_DIR)/ge/vendor/sqlite3.o

# Triangle library (C code, used by precompute tool)
ge/TRIANGLE_SRC = $(ge)/vendor/src/triangle.c
ge/TRIANGLE_OBJ = $(BUILD_DIR)/ge/vendor/triangle.o
ge/TRIANGLE_CFLAGS = -O2 -I$(ge)/vendor/include -DTRILIBRARY -DREAL=double -DANSI_DECLARATORS -DNO_TIMER

# lz4 compression (C code, used by sqlpipe)
ge/LZ4_SRC = $(ge)/vendor/src/lz4.c
ge/LZ4_OBJ = $(BUILD_DIR)/ge/vendor/lz4.o

# liteparser (C code, used by sqlpipe for query analysis)
ge/LITEPARSER_DIR = $(ge)/vendor/github.com/sqliteai/liteparser/src
ge/LITEPARSER_SRC = $(addprefix $(ge/LITEPARSER_DIR)/,arena.c liteparser.c lp_tokenize.c lp_unparse.c parse.c)
ge/LITEPARSER_OBJ = $(patsubst $(ge/LITEPARSER_DIR)/%.c,$(BUILD_DIR)/ge/vendor/liteparser/%.o,$(ge/LITEPARSER_SRC))

# Vendor C++ libraries (compiled into libge.a)
ge/VENDOR_CPP_SRC = $(ge)/vendor/src/sqlift.cpp $(ge)/vendor/src/sqlpipe.cpp
ge/VENDOR_CPP_OBJ = $(patsubst $(ge)/vendor/src/%.cpp,$(BUILD_DIR)/ge/vendor/%.o,$(ge/VENDOR_CPP_SRC))

# Test sources
ge/TEST_SRC = \
	$(ge)/src/main_test.cpp \
	$(ge)/src/DampedRotation_test.cpp
ge/TEST_OBJ = $(patsubst $(ge)/src/%.cpp,$(BUILD_DIR)/ge/src/%.o,$(ge/TEST_SRC))

# Shared variables (parent can += to extend)
CLEAN = bin build deps.dot deps.svg deps.png $(ge)/ged/web
COMPILE_DB_DEPS = $(ge/SRC) $(ge/TEST_SRC) $(ge)/Module.mk $(APP_SRC) Makefile
ge/DEPGRAPH_DEPS = $(ge/SRC) $(wildcard $(ge)/include/ge/*.h) $(ge)/tools/depgraph.py

# ────────────────────────────────────────────────
# Default compile/link flags (app-overridable)
# ────────────────────────────────────────────────

# Engine-managed base flags. Apps that want to extend CXXFLAGS keep these by
# default (via `CXXFLAGS ?=` below) or reference $(ge/CXXFLAGS_BASE) explicitly
# when constructing their own.
ge/CXXFLAGS_BASE = -std=c++20 -O2 -g $(ge/INCLUDES) $(ge/BGFX_ALL_INCLUDES) -DBX_CONFIG_DEBUG=0

CXXFLAGS   ?= $(ge/CXXFLAGS_BASE) -Isrc
SDL_CFLAGS ?= -I$(ge)/vendor/sdl3/include
FRAMEWORKS ?= $(ge/FRAMEWORKS)

# ────────────────────────────────────────────────
# App convention — parent declares APP_NAME / APP_SRC / APP_SHADERS
# ────────────────────────────────────────────────

# Derived from the parent's APP_NAME and APP_SRC. The parent can override
# $(APP) (e.g. to change the binary location) or $(APP_OBJ) (unusual) before
# the include.
APP         ?= bin/$(APP_NAME)
APP_OBJ     ?= $(patsubst %.cpp,$(BUILD_DIR)/%.o,$(APP_SRC))

# Display name used for iOS / Android bundles and Xcode targets/schemes.
# Defaults to APP_NAME; set to a Pascal-cased variant if you want a pretty
# string on the home screen while keeping a lowercase binary name.
APP_DISPLAY_NAME ?= $(APP_NAME)

# Extra static libs/objects the app needs beyond the ge engine (e.g. ship a
# specialised third-party library). Defaults to Box2D since many ge apps use
# it and its link cost is negligible for those that don't.
APP_LIBS    ?= $(ge/BOX2D_OBJ)

# ────────────────────────────────────────────────
# Rules
# ────────────────────────────────────────────────

# Default target — `make` with no args builds the app. Parent can declare its
# own `all:` BEFORE the include to win (the first target make sees is the
# default).
.PHONY: all run
all: $(APP)

# Default link rule. Parent can override by declaring its own $(APP) rule.
$(APP): $(APP_OBJ) $(APP_SHADERS) $(ge/RENDER_SHADERS) $(ge/LIB) $(ge/BGFX_LIBS) $(APP_LIBS)
	@mkdir -p $(@D)
	$(CXX) $(APP_OBJ) $(APP_LIBS) $(ge/LIB) $(ge/BGFX_LIBS) $(ge/SDL_LIBS) $(FRAMEWORKS) -o $@

# App objects — .cpp files under src/ compile into $(BUILD_DIR)/src/*.o.
$(BUILD_DIR)/src/%.o: src/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) $(SDL_CFLAGS) -MMD -MP -c $< -o $@

# Convenience: build and run.
run: $(APP)
	./$(APP)

# Engine + render + bridge objects (.cpp)
$(BUILD_DIR)/ge/src/%.o: $(ge)/src/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) $(SDL_CFLAGS) -MMD -MP -c $< -o $@

# Engine + render + bridge objects (.mm)
$(BUILD_DIR)/ge/src/%.o: $(ge)/src/%.mm
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) $(SDL_CFLAGS) -MMD -MP -c $< -o $@

# Tools ObjC++ objects (.mm) — e.g. player_capture_apple.mm
$(BUILD_DIR)/ge/tools/%.o: $(ge)/tools/%.mm
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) $(SDL_CFLAGS) -MMD -MP -c $< -o $@

# Static library
$(ge/LIB): $(ge/OBJ) $(ge/SQLITE_OBJ) $(ge/LZ4_OBJ) $(ge/LITEPARSER_OBJ) $(ge/VENDOR_CPP_OBJ)
	@mkdir -p $(dir $@)
	libtool -static -o $@ $^

# Vendor C++ sources
$(BUILD_DIR)/ge/vendor/%.o: $(ge)/vendor/src/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -MMD -MP -c $< -o $@

# Box2D library
$(BUILD_DIR)/ge/vendor/box2d/%.o: $(ge/BOX2D_DIR)/src/%.c
	@mkdir -p $(dir $@)
	$(CC) $(ge/BOX2D_CFLAGS) -MMD -MP -c $< -o $@

# SQLite3 (C amalgamation)
$(ge/SQLITE_OBJ): $(ge/SQLITE_SRC)
	@mkdir -p $(dir $@)
	$(CC) -O2 -I$(ge)/vendor/include -DSQLITE_ENABLE_SESSION -DSQLITE_ENABLE_PREUPDATE_HOOK -DSQLITE_ENABLE_DESERIALIZE -c $< -o $@

# lz4 compression
$(ge/LZ4_OBJ): $(ge/LZ4_SRC)
	@mkdir -p $(dir $@)
	$(CC) -O2 -I$(ge)/vendor/include -c $< -o $@

# liteparser
$(BUILD_DIR)/ge/vendor/liteparser/%.o: $(ge/LITEPARSER_DIR)/%.c
	@mkdir -p $(dir $@)
	$(CC) -w -O2 -I$(ge/LITEPARSER_DIR) -c $< -o $@

# Triangle library
$(ge/TRIANGLE_OBJ): $(ge/TRIANGLE_SRC)
	@mkdir -p $(dir $@)
	$(CC) $(ge/TRIANGLE_CFLAGS) -c $< -o $@

# bx (amalgamated build)
$(ge/BX_OBJ): $(ge/BX_DIR)/src/amalgamated.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(ge/BGFX_CXXFLAGS) -I$(ge/BX_DIR)/3rdparty -MMD -MP -c $< -o $@

$(ge/BX_LIB): $(ge/BX_OBJ)
	@mkdir -p $(dir $@)
	libtool -static -o $@ $^

# bimg (amalgamated build — needs bx + bimg internal headers)
$(BUILD_DIR)/ge/vendor/bimg_%.o: $(ge/BIMG_DIR)/src/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(ge/BGFX_CXXFLAGS) -DBIMG_CONFIG_DECODE_ENABLE=0 -I$(ge/BIMG_DIR)/3rdparty -I$(ge/BIMG_DIR)/3rdparty/astc-encoder/include -MMD -MP -c $< -o $@

$(ge/BIMG_LIB): $(ge/BIMG_OBJ)
	@mkdir -p $(dir $@)
	libtool -static -o $@ $^

# bgfx (amalgamated build — Metal renderer needs ObjC++ for MTLCopyAllDevicesWithObserver)
$(ge/BGFX_OBJ): $(ge/BGFX_DIR)/src/amalgamated.cpp
	@mkdir -p $(dir $@)
	$(CXX) -ObjC++ $(ge/BGFX_CXXFLAGS) -I$(ge/BGFX_DIR)/3rdparty -I$(ge/BGFX_DIR)/3rdparty/khronos -I$(ge/BGFX_DIR)/src -MMD -MP -c $< -o $@

$(ge/BGFX_LIB): $(ge/BGFX_OBJ)
	@mkdir -p $(dir $@)
	libtool -static -o $@ $^

# bgfx shader compilation. Parent just lists the `.bin` targets (e.g. in
# a SHADERS variable) and makes its app depend on them. These pattern
# rules do the rest.
#
# Convention: files named `*_vs.sc` are vertex shaders, `*_fs.sc` fragment,
# `*_cs.sc` compute. Outputs mirror the source path under $(BUILD_DIR).
#
# Override `ge/SHADER_DIR` (default: `shaders`) or `ge/SHADERC_VARYINGDEF`
# (default: `$(ge/SHADER_DIR)/varying.def.sc`) if your layout differs.
$(BUILD_DIR)/$(ge/SHADER_DIR)/%_vs.bin: $(ge/SHADER_DIR)/%_vs.sc $(ge/SHADERC_VARYINGDEF) $(ge/SHADERC)
	@mkdir -p $(dir $@)
	$(ge/SHADERC) -f $< -o $@ --type vertex \
	    --platform $(ge/SHADERC_PLATFORM) -p $(ge/SHADERC_PROFILE) \
	    --varyingdef $(ge/SHADERC_VARYINGDEF) \
	    -i $(ge/SHADERC_BGFX_INCLUDE) -i $(ge/SHADER_DIR)

$(BUILD_DIR)/$(ge/SHADER_DIR)/%_fs.bin: $(ge/SHADER_DIR)/%_fs.sc $(ge/SHADERC_VARYINGDEF) $(ge/SHADERC)
	@mkdir -p $(dir $@)
	$(ge/SHADERC) -f $< -o $@ --type fragment \
	    --platform $(ge/SHADERC_PLATFORM) -p $(ge/SHADERC_PROFILE) \
	    --varyingdef $(ge/SHADERC_VARYINGDEF) \
	    -i $(ge/SHADERC_BGFX_INCLUDE) -i $(ge/SHADER_DIR)

$(BUILD_DIR)/$(ge/SHADER_DIR)/%_cs.bin: $(ge/SHADER_DIR)/%_cs.sc $(ge/SHADERC)
	@mkdir -p $(dir $@)
	$(ge/SHADERC) -f $< -o $@ --type compute \
	    --platform $(ge/SHADERC_PLATFORM) -p $(ge/SHADERC_PROFILE) \
	    -i $(ge/SHADERC_BGFX_INCLUDE) -i $(ge/SHADER_DIR)

# Engine-internal render shaders (compose pass for viewport tilt).
$(BUILD_DIR)/ge/shaders/%_vs.bin: $(ge/RENDER_SHADER_DIR)/%_vs.sc $(ge/RENDER_SHADER_DIR)/varying.def.sc $(ge/SHADERC)
	@mkdir -p $(dir $@)
	$(ge/SHADERC) -f $< -o $@ --type vertex \
	    --platform $(ge/SHADERC_PLATFORM) -p $(ge/SHADERC_PROFILE) \
	    --varyingdef $(ge/RENDER_SHADER_DIR)/varying.def.sc \
	    -i $(ge/SHADERC_BGFX_INCLUDE) -i $(ge/RENDER_SHADER_DIR)

$(BUILD_DIR)/ge/shaders/%_fs.bin: $(ge/RENDER_SHADER_DIR)/%_fs.sc $(ge/RENDER_SHADER_DIR)/varying.def.sc $(ge/SHADERC)
	@mkdir -p $(dir $@)
	$(ge/SHADERC) -f $< -o $@ --type fragment \
	    --platform $(ge/SHADERC_PLATFORM) -p $(ge/SHADERC_PROFILE) \
	    --varyingdef $(ge/RENDER_SHADER_DIR)/varying.def.sc \
	    -i $(ge/SHADERC_BGFX_INCLUDE) -i $(ge/RENDER_SHADER_DIR)

# SPIR-V variants — for the Vulkan backend (Android). Output lives in
# $(BUILD_DIR)/shaders-spirv/ and $(BUILD_DIR)/ge/shaders-spirv/. The
# Android Gradle syncAssets task flattens these into assets/build/shaders/
# so runtime lookups continue to work via ge::resource("build/shaders/...").
$(BUILD_DIR)/$(ge/SHADER_DIR)-spirv/%_vs.bin: $(ge/SHADER_DIR)/%_vs.sc $(ge/SHADERC_VARYINGDEF) $(ge/SHADERC)
	@mkdir -p $(dir $@)
	$(ge/SHADERC) -f $< -o $@ --type vertex \
	    --platform android -p spirv \
	    --varyingdef $(ge/SHADERC_VARYINGDEF) \
	    -i $(ge/SHADERC_BGFX_INCLUDE) -i $(ge/SHADER_DIR)

$(BUILD_DIR)/$(ge/SHADER_DIR)-spirv/%_fs.bin: $(ge/SHADER_DIR)/%_fs.sc $(ge/SHADERC_VARYINGDEF) $(ge/SHADERC)
	@mkdir -p $(dir $@)
	$(ge/SHADERC) -f $< -o $@ --type fragment \
	    --platform android -p spirv \
	    --varyingdef $(ge/SHADERC_VARYINGDEF) \
	    -i $(ge/SHADERC_BGFX_INCLUDE) -i $(ge/SHADER_DIR)

$(BUILD_DIR)/ge/shaders-spirv/%_vs.bin: $(ge/RENDER_SHADER_DIR)/%_vs.sc $(ge/RENDER_SHADER_DIR)/varying.def.sc $(ge/SHADERC)
	@mkdir -p $(dir $@)
	$(ge/SHADERC) -f $< -o $@ --type vertex \
	    --platform android -p spirv \
	    --varyingdef $(ge/RENDER_SHADER_DIR)/varying.def.sc \
	    -i $(ge/SHADERC_BGFX_INCLUDE) -i $(ge/RENDER_SHADER_DIR)

$(BUILD_DIR)/ge/shaders-spirv/%_fs.bin: $(ge/RENDER_SHADER_DIR)/%_fs.sc $(ge/RENDER_SHADER_DIR)/varying.def.sc $(ge/SHADERC)
	@mkdir -p $(dir $@)
	$(ge/SHADERC) -f $< -o $@ --type fragment \
	    --platform android -p spirv \
	    --varyingdef $(ge/RENDER_SHADER_DIR)/varying.def.sc \
	    -i $(ge/SHADERC_BGFX_INCLUDE) -i $(ge/RENDER_SHADER_DIR)

# Desktop player binary (symmetry with ge/ios and ge/android).
.PHONY: ge/player
ge/player: $(ge/PLAYER)

$(ge/PLAYER): $(ge/PLAYER_SRC) $(ge/LIB) $(ge/BGFX_LIBS)
	@mkdir -p $(@D)
	$(CXX) -std=c++20 -DGE_DESKTOP $(ge/INCLUDES) $(ge/BGFX_ALL_INCLUDES) $(ge/PLAYER_SRC) $(ge/LIB) $(ge/BGFX_LIBS) $(ge/SDL_LIBS) $(FRAMEWORKS) -o $@

# imgdiff helper — used by matrix-test.sh for reference-image checks.
.PHONY: ge/imgdiff
ge/imgdiff: $(ge/IMGDIFF)

$(ge/IMGDIFF): $(ge)/tools/imgdiff.cpp
	@mkdir -p $(@D)
	$(CXX) -std=c++20 -O2 -I$(ge)/include -I$(ge)/vendor/include $< -o $@

# ────────────────────────────────────────────────
# Mobile targets
#
#   ge/ios, ge/android — build the *consuming app's* mobile distribution
#     project (the `ios/` or `android/` directory produced by ge/ios-init /
#     ge/android-init). These are the usual entry points for app authors.
#
#   ge/player-ios, ge/player-android — build the brokered ge *player* binary
#     for iOS / Android. Used for remote-rendering (ged + server) setups, and
#     by matrix-test.sh's player cells. Independent of the consuming app.
#
#   ge/ios-init, ge/android-init — generate the app-side ios/ or android/
#     scaffolding from ge/tools/{ios,android}-template. Parent passes APP_ID
#     and APP_NAME.
# ────────────────────────────────────────────────

# ── Consuming app's iOS build ──────────────────────────────────────

# Generate the Xcode project (if not already generated) and build the .app
# into ios/build/xcode/Debug-iphonesimulator/ (or the device equivalent).
# Expects ios/CMakeLists.txt to exist — run `make ge/ios-init` first.
#
# We depend on $(APP_SHADERS) and $(ge/RENDER_SHADERS) so they exist on disk
# when CMake's file(GLOB ...) for the bundle Resources runs.
.PHONY: ge/ios
ge/ios: $(APP_SHADERS) $(ge/RENDER_SHADERS)
	@if [ ! -d ios ]; then \
	    echo "ios/ not found — run 'make ge/ios-init APP_ID=... APP_NAME=...' first"; \
	    exit 1; \
	fi
	cd ios && cmake -G Xcode -B build/xcode \
	    -DCMAKE_SYSTEM_NAME=iOS \
	    -DCMAKE_OSX_ARCHITECTURES=arm64 \
	    -DCMAKE_OSX_SYSROOT=iphonesimulator \
	    -DCMAKE_OSX_DEPLOYMENT_TARGET=16.0
	cd ios && xcodebuild \
	    -project build/xcode/$(APP_DISPLAY_NAME).xcodeproj -scheme $(APP_DISPLAY_NAME) \
	    -configuration Debug -destination "generic/platform=iOS Simulator" \
	    build

# ── Consuming app's Android build ──────────────────────────────────

.PHONY: ge/android
ge/android: $(ge/APP_SHADERS_SPIRV) $(ge/RENDER_SHADERS_SPIRV)
	@if [ ! -d android ]; then \
	    echo "android/ not found — run 'make ge/android-init APP_ID=... APP_NAME=...' first"; \
	    exit 1; \
	fi
	cd android && ./gradlew assembleDebug
	@echo "APK: android/app/build/outputs/apk/debug/app-debug.apk"

# ── ge player for iOS / Android ────────────────────────────────────

# Generate the Xcode project for the ge player binary (tools/ios/).
.PHONY: ge/player-ios
ge/player-ios:
	cd $(ge)/tools/ios && cmake -G Xcode -B build/xcode \
	    -DCMAKE_SYSTEM_NAME=iOS \
	    -DCMAKE_OSX_ARCHITECTURES=arm64 \
	    -DCMAKE_OSX_SYSROOT=iphoneos \
	    -DCMAKE_OSX_DEPLOYMENT_TARGET=16.0
	@echo "Open $(ge)/tools/ios/build/xcode/Player.xcodeproj in Xcode"

# ge player iOS archive (generate project + xcodebuild archive)
.PHONY: ge/player-ios-archive
ge/player-ios-archive: ge/player-ios
	cd $(ge)/tools/ios && xcodebuild \
	    -project build/xcode/Player.xcodeproj \
	    -scheme Player \
	    -destination "generic/platform=iOS" \
	    -archivePath build/Player.xcarchive \
	    -allowProvisioningUpdates \
	    archive

# ge player TestFlight upload (archive + export/upload to App Store Connect)
.PHONY: ge/player-ios-testflight
ge/player-ios-testflight: ge/player-ios-archive
	cd $(ge)/tools/ios && xcodebuild -exportArchive \
	    -archivePath build/Player.xcarchive \
	    -exportOptionsPlist ExportOptions.plist \
	    -exportPath build/export \
	    -allowProvisioningUpdates
	@echo "Uploaded to App Store Connect — check TestFlight in https://appstoreconnect.apple.com"

# ge player Android debug APK
.PHONY: ge/player-android
ge/player-android:
	cd $(ge)/tools/android && ./gradlew assembleDebug
	@echo "APK: $(ge)/tools/android/app/build/outputs/apk/debug/app-debug.apk"

# ge player Android release AAB for Play Store upload
.PHONY: ge/player-android-release
ge/player-android-release:
	cd $(ge)/tools/android && ./gradlew bundleRelease
	@echo "AAB: $(ge)/tools/android/app/build/outputs/bundle/release/app-release.aab"

# ── Mobile project scaffolding (consuming app) ─────────────────────

# Parent Makefile sets APP_ID (bundle id / package) and APP_NAME before
# calling. APP_DISPLAY_NAME defaults to APP_NAME; override for a prettier
# on-device name while keeping APP_NAME as the lowercase binary name.
.PHONY: ge/android-init
ge/android-init:
	@if [ -z "$(APP_ID)" ] || [ -z "$(APP_NAME)" ]; then \
		echo "Error: set APP_ID and APP_NAME"; exit 1; fi
	$(ge)/tools/init-android.sh "$(APP_ID)" "$(APP_DISPLAY_NAME)"

.PHONY: ge/ios-init
ge/ios-init:
	@if [ -z "$(APP_ID)" ] || [ -z "$(APP_NAME)" ]; then \
		echo "Error: set APP_ID and APP_NAME"; exit 1; fi
	$(ge)/tools/init-ios.sh "$(APP_ID)" "$(APP_DISPLAY_NAME)" "$(IOS_DEVELOPMENT_TEAM)"

# ────────────────────────────────────────────────
# Generic targets (use CLEAN, COMPILE_DB_DEPS)
# ────────────────────────────────────────────────

.PHONY: clean
clean:
	rm -rf $(CLEAN)

# ────────────────────────────────────────────────
# Dependency graph (parent can extend ge/DEPGRAPH_DEPS)
# ────────────────────────────────────────────────

.PHONY: depgraph clean-depgraph
depgraph: deps.svg

deps.svg: $(ge/DEPGRAPH_DEPS)
	python3 $(ge)/tools/depgraph.py --format svg --output deps

deps.dot: $(ge/DEPGRAPH_DEPS)
	python3 $(ge)/tools/depgraph.py --format dot --output deps

clean-depgraph:
	rm -f deps.dot deps.svg deps.png

# Generate compile_commands.json for IDE support (clangd, VS Code).
# compiledb captures all sub-make commands,
# so we filter to only project entries afterward.
compile_commands.json: $(COMPILE_DB_DEPS)
	@compiledb -n make
	@python3 -c "import json,pathlib; p=pathlib.Path('compile_commands.json'); d=json.loads(p.read_text()); p.write_text(json.dumps([e for e in d if e['directory']=='$(CURDIR)'],indent=1)+'\n')"

# ────────────────────────────────────────────────
# Developer setup (common engine prerequisites)
# ────────────────────────────────────────────────

.PHONY: ge/init
ge/init:
	@echo "── ge engine setup ──"
	@command -v brew >/dev/null 2>&1 || { echo "ERROR: Homebrew not found. Install from https://brew.sh"; exit 1; }
	@echo "  Homebrew installed"
	@command -v xcode-select >/dev/null 2>&1 && xcode-select -p >/dev/null 2>&1 || { echo "ERROR: Xcode Command Line Tools not found. Run: xcode-select --install"; exit 1; }
	@echo "  Xcode Command Line Tools installed"
	@brew install git-lfs
	@git lfs install
	@git lfs pull
	@echo "  Dependencies installed"
	@brew install compiledb
	@$(MAKE) compile_commands.json
	@echo "  compile_commands.json generated"

# Dashboard web app (Vite + React)
.PHONY: web
web:
	cd $(ge)/web && npm install && npm run build

# Game Engine Daemon (Go binary with embedded web UI)
.PHONY: ged
ged: web
	@if [ ! -d $(ge)/web/dist ]; then \
		echo "ERROR: $(ge)/web/dist not found. Run 'make web' first."; exit 1; \
	fi
	@rm -rf $(ge)/ged/web/dist
	@mkdir -p $(ge)/ged/web
	@cp -R $(ge)/web/dist $(ge)/ged/web/dist
	cd $(ge)/ged && go build -o $(CURDIR)/bin/ged .

.PHONY: ged-test
ged-test:
	@if [ ! -d $(ge)/ged/web/dist ]; then \
		mkdir -p $(ge)/ged/web/dist && touch $(ge)/ged/web/dist/index.html; \
	fi
	cd $(ge)/ged && go test ./...

# Canned recipe for the parent to expand at the end of its init target.
define ge/INIT_DONE
	@echo ""
	@echo "Setup complete. Next steps:"
	@echo "  make              # Build the application"
	@echo "  make run          # Build and run"
	@echo "  make test         # Run all tests"
endef

# Dep-file include for the app's own objects. Engine object .d files are
# already picked up by their own implicit pattern-rule dep tracking.
-include $(APP_OBJ:.o=.d)
