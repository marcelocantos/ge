# sq engine module
# Included by the project Makefile. Expects BUILD_DIR and CXX to be defined.
sq := sq

# ────────────────────────────────────────────────
# Variables exported to parent
# ────────────────────────────────────────────────

sq/INCLUDES = \
	-Isq/include \
	-Isq/vendor/include \
	-Isq/vendor/github.com/gabime/spdlog/include \
	-Isq/vendor/dawn/include \
	-Isq/vendor/github.com/libsdl-org/SDL/include \
	-Isq/vendor/sdl3/include \
	-Isq/vendor/github.com/nayuki/QR-Code-generator/cpp

# Dawn (WebGPU) libraries
# Order matters: dawn_proc first (provides switchable wgpu* stubs), then webgpu_dawn (native impl)
sq/DAWN_PROC_LIB = sq/vendor/dawn/lib/macos-arm64/libdawn_proc.a
sq/DAWN_LIB = sq/vendor/dawn/lib/macos-arm64/libwebgpu_dawn.a
sq/DAWN_WIRE_LIB = sq/vendor/dawn/lib/macos-arm64/libdawn_wire.a
sq/DAWN_LIBS = $(sq/DAWN_PROC_LIB) $(sq/DAWN_LIB) $(sq/DAWN_WIRE_LIB)

# SDL3 libraries (static, vendored)
sq/SDL3_LIB = sq/vendor/sdl3/lib/macos-arm64/libSDL3.a
sq/SDL3_IMAGE_LIB = sq/vendor/sdl3/lib/macos-arm64/libSDL3_image.a
sq/SDL3_TTF_LIB = sq/vendor/sdl3/lib/macos-arm64/libSDL3_ttf.a
sq/FREETYPE_LIB = sq/vendor/sdl3/lib/macos-arm64/libfreetype.a
sq/HARFBUZZ_LIB = sq/vendor/sdl3/lib/macos-arm64/libharfbuzz.a
sq/PLUTOSVG_LIB = sq/vendor/sdl3/lib/macos-arm64/libplutosvg.a
sq/PLUTOVG_LIB = sq/vendor/sdl3/lib/macos-arm64/libplutovg.a
sq/SDL_LIBS = $(sq/SDL3_LIB) $(sq/SDL3_IMAGE_LIB) $(sq/SDL3_TTF_LIB) $(sq/FREETYPE_LIB) $(sq/HARFBUZZ_LIB) $(sq/PLUTOSVG_LIB) $(sq/PLUTOVG_LIB)

sq/SRC = \
	sq/src/GpuContext.cpp \
	sq/src/SdlContext.cpp \
	sq/src/NativeSurface_apple.cpp \
	sq/src/Texture.cpp \
	sq/src/Mesh.cpp \
	sq/src/Model.cpp \
	sq/src/ManifestLoader.cpp \
	sq/src/Pipeline.cpp \
	sq/src/BindGroup.cpp \
	sq/src/Resource.cpp \
	sq/src/FileIO.cpp \
	sq/src/CaptureTarget.cpp \
	sq/src/WireTransport.cpp \
	sq/src/WireSession.cpp \
	sq/vendor/github.com/nayuki/QR-Code-generator/cpp/qrcodegen.cpp

# Session backend objects (linked by the parent, not part of libsq.a)
sq/SESSION_WIRE_OBJ = $(BUILD_DIR)/sq/src/SessionWire.o
sq/SESSION_DIRECT_OBJ = $(BUILD_DIR)/sq/src/SessionDirect.o

sq/OBJ = $(patsubst %.cpp,$(BUILD_DIR)/%.o,$(sq/SRC))
sq/LIB = $(BUILD_DIR)/libsq.a

# Texture encoder (used by precompute tools, NOT part of libsq.a)
sq/TEXTURE_ENCODER_SRC = sq/src/TextureEncoder.cpp
sq/TEXTURE_ENCODER_OBJ = $(BUILD_DIR)/sq/src/TextureEncoder.o

# Triangle library (C code, used by precompute tool)
sq/TRIANGLE_SRC = sq/vendor/src/triangle.c
sq/TRIANGLE_OBJ = $(BUILD_DIR)/sq/vendor/triangle.o
sq/TRIANGLE_CFLAGS = -O2 -Isq/vendor/include -DTRILIBRARY -DREAL=double -DANSI_DECLARATORS -DNO_TIMER

# Wire receiver tool (standalone binary)
sq/RECEIVER_SRC = sq/tools/receiver.cpp sq/tools/receiver_core.cpp sq/tools/receiver_platform_apple.cpp
sq/RECEIVER_OBJ = $(patsubst %.cpp,$(BUILD_DIR)/%.o,$(sq/RECEIVER_SRC))
sq/RECEIVER = bin/receiver

