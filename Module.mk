# ge engine module
# Included by the project Makefile. Expects BUILD_DIR and CXX to be defined.
ge := ge

# ────────────────────────────────────────────────
# make controls
# ────────────────────────────────────────────────

MAKEFLAGS += -j$(shell sysctl -n hw.ncpu 2>/dev/null || nproc 2>/dev/null || echo 4)

# ────────────────────────────────────────────────
# Variables exported to parent
# ────────────────────────────────────────────────

ge/INCLUDES = \
	-Ige/include \
	-Ige/vendor/include \
	-Ige/vendor/github.com/gabime/spdlog/include \
	-Ige/vendor/dawn/include \
	-Ige/vendor/github.com/libsdl-org/SDL/include \
	-Ige/vendor/sdl3/include \
	-Ige/vendor/github.com/erincatto/box2d/include \
	-DSQLITE_ENABLE_SESSION -DSQLITE_ENABLE_PREUPDATE_HOOK -DSQLITE_ENABLE_DESERIALIZE

# Dawn (WebGPU) libraries
# Order matters: dawn_proc first (provides switchable wgpu* stubs), then webgpu_dawn (native impl)
ge/DAWN_PROC_LIB = ge/vendor/dawn/lib/macos-arm64/libdawn_proc.a
ge/DAWN_LIB = ge/vendor/dawn/lib/macos-arm64/libwebgpu_dawn.a
ge/DAWN_LIBS = $(ge/DAWN_PROC_LIB) $(ge/DAWN_LIB)

# bgfx + bx + bimg (vendored, compiled from source)
ge/BX_DIR = ge/vendor/github.com/bkaradzic/bx
ge/BIMG_DIR = ge/vendor/github.com/bkaradzic/bimg
ge/BGFX_DIR = ge/vendor/github.com/bkaradzic/bgfx

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
ge/SDL3_LIB = ge/vendor/sdl3/lib/macos-arm64/libSDL3.a
ge/SDL3_IMAGE_LIB = ge/vendor/sdl3/lib/macos-arm64/libSDL3_image.a
ge/SDL3_TTF_LIB = ge/vendor/sdl3/lib/macos-arm64/libSDL3_ttf.a
ge/FREETYPE_LIB = ge/vendor/sdl3/lib/macos-arm64/libfreetype.a
ge/HARFBUZZ_LIB = ge/vendor/sdl3/lib/macos-arm64/libharfbuzz.a
ge/PLUTOSVG_LIB = ge/vendor/sdl3/lib/macos-arm64/libplutosvg.a
ge/PLUTOVG_LIB = ge/vendor/sdl3/lib/macos-arm64/libplutovg.a
ge/SDL_LIBS = $(ge/SDL3_LIB) $(ge/SDL3_IMAGE_LIB) $(ge/SDL3_TTF_LIB) $(ge/FREETYPE_LIB) $(ge/HARFBUZZ_LIB) $(ge/PLUTOSVG_LIB) $(ge/PLUTOVG_LIB)

ge/SRC = \
	ge/src/GpuContext.cpp \
	ge/src/SdlContext.cpp \
	ge/src/NativeSurface_apple.cpp \
	ge/src/Texture.cpp \
	ge/src/Mesh.cpp \
	ge/src/Model.cpp \
	ge/src/ManifestLoader.cpp \
	ge/src/Pipeline.cpp \
	ge/src/BindGroup.cpp \
	ge/src/Resource.cpp \
	ge/src/FileIO.cpp \
	ge/src/TextRenderer.cpp \
	ge/src/CaptureTarget.cpp \
	ge/src/Audio.cpp \
	ge/src/SessionHost.cpp \
	ge/src/WebSocketClient.cpp \
	ge/src/StreamSession.cpp \
	ge/src/SharedTexture_apple.mm \
	ge/src/UniformRing.cpp \
	ge/src/VideoEncoder_apple.mm \
	ge/src/VideoDecoder_apple.mm

# Session backend objects (linked by the parent, not part of libge.a)
ge/SESSION_DIRECT_OBJ = $(BUILD_DIR)/ge/src/SessionDirect.o
ge/SESSION_HEADLESS_OBJ = $(BUILD_DIR)/ge/src/SessionHeadless.o

ge/OBJ = $(patsubst %.cpp,$(BUILD_DIR)/%.o,$(filter %.cpp,$(ge/SRC))) \
         $(patsubst %.mm,$(BUILD_DIR)/%.o,$(filter %.mm,$(ge/SRC)))
ge/LIB = $(BUILD_DIR)/libge.a

# Texture encoder (used by precompute tools, NOT part of libge.a)
ge/TEXTURE_ENCODER_SRC = ge/src/TextureEncoder.cpp
ge/TEXTURE_ENCODER_OBJ = $(BUILD_DIR)/ge/src/TextureEncoder.o

