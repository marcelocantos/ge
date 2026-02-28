package main

import (
	"context"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io/fs"
	"log/slog"
	"os"
	"os/exec"
	"sort"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/coder/websocket"
)

// protocolVersion must match wire::kProtocolVersion in Protocol.h.
const protocolVersion = 3

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
	ID   string

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
	ID       string
	Player   *PlayerConn
	ServerID string // which server this session is currently bridged to
	Name     string // platform name from player (e.g. "mac", "ios", "android")

	// Per-session wire connection to the game server.
	ServerWire *websocket.Conn
	wireMu     sync.Mutex
	bridged    bool
}

// Daemon is the central coordinator between game servers, players, and the dashboard.
type Daemon struct {
	mu           sync.Mutex
	servers      map[string]*ServerConn   // serverID -> server
	nextSrvID    int                      // incrementing server ID counter
	activeServer string                   // server ID that new/switched players get assigned to
	sessions     map[string]*PlayerSession // sessionID -> session
	nextID       int                       // incrementing session counter

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

	// Versioning
	dashBuildID string // build ID from web dist (for staleness detection)
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
		lanIP:       ip,
		qrURL:       fmt.Sprintf("ge-remote://%s:%d", ip, port),
		port:        port,
		noOpen:      noOpen,
		servers:     make(map[string]*ServerConn),
		sessions:    make(map[string]*PlayerSession),
		dashBuildID: readDashBuildID(),
	}
}

// readDashBuildID reads the dashboard build ID from disk or the embedded FS.
func readDashBuildID() string {
	// Try disk first (development mode)
	if data, err := os.ReadFile("ge/web/dist/.build-id"); err == nil {
		return strings.TrimSpace(string(data))
	}
	// Fall back to embedded FS
	if data, err := fs.ReadFile(embeddedUI, "web/dist/.build-id"); err == nil {
		return strings.TrimSpace(string(data))
	}
	slog.Warn("Dashboard build ID not found")
	return ""
}

// AddServer registers a new game server.
// Assigns a server ID, adds to the servers map, and if it's the first (or no active),
// sets it as the active server. Broadcasts state to dashboard clients.
func (d *Daemon) AddServer(sc *ServerConn) {
	d.mu.Lock()
	defer d.mu.Unlock()

	d.nextSrvID++
	sc.ID = "srv" + strconv.Itoa(d.nextSrvID)
	d.servers[sc.ID] = sc

	slog.Info("Server registered", "id", sc.ID, "name", sc.Name, "pid", sc.PID)

	// If no active server, make this one active
	if d.activeServer == "" {
		d.activeServer = sc.ID

		// Notify this server about all existing player sessions
		for _, sess := range d.sessions {
			sess.ServerID = sc.ID
			msg := fmt.Sprintf(`{"type":"player_attached","session_id":"%s"}`, sess.ID)
			d.sendToServerIDLocked(sc.ID, msg)
		}
	}

	d.broadcastStateLocked()

	if !d.noOpen && !d.openedDash {
		d.openedDash = true
		go func() {
			url := fmt.Sprintf("http://localhost:%d", d.port)
			_ = exec.Command("open", url).Run()
		}()
	}
}

// RemoveServer removes a game server. Sends SessionEnd to all sessions on that server.
// If it was the active server, picks another or clears. Sessions on the removed server
// get re-assigned to the new active server if one exists.
func (d *Daemon) RemoveServer(sc *ServerConn) {
	d.mu.Lock()
	defer d.mu.Unlock()

	if _, ok := d.servers[sc.ID]; !ok {
		return // already removed
	}

	slog.Info("Server disconnected", "id", sc.ID, "name", sc.Name)

	// Collect sessions that belong to this server
	var affected []*PlayerSession
	for _, sess := range d.sessions {
		if sess.ServerID == sc.ID {
			affected = append(affected, sess)
		}
	}

	// Close server wire connections and send SessionEnd to affected players
	for _, sess := range affected {
		if sess.ServerWire != nil {
			sess.ServerWire.CloseNow()
			sess.ServerWire = nil
		}
		sess.bridged = false
		d.sendSessionEndLocked(sess.Player.Conn)
	}

	delete(d.servers, sc.ID)

	// If this was the active server, pick another
	if d.activeServer == sc.ID {
		d.activeServer = ""
		for id := range d.servers {
			d.activeServer = id
			break
		}

		if d.activeServer != "" {
			// Re-assign affected sessions to the new active server
			for _, sess := range affected {
				sess.ServerID = d.activeServer
				msg := fmt.Sprintf(`{"type":"player_attached","session_id":"%s"}`, sess.ID)
				d.sendToServerIDLocked(d.activeServer, msg)
			}
		}
	}

	d.broadcastStateLocked()
}

