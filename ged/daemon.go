package main

import (
	"context"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"log/slog"
	"os/exec"
	"strconv"
	"sync"
	"time"

	"github.com/coder/websocket"
)

func contextWithTimeout(d time.Duration) (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), d)
}

const maxLogHistory = 1000

// ServerConn represents a connected game server's sideband connection.
// Wire connections are now per-session (see PlayerSession).
type ServerConn struct {
	Conn *websocket.Conn // sideband
	Name string
	PID  int

	// sendMu serializes writes to the sideband WebSocket.
	sendMu sync.Mutex
}

// PlayerConn represents a connected player.
type PlayerConn struct {
	Conn       *websocket.Conn
	DeviceInfo []byte // first binary frame (wire protocol DeviceInfo)
}

// PlayerSession represents an active session between a player and the game server.
// Each player gets its own session with a dedicated wire WS pair.
type PlayerSession struct {
	ID     string
	Player *PlayerConn

	// Per-session wire connection to the game server.
	ServerWire *websocket.Conn
	wireMu     sync.Mutex
	bridged    bool
}

// Daemon is the central coordinator between game servers, players, and the dashboard.
type Daemon struct {
	mu       sync.Mutex
	server   *ServerConn
	sessions map[string]*PlayerSession // sessionID → session
	nextID   int                       // incrementing session counter

	// Dashboard state
	logHistory  []string        // JSON-encoded log entries (ring buffer)
	logClients  []*wsClient     // /ws/logs subscribers
	prevClients []*wsClient     // /ws/preview subscribers
	tweakState  json.RawMessage // cached tweak JSON from server

	// Network
	lanIP      string
	qrURL      string
	port       int
	noOpen     bool // suppress browser open on first server connect
	openedDash bool // true after first browser open
}

// wsClient wraps a dashboard WebSocket connection.
type wsClient struct {
	conn            *websocket.Conn
	mu              sync.Mutex
	selectedSession string // preview filter: "" = show all
}

// NewDaemon creates a new daemon instance.
func NewDaemon(port int, noOpen bool) *Daemon {
	ip := lanIP()
	return &Daemon{
		lanIP:    ip,
		qrURL:    fmt.Sprintf("ge-remote://%s:%d", ip, port),
		port:     port,
		noOpen:   noOpen,
		sessions: make(map[string]*PlayerSession),
	}
}

// SetServer registers a new game server.
// Closes old server wire connections but keeps player sessions alive,
// then notifies the new server about existing players.
func (d *Daemon) SetServer(sc *ServerConn) {
	d.mu.Lock()
	defer d.mu.Unlock()

	// Close server wire connections from old server (but keep player sessions)
	for _, sess := range d.sessions {
		if sess.ServerWire != nil {
			sess.ServerWire.CloseNow()
			sess.ServerWire = nil
		}
		sess.bridged = false
	}

	// Close old server sideband connection
	if d.server != nil {
		d.server.Conn.CloseNow()
	}

	d.server = sc
	slog.Info("Server registered", "name", sc.Name, "pid", sc.PID)

	// Notify new server about existing player sessions
	for _, sess := range d.sessions {
		msg := fmt.Sprintf(`{"type":"player_attached","session_id":"%s"}`, sess.ID)
		d.sendToServerLocked(msg)
	}

	if !d.noOpen && !d.openedDash {
		d.openedDash = true
		go func() {
			url := fmt.Sprintf("http://localhost:%d", d.port)
			_ = exec.Command("open", url).Run()
		}()
	}
}

// UnsetServer removes the current game server.
func (d *Daemon) UnsetServer(sc *ServerConn) {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.server != sc {
		return // stale unset
	}

	// Notify all players that the server is gone and close server wires
	for _, sess := range d.sessions {
		d.sendSessionEndLocked(sess.Player.Conn)
		if sess.ServerWire != nil {
			sess.ServerWire.CloseNow()
			sess.ServerWire = nil
		}
		sess.bridged = false
	}

	d.server = nil
	slog.Info("Server disconnected")
}

// AddPlayer registers a new player, assigns a session ID, and notifies the server.
// Returns the session ID.
func (d *Daemon) AddPlayer(pc *PlayerConn) string {
	d.mu.Lock()
	defer d.mu.Unlock()

	d.nextID++
	sessionID := "s" + strconv.Itoa(d.nextID)

	sess := &PlayerSession{
		ID:     sessionID,
		Player: pc,
	}
	d.sessions[sessionID] = sess
	slog.Info("Player connected", "session", sessionID)

	// Notify the game server that a new player has attached
	if d.server != nil {
		msg := fmt.Sprintf(`{"type":"player_attached","session_id":"%s"}`, sessionID)
		d.sendToServerLocked(msg)
	}

	// Notify dashboard log clients about the new session
	d.broadcastToClients(&d.logClients, websocket.MessageText,
		[]byte(fmt.Sprintf(`{"type":"session_add","session":"%s"}`, sessionID)))

	return sessionID
}

