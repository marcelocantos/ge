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
	// Standard frame: 8-byte header + 18-byte struct = 26 bytes.
	// Extended frame: 26 bytes + UTF-8 preference string.
	var preference string
	if len(deviceInfo) > 26 {
		preference = string(deviceInfo[26:])
		deviceInfo = deviceInfo[:26] // strip preference before storing
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