// SwitchServer changes the active server and migrates all sessions to it.
// For each session currently on a different server: closes server wire, sends SessionEnd
// to the player, updates the session's ServerID, and notifies the new server.
func (d *Daemon) SwitchServer(serverID string) bool {
	d.mu.Lock()
	defer d.mu.Unlock()

	if _, ok := d.servers[serverID]; !ok {
		return false
	}
	if d.activeServer == serverID {
		return true // already active
	}

	oldActive := d.activeServer
	d.activeServer = serverID

	slog.Info("Switching active server", "from", oldActive, "to", serverID)

	// Migrate all sessions that are on a different server
	for _, sess := range d.sessions {
		if sess.ServerID == serverID {
			continue // already on the target server
		}

		oldServerID := sess.ServerID

		// Close old server wire
		if sess.ServerWire != nil {
			sess.ServerWire.CloseNow()
			sess.ServerWire = nil
		}
		sess.bridged = false

		// Send SessionEnd to the player
		d.sendSessionEndLocked(sess.Player.Conn)

		// Notify old server about detach
		if oldServerID != "" {
			d.sendToServerIDLocked(oldServerID, fmt.Sprintf(`{"type":"player_detached","session_id":"%s"}`, sess.ID))
		}

		// Update session's server assignment
		sess.ServerID = serverID

		// Notify new server about attach
		d.sendToServerIDLocked(serverID, fmt.Sprintf(`{"type":"player_attached","session_id":"%s"}`, sess.ID))
	}

	d.broadcastStateLocked()
	return true
}

// SwitchSession moves a single session to a different server.
// Does NOT change activeServer.
func (d *Daemon) SwitchSession(sessionID, serverID string) bool {
	d.mu.Lock()
	defer d.mu.Unlock()

	sess, ok := d.sessions[sessionID]
	if !ok {
		return false
	}
	if _, ok := d.servers[serverID]; !ok {
		return false
	}
	if sess.ServerID == serverID {
		return true // already there
	}

	oldServerID := sess.ServerID

	// Close old server wire
	if sess.ServerWire != nil {
		sess.ServerWire.CloseNow()
		sess.ServerWire = nil
	}
	sess.bridged = false

	// Send SessionEnd to the player
	d.sendSessionEndLocked(sess.Player.Conn)

	// Notify old server about detach
	if oldServerID != "" {
		d.sendToServerIDLocked(oldServerID,
			fmt.Sprintf(`{"type":"player_detached","session_id":"%s"}`, sess.ID))
	}

	// Update session's server assignment
	sess.ServerID = serverID

	// Notify new server about attach
	d.sendToServerIDLocked(serverID,
		fmt.Sprintf(`{"type":"player_attached","session_id":"%s"}`, sess.ID))

	d.broadcastStateLocked()
	return true
}