// RemovePlayer tears down a player session.
func (d *Daemon) RemovePlayer(sessionID string) {
	d.mu.Lock()
	defer d.mu.Unlock()

	sess, ok := d.sessions[sessionID]
	if !ok {
		return
	}

	// Close the server wire for this session (signals the game server thread to exit)
	if sess.ServerWire != nil {
		sess.ServerWire.CloseNow()
	}

	delete(d.sessions, sessionID)
	slog.Info("Player disconnected", "session", sessionID)

	// Notify the game server
	if d.server != nil {
		msg := fmt.Sprintf(`{"type":"player_detached","session_id":"%s"}`, sessionID)
		d.sendToServerLocked(msg)
	}

	// Notify dashboard log clients about the removed session
	d.broadcastToClients(&d.logClients, websocket.MessageText,
		[]byte(fmt.Sprintf(`{"type":"session_remove","session":"%s"}`, sessionID)))
}

// SetSessionWire associates a wire WebSocket with a session and bridges it.
func (d *Daemon) SetSessionWire(sessionID string, wireConn *websocket.Conn) bool {
	d.mu.Lock()
	defer d.mu.Unlock()

	sess, ok := d.sessions[sessionID]
	if !ok {
		return false
	}

	sess.ServerWire = wireConn
	d.tryBridgeSessionLocked(sess)
	return true
}

// UnsetSessionWire clears the wire connection for a session.
func (d *Daemon) UnsetSessionWire(sessionID string) {
	d.mu.Lock()
	defer d.mu.Unlock()

	sess, ok := d.sessions[sessionID]
	if !ok {
		return
	}

	sess.bridged = false
	sess.ServerWire = nil
}

// tryBridgeSessionLocked attempts to establish a bridge for a specific session.
// Sends the player's stored DeviceInfo to the server wire to initiate the handshake.
// Must be called with d.mu held.
func (d *Daemon) tryBridgeSessionLocked(sess *PlayerSession) {
	if sess.ServerWire == nil || sess.Player == nil || sess.bridged {
		return
	}
	if sess.Player.DeviceInfo == nil {
		return
	}

	// Send stored DeviceInfo to server — this initiates the wire handshake.
	sess.wireMu.Lock()
	ctx, cancel := contextWithTimeout(5 * time.Second)
	err := sess.ServerWire.Write(ctx, websocket.MessageBinary, sess.Player.DeviceInfo)
	cancel()
	sess.wireMu.Unlock()
	if err != nil {
		slog.Error("Failed to send DeviceInfo to server", "session", sess.ID, "err", err)
		return
	}

	sess.bridged = true
	slog.Info("Bridge established", "session", sess.ID)
}

// ForwardToPlayer sends a binary frame to the player for a specific session.
func (d *Daemon) ForwardToPlayer(sessionID string, data []byte) {
	d.mu.Lock()
	sess, ok := d.sessions[sessionID]
	d.mu.Unlock()

	if !ok || sess.Player == nil {
		return
	}

	ctx, cancel := contextWithTimeout(5 * time.Second)
	defer cancel()
	_ = sess.Player.Conn.Write(ctx, websocket.MessageBinary, data)
}

// ForwardToServerWire sends a frame to the server's wire for a specific session.
func (d *Daemon) ForwardToServerWire(sessionID string, mt websocket.MessageType, data []byte) {
	d.mu.Lock()
	sess, ok := d.sessions[sessionID]
	d.mu.Unlock()

	if !ok || sess.ServerWire == nil {
		return
	}

	sess.wireMu.Lock()
	defer sess.wireMu.Unlock()

	ctx, cancel := contextWithTimeout(5 * time.Second)
	defer cancel()
	_ = sess.ServerWire.Write(ctx, mt, data)
}

// sendToServerLocked sends a text message to the current server's sideband.
// Must be called with d.mu held.
func (d *Daemon) sendToServerLocked(msg string) {
	if d.server == nil {
		return
	}
	d.server.sendMu.Lock()
	defer d.server.sendMu.Unlock()
	ctx, cancel := contextWithTimeout(2 * time.Second)
	defer cancel()
	_ = d.server.Conn.Write(ctx, websocket.MessageText, []byte(msg))
}

// BroadcastLog sends a log entry to all dashboard /ws/logs clients.
func (d *Daemon) BroadcastLog(jsonMsg string) {
	d.mu.Lock()
	defer d.mu.Unlock()

	// Buffer for history replay
	d.logHistory = append(d.logHistory, jsonMsg)
	if len(d.logHistory) > maxLogHistory {
		d.logHistory = d.logHistory[len(d.logHistory)-maxLogHistory:]
	}

	// Broadcast to connected dashboard clients
	d.broadcastToClients(&d.logClients, websocket.MessageText, []byte(jsonMsg))
}

