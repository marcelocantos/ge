// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

// Code generated from protocol/*.yaml. DO NOT EDIT.

#ifndef PIGEON_GEWIRE_GEN_H
#define PIGEON_GEWIRE_GEN_H

#include <stdbool.h>
#include <stdint.h>

// GeWire server states.
typedef enum {
	PIGEON_SERVER_IDLE = 0,
	PIGEON_SERVER_STATE_COUNT
} pigeon_server_state;

// GeWire player states.
typedef enum {
	PIGEON_PLAYER_IDLE = 0,
	PIGEON_PLAYER_STATE_COUNT
} pigeon_player_state;

// GeWire ged states.
typedef enum {
	PIGEON_GED_IDLE = 0,
	PIGEON_GED_STATE_COUNT
} pigeon_ged_state;

// GeWire message types.
typedef enum {
	PIGEON_MSG_DEVICE_INFO = 0,
	PIGEON_MSG_SAFE_AREA,
	PIGEON_MSG_SDL_EVENT,
	PIGEON_MSG_SESSION_END,
	PIGEON_MSG_SERVER_ASSIGNED,
	PIGEON_MSG_SESSION_CONFIG,
	PIGEON_MSG_SQLPIPE_MSG,
	PIGEON_MSG_VIDEO_STREAM,
	PIGEON_MSG_STREAM_START,
	PIGEON_MSG_STREAM_STOP,
	PIGEON_MSG_ASPECT_LOCK,
	PIGEON_MSG_COUNT
} ge_wire_msg_type;

// GeWire events.
typedef enum {
	PIGEON_EVENT_CONNECTED = 0,
	PIGEON_EVENT_COUNT
} ge_wire_event_id;

// Wire constants.
#define PIGEON_WIRE_MAGIC_DEVICE_INFO 1195717188 // "GE2D" player→ged: player dimensions/class/safe area
#define PIGEON_WIRE_MAGIC_SAFE_AREA 1195717189 // "GE2E" player→server: safe area update on orientation change
#define PIGEON_WIRE_MAGIC_SDL_EVENT 1195717193 // "GE2I" player→server: SDL input event forwarding
#define PIGEON_WIRE_MAGIC_SESSION_END 1195717197 // "GE2M" ged→player: server disconnected
#define PIGEON_WIRE_MAGIC_SERVER_ASSIGNED 1195717198 // "GE2N" ged→player: assigned server name
#define PIGEON_WIRE_MAGIC_SESSION_CONFIG 1195717187 // "GE2C" server→player: session requirements (sensors, orientation)
#define PIGEON_WIRE_MAGIC_SQLPIPE_MSG 1195717204 // "GE2T" bidirectional sqlpipe messages
#define PIGEON_WIRE_MAGIC_VIDEO_STREAM 1195717206 // "GE2V" server→ged: H.264 NAL units
#define PIGEON_WIRE_MAGIC_STREAM_START 1195717207 // "GE2W" ged→player: start streaming
#define PIGEON_WIRE_MAGIC_STREAM_STOP 1195717208 // "GE2X" ged→player: stop streaming
#define PIGEON_WIRE_MAGIC_ASPECT_LOCK 1195717216 // "GE2`" server→player: lock window aspect ratio
#define PIGEON_WIRE_PROTOCOL_VERSION 6 // wire protocol version; bump on breaking changes
#define PIGEON_WIRE_MAX_MESSAGE_SIZE 536870912 // maximum single message size in bytes (512 MiB); matches ged/bridge.go
#define PIGEON_WIRE_SENSOR_ACCELEROMETER 1 // bitmask: request accelerometer data from player
#define PIGEON_WIRE_ORIENTATION_UNKNOWN 0 // SDL_ORIENTATION_UNKNOWN — no orientation preference
#define PIGEON_WIRE_ORIENTATION_LANDSCAPE 1 // SDL_ORIENTATION_LANDSCAPE
#define PIGEON_WIRE_ORIENTATION_LANDSCAPE_FLIPPED 2 // SDL_ORIENTATION_LANDSCAPE_FLIPPED
#define PIGEON_WIRE_ORIENTATION_PORTRAIT 3 // SDL_ORIENTATION_PORTRAIT
#define PIGEON_WIRE_ORIENTATION_PORTRAIT_FLIPPED 4 // SDL_ORIENTATION_PORTRAIT_FLIPPED
#define PIGEON_WIRE_DEVICE_CLASS_UNKNOWN 0 // device class: unknown
#define PIGEON_WIRE_DEVICE_CLASS_PHONE 1 // device class: phone
#define PIGEON_WIRE_DEVICE_CLASS_TABLET 2 // device class: tablet
#define PIGEON_WIRE_DEVICE_CLASS_DESKTOP 3 // device class: desktop

// Guard and action callback types.
typedef bool (*pigeon_guard_fn)(void *ctx);
typedef int  (*pigeon_action_fn)(void *ctx);
typedef void (*pigeon_change_fn)(const char *var_name, void *ctx);

// GeWire server state machine.
typedef struct {
	pigeon_server_state state;
	pigeon_change_fn on_change;
	void *userdata;
} pigeon_server_machine;

void pigeon_server_machine_init(pigeon_server_machine *m);
int  pigeon_server_handle_message(pigeon_server_machine *m, ge_wire_msg_type msg);
int  pigeon_server_step(pigeon_server_machine *m, ge_wire_event_id event);

// GeWire player state machine.
typedef struct {
	pigeon_player_state state;
	pigeon_change_fn on_change;
	void *userdata;
} pigeon_player_machine;

void pigeon_player_machine_init(pigeon_player_machine *m);
int  pigeon_player_handle_message(pigeon_player_machine *m, ge_wire_msg_type msg);
int  pigeon_player_step(pigeon_player_machine *m, ge_wire_event_id event);

// GeWire ged state machine.
typedef struct {
	pigeon_ged_state state;
	pigeon_change_fn on_change;
	void *userdata;
} pigeon_ged_machine;

void pigeon_ged_machine_init(pigeon_ged_machine *m);
int  pigeon_ged_handle_message(pigeon_ged_machine *m, ge_wire_msg_type msg);
int  pigeon_ged_step(pigeon_ged_machine *m, ge_wire_event_id event);

#endif // PIGEON_GEWIRE_GEN_H
