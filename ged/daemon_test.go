package main

import (
	"context"
	"encoding/binary"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/coder/websocket"
)

// Wire protocol constants (matching Protocol.h)
const (
	kDeviceInfoMagic  = 0x59573244
	kSessionEndMagic  = 0x5957324D
	kFrameReadyMagic  = 0x59573247
	kWireCommandMagic = 0x59573243
	kProtocolVersion  = 2
)

// makeDeviceInfo constructs a wire DeviceInfo frame: MessageHeader + DeviceInfo struct.
func makeDeviceInfo(width, height, pixelRatio uint16, format uint32) []byte {
	// DeviceInfo: magic(4) + version(2) + width(2) + height(2) + pixelRatio(2) + reserved(2) + preferredFormat(4) = 18 bytes
	const deviceInfoSize = 18
	buf := make([]byte, 8+deviceInfoSize) // MessageHeader + DeviceInfo

	// MessageHeader
	binary.LittleEndian.PutUint32(buf[0:4], kDeviceInfoMagic)
	binary.LittleEndian.PutUint32(buf[4:8], deviceInfoSize)

	// DeviceInfo struct
	binary.LittleEndian.PutUint32(buf[8:12], kDeviceInfoMagic)  // magic
	binary.LittleEndian.PutUint16(buf[12:14], kProtocolVersion) // version
	binary.LittleEndian.PutUint16(buf[14:16], width)
	binary.LittleEndian.PutUint16(buf[16:18], height)
	binary.LittleEndian.PutUint16(buf[18:20], pixelRatio)
	binary.LittleEndian.PutUint16(buf[20:22], 0) // reserved
	binary.LittleEndian.PutUint32(buf[22:26], format)

	return buf
}

// makeMessage constructs a wire message frame: MessageHeader + payload.
func makeMessage(magic uint32, payload []byte) []byte {
	buf := make([]byte, 8+len(payload))
	binary.LittleEndian.PutUint32(buf[0:4], magic)
	binary.LittleEndian.PutUint32(buf[4:8], uint32(len(payload)))
	copy(buf[8:], payload)
	return buf
}

// readMagic extracts the magic number from a binary WebSocket frame.
func readMagic(data []byte) uint32 {
	if len(data) < 4 {
		return 0
	}
	return binary.LittleEndian.Uint32(data[0:4])
}

// startTestDaemon creates a Daemon with an httptest.Server.
func startTestDaemon(t *testing.T) (*Daemon, *httptest.Server) {
	d := NewDaemon(0, true)
	mux := http.NewServeMux()

	// Register WebSocket routes
	mux.HandleFunc("/ws/wire", d.handlePlayer)
	mux.HandleFunc("/ws/server", d.handleServer)
	mux.HandleFunc("/ws/server/wire/{sessionID}", d.handleServerSessionWire)

	ts := httptest.NewServer(mux)
	t.Cleanup(ts.Close)
	return d, ts
}

// wsURL converts an httptest.Server URL to a WebSocket URL.
func wsURL(ts *httptest.Server, path string) string {
	return "ws" + strings.TrimPrefix(ts.URL, "http") + path
}

// dial opens a WebSocket to the given URL.
func dial(t *testing.T, url string) *websocket.Conn {
	t.Helper()
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	conn, _, err := websocket.Dial(ctx, url, nil)
	if err != nil {
		t.Fatalf("WebSocket dial %s failed: %v", url, err)
	}
	conn.SetReadLimit(maxFrameSize)
	return conn
}

// readBinary reads one binary WebSocket frame with a timeout.
func readBinary(t *testing.T, conn *websocket.Conn, timeout time.Duration) []byte {
	t.Helper()
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()
	mt, data, err := conn.Read(ctx)
	if err != nil {
		t.Fatalf("Read failed: %v", err)
	}
	if mt != websocket.MessageBinary {
		t.Fatalf("Expected binary frame, got %v", mt)
	}
	return data
}