// SendPreview sends a preview frame to dashboard clients that have selected the
// given session. If sessionID is empty, sends to all clients (backward compat).
func (d *Daemon) SendPreview(sessionID string, msgType websocket.MessageType, data []byte) {
	d.mu.Lock()
	defer d.mu.Unlock()

	alive := d.prevClients[:0]
	for _, c := range d.prevClients {
		// Send if: no session tag (broadcast), client has no filter, or filter matches.
		if sessionID != "" && c.selectedSession != "" && c.selectedSession != sessionID {
			alive = append(alive, c)
			continue
		}
		c.mu.Lock()
		ctx, cancel := contextWithTimeout(time.Second)
		err := c.conn.Write(ctx, msgType, data)
		cancel()
		c.mu.Unlock()
		if err == nil {
			alive = append(alive, c)
		}
	}
	d.prevClients = alive
}

// SetPreviewSession sets which session a preview client wants to watch.
func (d *Daemon) SetPreviewSession(c *wsClient, sessionID string) {
	d.mu.Lock()
	defer d.mu.Unlock()
	c.selectedSession = sessionID
}

// AddLogClient adds a dashboard log WebSocket client, replaying history.
func (d *Daemon) AddLogClient(c *wsClient) {
	d.mu.Lock()
	defer d.mu.Unlock()

	// Replay current session list so the dashboard knows existing sessions
	for _, sess := range d.sessions {
		msg := fmt.Sprintf(`{"type":"session_add","session":"%s"}`, sess.ID)
		ctx, cancel := contextWithTimeout(5 * time.Second)
		_ = c.conn.Write(ctx, websocket.MessageText, []byte(msg))
		cancel()
	}

	// Replay log history
	for _, msg := range d.logHistory {
		ctx, cancel := contextWithTimeout(5 * time.Second)
		_ = c.conn.Write(ctx, websocket.MessageText, []byte(msg))
		cancel()
	}

	d.logClients = append(d.logClients, c)
}

// RemoveLogClient removes a dashboard log WebSocket client.
func (d *Daemon) RemoveLogClient(c *wsClient) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.logClients = removeClient(d.logClients, c)
}

// AddPreviewClient adds a dashboard preview WebSocket client.
func (d *Daemon) AddPreviewClient(c *wsClient) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.prevClients = append(d.prevClients, c)
}

// RemovePreviewClient removes a dashboard preview WebSocket client.
func (d *Daemon) RemovePreviewClient(c *wsClient) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.prevClients = removeClient(d.prevClients, c)
}

// SetTweakState caches the latest tweak state from the server.
func (d *Daemon) SetTweakState(data json.RawMessage) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.tweakState = data
}

// GetTweakState returns the cached tweak state.
func (d *Daemon) GetTweakState() json.RawMessage {
	d.mu.Lock()
	defer d.mu.Unlock()
	if d.tweakState == nil {
		return json.RawMessage("[]")
	}
	return d.tweakState
}

// SendTweakToServer forwards a tweak command to the game server.
func (d *Daemon) SendTweakToServer(msg string) bool {
	d.mu.Lock()
	defer d.mu.Unlock()
	if d.server == nil {
		return false
	}
	d.sendToServerLocked(msg)
	return true
}

// ServerInfo returns current server info for the dashboard API.
func (d *Daemon) ServerInfo() map[string]any {
	d.mu.Lock()
	defer d.mu.Unlock()
	info := map[string]any{
		"connected": d.server != nil,
		"sessions":  len(d.sessions),
	}
	if d.server != nil {
		info["name"] = d.server.Name
		info["pid"] = d.server.PID
	}
	return info
}

// broadcastToClients sends a message to all clients in the list, removing dead ones.
func (d *Daemon) broadcastToClients(clients *[]*wsClient, mt websocket.MessageType, data []byte) {
	alive := (*clients)[:0]
	for _, c := range *clients {
		c.mu.Lock()
		ctx, cancel := contextWithTimeout(time.Second)
		err := c.conn.Write(ctx, mt, data)
		cancel()
		c.mu.Unlock()
		if err == nil {
			alive = append(alive, c)
		}
	}
	*clients = alive
}

// sendSessionEndLocked sends a wire::kSessionEndMagic message to a player connection.
// The message is a wire::MessageHeader with magic=0x4745324D and length=0.
// Must be called with d.mu held (or the caller must own the connection).
func (d *Daemon) sendSessionEndLocked(conn *websocket.Conn) {
	var buf [8]byte
	binary.LittleEndian.PutUint32(buf[0:4], 0x4745324D) // kSessionEndMagic
	binary.LittleEndian.PutUint32(buf[4:8], 0)          // length = 0
	ctx, cancel := contextWithTimeout(2 * time.Second)
	defer cancel()
	if err := conn.Write(ctx, websocket.MessageBinary, buf[:]); err != nil {
		slog.Warn("Failed to send SessionEnd to player", "err", err)
	}
}

func removeClient(clients []*wsClient, target *wsClient) []*wsClient {
	for i, c := range clients {
		if c == target {
			return append(clients[:i], clients[i+1:]...)
		}
	}
	return clients
}
