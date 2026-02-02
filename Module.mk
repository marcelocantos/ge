# sq engine module
# Included by the project Makefile. Expects BUILD_DIR and CXX to be defined.

SQ_DIR := sq

# ────────────────────────────────────────────────
# Variables exported to parent
# ────────────────────────────────────────────────

SQ_INCLUDES = \
	-I$(SQ_DIR)/include \
	-I$(SQ_DIR)/vendor/include \
	-I$(SQ_DIR)/vendor/spdlog/include \
	-I$(SQ_DIR)/vendor/bgfx/include \
	-I$(SQ_DIR)/vendor/bx/include \
	-I$(SQ_DIR)/vendor/bimg/include \
	-I$(SQ_DIR)/vendor/bx/include/compat/osx

SQ_SRC = \
	$(SQ_DIR)/src/BgfxContext.cpp \
	$(SQ_DIR)/src/SdlContext.cpp \
	$(SQ_DIR)/src/Texture.cpp \
	$(SQ_DIR)/src/Mesh.cpp \
	$(SQ_DIR)/src/Model.cpp \
	$(SQ_DIR)/src/ManifestLoader.cpp \
	$(SQ_DIR)/src/ShaderUtil.cpp

SQ_OBJ = $(patsubst %.cpp,$(BUILD_DIR)/%.o,$(SQ_SRC))
SQ_LIB = $(BUILD_DIR)/libsq.a

# Triangle library (C code, used by precompute tool)
SQ_TRIANGLE_SRC = $(SQ_DIR)/vendor/src/triangle.c
SQ_TRIANGLE_OBJ = $(BUILD_DIR)/$(SQ_DIR)/vendor/triangle.o
SQ_TRIANGLE_CFLAGS = -O2 -I$(SQ_DIR)/vendor/include -DTRILIBRARY -DREAL=double -DANSI_DECLARATORS -DNO_TIMER

# Framework libraries (bgfx, bx, bimg)
SQ_BGFX_LIB = frameworks/libbgfx.a
SQ_BX_LIB   = frameworks/libbx.a
SQ_BIMG_LIB  = frameworks/libbimg.a
SQ_FRAMEWORK_LIBS = $(SQ_BGFX_LIB) $(SQ_BX_LIB) $(SQ_BIMG_LIB)

# Shader compiler
SQ_SHADERC = $(SQ_DIR)/vendor/bgfx/.build/osx-arm64/bin/shadercRelease
SQ_SHADER_INCLUDE = -i $(SQ_DIR)/vendor/bgfx/src

# ────────────────────────────────────────────────
# Rules
# ────────────────────────────────────────────────

# Engine objects
$(BUILD_DIR)/$(SQ_DIR)/src/%.o: $(SQ_DIR)/src/%.cpp
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
	cd $(SQ_DIR)/vendor/bgfx && $(MAKE) osx-arm64-release
	cp $(SQ_DIR)/vendor/bgfx/.build/osx-arm64/bin/libbgfxRelease.a $(SQ_BGFX_LIB)
	cp $(SQ_DIR)/vendor/bgfx/.build/osx-arm64/bin/libbxRelease.a $(SQ_BX_LIB)
	cp $(SQ_DIR)/vendor/bgfx/.build/osx-arm64/bin/libbimgRelease.a $(SQ_BIMG_LIB)

.PHONY: frameworks clean-frameworks
frameworks: $(SQ_FRAMEWORK_LIBS)

clean-frameworks:
	rm -rf frameworks/*.a
	cd $(SQ_DIR)/vendor/bgfx && $(MAKE) clean