// readText reads one text WebSocket frame with a timeout.
func readText(t *testing.T, conn *websocket.Conn, timeout time.Duration) string {
	t.Helper()
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()
	mt, data, err := conn.Read(ctx)
	if err != nil {
		t.Fatalf("Read text failed: %v", err)
	}
	if mt != websocket.MessageText {
		t.Fatalf("Expected text frame, got %v", mt)
	}
	return string(data)
}

type fakeServer struct {
	sideband *websocket.Conn
}

// connectFakeServerSideband connects a fake game server's sideband to the daemon.
func connectFakeServerSideband(t *testing.T, ts *httptest.Server, name string) *fakeServer {
	t.Helper()
	ctx := context.Background()

	sideband := dial(t, wsURL(ts, "/ws/server"))
	hello := `{"type":"hello","name":"` + name + `","pid":99999}`
	if err := sideband.Write(ctx, websocket.MessageText, []byte(hello)); err != nil {
		t.Fatalf("Server hello write failed: %v", err)
	}

	// Give daemon time to register the server
	time.Sleep(50 * time.Millisecond)

	return &fakeServer{sideband: sideband}
}

// readPlayerAttached reads a player_attached sideband message and returns the session ID.
func readPlayerAttached(t *testing.T, server *fakeServer) string {
	t.Helper()
	text := readText(t, server.sideband, 2*time.Second)
	var msg struct {
		Type      string `json:"type"`
		SessionID string `json:"session_id"`
	}
	if err := json.Unmarshal([]byte(text), &msg); err != nil {
		t.Fatalf("Failed to parse player_attached: %v (text: %s)", err, text)
	}
	if msg.Type != "player_attached" {
		t.Fatalf("Expected player_attached, got %s", msg.Type)
	}
	return msg.SessionID
}

// connectSessionWire connects the server's per-session wire for the given session ID.
func connectSessionWire(t *testing.T, ts *httptest.Server, sessionID string) *websocket.Conn {
	t.Helper()
	wire := dial(t, wsURL(ts, "/ws/server/wire/"+sessionID))
	time.Sleep(50 * time.Millisecond)
	return wire
}

// connectFakePlayer connects a fake player to the daemon and sends DeviceInfo.
func connectFakePlayer(t *testing.T, ts *httptest.Server) *websocket.Conn {
	t.Helper()
	conn := dial(t, wsURL(ts, "/ws/wire"))
	deviceInfo := makeDeviceInfo(1080, 2400, 1, 22)
	ctx := context.Background()
	if err := conn.Write(ctx, websocket.MessageBinary, deviceInfo); err != nil {
		t.Fatalf("Player DeviceInfo write failed: %v", err)
	}
	time.Sleep(50 * time.Millisecond)
	return conn
}

// --- Tests ---

func TestBridgeEstablishment(t *testing.T) {
	_, ts := startTestDaemon(t)

	// Player connects first, sends DeviceInfo
	player := connectFakePlayer(t, ts)
	defer player.CloseNow()

	// Server connects sideband
	server := connectFakeServerSideband(t, ts, "test-game")
	defer server.sideband.CloseNow()

	// Server reads player_attached notification
	sessionID := readPlayerAttached(t, server)
	t.Logf("Got player_attached: session=%s", sessionID)

	// Server connects per-session wire
	wire := connectSessionWire(t, ts, sessionID)
	defer wire.CloseNow()

	// Server should receive the player's DeviceInfo on its wire WS
	data := readBinary(t, wire, 2*time.Second)
	magic := readMagic(data)
	if magic != kDeviceInfoMagic {
		t.Fatalf("Expected DeviceInfoMagic 0x%08X, got 0x%08X", kDeviceInfoMagic, magic)
	}

	t.Logf("Server received DeviceInfo (%d bytes)", len(data))
}

