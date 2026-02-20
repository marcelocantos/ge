package main

import (
	"context"
	"encoding/binary"
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
	kSessionInitMagic = 0x59573253
	kSessionEndMagic  = 0x5957324D
	kFrameEndMagic    = 0x59573246
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
	d := NewDaemon(0)
	mux := http.NewServeMux()

	// Register only the WebSocket routes needed for testing
	mux.HandleFunc("/ws/wire", d.handlePlayer)
	mux.HandleFunc("/ws/server", d.handleServer)
	mux.HandleFunc("/ws/server/wire", d.handleServerWire)

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

type fakeServer struct {
	sideband *websocket.Conn
	wire     *websocket.Conn
}

// connectFakeServer connects a fake game server (sideband + wire) to the daemon.
func connectFakeServer(t *testing.T, ts *httptest.Server, name string) *fakeServer {
	t.Helper()
	ctx := context.Background()

	sideband := dial(t, wsURL(ts, "/ws/server"))
	hello := `{"type":"hello","name":"` + name + `","pid":99999}`
	if err := sideband.Write(ctx, websocket.MessageText, []byte(hello)); err != nil {
		t.Fatalf("Server hello write failed: %v", err)
	}

	// Give daemon time to register the server
	time.Sleep(50 * time.Millisecond)

	wire := dial(t, wsURL(ts, "/ws/server/wire"))

	// Give daemon time to establish bridge
	time.Sleep(50 * time.Millisecond)

	return &fakeServer{sideband: sideband, wire: wire}
}

func (s *fakeServer) close() {
	s.wire.CloseNow()
	s.sideband.CloseNow()
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

	// Server connects (sideband + wire)
	server := connectFakeServer(t, ts, "test-game")
	defer server.close()

	// Server should receive the player's DeviceInfo on its wire WS
	data := readBinary(t, server.wire, 2*time.Second)
	magic := readMagic(data)
	if magic != kDeviceInfoMagic {
		t.Fatalf("Expected DeviceInfoMagic 0x%08X, got 0x%08X", kDeviceInfoMagic, magic)
	}

	t.Logf("Server received DeviceInfo (%d bytes)", len(data))
}

func TestBridgeServerFirst(t *testing.T) {
	_, ts := startTestDaemon(t)

	// Server connects first (no player yet)
	server := connectFakeServer(t, ts, "test-game")
	defer server.close()

	// Player connects after server, sends DeviceInfo
	player := connectFakePlayer(t, ts)
	defer player.CloseNow()

	// Server should receive DeviceInfo (daemon bridges once both are present)
	data := readBinary(t, server.wire, 2*time.Second)
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

	server := connectFakeServer(t, ts, "test-game")

	// Verify bridge is up: server gets DeviceInfo
	data := readBinary(t, server.wire, 2*time.Second)
	if readMagic(data) != kDeviceInfoMagic {
		t.Fatal("Bridge not established")
	}

	// Server crashes (close both connections)
	server.close()

	// Player should receive SessionEnd
	data = readBinary(t, player, 2*time.Second)
	magic := readMagic(data)
	if magic != kSessionEndMagic {
		t.Fatalf("Expected SessionEndMagic 0x%08X, got 0x%08X", kSessionEndMagic, magic)
	}

	t.Log("Player received SessionEnd after server disconnect")
}

func TestServerRestart(t *testing.T) {
	_, ts := startTestDaemon(t)

	player := connectFakePlayer(t, ts)
	defer player.CloseNow()

	// First server
	server1 := connectFakeServer(t, ts, "game-v1")
	data := readBinary(t, server1.wire, 2*time.Second)
	if readMagic(data) != kDeviceInfoMagic {
		t.Fatal("First bridge not established")
	}

	// First server crashes
	server1.close()

	// Player receives SessionEnd
	data = readBinary(t, player, 2*time.Second)
	if readMagic(data) != kSessionEndMagic {
		t.Fatal("Expected SessionEnd after first server disconnect")
	}

	// Second server connects
	server2 := connectFakeServer(t, ts, "game-v2")
	defer server2.close()

	// Second server should receive the same stored DeviceInfo
	data = readBinary(t, server2.wire, 2*time.Second)
	magic := readMagic(data)
	if magic != kDeviceInfoMagic {
		t.Fatalf("Expected DeviceInfoMagic on restart, got 0x%08X", magic)
	}

	t.Log("Server restart: second server received DeviceInfo, player stayed connected")
}

func TestWireFrameForwarding(t *testing.T) {
	_, ts := startTestDaemon(t)

	player := connectFakePlayer(t, ts)
	defer player.CloseNow()

	server := connectFakeServer(t, ts, "test-game")
	defer server.close()

	// Wait for bridge
	data := readBinary(t, server.wire, 2*time.Second)
	if readMagic(data) != kDeviceInfoMagic {
		t.Fatal("Bridge not established")
	}

	ctx := context.Background()

	// Server sends a wire command to player (through daemon bridge)
	fakeCmd := makeMessage(kWireCommandMagic, []byte("hello-from-server"))
	if err := server.wire.Write(ctx, websocket.MessageBinary, fakeCmd); err != nil {
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
	data = readBinary(t, server.wire, 2*time.Second)
	magic = readMagic(data)
	if magic != kFrameReadyMagic {
		t.Fatalf("Expected FrameReadyMagic 0x%08X, got 0x%08X", kFrameReadyMagic, magic)
	}

	t.Log("Bidirectional wire frame forwarding works")
}

func TestPlayerDisconnectClosesServerWire(t *testing.T) {
	_, ts := startTestDaemon(t)

	player := connectFakePlayer(t, ts)
	server := connectFakeServer(t, ts, "test-game")
	defer server.close()

	// Wait for bridge
	data := readBinary(t, server.wire, 2*time.Second)
	if readMagic(data) != kDeviceInfoMagic {
		t.Fatal("Bridge not established")
	}

	// Player disconnects
	player.CloseNow()

	// Server wire should get closed by daemon (read returns error)
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	_, _, err := server.wire.Read(ctx)
	if err == nil {
		t.Fatal("Expected server wire to close after player disconnect, but read succeeded")
	}

	t.Logf("Server wire closed after player disconnect: %v", err)
}

func TestMultipleServerRestarts(t *testing.T) {
	_, ts := startTestDaemon(t)

	player := connectFakePlayer(t, ts)
	defer player.CloseNow()

	for i := 0; i < 3; i++ {
		server := connectFakeServer(t, ts, "game")

		// Server gets DeviceInfo
		data := readBinary(t, server.wire, 2*time.Second)
		if readMagic(data) != kDeviceInfoMagic {
			t.Fatalf("Iteration %d: bridge not established", i)
		}

		// Server crashes
		server.close()

		// Player gets SessionEnd
		data = readBinary(t, player, 2*time.Second)
		if readMagic(data) != kSessionEndMagic {
			t.Fatalf("Iteration %d: expected SessionEnd", i)
		}
	}

	t.Log("Player survived 3 server restarts on the same WebSocket")
}
