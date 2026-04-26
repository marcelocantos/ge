// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

// Auto-generated from protocol definition. Do not edit.
// Source of truth: protocol/*.yaml

export enum GeWireServerState {
    Idle = "Idle",
}

export enum GeWirePlayerState {
    Idle = "Idle",
}

export enum GeWireGedState {
    Idle = "Idle",
}

/** The protocol transition table and shared type enums. */
export namespace GeWireProtocol {

    export enum MessageType {
        DeviceInfo = "device_info",
        SafeArea = "safe_area",
        SdlEvent = "sdl_event",
        SessionEnd = "session_end",
        ServerAssigned = "server_assigned",
        SessionConfig = "session_config",
        SqlpipeMsg = "sqlpipe_msg",
        VideoStream = "video_stream",
        StreamStart = "stream_start",
        StreamStop = "stream_stop",
        AspectLock = "aspect_lock",
    }

    export enum EventID {
        Connected = "connected",
    }

    /** Protocol wire constants shared across all platforms. */
    export const Wire = {
        MAGIC_DEVICE_INFO: 1195717188,
        MAGIC_SAFE_AREA: 1195717189,
        MAGIC_SDL_EVENT: 1195717193,
        MAGIC_SESSION_END: 1195717197,
        MAGIC_SERVER_ASSIGNED: 1195717198,
        MAGIC_SESSION_CONFIG: 1195717187,
        MAGIC_SQLPIPE_MSG: 1195717204,
        MAGIC_VIDEO_STREAM: 1195717206,
        MAGIC_STREAM_START: 1195717207,
        MAGIC_STREAM_STOP: 1195717208,
        MAGIC_ASPECT_LOCK: 1195717216,
        PROTOCOL_VERSION: 6,
        MAX_MESSAGE_SIZE: 536870912,
        SENSOR_ACCELEROMETER: 1,
        ORIENTATION_UNKNOWN: 0,
        ORIENTATION_LANDSCAPE: 1,
        ORIENTATION_LANDSCAPE_FLIPPED: 2,
        ORIENTATION_PORTRAIT: 3,
        ORIENTATION_PORTRAIT_FLIPPED: 4,
        DEVICE_CLASS_UNKNOWN: 0,
        DEVICE_CLASS_PHONE: 1,
        DEVICE_CLASS_TABLET: 2,
        DEVICE_CLASS_DESKTOP: 3,
    } as const;

    export interface Transition {
        readonly from: string;
        readonly to: string;
        readonly on: string;
        readonly onKind: "recv" | "internal";
        readonly guard?: string;
        readonly action?: string;
        readonly sends?: ReadonlyArray<{ readonly to: string; readonly msg: string }>;
    }

    export interface ActorTable {
        readonly initial: string;
        readonly transitions: ReadonlyArray<Transition>;
    }

    /** server transition table. */
    export const serverTable: ActorTable = {
        initial: GeWireServerState.Idle,
        transitions: [
            { from: "Idle", to: "Idle", on: "connected", onKind: "internal" },
        ],
    };

    /** player transition table. */
    export const playerTable: ActorTable = {
        initial: GeWirePlayerState.Idle,
        transitions: [
            { from: "Idle", to: "Idle", on: "connected", onKind: "internal" },
        ],
    };

    /** ged transition table. */
    export const gedTable: ActorTable = {
        initial: GeWireGedState.Idle,
        transitions: [
            { from: "Idle", to: "Idle", on: "connected", onKind: "internal" },
        ],
    };

}

/** GeWireServerMachine is the generated state machine for the server actor. */
export class GeWireServerMachine {
    readonly protocol = GeWireProtocol;
    state: GeWireServerState;

    constructor() {
        this.state = GeWireServerState.Idle;
    }

    handleEvent(ev: GeWireProtocol.EventID): string[] {
        switch (true) {
            case this.state === GeWireServerState.Idle && ev === GeWireProtocol.EventID.Connected: {
                this.state = GeWireServerState.Idle;
                return [];
            }
        }
        return [];
    }
}

/** GeWirePlayerMachine is the generated state machine for the player actor. */
export class GeWirePlayerMachine {
    readonly protocol = GeWireProtocol;
    state: GeWirePlayerState;

    constructor() {
        this.state = GeWirePlayerState.Idle;
    }

    handleEvent(ev: GeWireProtocol.EventID): string[] {
        switch (true) {
            case this.state === GeWirePlayerState.Idle && ev === GeWireProtocol.EventID.Connected: {
                this.state = GeWirePlayerState.Idle;
                return [];
            }
        }
        return [];
    }
}

/** GeWireGedMachine is the generated state machine for the ged actor. */
export class GeWireGedMachine {
    readonly protocol = GeWireProtocol;
    state: GeWireGedState;

    constructor() {
        this.state = GeWireGedState.Idle;
    }

    handleEvent(ev: GeWireProtocol.EventID): string[] {
        switch (true) {
            case this.state === GeWireGedState.Idle && ev === GeWireProtocol.EventID.Connected: {
                this.state = GeWireGedState.Idle;
                return [];
            }
        }
        return [];
    }
}
