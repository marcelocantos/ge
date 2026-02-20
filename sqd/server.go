package main

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"time"

	"github.com/coder/websocket"
)

// handleServer handles the game server's sideband WebSocket at /ws/server.
// This carries text frames: hello, logs, preview, tweaks.
func (d *Daemon) handleServer(w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
		InsecureSkipVerify: true,
	})
	if err != nil {
		slog.Error("Server sideband accept failed", "err", err)
		return
	}
	defer conn.CloseNow()

	conn.SetReadLimit(maxFrameSize)

	// Wait for hello message
	mt, data, err := conn.Read(r.Context())
	if err != nil {
		slog.Error("Server hello read failed", "err", err)
		return
	}
	if mt != websocket.MessageText {
		slog.Error("Server hello: expected text frame")
		return
	}

	var hello struct {
		Type string `json:"type"`
		Name string `json:"name"`
		PID  int    `json:"pid"`
	}
	if err := json.Unmarshal(data, &hello); err != nil || hello.Type != "hello" {
		slog.Error("Server hello: invalid message", "err", err)
		return
	}

	sc := &ServerConn{
		Conn:      conn,
		Name:      hello.Name,
		PID:       hello.PID,
		wireReady: make(chan struct{}),
	}

	d.SetServer(sc)
	defer d.UnsetServer(sc)

	// Sideband read loop: text frames carry JSON control messages,
	// binary frames carry raw JPEG preview data.
	ctx := r.Context()
	for {
		mt, data, err := conn.Read(ctx)
		if err != nil {
			if ctx.Err() == nil {
				slog.Info("Server sideband disconnected", "name", hello.Name)
			}
			return
		}
		if mt == websocket.MessageText {
			d.handleServerSideband(data)
		} else if mt == websocket.MessageBinary {
			d.BroadcastPreview(websocket.MessageBinary, data)
		}
	}
}

// handleServerWire handles the game server's wire WebSocket at /ws/server/wire.
// This carries binary frames forwarded to/from the player.
func (d *Daemon) handleServerWire(w http.ResponseWriter, r *http.Request) {
	conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
		InsecureSkipVerify: true,
	})
	if err != nil {
		slog.Error("Server wire accept failed", "err", err)
		return
	}
	defer conn.CloseNow()

	conn.SetReadLimit(maxFrameSize)

	// Associate with current server
	d.mu.Lock()
	sc := d.server
	d.mu.Unlock()

	if sc == nil {
		slog.Error("Server wire: no server registered")
		return
	}

	if !d.SetServerWire(sc, conn) {
		slog.Error("Server wire: server mismatch")
		return
	}
	defer d.UnsetServerWire(sc)

	slog.Info("Server wire connected", "name", sc.Name)

	// Read loop: forward binary frames to player
	ctx := r.Context()
	for {
		mt, data, err := conn.Read(ctx)
		if err != nil {
			if ctx.Err() == nil {
				slog.Info("Server wire disconnected", "name", sc.Name)
			}
			return
		}
		if mt == websocket.MessageBinary {
			d.forwardToPlayer(data)
		}
	}
}

// handleServerSideband processes a text (sideband) message from the game server.
func (d *Daemon) handleServerSideband(data []byte) {
	var msg struct {
		Type string          `json:"type"`
		Data json.RawMessage `json:"data"`
	}
	if err := json.Unmarshal(data, &msg); err != nil {
		return
	}

	switch msg.Type {
	case "log":
		// Extract inner data so dashboard receives {"ts":"...","level":"...","msg":"..."}
		if msg.Data != nil {
			d.BroadcastLog(string(msg.Data))
		}
	case "preview":
		d.BroadcastPreview(websocket.MessageText, data)
	case "preview_bin":
		d.BroadcastPreview(websocket.MessageBinary, msg.Data)
	case "accel":
		d.BroadcastPreview(websocket.MessageText, data)
	case "tweaks":
		d.SetTweakState(msg.Data)
	}
}

// forwardToPlayer sends a binary frame to the player if connected.
func (d *Daemon) forwardToPlayer(data []byte) {
	d.mu.Lock()
	player := d.player
	d.mu.Unlock()

	if player == nil {
		return
	}

	ctx, cancel := contextWithTimeout(5 * time.Second)
	defer cancel()
	_ = player.Conn.Write(ctx, websocket.MessageBinary, data)
}
