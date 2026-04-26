// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

// Code generated from protocol/*.yaml. DO NOT EDIT.

#include "gewire_gen.h"
#include <string.h>

void pigeon_server_machine_init(pigeon_server_machine *m)
{
	memset(m, 0, sizeof(*m));
	m->state = PIGEON_SERVER_IDLE;
}

int pigeon_server_handle_message(pigeon_server_machine *m, ge_wire_msg_type msg)
{
	return 0;
}

int pigeon_server_step(pigeon_server_machine *m, ge_wire_event_id event)
{
	if (m->state == PIGEON_SERVER_IDLE && event == PIGEON_EVENT_CONNECTED) {
		m->state = PIGEON_SERVER_IDLE;
		return 1;
	}
	return 0;
}

void pigeon_player_machine_init(pigeon_player_machine *m)
{
	memset(m, 0, sizeof(*m));
	m->state = PIGEON_PLAYER_IDLE;
}

int pigeon_player_handle_message(pigeon_player_machine *m, ge_wire_msg_type msg)
{
	return 0;
}

int pigeon_player_step(pigeon_player_machine *m, ge_wire_event_id event)
{
	if (m->state == PIGEON_PLAYER_IDLE && event == PIGEON_EVENT_CONNECTED) {
		m->state = PIGEON_PLAYER_IDLE;
		return 1;
	}
	return 0;
}

void pigeon_ged_machine_init(pigeon_ged_machine *m)
{
	memset(m, 0, sizeof(*m));
	m->state = PIGEON_GED_IDLE;
}

int pigeon_ged_handle_message(pigeon_ged_machine *m, ge_wire_msg_type msg)
{
	return 0;
}

int pigeon_ged_step(pigeon_ged_machine *m, ge_wire_event_id event)
{
	if (m->state == PIGEON_GED_IDLE && event == PIGEON_EVENT_CONNECTED) {
		m->state = PIGEON_GED_IDLE;
		return 1;
	}
	return 0;
}

