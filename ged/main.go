package main

import (
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

var version = "dev"

func main() {
	port := flag.Int("port", 42069, "listen port")
	noOpen := flag.Bool("no-open", false, "don't open dashboard in browser")
	showVersion := flag.Bool("version", false, "print version and exit")
	showAgentGuide := flag.Bool("help-agent", false, "print the agent guide and exit")
	flag.Parse()

	if *showVersion {
		fmt.Println("ged", version)
		os.Exit(0)
	}

	if *showAgentGuide {
		fmt.Print(agentGuide)
		os.Exit(0)
	}

	// Structured logging
	slog.SetDefault(slog.New(slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	})))

	// Ask any existing ged on this port to shut down.
	supersede(*port)

	d := NewDaemon(*port, *noOpen)

	// Print QR code
	printQR(d.qrURL)

	// Set up HTTP routes
	mux := http.NewServeMux()
	d.registerDashboard(mux)
	d.registerMCP(mux)

	// Handle signals
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		sig := <-sigCh
		slog.Info("Received signal, shutting down", "signal", sig)
		os.Exit(0)
	}()

	// Start serving
	if err := d.listenAndServe(mux); err != nil {
		slog.Error("Server failed", "err", err)
		os.Exit(1)
	}
}

// supersede asks any existing ged on the given port to shut down, then waits
// for the port to become available.
func supersede(port int) {
	url := fmt.Sprintf("http://localhost:%d/quitquitquit", port)
	client := &http.Client{Timeout: time.Second}
	resp, err := client.Post(url, "", nil)
	if err != nil {
		return // no ged running (or not responding) — proceed
	}
	resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return
	}
	slog.Info("Asked existing ged to shut down, waiting...")
	// Poll until the port is free (up to 3s).
	deadline := time.Now().Add(3 * time.Second)
	for time.Now().Before(deadline) {
		time.Sleep(100 * time.Millisecond)
		resp, err := client.Get(fmt.Sprintf("http://localhost:%d/api/info", port))
		if err != nil {
			return // port is free
		}
		resp.Body.Close()
	}
	slog.Warn("Timed out waiting for old ged to exit")
}
