// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

// Auto-generated from protocol definition. Do not edit.
// Source of truth: protocol/*.yaml

package com.marcelocantos.pigeon.crypto

enum class GeWireServerState(val value: String) {
    Idle("Idle");
}

enum class GeWirePlayerState(val value: String) {
    Idle("Idle");
}

enum class GeWireGedState(val value: String) {
    Idle("Idle");
}

/** The protocol transition table and shared type enums. */
object GeWireProtocol {

    enum class MessageType(val value: String) {
        DeviceInfo("device_info"),
        SafeArea("safe_area"),
        SdlEvent("sdl_event"),
        SessionEnd("session_end"),
        ServerAssigned("server_assigned"),
        SessionConfig("session_config"),
        SqlpipeMsg("sqlpipe_msg"),
        VideoStream("video_stream"),
        StreamStart("stream_start"),
        StreamStop("stream_stop"),
        AspectLock("aspect_lock");
    }

    enum class EventID(val value: String) {
        Connected("connected");
    }

    /** Protocol wire constants shared across all platforms. */
    object Wire {
        const val MAGIC_DEVICE_INFO = 1195717188
        const val MAGIC_SAFE_AREA = 1195717189
        const val MAGIC_SDL_EVENT = 1195717193
        const val MAGIC_SESSION_END = 1195717197
        const val MAGIC_SERVER_ASSIGNED = 1195717198
        const val MAGIC_SESSION_CONFIG = 1195717187
        const val MAGIC_SQLPIPE_MSG = 1195717204
        const val MAGIC_VIDEO_STREAM = 1195717206
        const val MAGIC_STREAM_START = 1195717207
        const val MAGIC_STREAM_STOP = 1195717208
        const val MAGIC_ASPECT_LOCK = 1195717216
        const val PROTOCOL_VERSION = 6
        const val MAX_MESSAGE_SIZE = 536870912
        const val SENSOR_ACCELEROMETER = 1
        const val ORIENTATION_UNKNOWN = 0
        const val ORIENTATION_LANDSCAPE = 1
        const val ORIENTATION_LANDSCAPE_FLIPPED = 2
        const val ORIENTATION_PORTRAIT = 3
        const val ORIENTATION_PORTRAIT_FLIPPED = 4
        const val DEVICE_CLASS_UNKNOWN = 0
        const val DEVICE_CLASS_PHONE = 1
        const val DEVICE_CLASS_TABLET = 2
        const val DEVICE_CLASS_DESKTOP = 3
    }

    /** server transition table. */
    object ServerTable {
        val initial = GeWireServerState.Idle

        data class Transition(
            val from: String,
            val to: String,
            val on: String,
            val onKind: String,
            val guard: String? = null,
            val action: String? = null,
            val sends: List<Pair<String, String>> = emptyList(),
        )

        val transitions = listOf(
            Transition("Idle", "Idle", "connected", "internal", null, null, emptyList()),
        )
    }

    /** player transition table. */
    object PlayerTable {
        val initial = GeWirePlayerState.Idle

        data class Transition(
            val from: String,
            val to: String,
            val on: String,
            val onKind: String,
            val guard: String? = null,
            val action: String? = null,
            val sends: List<Pair<String, String>> = emptyList(),
        )

        val transitions = listOf(
            Transition("Idle", "Idle", "connected", "internal", null, null, emptyList()),
        )
    }

    /** ged transition table. */
    object GedTable {
        val initial = GeWireGedState.Idle

        data class Transition(
            val from: String,
            val to: String,
            val on: String,
            val onKind: String,
            val guard: String? = null,
            val action: String? = null,
            val sends: List<Pair<String, String>> = emptyList(),
        )

        val transitions = listOf(
            Transition("Idle", "Idle", "connected", "internal", null, null, emptyList()),
        )
    }

}

/** GeWireServerMachine is the generated state machine for the server actor. */
class GeWireServerMachine {
    var state: GeWireServerState = GeWireServerState.Idle
        private set

    /** Handle an event and return the list of commands to execute. */
    fun handleEvent(ev: GeWireProtocol.EventID): List<String> {
        val cmds: List<String> = when {
            state == GeWireServerState.Idle && ev == GeWireProtocol.EventID.Connected ->
                run {
                    state = GeWireServerState.Idle
                    emptyList()
                }
            else -> emptyList()
        }
        return cmds
    }
}

/** GeWirePlayerMachine is the generated state machine for the player actor. */
class GeWirePlayerMachine {
    var state: GeWirePlayerState = GeWirePlayerState.Idle
        private set

    /** Handle an event and return the list of commands to execute. */
    fun handleEvent(ev: GeWireProtocol.EventID): List<String> {
        val cmds: List<String> = when {
            state == GeWirePlayerState.Idle && ev == GeWireProtocol.EventID.Connected ->
                run {
                    state = GeWirePlayerState.Idle
                    emptyList()
                }
            else -> emptyList()
        }
        return cmds
    }
}

/** GeWireGedMachine is the generated state machine for the ged actor. */
class GeWireGedMachine {
    var state: GeWireGedState = GeWireGedState.Idle
        private set

    /** Handle an event and return the list of commands to execute. */
    fun handleEvent(ev: GeWireProtocol.EventID): List<String> {
        val cmds: List<String> = when {
            state == GeWireGedState.Idle && ev == GeWireProtocol.EventID.Connected ->
                run {
                    state = GeWireGedState.Idle
                    emptyList()
                }
            else -> emptyList()
        }
        return cmds
    }
}

