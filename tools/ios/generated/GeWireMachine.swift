// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

// Auto-generated from protocol definition. Do not edit.
// Source of truth: protocol/*.yaml

import Foundation

public enum GeWireServerState: String, Sendable {
    case idle = "Idle"
}

public enum GeWirePlayerState: String, Sendable {
    case idle = "Idle"
}

public enum GeWireGedState: String, Sendable {
    case idle = "Idle"
}

/// Protocol wire constants shared across all platforms.
public enum GeWireWire {
    public static let magicDeviceInfo = 1195717188
    public static let magicSafeArea = 1195717189
    public static let magicSdlEvent = 1195717193
    public static let magicSessionEnd = 1195717197
    public static let magicServerAssigned = 1195717198
    public static let magicSessionConfig = 1195717187
    public static let magicSqlpipeMsg = 1195717204
    public static let magicVideoStream = 1195717206
    public static let magicStreamStart = 1195717207
    public static let magicStreamStop = 1195717208
    public static let magicAspectLock = 1195717216
    public static let protocolVersion = 6
    public static let maxMessageSize = 536870912
    public static let sensorAccelerometer = 1
    public static let orientationUnknown = 0
    public static let orientationLandscape = 1
    public static let orientationLandscapeFlipped = 2
    public static let orientationPortrait = 3
    public static let orientationPortraitFlipped = 4
    public static let deviceClassUnknown = 0
    public static let deviceClassPhone = 1
    public static let deviceClassTablet = 2
    public static let deviceClassDesktop = 3
}

/// The protocol transition table and shared type enums.
public enum GeWireProtocol {

    public enum MessageType: String, Sendable {
        case deviceInfo = "device_info"
        case safeArea = "safe_area"
        case sdlEvent = "sdl_event"
        case sessionEnd = "session_end"
        case serverAssigned = "server_assigned"
        case sessionConfig = "session_config"
        case sqlpipeMsg = "sqlpipe_msg"
        case videoStream = "video_stream"
        case streamStart = "stream_start"
        case streamStop = "stream_stop"
        case aspectLock = "aspect_lock"
    }

    public enum EventID: String, Sendable {
        case connected = "connected"
    }


    /// server transitions.
    public static let serverInitial: GeWireServerState = .idle

    public static let serverTransitions: [(from: String, to: String, on: String, onKind: String, guard: String?, action: String?, sends: [(to: String, msg: String)])] = [
        (from: "Idle", to: "Idle", on: "connected", onKind: "internal", guard: nil, action: nil, sends: []),
    ]

    /// player transitions.
    public static let playerInitial: GeWirePlayerState = .idle

    public static let playerTransitions: [(from: String, to: String, on: String, onKind: String, guard: String?, action: String?, sends: [(to: String, msg: String)])] = [
        (from: "Idle", to: "Idle", on: "connected", onKind: "internal", guard: nil, action: nil, sends: []),
    ]

    /// ged transitions.
    public static let gedInitial: GeWireGedState = .idle

    public static let gedTransitions: [(from: String, to: String, on: String, onKind: String, guard: String?, action: String?, sends: [(to: String, msg: String)])] = [
        (from: "Idle", to: "Idle", on: "connected", onKind: "internal", guard: nil, action: nil, sends: []),
    ]
}

/// GeWireServerMachine is the generated state machine for the server actor.
public final class GeWireServerMachine: @unchecked Sendable {
    public typealias MessageType = GeWireProtocol.MessageType
    public typealias GuardID = GeWireProtocol.GuardID
    public typealias ActionID = GeWireProtocol.ActionID
    public typealias EventID = GeWireProtocol.EventID

    public private(set) var state: GeWireServerState

    public var guards: [GuardID: () -> Bool] = [:]
    public var actions: [ActionID: () throws -> Void] = [:]

    public init() {
        self.state = .idle
    }

    /// Handle any event (message receipt or internal). Returns emitted commands.
    @discardableResult
    public func handleEvent(_ ev: EventID) throws -> [String] {
        switch (state, ev) {
        case (.idle, .connected):
            state = .idle
            return []
        default:
            return []
        }
    }

    /// Process a received message. Returns the new state, or nil if rejected.
    @discardableResult
    public func handleMessage(_ msg: MessageType) throws -> GeWireServerState? {
        switch (state, msg) {
        default:
            return nil
        }
    }

    /// Attempt an internal transition. Returns the new state, or nil if none available.
    @discardableResult
    public func step() throws -> GeWireServerState? {
        switch state {
        case .idle:
            state = .idle
            return state
        default:
            return nil
        }
    }
}

/// GeWirePlayerMachine is the generated state machine for the player actor.
public final class GeWirePlayerMachine: @unchecked Sendable {
    public typealias MessageType = GeWireProtocol.MessageType
    public typealias GuardID = GeWireProtocol.GuardID
    public typealias ActionID = GeWireProtocol.ActionID
    public typealias EventID = GeWireProtocol.EventID

    public private(set) var state: GeWirePlayerState

    public var guards: [GuardID: () -> Bool] = [:]
    public var actions: [ActionID: () throws -> Void] = [:]

    public init() {
        self.state = .idle
    }

    /// Handle any event (message receipt or internal). Returns emitted commands.
    @discardableResult
    public func handleEvent(_ ev: EventID) throws -> [String] {
        switch (state, ev) {
        case (.idle, .connected):
            state = .idle
            return []
        default:
            return []
        }
    }

    /// Process a received message. Returns the new state, or nil if rejected.
    @discardableResult
    public func handleMessage(_ msg: MessageType) throws -> GeWirePlayerState? {
        switch (state, msg) {
        default:
            return nil
        }
    }

    /// Attempt an internal transition. Returns the new state, or nil if none available.
    @discardableResult
    public func step() throws -> GeWirePlayerState? {
        switch state {
        case .idle:
            state = .idle
            return state
        default:
            return nil
        }
    }
}

/// GeWireGedMachine is the generated state machine for the ged actor.
public final class GeWireGedMachine: @unchecked Sendable {
    public typealias MessageType = GeWireProtocol.MessageType
    public typealias GuardID = GeWireProtocol.GuardID
    public typealias ActionID = GeWireProtocol.ActionID
    public typealias EventID = GeWireProtocol.EventID

    public private(set) var state: GeWireGedState

    public var guards: [GuardID: () -> Bool] = [:]
    public var actions: [ActionID: () throws -> Void] = [:]

    public init() {
        self.state = .idle
    }

    /// Handle any event (message receipt or internal). Returns emitted commands.
    @discardableResult
    public func handleEvent(_ ev: EventID) throws -> [String] {
        switch (state, ev) {
        case (.idle, .connected):
            state = .idle
            return []
        default:
            return []
        }
    }

    /// Process a received message. Returns the new state, or nil if rejected.
    @discardableResult
    public func handleMessage(_ msg: MessageType) throws -> GeWireGedState? {
        switch (state, msg) {
        default:
            return nil
        }
    }

    /// Attempt an internal transition. Returns the new state, or nil if none available.
    @discardableResult
    public func step() throws -> GeWireGedState? {
        switch state {
        case .idle:
            state = .idle
            return state
        default:
            return nil
        }
    }
}

