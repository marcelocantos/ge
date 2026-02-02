# sq engine module
# Included by the project Makefile. Expects BUILD_DIR, CXX, and . to be defined.

# ────────────────────────────────────────────────
# Variables exported to parent
# ────────────────────────────────────────────────

$(.)/INCLUDES = \
	-I$(.)/include \
	-I$(.)/vendor/include \
	-I$(.)/vendor/spdlog/include \
	-I$(.)/vendor/bgfx/include \
	-I$(.)/vendor/bx/include \
	-I$(.)/vendor/bimg/include \
	-I$(.)/vendor/bx/include/compat/osx

$(.)/SRC = \
	$(.)/src/BgfxContext.cpp \
	$(.)/src/SdlContext.cpp \
	$(.)/src/Texture.cpp \
	$(.)/src/Mesh.cpp \
	$(.)/src/Model.cpp \
	$(.)/src/ManifestLoader.cpp \
	$(.)/src/ShaderUtil.cpp

$(.)/OBJ = $(patsubst %.cpp,$(BUILD_DIR)/%.o,$($(.)/SRC))
$(.)/LIB = $(BUILD_DIR)/libsq.a

# Triangle library (C code, used by precompute tool)
$(.)/TRIANGLE_SRC = $(.)/vendor/src/triangle.c
$(.)/TRIANGLE_OBJ = $(BUILD_DIR)/$(.)/vendor/triangle.o
$(.)/TRIANGLE_CFLAGS = -O2 -I$(.)/vendor/include -DTRILIBRARY -DREAL=double -DANSI_DECLARATORS -DNO_TIMER

# Framework libraries (bgfx, bx, bimg)
$(.)/BGFX_LIB = frameworks/libbgfx.a
$(.)/BX_LIB   = frameworks/libbx.a
$(.)/BIMG_LIB  = frameworks/libbimg.a
$(.)/FRAMEWORK_LIBS = $($(.)/BGFX_LIB) $($(.)/BX_LIB) $($(.)/BIMG_LIB)

# Shader compiler
$(.)/SHADERC = $(.)/vendor/bgfx/.build/osx-arm64/bin/shadercRelease
$(.)/SHADER_INCLUDE = -i $(.)/vendor/bgfx/src

# ────────────────────────────────────────────────
# Rules
# ────────────────────────────────────────────────

# Engine objects
$(BUILD_DIR)/$(.)/src/%.o: $(.)/src/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) $(SDL_CFLAGS) -MMD -MP -c $< -o $@

# Static library
$($(.)/LIB): $($(.)/OBJ)
	@mkdir -p $(dir $@)
	$(AR) rcs $@ $^

# Triangle library
$($(.)/TRIANGLE_OBJ): $($(.)/TRIANGLE_SRC)
	@mkdir -p $(dir $@)
	$(CC) $($(.)/TRIANGLE_CFLAGS) -c $< -o $@

# Framework libraries (bgfx build produces all three)
$($(.)/FRAMEWORK_LIBS):
	@echo "Building bgfx, bx, and bimg libraries..."
	@mkdir -p frameworks
	cd $(.)/vendor/bgfx && $(MAKE) osx-arm64-release
	cp $(.)/vendor/bgfx/.build/osx-arm64/bin/libbgfxRelease.a $($(.)/BGFX_LIB)
	cp $(.)/vendor/bgfx/.build/osx-arm64/bin/libbxRelease.a $($(.)/BX_LIB)
	cp $(.)/vendor/bgfx/.build/osx-arm64/bin/libbimgRelease.a $($(.)/BIMG_LIB)

.PHONY: frameworks clean-frameworks
frameworks: $($(.)/FRAMEWORK_LIBS)

clean-frameworks:
	rm -rf frameworks/*.a
	cd $(.)/vendor/bgfx && $(MAKE) clean
