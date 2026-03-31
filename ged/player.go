package main

import (
	"encoding/binary"
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
	// Frame layout: [8-byte MessageHeader][28-byte DeviceInfo struct][optional preference]
	// The DeviceInfo struct is 28 bytes: magic(4) + version(2) + width(2) + height(2) +
	// pixelRatio(2) + deviceClass(1) + orientation(1) + padding(2) + preferredFormat(4) +
	// safeX(2) + safeY(2) + safeW(2) + safeH(2).
	const deviceInfoFrameSize = 8 + 28 // MessageHeader + DeviceInfo
	var preference string
	if len(deviceInfo) > deviceInfoFrameSize {
		preference = string(deviceInfo[deviceInfoFrameSize:])
		deviceInfo = deviceInfo[:deviceInfoFrameSize] // strip preference before storing
	}

	cancelPing := startPing(ctx, conn)
	defer cancelPing()

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

		// Intercept video stream frames (player -> ged).
		if mt == websocket.MessageBinary && len(data) >= 8 {
			magic := binary.LittleEndian.Uint32(data[:4])
			if magic == 0x47453256 { // kVideoStreamMagic
				if len(data) > 8 {
					d.HandleVideoFrame(sessionID, data[8:])
				}
				continue // don't forward to server
			}
		}

		// Try session wire first (Dawn wire protocol), fall back to server
		// sideband (H.264 architecture where server has no per-session wire).
		if !d.ForwardToServerWire(sessionID, mt, data) {
			d.ForwardToServerSideband(sessionID, mt, data)
		}
	}
}
