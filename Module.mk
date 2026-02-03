# sq engine module
# Included by the project Makefile. Expects BUILD_DIR and CXX to be defined.sq:= sq

# ────────────────────────────────────────────────
# Variables exported to parent
# ────────────────────────────────────────────────

sq/INCLUDES = \
	-Isq/include \
	-Isq/vendor/include \
	-Isq/vendor/spdlog/include \
	-Isq/vendor/bgfx/include \
	-Isq/vendor/bx/include \
	-Isq/vendor/bimg/include \
	-Isq/vendor/bx/include/compat/osx

sq/SRC = \
	sq/src/GpuContext.cpp \
	sq/src/SdlContext.cpp \
	sq/src/Texture.cpp \
	sq/src/Mesh.cpp \
	sq/src/Model.cpp \
	sq/src/ManifestLoader.cpp \
	sq/src/Program.cpp \
	sq/src/Render.cpp \
	sq/src/ImageDiff.cpp

sq/OBJ = $(patsubst %.cpp,$(BUILD_DIR)/%.o,$(sq/SRC))
sq/LIB = $(BUILD_DIR)/libsq.a

# Triangle library (C code, used by precompute tool)
sq/TRIANGLE_SRC = sq/vendor/src/triangle.c
sq/TRIANGLE_OBJ = $(BUILD_DIR)/sq/vendor/triangle.o
sq/TRIANGLE_CFLAGS = -O2 -Isq/vendor/include -DTRILIBRARY -DREAL=double -DANSI_DECLARATORS -DNO_TIMER

# Framework libraries (bgfx, bx, bimg)
sq/BGFX_LIB = frameworks/libbgfx.a
sq/BX_LIB   = frameworks/libbx.a
sq/BIMG_LIB  = frameworks/libbimg.a
sq/FRAMEWORK_LIBS = $(sq/BGFX_LIB) $(sq/BX_LIB) $(sq/BIMG_LIB)

# Shader compiler
sq/SHADERC = sq/vendor/bgfx/.build/osx-arm64/bin/shadercRelease
sq/SHADER_INCLUDE = -i sq/vendor/bgfx/src

# Test sources
sq/TEST_SRC = \
	sq/src/main_test.cpp \
	sq/src/GpuContext_test.cpp \
	sq/src/DampedRotation_test.cpp
sq/TEST_OBJ = $(patsubst %.cpp,$(BUILD_DIR)/%.o,$(sq/TEST_SRC))

# Test shaders
sq/COMPILED_TEST_SHADERS = \
	$(BUILD_DIR)/sq/shaders/test_vs.bin \
	$(BUILD_DIR)/sq/shaders/test_fs.bin

# Shared variables (parent can += to extend)
CLEAN = bin build
CLEAN_SHADERS = $(BUILD_DIR)/shaders $(BUILD_DIR)/sq/shaders
COMPILED_SHADERS =
COMPILE_DB_DEPS = $(sq/SRC) $(sq/TEST_SRC) sq/Module.mk

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

# Triangle library
$(sq/TRIANGLE_OBJ): $(sq/TRIANGLE_SRC)
	@mkdir -p $(dir $@)
	$(CC) $(sq/TRIANGLE_CFLAGS) -c $< -o $@

# Framework libraries (bgfx build produces all three)
$(sq/FRAMEWORK_LIBS):
	@echo "Building bgfx, bx, and bimg libraries..."
	@mkdir -p frameworks
	cd sq/vendor/bgfx && $(MAKE) osx-arm64-release
	cp sq/vendor/bgfx/.build/osx-arm64/bin/libbgfxRelease.a $(sq/BGFX_LIB)
	cp sq/vendor/bgfx/.build/osx-arm64/bin/libbxRelease.a $(sq/BX_LIB)
	cp sq/vendor/bgfx/.build/osx-arm64/bin/libbimgRelease.a $(sq/BIMG_LIB)

.PHONY: frameworks clean-frameworks
frameworks: $(sq/FRAMEWORK_LIBS)

clean-frameworks:
	rm -rf frameworks/*.a
	cd sq/vendor/bgfx && $(MAKE) clean

# Shader compilation (unified: maps any %_vs.sc / %_fs.sc to build/)
# Each shader directory must contain its own varying.def.sc.
.SECONDEXPANSION:
$(BUILD_DIR)/%_vs.bin: %_vs.sc $$(dir $$*)varying.def.sc $(sq/SHADERC)
	@mkdir -p $(dir $@)
	$(sq/SHADERC) -f $< -o $@ --platform osx -p metal --type vertex --varyingdef $(dir $<)varying.def.sc $(sq/SHADER_INCLUDE)

$(BUILD_DIR)/%_fs.bin: %_fs.sc $$(dir $$*)varying.def.sc $(sq/SHADERC)
	@mkdir -p $(dir $@)
	$(sq/SHADERC) -f $< -o $@ --platform osx -p metal --type fragment --varyingdef $(dir $<)varying.def.sc $(sq/SHADER_INCLUDE)

.PHONY: shaders
shaders: $(COMPILED_SHADERS)

# ────────────────────────────────────────────────
# Generic targets (use CLEAN, CLEAN_SHADERS, COMPILE_DB_DEPS)
# ────────────────────────────────────────────────

.PHONY: clean
clean:
	rm -rf $(CLEAN)

.PHONY: clean-shaders
clean-shaders:
	rm -rf $(CLEAN_SHADERS)

# Generate compile_commands.json for IDE support (clangd, VS Code).
# compiledb captures all sub-make commands (including vendor bgfx build),
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
	@brew install git-lfs sdl3 sdl3_image sdl3_ttf
	@git lfs install
	@git lfs pull
	@echo "  Dependencies installed"
	@mkdir -p .vscode
	@(cat .vscode/settings.json 2>/dev/null || echo '{}') | \
		jq '. + {"files.associations": ((."files.associations" // {}) + {"*.sc": "glsl"})}' \
		> .vscode/settings.json.tmp && \
		mv .vscode/settings.json.tmp .vscode/settings.json
	@echo "  VS Code: .sc -> GLSL association configured"
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
