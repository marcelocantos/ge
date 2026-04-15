package main

import (
	"context"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io/fs"
	"log/slog"
	"os/exec"
	"sort"
	"strconv"
	"strings"
	"sync"
	"syscall"
	"time"

	"github.com/coder/websocket"
)

// protocolVersion must match wire::kProtocolVersion in Protocol.h.
const protocolVersion = 6

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
	Conn *websocket.Conn
}

// PlayerSession represents an active session between a player and the game server.
// Each player gets its own session with a dedicated wire WS pair.
type PlayerSession struct {
	ID         string
	Player     *PlayerConn
	ServerID   string // which server this session is currently bridged to
	Name       string // platform name from player (e.g. "mac", "ios", "android")
	Preference string // server name preference from the player's query string

	// Per-session wire connection to the game server.
	ServerWire *websocket.Conn
	wireMu     sync.Mutex
	bridged    bool
}

// Daemon is the central coordinator between game servers, players, and the dashboard.
type Daemon struct {
	mu        sync.Mutex
	servers   map[string]*ServerConn   // serverID -> server
	nextSrvID int                      // incrementing server ID counter
	sessions  map[string]*PlayerSession // sessionID -> session
	nextID    int                       // incrementing session counter

	// Dashboard state
	logHistory  []string                  // JSON-encoded log entries (ring buffer)
	logClients  []*wsClient               // /ws/logs subscribers
	prevClients []*wsClient               // /ws/preview subscribers
	stateCache  map[string]json.RawMessage // cached sideband state by message type

	// Video stream state
	streamMuxers  map[string]*StreamMuxer // sessionID -> muxer
	streamClients map[string][]*wsClient  // sessionID -> browser stream clients

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
		servers:       make(map[string]*ServerConn),
		sessions:      make(map[string]*PlayerSession),
		stateCache:    make(map[string]json.RawMessage),
		streamMuxers:  make(map[string]*StreamMuxer),
		streamClients: make(map[string][]*wsClient),
		dashBuildID:   readDashBuildID(),
	}
}

// readDashBuildID reads the dashboard build ID from the embedded FS.
func readDashBuildID() string {
	if data, err := fs.ReadFile(embeddedUI, "web/dist/.build-id"); err == nil {
		return strings.TrimSpace(string(data))
	}
	slog.Warn("Dashboard build ID not found")
	return ""
}

