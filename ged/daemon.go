package main

import (
	"context"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"log/slog"
	"os/exec"
	"sync"
	"time"

	"github.com/coder/websocket"
)

func contextWithTimeout(d time.Duration) (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), d)
}

const maxLogHistory = 1000

// ServerConn represents a connected game server.
// The server has two WebSocket connections:
//   - Sideband (Conn): text frames for hello, logs, preview, tweaks, player_attached/detached
//   - Wire (WireConn): binary frames forwarded to/from the player
type ServerConn struct {
	Conn     *websocket.Conn // sideband
	WireConn *websocket.Conn // wire (nil until player attached and server connects wire)
	Name     string
	PID      int

	// sendMu serializes writes to the sideband WebSocket.
	sendMu sync.Mutex
	// wireMu serializes writes to the wire WebSocket.
	wireMu sync.Mutex

	// wireReady is closed when WireConn is set.
	wireReady chan struct{}
}

// PlayerConn represents a connected player.
type PlayerConn struct {
	Conn       *websocket.Conn
	DeviceInfo []byte // first binary frame (wire protocol DeviceInfo)
}

// Daemon is the central coordinator between game servers, players, and the dashboard.
type Daemon struct {
	mu     sync.Mutex
	server *ServerConn
	player *PlayerConn
	bridge *Bridge

	// Dashboard state
	logHistory  []string        // JSON-encoded log entries (ring buffer)
	logClients  []*wsClient     // /ws/logs subscribers
	prevClients []*wsClient     // /ws/preview subscribers
	tweakState  json.RawMessage // cached tweak JSON from server

	// Network
	lanIP      string
	qrURL      string
	port       int
	openedDash bool // true after first browser open
}

// wsClient wraps a dashboard WebSocket connection.
type wsClient struct {
	conn *websocket.Conn
	mu   sync.Mutex
}

// NewDaemon creates a new daemon instance.
func NewDaemon(port int) *Daemon {
	ip := lanIP()
	return &Daemon{
		lanIP: ip,
		qrURL: fmt.Sprintf("squz-remote://%s:%d", ip, port),
		port:  port,
	}
}

// SetServer registers a new game server, tearing down any existing bridge.
func (d *Daemon) SetServer(sc *ServerConn) {
	d.mu.Lock()
	defer d.mu.Unlock()

	// Tear down old bridge if active
	if d.bridge != nil {
		d.bridge.Close()
		d.bridge = nil
	}

	// Close old server connection
	if d.server != nil {
		d.server.Conn.CloseNow()
		if d.server.WireConn != nil {
			d.server.WireConn.CloseNow()
		}
	}

	d.server = sc
	slog.Info("Server registered", "name", sc.Name, "pid", sc.PID)

	if !d.openedDash {
		d.openedDash = true
		go func() {
			url := fmt.Sprintf("http://localhost:%d", d.port)
			_ = exec.Command("open", url).Run()
		}()
	}

	d.tryBridgeLocked()
}

// UnsetServer removes the current game server.
func (d *Daemon) UnsetServer(sc *ServerConn) {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.server != sc {
		return // stale unset
	}

	if d.bridge != nil {
		d.bridge.Close()
		d.bridge = nil
	}

	d.server = nil
	slog.Info("Server disconnected")

	// Always notify the player when the server disconnects. The player
	// handles SessionEnd gracefully whether mid-session or waiting idle.
	// (UnsetServerWire may race and clear the bridge first, so we can't
	// rely on bridge state.)
	if d.player != nil {
		d.sendSessionEndLocked(d.player.Conn)
	}
}

// SetServerWire sets the wire WebSocket for the current server and starts the bridge.
func (d *Daemon) SetServerWire(sc *ServerConn, wireConn *websocket.Conn) bool {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.server != sc {
		return false
	}

	sc.WireConn = wireConn

	// Signal that wire is ready
	select {
	case <-sc.wireReady:
	default:
		close(sc.wireReady)
	}

	// Start bridge if player is connected
	d.tryBridgeLocked()
	return true
}

// UnsetServerWire clears the wire connection for a server.
func (d *Daemon) UnsetServerWire(sc *ServerConn) {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.server != sc {
		return
	}

	if d.bridge != nil {
		d.bridge.Close()
		d.bridge = nil
	}

	sc.WireConn = nil
}

// SetPlayer registers a new player connection.
func (d *Daemon) SetPlayer(pc *PlayerConn) {
	d.mu.Lock()
	defer d.mu.Unlock()

	// Close old player
	if d.player != nil {
		if d.bridge != nil {
			d.bridge.Close()
			d.bridge = nil
		}
		d.player.Conn.CloseNow()
	}

	d.player = pc
	slog.Info("Player connected")

	d.tryBridgeLocked()
}

// UnsetPlayer removes the current player.
func (d *Daemon) UnsetPlayer(pc *PlayerConn) {
	d.mu.Lock()
	defer d.mu.Unlock()

	if d.player != pc {
		return
	}

	if d.bridge != nil {
		d.bridge.Close()
		d.bridge = nil
	}

	d.player = nil
	slog.Info("Player disconnected")

	// Close server wire WS to signal disconnect to the server.
	// Server's processResponses detects this, run() returns true,
	// outer loop creates a new WireSession that reconnects.
	if d.server != nil && d.server.WireConn != nil {
		d.server.WireConn.CloseNow()
	}
}

// tryBridgeLocked attempts to establish a bridge if server wire and player are both ready.
// Sends the player's stored DeviceInfo to the server to initiate the wire handshake.
// Must be called with d.mu held.
func (d *Daemon) tryBridgeLocked() {
	if d.server == nil || d.server.WireConn == nil || d.player == nil || d.bridge != nil {
		return
	}
	if d.player.DeviceInfo == nil {
		return
	}

	// Send stored DeviceInfo to server — this initiates the wire handshake.
	d.server.wireMu.Lock()
	ctx, cancel := contextWithTimeout(5 * time.Second)
	err := d.server.WireConn.Write(ctx, websocket.MessageBinary, d.player.DeviceInfo)
	cancel()
	d.server.wireMu.Unlock()
	if err != nil {
		slog.Error("Failed to send DeviceInfo to server", "err", err)
		return
	}

	d.bridge = NewBridge(d, d.server, d.player)
	slog.Info("Bridge established")
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

// BroadcastPreview sends a preview frame/accel to all dashboard /ws/preview clients.
func (d *Daemon) BroadcastPreview(msgType websocket.MessageType, data []byte) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.broadcastToClients(&d.prevClients, msgType, data)
}

// AddLogClient adds a dashboard log WebSocket client, replaying history.
func (d *Daemon) AddLogClient(c *wsClient) {
	d.mu.Lock()
	defer d.mu.Unlock()

	// Replay history
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
// The message is a wire::MessageHeader with magic=0x5957324D and length=0.
// Must be called with d.mu held (or the caller must own the connection).
func (d *Daemon) sendSessionEndLocked(conn *websocket.Conn) {
	var buf [8]byte
	binary.LittleEndian.PutUint32(buf[0:4], 0x5957324D) // kSessionEndMagic
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
