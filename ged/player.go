package main

import (
	"encoding/binary"
	"log/slog"
	"net/http"

	"github.com/coder/websocket"
)

// handlePlayer handles a player WebSocket connection at /ws/wire.
// Ged is a pure bridge — it registers the player, then forwards all
// binary frames bidirectionally between the player and server wire.
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

	ctx := r.Context()
	cancelPing := startPing(ctx, conn)
	defer cancelPing()

	name := r.URL.Query().Get("name")
	preference := r.URL.Query().Get("preference")
	pc := &PlayerConn{Conn: conn}
	sessionID := d.AddPlayer(pc, name, preference)
	defer d.RemovePlayer(sessionID)

	// Forward all frames to the server wire for this session.
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

		if !d.ForwardToServerWire(sessionID, mt, data) {
			d.ForwardToServerSideband(sessionID, mt, data)
		}
	}
}