// AddServer registers a new game server.
// Assigns a server ID, adds to the servers map, and assigns any unattached
// sessions (those with an empty ServerID) to this server. Broadcasts state
// to dashboard clients.
func (d *Daemon) AddServer(sc *ServerConn) {
	d.mu.Lock()
	defer d.mu.Unlock()

	// Supersede any existing server with the same name.
	for _, old := range d.servers {
		if old.Name == sc.Name && old.PID != sc.PID {
			slog.Info("Superseding server", "name", old.Name, "old_pid", old.PID, "new_pid", sc.PID)
			syscall.Kill(old.PID, syscall.SIGINT)
		}
	}

	d.nextSrvID++
	sc.ID = "srv" + strconv.Itoa(d.nextSrvID)
	d.servers[sc.ID] = sc

	slog.Info("Server registered", "id", sc.ID, "name", sc.Name, "pid", sc.PID)

	// Auto-assign unattached sessions to this server if their preference
	// matches, or if this is the only server (unambiguous).
	singleServer := len(d.servers) == 1
	for _, sess := range d.sessions {
		if sess.ServerID != "" {
			continue
		}
		if sess.Preference == sc.Name || (sess.Preference == "" && singleServer) {
			sess.ServerID = sc.ID
			d.sendServerAssignedLocked(sess.Player.Conn, sc.Name)
			d.sendToServerIDLocked(sc.ID, fmt.Sprintf(`{"type":"player_attached","session_id":"%s"}`, sess.ID))
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

// RemoveServer removes a game server. Closes wire connections, sends
// SessionEnd to affected players, and tries to reassign them to remaining
// servers. If no servers remain, players stay unattached until a new server
// connects (AddServer assigns unattached sessions) or the dashboard reassigns.
func (d *Daemon) RemoveServer(sc *ServerConn) {
	d.mu.Lock()
	defer d.mu.Unlock()

	if _, ok := d.servers[sc.ID]; !ok {
		return // already removed
	}

	slog.Info("Server disconnected", "id", sc.ID, "name", sc.Name)

	// Close server wire connections and send SessionEnd to affected players.
	for _, sess := range d.sessions {
		if sess.ServerID != sc.ID {
			continue
		}
		if sess.ServerWire != nil {
			sess.ServerWire.CloseNow()
			sess.ServerWire = nil
		}
		sess.bridged = false
		sess.ServerID = ""
		d.sendSessionEndLocked(sess.Player.Conn)
	}

	delete(d.servers, sc.ID)

	// Reassign unattached sessions: prefer a server with the same name
	// (supersede case), otherwise auto-assign if only one server remains.
	singleServer := len(d.servers) == 1
	for _, sess := range d.sessions {
		if sess.ServerID != "" {
			continue
		}
		for _, candidate := range d.servers {
			if candidate.Name == sc.Name || singleServer {
				sess.ServerID = candidate.ID
				d.sendServerAssignedLocked(sess.Player.Conn, candidate.Name)
				d.sendToServerIDLocked(candidate.ID, fmt.Sprintf(`{"type":"player_attached","session_id":"%s"}`, sess.ID))
				break
			}
		}
	}

	d.broadcastStateLocked()
}

// SwitchServer tells all players not already on the target server to switch.
// Sends SessionEnd-with-target so the player reconnects with the target as
// its new preference. Does not update any global state — the player drives
// server selection.
func (d *Daemon) SwitchServer(serverID string) bool {
	d.mu.Lock()
	defer d.mu.Unlock()

	sc, ok := d.servers[serverID]
	if !ok {
		return false
	}

	slog.Info("Switch all to server", "id", serverID, "name", sc.Name)

	for _, sess := range d.sessions {
		if sess.ServerID == serverID {
			continue // already on the target server
		}
		d.sendSessionEndWithTargetLocked(sess.Player.Conn, sc.Name)
	}

	d.broadcastStateLocked()
	return true
}

// SwitchSession tells a single player to switch to a different server by
// sending SessionEnd-with-target. The player reconnects with the target
// as its new preference.
func (d *Daemon) SwitchSession(sessionID, serverID string) bool {
	d.mu.Lock()
	defer d.mu.Unlock()

	sess, ok := d.sessions[sessionID]
	if !ok {
		return false
	}
	sc, ok := d.servers[serverID]
	if !ok {
		return false
	}
	if sess.ServerID == serverID {
		return true // already there
	}

	d.sendSessionEndWithTargetLocked(sess.Player.Conn, sc.Name)

	d.broadcastStateLocked()
	return true
}

// AddPlayer registers a new player, assigns a session ID, resolves the player's
// server preference, and notifies the matched server. Returns the session ID.
// SwitchSessionByName finds a server by name and switches the session to it.
func (d *Daemon) SwitchSessionByName(sessionID, serverName string) bool {
	d.mu.Lock()
	defer d.mu.Unlock()

	sess, ok := d.sessions[sessionID]
	if !ok {
		return false
	}
	for _, sc := range d.servers {
		if sc.Name == serverName {
			if sess.ServerID == sc.ID {
				return true
			}
			d.sendSessionEndWithTargetLocked(sess.Player.Conn, sc.Name)
			d.broadcastStateLocked()
			return true
		}
	}
	return false
}

func (d *Daemon) AddPlayer(pc *PlayerConn, name, preference string) string {
	d.mu.Lock()
	defer d.mu.Unlock()

	d.nextID++
	sessionID := "s" + strconv.Itoa(d.nextID)

	// Resolve preference → server ID. If no preference, only auto-assign
	// when there's exactly one server (unambiguous). With multiple servers,
	// the player stays unattached until it picks one.
	target := d.resolveServerPreferenceLocked(preference)
	if target == "" && len(d.servers) == 1 {
		for id := range d.servers {
			target = id
		}
	}

	serverName := ""
	if target != "" {
		serverName = d.servers[target].Name
	}

	sess := &PlayerSession{
		ID:         sessionID,
		Player:     pc,
		ServerID:   target,
		Name:       name,
		Preference: preference,
	}
	d.sessions[sessionID] = sess
	slog.Info("Player connected", "session", sessionID, "name", name, "preference", preference, "server", target)

	if target != "" {
		d.sendServerAssignedLocked(pc.Conn, serverName)
		d.sendToServerIDLocked(target, fmt.Sprintf(`{"type":"player_attached","session_id":"%s"}`, sessionID))
		d.tryBridgeSessionLocked(sess)
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

	// Clean up stream state for this session.
	delete(d.streamMuxers, sessionID)
	delete(d.streamClients, sessionID)

	slog.Info("Player disconnected", "session", sessionID)

	// Notify the session's server
	if sess.ServerID != "" {
		msg := fmt.Sprintf(`{"type":"player_detached","session_id":"%s"}`, sessionID)
		d.sendToServerIDLocked(sess.ServerID, msg)
	}

	d.broadcastStateLocked()
}

// SetSessionWire associates a wire WebSocket with a session.
// Does not trigger bridging — the caller is responsible for calling
// TryBridgeSession after the read loop is ready.
func (d *Daemon) SetSessionWire(sessionID string, wireConn *websocket.Conn) bool {
	d.mu.Lock()
	defer d.mu.Unlock()

	sess, ok := d.sessions[sessionID]
	if !ok {
		return false
	}

	sess.ServerWire = wireConn
	return true
}

// TryBridgeSession marks a session as bridged after the read loop is ready.
func (d *Daemon) TryBridgeSession(sessionID string) {
	d.mu.Lock()
	defer d.mu.Unlock()

	if sess, ok := d.sessions[sessionID]; ok {
		d.tryBridgeSessionLocked(sess)
	}
}

// UnsetSessionWire clears the wire connection for a session, but only if it
// still points to the given connection. This prevents a stale goroutine's
// deferred cleanup from clobbering a newer wire established by SwitchServer.
func (d *Daemon) UnsetSessionWire(sessionID string, conn *websocket.Conn) {
	d.mu.Lock()
	defer d.mu.Unlock()

	sess, ok := d.sessions[sessionID]
	if !ok {
		return
	}

	if sess.ServerWire != conn {
		return // wire was already replaced by a newer connection
	}

	sess.bridged = false
	sess.ServerWire = nil
}

// tryBridgeSessionLocked marks a session as bridged so that frames
// flow between the player and the server wire. Ged is a pure bridge —
// it does not interpret or store any application-level messages.
// Must be called with d.mu held.
func (d *Daemon) tryBridgeSessionLocked(sess *PlayerSession) {
	if sess.Player == nil || sess.ServerID == "" {
		return
	}
	sess.bridged = true
	slog.Info("Session bridged", "session", sess.ID)
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

// ForwardVideoToPlayers sends a video frame to all player sessions belonging to a server.
// Uses a short timeout to avoid blocking the sideband read loop — it's better to drop
// a video frame than to deadlock the pipeline.
func (d *Daemon) ForwardVideoToPlayers(serverID string, data []byte) {
	d.mu.Lock()
	var players []*PlayerConn
	for _, sess := range d.sessions {
		if sess.ServerID == serverID && sess.Player != nil {
			players = append(players, sess.Player)
		}
	}
	d.mu.Unlock()

	for _, pc := range players {
		ctx, cancel := contextWithTimeout(50 * time.Millisecond)
		_ = pc.Conn.Write(ctx, websocket.MessageBinary, data)
		cancel()
	}
}

// ForwardToServerWire sends a frame to the server's wire for a specific session.
// Returns false if no wire is available (session not bridged or no wire connection).
func (d *Daemon) ForwardToServerWire(sessionID string, mt websocket.MessageType, data []byte) bool {
	d.mu.Lock()
	sess, ok := d.sessions[sessionID]
	if !ok || !sess.bridged || sess.ServerWire == nil {
		d.mu.Unlock()
		return false
	}
	wire := sess.ServerWire // snapshot under lock
	d.mu.Unlock()

	sess.wireMu.Lock()
	defer sess.wireMu.Unlock()

	ctx, cancel := contextWithTimeout(5 * time.Second)
	defer cancel()
	_ = wire.Write(ctx, mt, data)
	return true
}

// ForwardToServerSideband sends a binary frame to the server's sideband connection
// for a given session. Used when there is no per-session wire (e.g. H.264 server).
// Short timeout to avoid blocking the player read loop.
func (d *Daemon) ForwardToServerSideband(sessionID string, mt websocket.MessageType, data []byte) {
	if mt != websocket.MessageBinary {
		return
	}
	d.mu.Lock()
	sess, ok := d.sessions[sessionID]
	if !ok || sess.ServerID == "" {
		d.mu.Unlock()
		return
	}
	sc, ok := d.servers[sess.ServerID]
	d.mu.Unlock()
	if !ok {
		return
	}

	sc.sendMu.Lock()
	defer sc.sendMu.Unlock()
	ctx, cancel := contextWithTimeout(50 * time.Millisecond)
	defer cancel()
	_ = sc.Conn.Write(ctx, websocket.MessageBinary, data)
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
		ID   string `json:"id"`
		Name string `json:"name"`
		PID  int    `json:"pid"`
	}

	servers := make([]serverInfo, 0, len(d.servers))
	for _, sc := range d.servers {
		servers = append(servers, serverInfo{
			ID:   sc.ID,
			Name: sc.Name,
			PID:  sc.PID,
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

// CacheState stores a sideband message's data field, keyed by message type.
// Ged doesn't interpret the content — it's opaque bytes.
func (d *Daemon) CacheState(msgType string, data json.RawMessage) {
	d.mu.Lock()
	defer d.mu.Unlock()
	d.stateCache[msgType] = data
}

// GetCachedState returns the last cached data for a message type.
func (d *Daemon) GetCachedState(msgType string) json.RawMessage {
	d.mu.Lock()
	defer d.mu.Unlock()
	if data, ok := d.stateCache[msgType]; ok {
		return data
	}
	return json.RawMessage("[]")
}

// ForwardToServer sends a raw sideband message to game servers.
// If serverID is non-empty, targets that specific server; otherwise broadcasts.
// Ged does not parse the message content.
func (d *Daemon) ForwardToServer(msg string, serverID string) bool {
	d.mu.Lock()
	defer d.mu.Unlock()
	if len(d.servers) == 0 {
		return false
	}
	if serverID != "" {
		if _, ok := d.servers[serverID]; !ok {
			return false
		}
		d.sendToServerIDLocked(serverID, msg)
	} else {
		for id := range d.servers {
			d.sendToServerIDLocked(id, msg)
		}
	}
	return true
}

// ServerInfo returns current server info for the dashboard API.
// Returns an array of all servers with session counts.
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
		})
	}

	return map[string]any{
		"connected": len(d.servers) > 0,
		"servers":   servers,
		"sessions":  len(d.sessions),
	}
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

// resolveServerPreferenceLocked finds a server whose Name matches the given
// preference string. Returns the server ID, or "" if no match.
// Must be called with d.mu held.
func (d *Daemon) resolveServerPreferenceLocked(pref string) string {
	if pref == "" {
		return ""
	}
	for _, sc := range d.servers {
		if sc.Name == pref {
			return sc.ID
		}
	}
	return ""
}


// sendServerAssignedLocked sends a kServerAssignedMagic message to a player
// with the assigned server name as payload.
// Must be called with d.mu held.
func (d *Daemon) sendServerAssignedLocked(conn *websocket.Conn, serverName string) {
	payload := []byte(serverName)
	buf := make([]byte, 8+len(payload))
	binary.LittleEndian.PutUint32(buf[0:4], 0x4745324E) // kServerAssignedMagic
	binary.LittleEndian.PutUint32(buf[4:8], uint32(len(payload)))
	copy(buf[8:], payload)
	ctx, cancel := contextWithTimeout(2 * time.Second)
	defer cancel()
	if err := conn.Write(ctx, websocket.MessageBinary, buf); err != nil {
		slog.Warn("Failed to send ServerAssigned to player", "err", err)
	}
}

// sendSessionEndWithTargetLocked sends a kSessionEndMagic message with the
// target server name as payload. The player uses this to update its preference
// and reconnect to the specified server.
// Must be called with d.mu held.
func (d *Daemon) sendSessionEndWithTargetLocked(conn *websocket.Conn, targetName string) {
	payload := []byte(targetName)
	buf := make([]byte, 8+len(payload))
	binary.LittleEndian.PutUint32(buf[0:4], 0x4745324D) // kSessionEndMagic
	binary.LittleEndian.PutUint32(buf[4:8], uint32(len(payload)))
	copy(buf[8:], payload)
	ctx, cancel := contextWithTimeout(2 * time.Second)
	defer cancel()
	if err := conn.Write(ctx, websocket.MessageBinary, buf); err != nil {
		slog.Warn("Failed to send SessionEnd to player", "err", err)
	}
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

// startPing spawns a goroutine that sends WebSocket pings every 15 seconds.
// Returns a cancel function that stops the goroutine.
func startPing(ctx context.Context, conn *websocket.Conn) context.CancelFunc {
	ctx, cancel := context.WithCancel(ctx)
	go func() {
		ticker := time.NewTicker(15 * time.Second)
		defer ticker.Stop()
		for {
			select {
			case <-ticker.C:
				if err := conn.Ping(ctx); err != nil {
					return
				}
			case <-ctx.Done():
				return
			}
		}
	}()
	return cancel
}

// HandleVideoFrame processes an H.264 NAL frame from a player.
// Frame format: [1-byte flags][optional SPS/PPS][NAL data]
// Flags bit 0: keyframe, bit 1: has parameter sets.
func (d *Daemon) HandleVideoFrame(sessionID string, payload []byte) {
	if len(payload) < 1 {
		return
	}

	flags := payload[0]
	data := payload[1:]
	hasParams := flags&0x02 != 0
	isKeyframe := flags&0x01 != 0

	d.mu.Lock()
	muxer, ok := d.streamMuxers[sessionID]
	if !ok {
		muxer = NewStreamMuxer(10) // 10 fps capture rate
		d.streamMuxers[sessionID] = muxer
	}
	clients := d.streamClients[sessionID]
	d.mu.Unlock()

	if len(clients) == 0 {
		return // no viewers, skip processing
	}

	if hasParams {
		// Parse SPS/PPS from frame.
		// Layout: [2-byte spsLen][sps][2-byte ppsLen][pps][NAL data]
		if len(data) < 4 {
			return
		}
		spsLen := int(binary.LittleEndian.Uint16(data[0:2]))
		if len(data) < 2+spsLen+2 {
			return
		}
		sps := data[2 : 2+spsLen]
		ppsLen := int(binary.LittleEndian.Uint16(data[2+spsLen : 4+spsLen]))
		if len(data) < 4+spsLen+ppsLen {
			return
		}
		pps := data[4+spsLen : 4+spsLen+ppsLen]
		nalData := data[4+spsLen+ppsLen:]

		if err := muxer.SetParameterSets(sps, pps); err != nil {
			slog.Error("Stream: failed to set parameter sets", "err", err, "session", sessionID)
			return
		}

		// Send init segment to all connected stream clients.
		if initSeg := muxer.InitSegment(); initSeg != nil {
			d.sendToStreamClients(sessionID, initSeg)
		}

		// Also send the media segment for this first keyframe.
		if len(nalData) > 0 {
			if seg := muxer.MediaSegment(nalData, isKeyframe); seg != nil {
				d.sendToStreamClients(sessionID, seg)
			}
		}
	} else {
		if seg := muxer.MediaSegment(data, isKeyframe); seg != nil {
			d.sendToStreamClients(sessionID, seg)
		}
	}
}

// AddStreamClient adds a browser stream viewer for a session.
func (d *Daemon) AddStreamClient(sessionID string, c *wsClient) {
	d.mu.Lock()
	defer d.mu.Unlock()

	d.streamClients[sessionID] = append(d.streamClients[sessionID], c)

	// Send init segment if available.
	if muxer, ok := d.streamMuxers[sessionID]; ok {
		if initSeg := muxer.InitSegment(); initSeg != nil {
			c.mu.Lock()
			ctx, cancel := contextWithTimeout(5 * time.Second)
			_ = c.conn.Write(ctx, websocket.MessageBinary, initSeg)
			cancel()
			c.mu.Unlock()
		}
	}

	// If this is the first client, tell the player to start streaming.
	if len(d.streamClients[sessionID]) == 1 {
		d.sendStreamControlLocked(sessionID, 0x47453257) // kStreamStartMagic
	}

	slog.Info("Stream client connected", "session", sessionID, "clients", len(d.streamClients[sessionID]))
}

// RemoveStreamClient removes a browser stream viewer.
func (d *Daemon) RemoveStreamClient(sessionID string, c *wsClient) {
	d.mu.Lock()
	defer d.mu.Unlock()

	clients := d.streamClients[sessionID]
	for i, cl := range clients {
		if cl == c {
			d.streamClients[sessionID] = append(clients[:i], clients[i+1:]...)
			break
		}
	}

	remaining := len(d.streamClients[sessionID])
	if remaining == 0 {
		delete(d.streamClients, sessionID)
		d.sendStreamControlLocked(sessionID, 0x47453258) // kStreamStopMagic
		delete(d.streamMuxers, sessionID)
	}

	slog.Info("Stream client disconnected", "session", sessionID, "remaining", remaining)
}

// sendToStreamClients sends binary data to all stream viewers of a session.
func (d *Daemon) sendToStreamClients(sessionID string, data []byte) {
	d.mu.Lock()
	clients := d.streamClients[sessionID]
	alive := clients[:0]
	for _, c := range clients {
		c.mu.Lock()
		ctx, cancel := contextWithTimeout(time.Second)
		err := c.conn.Write(ctx, websocket.MessageBinary, data)
		cancel()
		c.mu.Unlock()
		if err == nil {
			alive = append(alive, c)
		}
	}
	d.streamClients[sessionID] = alive
	d.mu.Unlock()
}

// sendStreamControlLocked sends a stream control message to the player.
// Must be called with d.mu held.
func (d *Daemon) sendStreamControlLocked(sessionID string, magic uint32) {
	sess, ok := d.sessions[sessionID]
	if !ok || sess.Player == nil {
		return
	}

	var buf [8]byte
	binary.LittleEndian.PutUint32(buf[0:4], magic)
	binary.LittleEndian.PutUint32(buf[4:8], 0) // length = 0

	ctx, cancel := contextWithTimeout(2 * time.Second)
	defer cancel()
	if err := sess.Player.Conn.Write(ctx, websocket.MessageBinary, buf[:]); err != nil {
		slog.Warn("Failed to send stream control to player", "magic", fmt.Sprintf("0x%08X", magic), "err", err)
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