func TestBridgeServerFirst(t *testing.T) {
	_, ts := startTestDaemon(t)

	// Server connects first (no player yet)
	server := connectFakeServerSideband(t, ts, "test-game")
	defer server.sideband.CloseNow()

	// Player connects after server, sends DeviceInfo
	player := connectFakePlayer(t, ts)
	defer player.CloseNow()

	// Server reads player_attached
	sessionID := readPlayerAttached(t, server)

	// Server connects per-session wire
	wire := connectSessionWire(t, ts, sessionID)
	defer wire.CloseNow()

	// Server should receive DeviceInfo
	data := readBinary(t, wire, 2*time.Second)
	magic := readMagic(data)
	if magic != kDeviceInfoMagic {
		t.Fatalf("Expected DeviceInfoMagic 0x%08X, got 0x%08X", kDeviceInfoMagic, magic)
	}

	t.Logf("Server received DeviceInfo after player connected (%d bytes)", len(data))
}

func TestSessionEndOnServerDisconnect(t *testing.T) {
	_, ts := startTestDaemon(t)

	player := connectFakePlayer(t, ts)
	defer player.CloseNow()

	server := connectFakeServerSideband(t, ts, "test-game")
	sessionID := readPlayerAttached(t, server)
	wire := connectSessionWire(t, ts, sessionID)

	// Verify bridge is up: server gets DeviceInfo
	data := readBinary(t, wire, 2*time.Second)
	if readMagic(data) != kDeviceInfoMagic {
		t.Fatal("Bridge not established")
	}

	// Server crashes (close both connections)
	wire.CloseNow()
	server.sideband.CloseNow()

	// Player should receive SessionEnd
	data = readBinary(t, player, 2*time.Second)
	magic := readMagic(data)
	if magic != kSessionEndMagic {
		t.Fatalf("Expected SessionEndMagic 0x%08X, got 0x%08X", kSessionEndMagic, magic)
	}

	t.Log("Player received SessionEnd after server disconnect")
}

func TestWireFrameForwarding(t *testing.T) {
	_, ts := startTestDaemon(t)

	player := connectFakePlayer(t, ts)
	defer player.CloseNow()

	server := connectFakeServerSideband(t, ts, "test-game")
	defer server.sideband.CloseNow()
	sessionID := readPlayerAttached(t, server)
	wire := connectSessionWire(t, ts, sessionID)
	defer wire.CloseNow()

	// Wait for bridge
	data := readBinary(t, wire, 2*time.Second)
	if readMagic(data) != kDeviceInfoMagic {
		t.Fatal("Bridge not established")
	}

	ctx := context.Background()

	// Server sends a wire command to player (through daemon bridge)
	fakeCmd := makeMessage(kWireCommandMagic, []byte("hello-from-server"))
	if err := wire.Write(ctx, websocket.MessageBinary, fakeCmd); err != nil {
		t.Fatalf("Server wire write failed: %v", err)
	}

	// Player should receive it
	data = readBinary(t, player, 2*time.Second)
	magic := readMagic(data)
	if magic != kWireCommandMagic {
		t.Fatalf("Expected WireCommandMagic 0x%08X, got 0x%08X", kWireCommandMagic, magic)
	}

	// Player sends a response back (through daemon bridge)
	fakeResp := makeMessage(kFrameReadyMagic, nil)
	if err := player.Write(ctx, websocket.MessageBinary, fakeResp); err != nil {
		t.Fatalf("Player wire write failed: %v", err)
	}

	// Server should receive it
	data = readBinary(t, wire, 2*time.Second)
	magic = readMagic(data)
	if magic != kFrameReadyMagic {
		t.Fatalf("Expected FrameReadyMagic 0x%08X, got 0x%08X", kFrameReadyMagic, magic)
	}

	t.Log("Bidirectional wire frame forwarding works")
}

func TestPlayerDisconnectClosesServerWire(t *testing.T) {
	_, ts := startTestDaemon(t)

	player := connectFakePlayer(t, ts)
	server := connectFakeServerSideband(t, ts, "test-game")
	defer server.sideband.CloseNow()
	sessionID := readPlayerAttached(t, server)
	wire := connectSessionWire(t, ts, sessionID)
	defer wire.CloseNow()

	// Wait for bridge
	data := readBinary(t, wire, 2*time.Second)
	if readMagic(data) != kDeviceInfoMagic {
		t.Fatal("Bridge not established")
	}

	// Player disconnects
	player.CloseNow()

	// Server wire should get closed by daemon (read returns error)
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	_, _, err := wire.Read(ctx)
	if err == nil {
		t.Fatal("Expected server wire to close after player disconnect, but read succeeded")
	}

	t.Logf("Server wire closed after player disconnect: %v", err)
}

