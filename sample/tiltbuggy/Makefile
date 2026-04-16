# TiltBuggy — in-tree ge sample app.
#
# Demonstrates the integration pattern from ge/CLAUDE.md while living
# inside the ge repo. Unlike a consuming project where ge is a submodule
# at `./ge/`, here `$(ge)` is `../..` and Module.mk adapts accordingly.

ge := ../..
BUILD_DIR := build
CXX := clang++
CC := clang

# Declare default target BEFORE -include so it wins over Module.mk rules.
.PHONY: all
all: bin/tiltbuggy

-include $(ge)/Module.mk

CXXFLAGS := -std=c++20 -O2 -g $(ge/INCLUDES) $(ge/BGFX_ALL_INCLUDES) -Isrc
SDL_CFLAGS := -I$(ge)/vendor/sdl3/include
FRAMEWORKS := \
    -framework Metal -framework MetalKit -framework QuartzCore \
    -framework Cocoa -framework IOKit -framework CoreFoundation \
    -framework Carbon -framework CoreAudio -framework AudioToolbox \
    -framework CoreHaptics -framework GameController -framework CoreVideo \
    -framework ForceFeedback -framework AVFoundation -framework CoreMedia \
    -framework UniformTypeIdentifiers -framework CoreGraphics \
    -framework VideoToolbox -framework CoreMotion

APP := bin/tiltbuggy
SRC := src/main.cpp
APP_OBJ := $(patsubst %.cpp,$(BUILD_DIR)/%.o,$(SRC))

COMPILE_DB_DEPS += $(SRC) Makefile

.PHONY: run

$(APP): $(APP_OBJ) $(ge/LIB) $(ge/BGFX_LIBS) $(ge/BOX2D_OBJ)
	@mkdir -p $(@D)
	$(CXX) $(APP_OBJ) $(ge/LIB) $(ge/BGFX_LIBS) $(ge/BOX2D_OBJ) $(ge/SDL_LIBS) $(FRAMEWORKS) -o $@

$(BUILD_DIR)/src/%.o: src/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) $(SDL_CFLAGS) -MMD -MP -c $< -o $@

run: $(APP)
	./$(APP)

-include $(APP_OBJ:.o=.d)