# Framework libraries (Dawn WebGPU)
sq/FRAMEWORK_LIBS = $(sq/DAWN_LIBS)

# Test sources
sq/TEST_SRC = \
	sq/src/main_test.cpp \
	sq/src/GpuContext_test.cpp \
	sq/src/DampedRotation_test.cpp \
	sq/src/WireTransport_test.cpp
sq/TEST_OBJ = $(patsubst %.cpp,$(BUILD_DIR)/%.o,$(sq/TEST_SRC))

# Shared variables (parent can += to extend)
CLEAN = bin build deps.dot deps.svg deps.png
COMPILE_DB_DEPS = $(sq/SRC) $(sq/TEST_SRC) $(sq/RECEIVER_SRC) sq/Module.mk
sq/DEPGRAPH_DEPS = $(sq/SRC) $(wildcard sq/include/sq/*.h) sq/tools/depgraph.py

# ────────────────────────────────────────────────
# Rules
# ────────────────────────────────────────────────

# Engine objects
$(BUILD_DIR)/sq/src/%.o: sq/src/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) $(SDL_CFLAGS) -MMD -MP -c $< -o $@

# Static library
$(sq/LIB): $(sq/OBJ)
	@mkdir -p $(dir $@)
	$(AR) rcs $@ $^

# Vendor C++ sources
$(BUILD_DIR)/sq/vendor/%.o: sq/vendor/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -MMD -MP -c $< -o $@

# Triangle library
$(sq/TRIANGLE_OBJ): $(sq/TRIANGLE_SRC)
	@mkdir -p $(dir $@)
	$(CC) $(sq/TRIANGLE_CFLAGS) -c $< -o $@

# Receiver objects
$(BUILD_DIR)/sq/tools/%.o: sq/tools/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) $(SDL_CFLAGS) -MMD -MP -c $< -o $@

# Receiver binary
$(sq/RECEIVER): $(sq/RECEIVER_OBJ) $(sq/LIB) $(sq/DAWN_LIBS)
	@mkdir -p bin
	$(CXX) $(sq/RECEIVER_OBJ) $(sq/LIB) $(sq/DAWN_LIBS) $(FRAMEWORKS) $(SDL_LIBS) -o $@

# Dawn libraries are prebuilt; no build rule needed

# iOS Xcode project generation
.PHONY: sq/ios
sq/ios:
	cd sq/tools/ios && cmake -G Xcode -B build/xcode \
	    -DCMAKE_SYSTEM_NAME=iOS \
	    -DCMAKE_OSX_ARCHITECTURES=arm64 \
	    -DCMAKE_OSX_DEPLOYMENT_TARGET=16.0
	@echo "Open sq/tools/ios/build/xcode/Receiver.xcodeproj in Xcode"

# Android APK build (receiver)
.PHONY: sq/android
sq/android:
	cd sq/tools/android && ./gradlew assembleDebug
	@echo "APK: sq/tools/android/app/build/outputs/apk/debug/app-debug.apk"

# Direct-mode project generation
# Parent Makefile sets APP_ID and APP_NAME before calling.
.PHONY: sq/android-init
sq/android-init:
	@if [ -z "$(APP_ID)" ] || [ -z "$(APP_NAME)" ]; then \
		echo "Error: set APP_ID and APP_NAME"; exit 1; fi
	sq/tools/init-android.sh "$(APP_ID)" "$(APP_NAME)"

.PHONY: sq/ios-init
sq/ios-init:
	@if [ -z "$(APP_ID)" ] || [ -z "$(APP_NAME)" ]; then \
		echo "Error: set APP_ID and APP_NAME"; exit 1; fi
	sq/tools/init-ios.sh "$(APP_ID)" "$(APP_NAME)" "$(IOS_DEVELOPMENT_TEAM)"

# ────────────────────────────────────────────────
# Generic targets (use CLEAN, CLEAN_SHADERS, COMPILE_DB_DEPS)
# ────────────────────────────────────────────────

.PHONY: clean
clean:
	rm -rf $(CLEAN)

# ────────────────────────────────────────────────
# Dependency graph (parent can extend sq/DEPGRAPH_DEPS)
# ────────────────────────────────────────────────

.PHONY: depgraph clean-depgraph
depgraph: deps.svg

deps.svg: $(sq/DEPGRAPH_DEPS)
	python3 sq/tools/depgraph.py --format svg --output deps

deps.dot: $(sq/DEPGRAPH_DEPS)
	python3 sq/tools/depgraph.py --format dot --output deps

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

.PHONY: sq/init
sq/init:
	@echo "── sq engine setup ──"
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

# Canned recipe for the parent to expand at the end of its init target.
define sq/INIT_DONE
	@echo ""
	@echo "Setup complete. Next steps:"
	@echo "  make              # Build the application"
	@echo "  make run          # Build and run"
	@echo "  make test         # Run all tests"
endef
