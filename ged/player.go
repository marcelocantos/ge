package main

import (
	"context"
	"log/slog"
	"net/http"
	"time"

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

	pc := &PlayerConn{Conn: conn, DeviceInfo: deviceInfo}
	d.SetPlayer(pc)
	defer d.UnsetPlayer(pc)

	// Forward remaining frames to the server's wire connection.
	for {
		mt, data, err := conn.Read(ctx)
		if err != nil {
			if ctx.Err() == nil {
				slog.Info("Player disconnected")
			}
			return
		}

		d.forwardToServerWire(mt, data)
	}
}

// forwardToServerWire sends a frame to the server's wire connection.
func (d *Daemon) forwardToServerWire(mt websocket.MessageType, data []byte) {
	d.mu.Lock()
	server := d.server
	d.mu.Unlock()

	if server == nil || server.WireConn == nil {
		return
	}

	server.wireMu.Lock()
	defer server.wireMu.Unlock()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = server.WireConn.Write(ctx, mt, data)
}
