package main

import (
	"log/slog"
	"net/http"

	"github.com/coder/websocket"
)

// handlePlayer handles a player WebSocket connection at /ws/wire.
func (d *Daemon) handlePlayer(w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
		InsecureSkipVerify: true,
	})
	if err != nil {
		slog.Error("Player WebSocket accept failed", "err", err)
		return
	}
	defer conn.CloseNow()

	conn.SetReadLimit(maxFrameSize)

	// Read DeviceInfo (first binary frame from player).
	// The daemon stores this and replays it to the server when the
	// bridge is established, so the server always gets DeviceInfo
	// regardless of connect ordering.
	ctx := r.Context()
	mt, deviceInfo, err := conn.Read(ctx)
	if err != nil {
		slog.Error("Player DeviceInfo read failed", "err", err)
		return
	}
	if mt != websocket.MessageBinary {
		slog.Error("Player DeviceInfo: expected binary frame")
		return
	}

	// Extract server preference from extended DeviceInfo frame.
	// Frame layout: [8-byte MessageHeader][20-byte DeviceInfo struct][optional preference]
	// The DeviceInfo struct is 20 bytes (sizeof includes 2 bytes of alignment padding
	// before the uint32_t preferredFormat field).
	const deviceInfoFrameSize = 8 + 20 // MessageHeader + DeviceInfo
	var preference string
	if len(deviceInfo) > deviceInfoFrameSize {
		preference = string(deviceInfo[deviceInfoFrameSize:])
		deviceInfo = deviceInfo[:deviceInfoFrameSize] // strip preference before storing
	}

	name := r.URL.Query().Get("name")
	pc := &PlayerConn{Conn: conn, DeviceInfo: deviceInfo}
	sessionID := d.AddPlayer(pc, name, preference)
	defer d.RemovePlayer(sessionID)

	// Forward remaining frames to the server's wire connection for this session.
	for {
		mt, data, err := conn.Read(ctx)
		if err != nil {
			if ctx.Err() == nil {
				slog.Info("Player disconnected", "session", sessionID)
			}
			return
		}

		d.ForwardToServerWire(sessionID, mt, data)
	}
}