// AddPlayer registers a new player, assigns a session ID, and notifies the active server.
// Returns the session ID.
func (d *Daemon) AddPlayer(pc *PlayerConn, name string) string {
	d.mu.Lock()
	defer d.mu.Unlock()

	d.nextID++
	sessionID := "s" + strconv.Itoa(d.nextID)

	sess := &PlayerSession{
		ID:       sessionID,
		Player:   pc,
		ServerID: d.activeServer,
		Name:     name,
	}
	d.sessions[sessionID] = sess
	slog.Info("Player connected", "session", sessionID, "name", name, "server", d.activeServer)

	// Notify the active game server that a new player has attached
	if d.activeServer != "" {
		msg := fmt.Sprintf(`{"type":"player_attached","session_id":"%s"}`, sessionID)
		d.sendToServerIDLocked(d.activeServer, msg)
	}

	d.broadcastStateLocked()
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

	// Notify the session's server
	if sess.ServerID != "" {
		msg := fmt.Sprintf(`{"type":"player_detached","session_id":"%s"}`, sessionID)
		d.sendToServerIDLocked(sess.ServerID, msg)
	}

	d.broadcastStateLocked()
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

// sendToServerIDLocked sends a text message to a specific server's sideband.
// Must be called with d.mu held.
func (d *Daemon) sendToServerIDLocked(serverID string, msg string) {
	sc, ok := d.servers[serverID]
	if !ok {
		return
	}
	sc.sendMu.Lock()
	defer sc.sendMu.Unlock()
	ctx, cancel := contextWithTimeout(2 * time.Second)
	defer cancel()
	_ = sc.Conn.Write(ctx, websocket.MessageText, []byte(msg))
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

// AddLogClient adds a dashboard log WebSocket client, sending current state + log history.
func (d *Daemon) AddLogClient(c *wsClient) {
	d.mu.Lock()
	defer d.mu.Unlock()

	// Send current state snapshot
	snapshot := d.stateSnapshotLocked()
	ctx, cancel := contextWithTimeout(5 * time.Second)
	_ = c.conn.Write(ctx, websocket.MessageText, snapshot)
	cancel()

	// Replay log history
	for _, msg := range d.logHistory {
		ctx, cancel := contextWithTimeout(5 * time.Second)
		_ = c.conn.Write(ctx, websocket.MessageText, []byte(msg))
		cancel()
	}

	d.logClients = append(d.logClients, c)
}

// broadcastStateLocked sends the full state snapshot to all dashboard clients.
// Must be called with d.mu held.
func (d *Daemon) broadcastStateLocked() {
	d.broadcastToClients(&d.logClients, websocket.MessageText, d.stateSnapshotLocked())
}

// stateSnapshotLocked builds a JSON state message with all servers and sessions.
// Must be called with d.mu held.
func (d *Daemon) stateSnapshotLocked() []byte {
	type serverInfo struct {
		ID     string `json:"id"`
		Name   string `json:"name"`
		PID    int    `json:"pid"`
		Active bool   `json:"active"`
	}

	servers := make([]serverInfo, 0, len(d.servers))
	for _, sc := range d.servers {
		servers = append(servers, serverInfo{
			ID:     sc.ID,
			Name:   sc.Name,
			PID:    sc.PID,
			Active: sc.ID == d.activeServer,
		})
	}

	type sessionInfo struct {
		ID       string `json:"id"`
		ServerID string `json:"serverID"`
		Name     string `json:"name"`
	}

	// Compute display names: single instance gets bare name,
	// duplicates get " 1", " 2" suffix ordered by session ID.
	nameCounts := make(map[string]int)
	for _, sess := range d.sessions {
		nameCounts[sess.Name]++
	}

	// Collect and sort session IDs for stable numbering
	sortedIDs := make([]string, 0, len(d.sessions))
	for id := range d.sessions {
		sortedIDs = append(sortedIDs, id)
	}
	sort.Strings(sortedIDs)

	// Assign display names
	nameCounters := make(map[string]int)
	displayNames := make(map[string]string, len(d.sessions))
	for _, id := range sortedIDs {
		sess := d.sessions[id]
		base := sess.Name
		if base == "" {
			displayNames[id] = sess.ID
		} else if nameCounts[base] == 1 {
			displayNames[id] = base
		} else {
			nameCounters[base]++
			displayNames[id] = fmt.Sprintf("%s %d", base, nameCounters[base])
		}
	}

	sessions := make([]sessionInfo, 0, len(d.sessions))
	for _, sess := range d.sessions {
		sessions = append(sessions, sessionInfo{
			ID:       sess.ID,
			ServerID: sess.ServerID,
			Name:     displayNames[sess.ID],
		})
	}

	msg := struct {
		Type     string        `json:"type"`
		BuildID  string        `json:"buildId,omitempty"`
		Servers  []serverInfo  `json:"servers"`
		Sessions []sessionInfo `json:"sessions"`
	}{
		Type:     "state",
		BuildID:  d.dashBuildID,
		Servers:  servers,
		Sessions: sessions,
	}

	data, _ := json.Marshal(msg)
	return data
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

// SendTweakToServer forwards a tweak command to the active game server.
func (d *Daemon) SendTweakToServer(msg string) bool {
	d.mu.Lock()
	defer d.mu.Unlock()
	if d.activeServer == "" {
		return false
	}
	d.sendToServerIDLocked(d.activeServer, msg)
	return true
}

// ServerInfo returns current server info for the dashboard API.
// Returns an array of all servers with session counts and active flag.
func (d *Daemon) ServerInfo() map[string]any {
	d.mu.Lock()
	defer d.mu.Unlock()

	// Count sessions per server
	sessionCounts := make(map[string]int)
	for _, sess := range d.sessions {
		sessionCounts[sess.ServerID]++
	}

	servers := make([]map[string]any, 0, len(d.servers))
	for _, sc := range d.servers {
		servers = append(servers, map[string]any{
			"id":       sc.ID,
			"name":     sc.Name,
			"pid":      sc.PID,
			"sessions": sessionCounts[sc.ID],
			"active":   sc.ID == d.activeServer,
		})
	}

	info := map[string]any{
		"connected": len(d.servers) > 0,
		"servers":   servers,
		"sessions":  len(d.sessions),
	}

	// Backward compat: include name/pid of active server at top level
	if d.activeServer != "" {
		if sc, ok := d.servers[d.activeServer]; ok {
			info["name"] = sc.Name
			info["pid"] = sc.PID
		}
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
