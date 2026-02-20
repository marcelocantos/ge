package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"

	"github.com/coder/websocket"
	"github.com/skip2/go-qrcode"
)

// registerDashboard sets up all dashboard HTTP and WebSocket routes on the mux.
func (d *Daemon) registerDashboard(mux *http.ServeMux) {
	// QR code PNG
	mux.HandleFunc("GET /api/qr", func(w http.ResponseWriter, r *http.Request) {
		png, err := qrcode.Encode(d.qrURL, qrcode.Medium, 256)
		if err != nil {
			http.Error(w, "QR generation failed", 500)
			return
		}
		w.Header().Set("Content-Type", "image/png")
		w.Write(png)
	})

	// Connection URL
	mux.HandleFunc("GET /api/url", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"url":%q}`, d.qrURL)
	})

	// Server info
	mux.HandleFunc("GET /api/info", func(w http.ResponseWriter, r *http.Request) {
		info := d.ServerInfo()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(info)
	})

	// Tweaks
	mux.HandleFunc("GET /api/tweaks", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write(d.GetTweakState())
	})

	mux.HandleFunc("POST /api/tweaks", func(w http.ResponseWriter, r *http.Request) {
		body, _ := io.ReadAll(r.Body)
		msg := fmt.Sprintf(`{"type":"tweak_set","data":%s}`, string(body))
		if d.SendTweakToServer(msg) {
			w.Header().Set("Content-Type", "application/json")
			fmt.Fprint(w, `{"ok":true}`)
		} else {
			http.Error(w, `{"error":"no server connected"}`, 503)
		}
	})

	mux.HandleFunc("POST /api/tweaks/reset", func(w http.ResponseWriter, r *http.Request) {
		body, _ := io.ReadAll(r.Body)
		msg := fmt.Sprintf(`{"type":"tweak_reset","data":%s}`, string(body))
		if d.SendTweakToServer(msg) {
			w.Header().Set("Content-Type", "application/json")
			w.Write(d.GetTweakState())
		} else {
			http.Error(w, `{"error":"no server connected"}`, 503)
		}
	})

	// Stop server
	mux.HandleFunc("POST /api/stop", func(w http.ResponseWriter, r *http.Request) {
		d.mu.Lock()
		server := d.server
		d.mu.Unlock()

		if server != nil && server.PID > 0 {
			slog.Info("Stop requested from dashboard", "pid", server.PID)
			syscall.Kill(server.PID, syscall.SIGINT)
			w.Header().Set("Content-Type", "application/json")
			fmt.Fprint(w, `{"ok":true}`)
		} else {
			http.Error(w, `{"error":"no server connected"}`, 503)
		}
	})

	// WebSocket: log stream
	mux.HandleFunc("/ws/logs", func(w http.ResponseWriter, r *http.Request) {
		conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
			InsecureSkipVerify: true,
		})
		if err != nil {
			slog.Error("Log WebSocket accept failed", "err", err)
			return
		}
		defer conn.CloseNow()

		client := &wsClient{conn: conn}
		d.AddLogClient(client)
		defer d.RemoveLogClient(client)

		// Block until client disconnects (read loop absorbs pings/close)
		for {
			_, _, err := conn.Read(r.Context())
			if err != nil {
				return
			}
		}
	})

	// WebSocket: preview stream
	mux.HandleFunc("/ws/preview", func(w http.ResponseWriter, r *http.Request) {
		conn, err := websocket.Accept(w, r, &websocket.AcceptOptions{
			InsecureSkipVerify: true,
		})
		if err != nil {
			slog.Error("Preview WebSocket accept failed", "err", err)
			return
		}
		defer conn.CloseNow()

		client := &wsClient{conn: conn}
		d.AddPreviewClient(client)
		defer d.RemovePreviewClient(client)

		for {
			_, _, err := conn.Read(r.Context())
			if err != nil {
				return
			}
		}
	})

	// WebSocket: wire (player connection)
	mux.HandleFunc("/ws/wire", d.handlePlayer)

	// WebSocket: server sideband + wire
	mux.HandleFunc("/ws/server", d.handleServer)
	mux.HandleFunc("/ws/server/wire", d.handleServerWire)

	// Static files: serve ge/web/dist
	d.registerStaticFiles(mux)
}

// registerStaticFiles serves the dashboard SPA from ge/web/dist.
func (d *Daemon) registerStaticFiles(mux *http.ServeMux) {
	// Try to find the web dist directory relative to the binary or cwd
	candidates := []string{
		"ge/web/dist",
		filepath.Join(filepath.Dir(os.Args[0]), "..", "sq", "web", "dist"),
	}

	var distDir string
	for _, c := range candidates {
		if info, err := os.Stat(c); err == nil && info.IsDir() {
			distDir = c
			break
		}
	}

	var fileServer http.Handler
	var checkFileExists func(path string) bool

	if distDir != "" {
		slog.Info("Serving dashboard UI", "dir", distDir)
		fileServer = http.FileServer(http.Dir(distDir))
		checkFileExists = func(path string) bool {
			_, err := os.Stat(filepath.Join(distDir, filepath.Clean(path)))
			return err == nil
		}
	} else {
		// Fall back to embedded UI
		sub, err := fs.Sub(embeddedUI, "web/dist")
		if err != nil {
			slog.Warn("Dashboard UI not found (no disk or embedded files)")
			return
		}
		// Verify embedded FS has content
		if _, err := fs.Stat(sub, "index.html"); err != nil {
			slog.Warn("Dashboard UI not found (embedded FS empty)")
			return
		}
		slog.Info("Serving dashboard UI", "dir", "(embedded)")
		fileServer = http.FileServer(http.FS(sub))
		checkFileExists = func(path string) bool {
			_, err := fs.Stat(sub, strings.TrimPrefix(path, "/"))
			return err == nil
		}
	}

	// Use Handle (not HandleFunc with method prefix) to avoid conflicts
	// with method-less WebSocket patterns in Go 1.22+ ServeMux.
	mux.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet && r.Method != http.MethodHead {
			http.Error(w, "Method not allowed", 405)
			return
		}

		path := r.URL.Path
		if path == "/" {
			fileServer.ServeHTTP(w, r)
			return
		}

		if checkFileExists(path) {
			switch {
			case strings.HasSuffix(path, ".js"):
				w.Header().Set("Content-Type", "application/javascript")
			case strings.HasSuffix(path, ".css"):
				w.Header().Set("Content-Type", "text/css")
			case strings.HasSuffix(path, ".svg"):
				w.Header().Set("Content-Type", "image/svg+xml")
			}
			fileServer.ServeHTTP(w, r)
		} else {
			// SPA fallback
			r.URL.Path = "/"
			fileServer.ServeHTTP(w, r)
		}
	}))
}

// listenAndServe starts the HTTP server.
func (d *Daemon) listenAndServe(mux *http.ServeMux) error {
	addr := ":" + strconv.Itoa(d.port)
	slog.Info("Listening", "addr", addr, "url", fmt.Sprintf("http://localhost:%d", d.port))
	return http.ListenAndServe(addr, mux)
}
