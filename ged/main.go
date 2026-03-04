package main

import (
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
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

	d := NewDaemon(*port, *noOpen)

	// Print QR code
	printQR(d.qrURL)

	// Set up HTTP routes
	mux := http.NewServeMux()
	d.registerDashboard(mux)

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