func TestMultiplePlayers(t *testing.T) {
	_, ts := startTestDaemon(t)

	// Connect server sideband
	server := connectFakeServerSideband(t, ts, "test-game")
	defer server.sideband.CloseNow()

	// Connect two players
	player1 := connectFakePlayer(t, ts)
	defer player1.CloseNow()
	session1 := readPlayerAttached(t, server)
	wire1 := connectSessionWire(t, ts, session1)
	defer wire1.CloseNow()

	player2 := connectFakePlayer(t, ts)
	defer player2.CloseNow()
	session2 := readPlayerAttached(t, server)
	wire2 := connectSessionWire(t, ts, session2)
	defer wire2.CloseNow()

	if session1 == session2 {
		t.Fatal("Expected different session IDs for different players")
	}

	// Both should receive DeviceInfo
	data1 := readBinary(t, wire1, 2*time.Second)
	if readMagic(data1) != kDeviceInfoMagic {
		t.Fatal("Bridge 1 not established")
	}
	data2 := readBinary(t, wire2, 2*time.Second)
	if readMagic(data2) != kDeviceInfoMagic {
		t.Fatal("Bridge 2 not established")
	}

	ctx := context.Background()

	// Send different commands on each wire
	cmd1 := makeMessage(kWireCommandMagic, []byte("cmd-for-player1"))
	if err := wire1.Write(ctx, websocket.MessageBinary, cmd1); err != nil {
		t.Fatal(err)
	}
	cmd2 := makeMessage(kWireCommandMagic, []byte("cmd-for-player2"))
	if err := wire2.Write(ctx, websocket.MessageBinary, cmd2); err != nil {
		t.Fatal(err)
	}

	// Each player should receive only their own command
	recv1 := readBinary(t, player1, 2*time.Second)
	recv2 := readBinary(t, player2, 2*time.Second)
	if readMagic(recv1) != kWireCommandMagic || readMagic(recv2) != kWireCommandMagic {
		t.Fatal("Expected wire commands on both players")
	}

	t.Logf("Two players with independent sessions: %s, %s", session1, session2)
}

func TestServerRestart(t *testing.T) {
	_, ts := startTestDaemon(t)

	player := connectFakePlayer(t, ts)
	defer player.CloseNow()

	// First server
	server1 := connectFakeServerSideband(t, ts, "game-v1")
	session1 := readPlayerAttached(t, server1)
	wire1 := connectSessionWire(t, ts, session1)
	data := readBinary(t, wire1, 2*time.Second)
	if readMagic(data) != kDeviceInfoMagic {
		t.Fatal("First bridge not established")
	}

	// First server crashes
	wire1.CloseNow()
	server1.sideband.CloseNow()

	// Player receives SessionEnd
	data = readBinary(t, player, 2*time.Second)
	if readMagic(data) != kSessionEndMagic {
		t.Fatal("Expected SessionEnd after first server disconnect")
	}

	// Give player time to be cleaned up
	time.Sleep(100 * time.Millisecond)

	// Player reconnects (new WebSocket)
	player.CloseNow()
	player = connectFakePlayer(t, ts)
	defer player.CloseNow()

	// Second server connects
	server2 := connectFakeServerSideband(t, ts, "game-v2")
	defer server2.sideband.CloseNow()

	session2 := readPlayerAttached(t, server2)
	wire2 := connectSessionWire(t, ts, session2)
	defer wire2.CloseNow()

	// Second server should receive DeviceInfo
	data = readBinary(t, wire2, 2*time.Second)
	magic := readMagic(data)
	if magic != kDeviceInfoMagic {
		t.Fatalf("Expected DeviceInfoMagic on restart, got 0x%08X", magic)
	}

	t.Log("Server restart: second server received DeviceInfo")
}