# Box2D v3 physics library (C code)
ge/BOX2D_DIR = ge/vendor/github.com/erincatto/box2d
ge/BOX2D_SRC = $(wildcard $(ge/BOX2D_DIR)/src/*.c)
ge/BOX2D_OBJ = $(patsubst %.c,$(BUILD_DIR)/%.o,$(ge/BOX2D_SRC))
ge/BOX2D_CFLAGS = -I$(ge/BOX2D_DIR)/include -I$(ge/BOX2D_DIR)/src -O2 -std=c17

# SQLite3 (C code, vendored amalgamation — used by Tweak.h)
ge/SQLITE_SRC = ge/vendor/src/sqlite3.c
ge/SQLITE_OBJ = $(BUILD_DIR)/ge/vendor/sqlite3.o

# Triangle library (C code, used by precompute tool)
ge/TRIANGLE_SRC = ge/vendor/src/triangle.c
ge/TRIANGLE_OBJ = $(BUILD_DIR)/ge/vendor/triangle.o
ge/TRIANGLE_CFLAGS = -O2 -Ige/vendor/include -DTRILIBRARY -DREAL=double -DANSI_DECLARATORS -DNO_TIMER

# lz4 compression (C code, used by sqlpipe)
ge/LZ4_SRC = ge/vendor/src/lz4.c
ge/LZ4_OBJ = $(BUILD_DIR)/ge/vendor/lz4.o

# Vendor C++ libraries (compiled into libge.a)
ge/VENDOR_CPP_SRC = ge/vendor/src/sqlift.cpp ge/vendor/src/sqlpipe.cpp
ge/VENDOR_CPP_OBJ = $(patsubst %.cpp,$(BUILD_DIR)/%.o,$(ge/VENDOR_CPP_SRC))

# Player tool (standalone binary)
ge/PLAYER_SRC = ge/tools/player.cpp ge/tools/player_core.cpp ge/tools/player_platform_apple.cpp ge/tools/AudioPlayer.cpp \
	ge/tools/player_capture_apple.mm
ge/PLAYER_OBJ = $(patsubst %.cpp,$(BUILD_DIR)/%.o,$(filter %.cpp,$(ge/PLAYER_SRC))) \
                $(patsubst %.mm,$(BUILD_DIR)/%.o,$(filter %.mm,$(ge/PLAYER_SRC)))
ge/PLAYER = bin/player

# bgfx spike test
ge/BGFX_TEST_SRC = ge/tools/bgfx_test.cpp
ge/BGFX_TEST_OBJ = $(BUILD_DIR)/ge/tools/bgfx_test.o
ge/BGFX_TEST = bin/bgfx_test

# Framework libraries (Dawn WebGPU)
ge/FRAMEWORK_LIBS = $(ge/DAWN_LIBS)

# Test sources
ge/TEST_SRC = \
	ge/src/main_test.cpp \
	ge/src/GpuContext_test.cpp \
	ge/src/DampedRotation_test.cpp
ge/TEST_OBJ = $(patsubst %.cpp,$(BUILD_DIR)/%.o,$(ge/TEST_SRC))

# Shared variables (parent can += to extend)
CLEAN = bin build deps.dot deps.svg deps.png ge/ged/web
COMPILE_DB_DEPS = $(ge/SRC) $(ge/TEST_SRC) $(ge/PLAYER_SRC) ge/Module.mk
ge/DEPGRAPH_DEPS = $(ge/SRC) $(wildcard ge/include/ge/*.h) ge/tools/depgraph.py

# ────────────────────────────────────────────────
# Rules
# ────────────────────────────────────────────────

# Engine objects
$(BUILD_DIR)/ge/src/%.o: ge/src/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) $(SDL_CFLAGS) -MMD -MP -c $< -o $@

# Engine ObjC++ objects (.mm)
$(BUILD_DIR)/ge/src/%.o: ge/src/%.mm
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) $(SDL_CFLAGS) -MMD -MP -c $< -o $@

# Static library
$(ge/LIB): $(ge/OBJ) $(ge/SQLITE_OBJ) $(ge/LZ4_OBJ) $(ge/VENDOR_CPP_OBJ)
	@mkdir -p $(dir $@)
	$(AR) rcs $@ $^

# Vendor C++ sources
$(BUILD_DIR)/ge/vendor/%.o: ge/vendor/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -MMD -MP -c $< -o $@

# Box2D library
$(BUILD_DIR)/$(ge/BOX2D_DIR)/src/%.o: $(ge/BOX2D_DIR)/src/%.c
	@mkdir -p $(dir $@)
	$(CC) $(ge/BOX2D_CFLAGS) -MMD -MP -c $< -o $@

# SQLite3 (C amalgamation)
$(ge/SQLITE_OBJ): $(ge/SQLITE_SRC)
	@mkdir -p $(dir $@)
	$(CC) -O2 -Ige/vendor/include -DSQLITE_ENABLE_SESSION -DSQLITE_ENABLE_PREUPDATE_HOOK -DSQLITE_ENABLE_DESERIALIZE -c $< -o $@

# lz4 compression
$(ge/LZ4_OBJ): $(ge/LZ4_SRC)
	@mkdir -p $(dir $@)
	$(CC) -O2 -Ige/vendor/include -c $< -o $@

# Triangle library
$(ge/TRIANGLE_OBJ): $(ge/TRIANGLE_SRC)
	@mkdir -p $(dir $@)
	$(CC) $(ge/TRIANGLE_CFLAGS) -c $< -o $@

# Player objects
$(BUILD_DIR)/ge/tools/%.o: ge/tools/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) $(SDL_CFLAGS) -MMD -MP -c $< -o $@

# Player ObjC++ objects (.mm)
$(BUILD_DIR)/ge/tools/%.o: ge/tools/%.mm
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) $(SDL_CFLAGS) -MMD -MP -c $< -o $@

# Player binary
$(ge/PLAYER): $(ge/PLAYER_OBJ) $(ge/LIB) $(ge/DAWN_LIBS)
	@mkdir -p bin
	$(CXX) $(ge/PLAYER_OBJ) $(ge/LIB) $(ge/DAWN_LIBS) $(FRAMEWORKS) $(SDL_LIBS) -o $@

# bgfx spike test binary
$(ge/BGFX_TEST_OBJ): $(ge/BGFX_TEST_SRC)
	@mkdir -p $(dir $@)
	$(CXX) -std=c++20 -O2 $(ge/BGFX_ALL_INCLUDES) -Ige/include -Ige/vendor/github.com/gabime/spdlog/include -Ige/vendor/github.com/libsdl-org/SDL/include -Ige/vendor/sdl3/include -DBX_CONFIG_DEBUG=0 -MMD -MP -c $< -o $@

$(ge/BGFX_TEST): $(ge/BGFX_TEST_OBJ) $(ge/BGFX_LIBS) $(ge/SDL3_LIB)
	@mkdir -p bin
	$(CXX) $(ge/BGFX_TEST_OBJ) $(ge/BGFX_LIBS) $(ge/SDL3_LIB) -framework Metal -framework QuartzCore -framework IOKit -framework Foundation -framework Cocoa -framework Carbon -framework CoreAudio -framework AudioToolbox -framework CoreHaptics -framework GameController -framework CoreVideo -framework ForceFeedback -framework CoreFoundation -framework AVFoundation -framework CoreMedia -framework UniformTypeIdentifiers -framework CoreGraphics -o $@

# Dawn libraries are prebuilt; no build rule needed

# bx (amalgamated build)
$(ge/BX_OBJ): $(ge/BX_DIR)/src/amalgamated.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(ge/BGFX_CXXFLAGS) -I$(ge/BX_DIR)/3rdparty -MMD -MP -c $< -o $@

$(ge/BX_LIB): $(ge/BX_OBJ)
	@mkdir -p $(dir $@)
	$(AR) rcs $@ $^

# bimg (amalgamated build — needs bx + bimg internal headers)
$(BUILD_DIR)/ge/vendor/bimg_%.o: $(ge/BIMG_DIR)/src/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(ge/BGFX_CXXFLAGS) -DBIMG_CONFIG_DECODE_ENABLE=0 -I$(ge/BIMG_DIR)/3rdparty -I$(ge/BIMG_DIR)/3rdparty/astc-encoder/include -MMD -MP -c $< -o $@

$(ge/BIMG_LIB): $(ge/BIMG_OBJ)
	@mkdir -p $(dir $@)
	$(AR) rcs $@ $^

# bgfx (amalgamated build — Metal renderer needs ObjC++ for MTLCopyAllDevicesWithObserver)
$(ge/BGFX_OBJ): $(ge/BGFX_DIR)/src/amalgamated.cpp
	@mkdir -p $(dir $@)
	$(CXX) -ObjC++ $(ge/BGFX_CXXFLAGS) -I$(ge/BGFX_DIR)/3rdparty -I$(ge/BGFX_DIR)/3rdparty/khronos -I$(ge/BGFX_DIR)/src -MMD -MP -c $< -o $@

$(ge/BGFX_LIB): $(ge/BGFX_OBJ)
	@mkdir -p $(dir $@)
	$(AR) rcs $@ $^

# iOS Xcode project generation
.PHONY: ge/ios
ge/ios:
	cd ge/tools/ios && cmake -G Xcode -B build/xcode \
	    -DCMAKE_SYSTEM_NAME=iOS \
	    -DCMAKE_OSX_ARCHITECTURES=arm64 \
	    -DCMAKE_OSX_SYSROOT=iphoneos \
	    -DCMAKE_OSX_DEPLOYMENT_TARGET=16.0
	@echo "Open ge/tools/ios/build/xcode/Player.xcodeproj in Xcode"

# iOS player archive (generate Xcode project + xcodebuild archive)
.PHONY: ge/ios-archive
ge/ios-archive: ge/ios
	cd ge/tools/ios && xcodebuild \
	    -project build/xcode/Player.xcodeproj \
	    -scheme Player \
	    -destination "generic/platform=iOS" \
	    -archivePath build/Player.xcarchive \
	    -allowProvisioningUpdates \
	    archive

# iOS player TestFlight upload (archive + export/upload to App Store Connect)
.PHONY: ge/ios-testflight
ge/ios-testflight: ge/ios-archive
	cd ge/tools/ios && xcodebuild -exportArchive \
	    -archivePath build/Player.xcarchive \
	    -exportOptionsPlist ExportOptions.plist \
	    -exportPath build/export \
	    -allowProvisioningUpdates
	@echo "Uploaded to App Store Connect — check TestFlight in https://appstoreconnect.apple.com"

# Android debug APK (player)
.PHONY: ge/android
ge/android:
	cd ge/tools/android && ./gradlew assembleDebug
	@echo "APK: ge/tools/android/app/build/outputs/apk/debug/app-debug.apk"

# Android release AAB for Play Store upload
.PHONY: ge/android-release
ge/android-release:
	cd ge/tools/android && ./gradlew bundleRelease
	@echo "AAB: ge/tools/android/app/build/outputs/bundle/release/app-release.aab"

# Direct-mode project generation
# Parent Makefile sets APP_ID and APP_NAME before calling.
.PHONY: ge/android-init
ge/android-init:
	@if [ -z "$(APP_ID)" ] || [ -z "$(APP_NAME)" ]; then \
		echo "Error: set APP_ID and APP_NAME"; exit 1; fi
	ge/tools/init-android.sh "$(APP_ID)" "$(APP_NAME)"

.PHONY: ge/ios-init
ge/ios-init:
	@if [ -z "$(APP_ID)" ] || [ -z "$(APP_NAME)" ]; then \
		echo "Error: set APP_ID and APP_NAME"; exit 1; fi
	ge/tools/init-ios.sh "$(APP_ID)" "$(APP_NAME)" "$(IOS_DEVELOPMENT_TEAM)"

# ────────────────────────────────────────────────
# Generic targets (use CLEAN, CLEAN_SHADERS, COMPILE_DB_DEPS)
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
	python3 ge/tools/depgraph.py --format svg --output deps

deps.dot: $(ge/DEPGRAPH_DEPS)
	python3 ge/tools/depgraph.py --format dot --output deps

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
	@mkdir -p .vscode
	@(cat .vscode/settings.json 2>/dev/null || echo '{}') | \
		jq '. + {"files.associations": ((."files.associations" // {}) + {"*.wgsl": "wgsl"})}' \
		> .vscode/settings.json.tmp && \
		mv .vscode/settings.json.tmp .vscode/settings.json
	@echo "  VS Code: .wgsl -> WGSL association configured"
	@brew install compiledb
	@$(MAKE) compile_commands.json
	@echo "  compile_commands.json generated"

# Dashboard web app (Vite + React)
.PHONY: web
web:
	cd ge/web && npm install && npm run build

# Game Engine Daemon (Go binary with embedded web UI)
.PHONY: ged
ged: web
	@if [ ! -d ge/web/dist ]; then \
		echo "ERROR: ge/web/dist not found. Run 'make web' first."; exit 1; \
	fi
	@rm -rf ge/ged/web/dist
	@mkdir -p ge/ged/web
	@cp -R ge/web/dist ge/ged/web/dist
	cd ge/ged && go build -o ../../bin/ged .

.PHONY: ged-test
ged-test:
	@if [ ! -d ge/ged/web/dist ]; then \
		mkdir -p ge/ged/web/dist && touch ge/ged/web/dist/index.html; \
	fi
	cd ge/ged && go test ./...

# Canned recipe for the parent to expand at the end of its init target.
define ge/INIT_DONE
	@echo ""
	@echo "Setup complete. Next steps:"
	@echo "  make              # Build the application"
	@echo "  make run          # Build and run"
	@echo "  make test         # Run all tests"
endef
