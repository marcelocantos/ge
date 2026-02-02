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
	sq/src/BgfxContext.cpp \
	sq/src/SdlContext.cpp \
	sq/src/Texture.cpp \
	sq/src/Mesh.cpp \
	sq/src/Model.cpp \
	sq/src/ManifestLoader.cpp \
	sq/src/ShaderUtil.cpp

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
