# ged — ge development daemon

ged is a daemon that brokers connections between ge game servers and players
(mobile or desktop). It serves a web dashboard for monitoring sessions and
provides QR codes for mobile device pairing.

## Installation

```bash
brew install squz/tap/ged
```

Or build from source:

```bash
cd ge/ged && go build -o ged .
```

## Usage

```bash
ged [flags]
```

### Flags

| Flag | Default | Description |
|------|---------|-------------|
| `-port` | `42069` | HTTP/WebSocket listen port |
| `-no-open` | `false` | Don't open the dashboard in a browser on first server connection |
| `-version` | | Print version and exit |
| `-help-agent` | | Print this guide and exit |

## Architecture

ged sits between game servers and players:

```
Game Server ──(sideband WS)──► ged ◄──(player WS)── Player
                                │
                           Dashboard UI
                          http://localhost:42069
```

- **Sideband WebSocket** (`/ws/server`): Game server connects here to register
  itself and stream logs, preview frames, and tweak state.
- **Per-session wire** (`/ws/server/wire/{sessionID}`): Each player session gets
  a dedicated WebSocket pair for Dawn wire GPU command forwarding.
- **Player WebSocket** (`/ws/wire`): Players connect here. ged assigns a session
  ID and bridges to the game server's wire connection.

## HTTP API

All endpoints are on the same port as the dashboard.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/qr` | QR code PNG (`squz-remote://<lan-ip>:<port>`) |
| `GET` | `/api/url` | Connection URL as JSON |
| `GET` | `/api/info` | Server status: `{"connected":bool,"name":string,"pid":int,"sessions":int}` |
| `GET` | `/api/tweaks` | Current tweak state JSON |
| `POST` | `/api/tweaks` | Send tweak update to game server |
| `POST` | `/api/tweaks/reset` | Reset tweaks to defaults |
| `POST` | `/api/stop` | Send SIGINT to the connected game server |

## WebSocket endpoints

| Path | Direction | Description |
|------|-----------|-------------|
| `/ws/logs` | server→client | Real-time log stream (text JSON frames). Replays session list + log history on connect. |
| `/ws/preview` | server→client | Live preview frames from the game server |
| `/ws/server` | bidirectional | Game server sideband (logs, previews, tweaks) |
| `/ws/server/wire/{id}` | bidirectional | Per-session Dawn wire commands |
| `/ws/wire` | bidirectional | Player connection (DeviceInfo + wire frames) |

## Log message format

Log messages on `/ws/logs` are JSON text frames:

```json
{"ts":"2026-01-15T10:30:00.000","level":"info","msg":"Player connected","session":"s1"}
```

Session lifecycle events:

```json
{"type":"session_add","session":"s1"}
{"type":"session_remove","session":"s1"}
```

## Typical development workflow

```bash
# Terminal 0: start ged
ged

# Terminal 1: start game server (auto-connects to ged at localhost:42069)
bin/yourworld

# Terminal 2: start desktop player
bin/player

# Open http://localhost:42069 for the dashboard
```

The game server address defaults to `localhost:42069`. Override with
`GE_DAEMON_ADDR=host:port`.

## Running as a service

When installed via Homebrew, ged can run as a background service:

```bash
brew services start squz/tap/ged
```

Logs are written to `/opt/homebrew/var/log/ged.log`.
