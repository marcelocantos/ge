# TiltCal — accelerometer calibration sample.
#
# Quick & dirty: single-source app that reads SDL3's accelerometer and
# logs each pose's reading. Used to characterise the SDL3 sensor
# contract on iOS / iPadOS / Android.

ge := ../..

APP_NAME    := tiltcal
APP_DISPLAY_NAME := TiltCal
APP_ID      := com.squz.tiltcal
APP_SRC     := src/main.cpp
APP_SHADERS :=

# Default to FREE orientation lock for desktop builds; iOS builds set
# their own value in CMakeLists.txt per variant.
APP_CXXFLAGS := -DTILTCAL_LOCK=0

-include $(ge)/Module.mk
$(ge)/Module.mk:
	git submodule update --init --recursive
