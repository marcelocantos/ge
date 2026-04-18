# TiltBuggy — in-tree ge sample app.
#
# Demonstrates the minimal-Makefile integration pattern: declare app-level
# variables, include ge/Module.mk, done. Everything else (link/compile rules,
# default target, shader compilation, run, clean, depgraph, compile_commands)
# is inherited.

ge := ../..

APP_NAME    := tiltbuggy
APP_DISPLAY := TiltBuggy
APP_ID      := com.squz.tiltbuggy
APP_SRC     := src/main.cpp src/Scene.cpp src/Renderer.cpp
APP_SHADERS := build/shaders/simple_vs.bin build/shaders/simple_fs.bin

-include $(ge)/Module.mk
$(ge)/Module.mk:
	git submodule update --init --recursive
