// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

// Code generated from protocol/*.yaml. DO NOT EDIT.

package protocol

// GeWire server states.
const (
	GeWireServerIdle State = "Idle"
)

// GeWire player states.
const (
	GeWirePlayerIdle State = "Idle"
)

// GeWire ged states.
const (
	GeWireGedIdle State = "Idle"
)

// GeWire message types.
const (
	GeWireMsgDeviceInfo MsgType = "device_info"
	GeWireMsgSafeArea MsgType = "safe_area"
	GeWireMsgSdlEvent MsgType = "sdl_event"
	GeWireMsgSessionEnd MsgType = "session_end"
	GeWireMsgServerAssigned MsgType = "server_assigned"
	GeWireMsgSessionConfig MsgType = "session_config"
	GeWireMsgSqlpipeMsg MsgType = "sqlpipe_msg"
	GeWireMsgVideoStream MsgType = "video_stream"
	GeWireMsgStreamStart MsgType = "stream_start"
	GeWireMsgStreamStop MsgType = "stream_stop"
	GeWireMsgAspectLock MsgType = "aspect_lock"
)

// GeWire guards.
const (
)

// GeWire events.
const (
	GeWireEventConnected EventID = "connected"
)

// Wire constants — protocol-level values shared across all platforms.
// MessageMagic
const (
	MagicDeviceInfo = 1195717188 // "GE2D" player→ged: player dimensions/class/safe area
	MagicSafeArea = 1195717189 // "GE2E" player→server: safe area update on orientation change
	MagicSdlEvent = 1195717193 // "GE2I" player→server: SDL input event forwarding
	MagicSessionEnd = 1195717197 // "GE2M" ged→player: server disconnected
	MagicServerAssigned = 1195717198 // "GE2N" ged→player: assigned server name
	MagicSessionConfig = 1195717187 // "GE2C" server→player: session requirements (sensors, orientation)
	MagicSqlpipeMsg = 1195717204 // "GE2T" bidirectional sqlpipe messages
	MagicVideoStream = 1195717206 // "GE2V" server→ged: H.264 NAL units
	MagicStreamStart = 1195717207 // "GE2W" ged→player: start streaming
	MagicStreamStop = 1195717208 // "GE2X" ged→player: stop streaming
	MagicAspectLock = 1195717216 // "GE2`" server→player: lock window aspect ratio
)

// Framing
const (
	ProtocolVersion = 6 // wire protocol version; bump on breaking changes
	MaxMessageSize = 536870912 // maximum single message size in bytes (512 MiB); matches ged/bridge.go
)

// Sensors
const (
	SensorAccelerometer = 1 // bitmask: request accelerometer data from player
)

// Orientation
const (
	OrientationUnknown = 0 // SDL_ORIENTATION_UNKNOWN — no orientation preference
	OrientationLandscape = 1 // SDL_ORIENTATION_LANDSCAPE
	OrientationLandscapeFlipped = 2 // SDL_ORIENTATION_LANDSCAPE_FLIPPED
	OrientationPortrait = 3 // SDL_ORIENTATION_PORTRAIT
	OrientationPortraitFlipped = 4 // SDL_ORIENTATION_PORTRAIT_FLIPPED
)

// DeviceClass
const (
	DeviceClassUnknown = 0 // device class: unknown
	DeviceClassPhone = 1 // device class: phone
	DeviceClassTablet = 2 // device class: tablet
	DeviceClassDesktop = 3 // device class: desktop
)

