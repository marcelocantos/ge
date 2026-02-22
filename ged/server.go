package main

import (
	"encoding/json"
	"log/slog"
	"net/http"

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
		Conn: conn,
		Name: hello.Name,
		PID:  hello.PID,
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

// handleServerSessionWire handles a per-session wire WebSocket at /ws/server/wire/{sessionID}.
// The game server connects one of these for each player session.
func (d *Daemon) handleServerSessionWire(w http.ResponseWriter, r *http.Request) {
	sessionID := r.PathValue("sessionID")
	if sessionID == "" {
		http.Error(w, "missing session ID", 400)
		return
	}

	conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
		InsecureSkipVerify: true,
	})
	if err != nil {
		slog.Error("Server session wire accept failed", "session", sessionID, "err", err)
		return
	}
	defer conn.CloseNow()

	conn.SetReadLimit(maxFrameSize)

	if !d.SetSessionWire(sessionID, conn) {
		slog.Error("Server session wire: unknown session", "session", sessionID)
		return
	}
	defer d.UnsetSessionWire(sessionID)

	slog.Info("Server session wire connected", "session", sessionID)

	// Read loop: forward binary frames to the session's player
	ctx := r.Context()
	for {
		mt, data, err := conn.Read(ctx)
		if err != nil {
			if ctx.Err() == nil {
				slog.Info("Server session wire disconnected", "session", sessionID)
			}
			return
		}
		if mt == websocket.MessageBinary {
			d.ForwardToPlayer(sessionID, data)
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
