# sq engine module
# Included by the project Makefile. Expects BUILD_DIR, CXX, and . to be defined.

# ────────────────────────────────────────────────
# Variables exported to parent
# ────────────────────────────────────────────────

SQ_INCLUDES = \
	-I$(.)/include \
	-I$(.)/vendor/include \
	-I$(.)/vendor/spdlog/include \
	-I$(.)/vendor/bgfx/include \
	-I$(.)/vendor/bx/include \
	-I$(.)/vendor/bimg/include \
	-I$(.)/vendor/bx/include/compat/osx

SQ_SRC = \
	$(.)/src/BgfxContext.cpp \
	$(.)/src/SdlContext.cpp \
	$(.)/src/Texture.cpp \
	$(.)/src/Mesh.cpp \
	$(.)/src/Model.cpp \
	$(.)/src/ManifestLoader.cpp \
	$(.)/src/ShaderUtil.cpp

SQ_OBJ = $(patsubst %.cpp,$(BUILD_DIR)/%.o,$(SQ_SRC))
SQ_LIB = $(BUILD_DIR)/libsq.a

# Triangle library (C code, used by precompute tool)
SQ_TRIANGLE_SRC = $(.)/vendor/src/triangle.c
SQ_TRIANGLE_OBJ = $(BUILD_DIR)/$(.)/vendor/triangle.o
SQ_TRIANGLE_CFLAGS = -O2 -I$(.)/vendor/include -DTRILIBRARY -DREAL=double -DANSI_DECLARATORS -DNO_TIMER

# Framework libraries (bgfx, bx, bimg)
SQ_BGFX_LIB = frameworks/libbgfx.a
SQ_BX_LIB   = frameworks/libbx.a
SQ_BIMG_LIB  = frameworks/libbimg.a
SQ_FRAMEWORK_LIBS = $(SQ_BGFX_LIB) $(SQ_BX_LIB) $(SQ_BIMG_LIB)

# Shader compiler
SQ_SHADERC = $(.)/vendor/bgfx/.build/osx-arm64/bin/shadercRelease
SQ_SHADER_INCLUDE = -i $(.)/vendor/bgfx/src

# ────────────────────────────────────────────────
# Rules
# ────────────────────────────────────────────────

# Engine objects
$(BUILD_DIR)/$(.)/src/%.o: $(.)/src/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) $(SDL_CFLAGS) -MMD -MP -c $< -o $@

# Static library
$(SQ_LIB): $(SQ_OBJ)
	@mkdir -p $(dir $@)
	$(AR) rcs $@ $^

# Triangle library
$(SQ_TRIANGLE_OBJ): $(SQ_TRIANGLE_SRC)
	@mkdir -p $(dir $@)
	$(CC) $(SQ_TRIANGLE_CFLAGS) -c $< -o $@

# Framework libraries (bgfx build produces all three)
$(SQ_FRAMEWORK_LIBS):
	@echo "Building bgfx, bx, and bimg libraries..."
	@mkdir -p frameworks
	cd $(.)/vendor/bgfx && $(MAKE) osx-arm64-release
	cp $(.)/vendor/bgfx/.build/osx-arm64/bin/libbgfxRelease.a $(SQ_BGFX_LIB)
	cp $(.)/vendor/bgfx/.build/osx-arm64/bin/libbxRelease.a $(SQ_BX_LIB)
	cp $(.)/vendor/bgfx/.build/osx-arm64/bin/libbimgRelease.a $(SQ_BIMG_LIB)

.PHONY: frameworks clean-frameworks
frameworks: $(SQ_FRAMEWORK_LIBS)

clean-frameworks:
	rm -rf frameworks/*.a
	cd $(.)/vendor/bgfx && $(MAKE) clean