func GeWire() *Protocol {
	return &Protocol{
		Name: "GeWire",
		Actors: []Actor{
			{Name: "server", Initial: "Idle", Transitions: []Transition{
				{From: "Idle", To: "Idle", On: Internal("connected")},
			}},
			{Name: "player", Initial: "Idle", Transitions: []Transition{
				{From: "Idle", To: "Idle", On: Internal("connected")},
			}},
			{Name: "ged", Initial: "Idle", Transitions: []Transition{
				{From: "Idle", To: "Idle", On: Internal("connected")},
			}},
		},
		Messages: []Message{
			{Type: "device_info", From: "player", To: "ged", Desc: "Player capabilities sent after connecting. Fields: magic(u32)=magic_device_info, version(u16)=protocol_version, width(u16), height(u16), pixelRatio(u16), deviceClass(u8)=device_class_*, orientation(u8)=orientation_*, safeX(u16), safeY(u16), safeW(u16), safeH(u16)."},
			{Type: "safe_area", From: "player", To: "server", Desc: "Safe area update sent on orientation change. Fields: magic(u32)=magic_safe_area, safeX(u16), safeY(u16), safeW(u16), safeH(u16)."},
			{Type: "sdl_event", From: "player", To: "server", Desc: "SDL input event forwarded from player. Fields: magic(u32)=magic_sdl_event followed by raw SDL_Event struct bytes."},
			{Type: "session_end", From: "ged", To: "player", Desc: "Server disconnected; player should retry. Fields: magic(u32)=magic_session_end, length(u32)=0."},
			{Type: "server_assigned", From: "ged", To: "player", Desc: "Assigned server name for this player session. Fields: magic(u32)=magic_server_assigned, length(u32), name(utf8)."},
			{Type: "session_config", From: "server", To: "player", Desc: "Session requirements sent once after setup. Fields: magic(u32)=magic_session_config, sensors(u8) bitmask using sensor_* constants, orientation(u8) using orientation_* constants, _pad(2 bytes)."},
			{Type: "sqlpipe_msg", From: "server", To: "player", Desc: "Bidirectional sqlpipe database sync message. Fields: magic(u32)=magic_sqlpipe_msg, length(u32), payload(bytes)."},
			{Type: "video_stream", From: "server", To: "ged", Desc: "H.264 encoded NAL units for one frame. Fields: magic(u32)=magic_video_stream, length(u32), nal_data(bytes)."},
			{Type: "stream_start", From: "ged", To: "player", Desc: "Signal to player to begin receiving H.264 frames. Fields: magic(u32)=magic_stream_start, length(u32)=0."},
			{Type: "stream_stop", From: "ged", To: "player", Desc: "Signal to player to stop receiving frames (server gone). Fields: magic(u32)=magic_stream_stop, length(u32)=0."},
			{Type: "aspect_lock", From: "server", To: "player", Desc: "Lock window aspect ratio. Fields: magic(u32)=magic_aspect_lock, ratio(f32) = width/height (e.g. 0.6948 for 954x1373); send 0.0 to unlock."},
		},
		Vars: []VarDef{
		},
		Guards: []GuardDef{
		},
		Operators: []Operator{
		},
		AdvActions: []AdvAction{
		},
		Properties: []Property{
		},
		ChannelBound: 0,
		OneShot: false,
	}
}

// GeWireServerMachine is the generated state machine for the server actor.
type GeWireServerMachine struct {
	State State

	Guards  map[GuardID]func() bool
	Actions map[ActionID]func() error
	OnChange func(varName string)
}

func NewGeWireServerMachine() *GeWireServerMachine {
	return &GeWireServerMachine{
		State: GeWireServerIdle,
		Guards:  make(map[GuardID]func() bool),
		Actions: make(map[ActionID]func() error),
	}
}

func (m *GeWireServerMachine) HandleMessage(msg MsgType) (bool, error) {
	switch {
	}
	return false, nil
}

func (m *GeWireServerMachine) Step(event EventID) (bool, error) {
	switch {
	case m.State == GeWireServerIdle && event == GeWireEventConnected:
		m.State = GeWireServerIdle
		return true, nil
	}
	return false, nil
}

func (m *GeWireServerMachine) HandleEvent(ev EventID) ([]CmdID, error) {
	switch {
	case m.State == GeWireServerIdle && ev == GeWireEventConnected:
		m.State = GeWireServerIdle
		return nil, nil
	}
	return nil, nil
}

// GeWirePlayerMachine is the generated state machine for the player actor.
type GeWirePlayerMachine struct {
	State State

	Guards  map[GuardID]func() bool
	Actions map[ActionID]func() error
	OnChange func(varName string)
}

func NewGeWirePlayerMachine() *GeWirePlayerMachine {
	return &GeWirePlayerMachine{
		State: GeWirePlayerIdle,
		Guards:  make(map[GuardID]func() bool),
		Actions: make(map[ActionID]func() error),
	}
}

func (m *GeWirePlayerMachine) HandleMessage(msg MsgType) (bool, error) {
	switch {
	}
	return false, nil
}

func (m *GeWirePlayerMachine) Step(event EventID) (bool, error) {
	switch {
	case m.State == GeWirePlayerIdle && event == GeWireEventConnected:
		m.State = GeWirePlayerIdle
		return true, nil
	}
	return false, nil
}

func (m *GeWirePlayerMachine) HandleEvent(ev EventID) ([]CmdID, error) {
	switch {
	case m.State == GeWirePlayerIdle && ev == GeWireEventConnected:
		m.State = GeWirePlayerIdle
		return nil, nil
	}
	return nil, nil
}

// GeWireGedMachine is the generated state machine for the ged actor.
type GeWireGedMachine struct {
	State State

	Guards  map[GuardID]func() bool
	Actions map[ActionID]func() error
	OnChange func(varName string)
}

func NewGeWireGedMachine() *GeWireGedMachine {
	return &GeWireGedMachine{
		State: GeWireGedIdle,
		Guards:  make(map[GuardID]func() bool),
		Actions: make(map[ActionID]func() error),
	}
}

func (m *GeWireGedMachine) HandleMessage(msg MsgType) (bool, error) {
	switch {
	}
	return false, nil
}

func (m *GeWireGedMachine) Step(event EventID) (bool, error) {
	switch {
	case m.State == GeWireGedIdle && event == GeWireEventConnected:
		m.State = GeWireGedIdle
		return true, nil
	}
	return false, nil
}

func (m *GeWireGedMachine) HandleEvent(ev EventID) ([]CmdID, error) {
	switch {
	case m.State == GeWireGedIdle && ev == GeWireEventConnected:
		m.State = GeWireGedIdle
		return nil, nil
	}
	return nil, nil
}

