package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"

	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)

// registerMCP adds MCP (Model Context Protocol) tools to the HTTP mux,
// allowing Claude Code and other MCP clients to interact with ged.
func (d *Daemon) registerMCP(mux *http.ServeMux) {
	s := server.NewMCPServer(
		"ged",
		"1.0.0",
		server.WithToolCapabilities(false),
	)

	// ── info ──────────────────────────────────────────────────────────
	s.AddTool(
		mcp.NewTool("info",
			mcp.WithDescription("Get ged server status: connected servers, active sessions, and player info."),
		),
		func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
			info := d.ServerInfo()
			b, _ := json.MarshalIndent(info, "", "  ")
			return mcp.NewToolResultText(string(b)), nil
		},
	)

	// ── tweak_list ────────────────────────────────────────────────────
	s.AddTool(
		mcp.NewTool("tweak_list",
			mcp.WithDescription("List all tweaks with current values, defaults, and metadata."),
		),
		func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
			state := d.GetCachedState("tweaks")
			var tweaks []any
			if json.Unmarshal(state, &tweaks) == nil {
				b, _ := json.MarshalIndent(tweaks, "", "  ")
				return mcp.NewToolResultText(string(b)), nil
			}
			return mcp.NewToolResultText(string(state)), nil
		},
	)

	// ── tweak_get ─────────────────────────────────────────────────────
	s.AddTool(
		mcp.NewTool("tweak_get",
			mcp.WithDescription("Get the current value of a specific tweak by name."),
			mcp.WithString("name", mcp.Required(), mcp.Description("Tweak name (e.g. 'parity.view', 'camera.fov_deg')")),
		),
		func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
			name, _ := req.GetArguments()["name"].(string)
			if name == "" {
				return mcp.NewToolResultError("name is required"), nil
			}
			state := d.GetCachedState("tweaks")
			var tweaks []map[string]any
			if err := json.Unmarshal(state, &tweaks); err != nil {
				return mcp.NewToolResultError("failed to parse tweak state"), nil
			}
			for _, tw := range tweaks {
				if tw["name"] == name {
					b, _ := json.MarshalIndent(tw, "", "  ")
					return mcp.NewToolResultText(string(b)), nil
				}
			}
			return mcp.NewToolResultError(fmt.Sprintf("tweak %q not found", name)), nil
		},
	)

	// ── tweak_set ─────────────────────────────────────────────────────
	s.AddTool(
		mcp.NewTool("tweak_set",
			mcp.WithDescription("Set a tweak value. Value can be a number, array, or other JSON-compatible type."),
			mcp.WithString("name", mcp.Required(), mcp.Description("Tweak name")),
			mcp.WithNumber("value", mcp.Description("Numeric value (use this for float/int/enum tweaks)")),
		),
		func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
			name, _ := req.GetArguments()["name"].(string)
			if name == "" {
				return mcp.NewToolResultError("name is required"), nil
			}
			value, ok := req.GetArguments()["value"]
			if !ok {
				return mcp.NewToolResultError("value is required"), nil
			}
			body, _ := json.Marshal(map[string]any{"name": name, "value": value})
			msg := fmt.Sprintf(`{"type":"tweak_set","data":%s}`, string(body))
			if d.ForwardToServer(msg, "") {
				return mcp.NewToolResultText(fmt.Sprintf("set %s = %v", name, value)), nil
			}
			return mcp.NewToolResultError("no server connected"), nil
		},
	)

	// ── tweak_reset ───────────────────────────────────────────────────
	s.AddTool(
		mcp.NewTool("tweak_reset",
			mcp.WithDescription("Reset a tweak to its default value, or reset all tweaks."),
			mcp.WithString("name", mcp.Description("Tweak name to reset. Omit to reset all.")),
		),
		func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
			name, _ := req.GetArguments()["name"].(string)
			var body string
			if name == "" {
				body = `{"all":true}`
			} else {
				b, _ := json.Marshal(map[string]string{"name": name})
				body = string(b)
			}
			msg := fmt.Sprintf(`{"type":"tweak_reset","data":%s}`, body)
			if d.ForwardToServer(msg, "") {
				if name == "" {
					return mcp.NewToolResultText("all tweaks reset to defaults"), nil
				}
				return mcp.NewToolResultText(fmt.Sprintf("reset %s to default", name)), nil
			}
			return mcp.NewToolResultError("no server connected"), nil
		},
	)

	// ── logs ──────────────────────────────────────────────────────────
	s.AddTool(
		mcp.NewTool("logs",
			mcp.WithDescription("Get recent log entries from the game server."),
			mcp.WithNumber("count", mcp.Description("Number of recent entries to return (default 20, max 200)")),
		),
		func(ctx context.Context, req mcp.CallToolRequest) (*mcp.CallToolResult, error) {
			count := 20
			if c, ok := req.GetArguments()["count"].(float64); ok && c > 0 {
				count = int(c)
				if count > 200 {
					count = 200
				}
			}
			d.mu.Lock()
			history := d.logHistory
			d.mu.Unlock()

			start := 0
			if len(history) > count {
				start = len(history) - count
			}
			entries := history[start:]

			if len(entries) == 0 {
				return mcp.NewToolResultText("(no log entries)"), nil
			}

			result := ""
			for _, entry := range entries {
				result += entry + "\n"
			}
			return mcp.NewToolResultText(result), nil
		},
	)

	httpServer := server.NewStreamableHTTPServer(s)
	mux.Handle("/mcp", httpServer)
	slog.Info("MCP server registered", "path", "/mcp")
}
