# ge/ Engine Module

**IMPORTANT: When creating any artefact — code, targets, documentation, plans, tests — always consider whether it belongs in `ge/` (general-purpose engine, usable by any app) or in the parent project (game-specific logic). If unsure, ask before creating it.** Anything concerning the player, ged, wire protocol, engine infrastructure, or engine design belongs in `ge/`, not the consuming project.

Reusable rendering and streaming engine built on bgfx + SDL3. Consumed as a git submodule; build integration via `Module.mk`.

homebrew_tap: disabled  <!-- ge is a library consumed via git submodule; no binary to ship through brew. -->
profile: game  <!-- interactive rendering + streaming; "tests pass" doesn't guarantee visual correctness. -->

Apps built on ge use a **server/player architecture**: the app (server) renders headless via bgfx, encodes H.264 frames (VideoToolbox on Apple), and streams them to the player over a ged-brokered WebSocket. The player decodes the H.264 stream (VideoToolbox/MediaCodec) and displays it via SDL. Input events flow back over the same WebSocket channel. The app itself has zero platform-specific rendering code — ge handles encoding, framing, and the network link.

## Integrating ge into a New App

### Minimal Example

A complete ge app needs three things: a `Makefile`, a `main.cpp`, and game logic.

**main.cpp** — the standard entry point pattern:

```cpp
#include <ge/SessionHost.h>

int main() {
    MyState state;  // Persistent game state (survives reconnects)

    ge::run([&](ge::Context ctx) -> ge::RunConfig {
        auto app = std::make_shared<MyApp>(ctx);

        return {
            .onUpdate   = [&, app](float dt) { app->update(dt, state); },
            .onRender   = [&, app](int w, int h) { app->render(state, w, h); },
            .onEvent    = [&, app](const SDL_Event& e) { app->event(e, state); },
            .onShutdown = [&, app]() { app->shutdown(); },
        };
    });
}
```

Key points:
- **`ge::run(Factory)`** connects to the ged daemon broker and spawns sessions for attaching players
- **State lives outside the factory** so it persists across player reconnects
- **App resources are created per session** (each reconnect gets a fresh `Context`)
- The factory callback receives a `ge::Context` (dimensions, device class, DB) and returns a `RunConfig`
- `RunConfig` uses designated initializers: `onUpdate`, `onRender`, `onEvent`, `onShutdown`
- `onRender(w, h)` is called each frame; bgfx frame submission happens inside
- `ge::run` blocks until SIGINT or all sessions end
- Ctrl+C terminates the process gracefully

**Makefile** — minimal integration:

```makefile
BUILD_DIR := build
CXX := clang++

-include ge/Module.mk
ge/Module.mk:
	git submodule update --init --recursive

CXXFLAGS := -std=c++20 -O2 $(ge/INCLUDES)
SDL_CFLAGS := $(shell pkg-config --cflags sdl3 2>/dev/null)
SDL_LIBS := $(shell pkg-config --libs sdl3 2>/dev/null)
FRAMEWORKS := -framework Metal -framework QuartzCore -framework Foundation \
              -framework VideoToolbox -framework CoreMedia -framework CoreVideo

SRC := src/main.cpp src/MyApp.cpp
OBJ := $(SRC:%.cpp=$(BUILD_DIR)/%.o)
APP := bin/myapp

COMPILE_DB_DEPS += $(SRC) Makefile

$(APP): $(OBJ) $(ge/LIB) $(ge/BGFX_LIBS)
	@mkdir -p $(@D)
	$(CXX) $(OBJ) $(ge/LIB) $(ge/BGFX_LIBS) $(ge/SDL_LIBS) $(FRAMEWORKS) -o $@

player: $(ge/PLAYER)

$(BUILD_DIR)/%.o: %.cpp
	@mkdir -p $(@D)
	$(CXX) $(CXXFLAGS) $(SDL_CFLAGS) -c $< -o $@
```

### Running Your App

```bash
make ged && bin/ged &       # Start the daemon broker
make && bin/myapp           # Terminal 1: game server (connects to ged)
make player && bin/player   # Terminal 2: desktop player (connects via ged)
```

The ged daemon manages player connections, QR codes, and session routing. Game servers and players both connect to ged.

### What ge Gives You

| Concern | ge handles it | You write |
|---------|--------------|-----------|
| Rendering backend | bgfx Metal (macOS) / Vulkan (Android) | bgfx draw calls in `onRender` |
| H.264 encoding | `VideoEncoder_apple.mm` (VideoToolbox) | Nothing |
| H.264 decoding | `VideoDecoder_apple.mm` (VideoToolbox) | Nothing |
| Frame loop | `ge::run` with delta timing + signal handling | `onUpdate(dt)` + `onRender(w, h)` callbacks |
| Input | Player captures SDL events, sends over WebSocket | `onEvent(e)` callback |
| Reconnection | `ge::run` spawns new session per player | Separate State from App |
| Session routing | ged daemon manages connections + QR codes | Nothing |
| Asset loading | `ge::loadManifest<T>()` for meshes + metadata | manifest.json + data files |
| Mobile builds | iOS/Android player projects in `ge/tools/` (TODO: bgfx port) | Nothing (shared player) |

## Module.mk Integration

There is no standalone build. The parent Makefile includes `ge/Module.mk`, which provides variables, pattern rules, and generic targets. The parent defines a few variables before the include, extends shared variables with `+=` after it, and writes its own link rules using the exported `ge/` variables.

### Prerequisites

The parent must define these **before** the include:

| Variable | Purpose | Example |
|----------|---------|---------|
| `BUILD_DIR` | Output directory for all build artifacts | `build` |
| `CXX` | C++ compiler | `/usr/bin/clang++` |

These are referenced **after** the include but must be defined before any rules run:

| Variable | Purpose | Example |
|----------|---------|---------|
| `CXXFLAGS` | C++ flags (must include `$(ge/INCLUDES)`) | `-std=c++20 -Wall $(ge/INCLUDES)` |
| `SDL_CFLAGS` | SDL3 header search path | `-I/opt/homebrew/include` |

### Including Module.mk

Use `-include` (with leading dash) so the first clone works before the submodule exists, paired with a rebuild rule that auto-clones:

```makefile
-include ge/Module.mk

ge/Module.mk:
	git submodule update --init --recursive
```

Make will see that `ge/Module.mk` is missing, run the rebuild rule to clone, then restart and re-read the now-present file.

### Exported Variables

Engine-internal variables use the `ge/` prefix. These are read-only — the parent references them but does not modify them.

| Variable | Contents |
|----------|----------|
| `ge/INCLUDES` | `-I` flags for engine + vendor headers (bgfx, bx, bimg, SDL3, spdlog, asio, etc.) |
| `ge/SRC`, `ge/OBJ` | Engine source files and derived objects |
| `ge/LIB` | Static library path (`$(BUILD_DIR)/libge.a`) |
| `ge/BGFX_LIBS` | bgfx static libraries (`libbgfx.a`, `libbimg.a`, `libbx.a`) |
| `ge/SDL_LIBS` | SDL3 static libraries (SDL3, SDL3_image, SDL3_ttf, freetype, harfbuzz, etc.) |
| `ge/TEST_SRC`, `ge/TEST_OBJ` | Unit test sources and objects |
| `ge/TRIANGLE_OBJ` | Triangle library object (for tools that need triangulation) |
| `ge/PLAYER` | ge player binary path (`bin/player`) |

### Shared Variables

Module.mk provides sensible defaults for project-wide variables. The parent extends these with `+=`:

| Variable | Default | Parent extends with |
|----------|---------|---------------------|
| `CLEAN` | `bin build` | Additional directories for `make clean` |
| `COMPILE_DB_DEPS` | `$(ge/SRC) $(ge/TEST_SRC) ge/Module.mk` | App sources and Makefile |

Example:

```makefile
# After the -include ge/Module.mk line:
COMPILE_DB_DEPS += $(SRC) Makefile
```

### Generic Targets

Module.mk defines these targets so the parent doesn't need to:

| Target | Action |
|--------|--------|
| `clean` | `rm -rf $(CLEAN)` |
| `compile_commands.json` | Generate clangd compile database from `$(COMPILE_DB_DEPS)` |
| `ged` | Build the ged daemon (`bin/ged`), compiling the dashboard first |
| `ge/ios` | Generate the iOS Xcode project (TODO: needs bgfx port) |
| `ge/android` | Build the Android debug APK (TODO: needs bgfx port) |

### Developer Setup

`ge/init` installs common prerequisites (Homebrew packages, Git LFS, VS Code settings, compiledb). The parent's `init` target should depend on it and expand the `ge/INIT_DONE` canned recipe at the end:

```makefile
.PHONY: init
init: ge/init
	@echo "── Project setup ──"
	# ... project-specific steps ...
	$(ge/INIT_DONE)
```

### Linking

Link the app against `$(ge/LIB)`, the bgfx libraries, and SDL:

```makefile
$(APP): $(APP_OBJ) $(ge/LIB) $(ge/BGFX_LIBS)
	$(CXX) $(APP_OBJ) $(ge/LIB) $(ge/BGFX_LIBS) $(ge/SDL_LIBS) $(FRAMEWORKS) -o $@
```

The `FRAMEWORKS` variable should include VideoToolbox, CoreMedia, CoreVideo, Metal, QuartzCore, and Foundation on macOS/iOS.

Link the player:

```makefile
player: $(ge/PLAYER)
```

## Module Structure

| Directory | Contents |
|-----------|----------|
| `include/` | Public headers (one per class) |
| `src/` | Implementation files + test files (`*_test.cpp`) |
| `tools/` | Player entry point (`player.cpp`), capture backend (`player_capture_apple.mm`) |
| `tools/ios/` | iOS player: Xcode project, build scripts (TODO: bgfx port) |
| `tools/android/` | Android player: Gradle project (TODO: bgfx port) |
| `vendor/github.com/bkaradzic/{bgfx,bx,bimg}/` | bgfx rendering libraries (vendored, compiled from source) |
| `vendor/` | Other third-party dependencies: spdlog, linalg.h, earcut.hpp, doctest, Triangle, asio, SQLite3 |

**Note:** SQLite3 is compiled into `libge.a` (from the vendored amalgamation `vendor/src/sqlite3.c`). Do not add `-lsqlite3` to link lines — it's already included.

### ge/SRC (files compiled into libge.a)

| File | Purpose |
|------|---------|
| `ge/src/Resource.cpp` | Asset path resolution |
| `ge/src/FileIO.cpp` | Platform-agnostic file I/O |
| `ge/src/WebSocketClient.cpp` | WebSocket client (ged connection) |
| `ge/src/BgfxContext.mm` | bgfx device setup and frame management |
| `ge/src/Signal.cpp` | SIGINT / graceful shutdown |
| `ge/src/SessionHost.mm` | `ge::run()` — sideband connect, session lifecycle |
| `ge/src/VideoEncoder_apple.mm` | H.264 encoding via VideoToolbox |
| `ge/src/VideoDecoder_apple.mm` | H.264 decoding via VideoToolbox |
| `ge/tools/player_capture_apple.mm` | Player screen capture backend (Apple) |

## H.264 Streaming Protocol

The server and player communicate over WebSocket (brokered by ged) using binary-framed messages.

### Connection Flow

```
Player → ged:    DeviceInfo   (dimensions, pixel ratio, device class, safe area)
ged → player:    StreamStart  (ged signals player to begin receiving H.264 frames)
Server → ged:    VideoStream  (encoded H.264 NAL units, each frame as one message)
ged → player:    VideoStream  (ged forwards frames to the player)
Player → server: SdlEvent     (input events forwarded back to the server)
Player → server: SafeAreaUpdate (on orientation change)
ged → player:    StreamStop / SessionEnd (on server disconnect)
```

### Steady-State Messages

```
Server → ged → player:  MessageHeader{kVideoStreamMagic} + H.264 NAL data
Player → server:        MessageHeader{kSdlEventMagic} + SDL_Event structs (input)
Player → server:        MessageHeader{kSafeAreaMagic} + SafeAreaUpdate (on resize)
Server → player:        MessageHeader{kAspectLockMagic} + AspectLock (optional)
```

### Key Constants (`Protocol.h`)

| Constant | Value | Purpose |
|----------|-------|---------|
| `kProtocolVersion` | 6 | Protocol version for compatibility checking |
| `kMaxMessageSize` | 512 MB | Maximum single message size |
| `kDeviceInfoMagic` | `0x47453244` | "GE2D" — player → ged: player dimensions/class |
| `kSdlEventMagic` | `0x47453249` | "GE2I" — player → server: SDL input event |
| `kSessionEndMagic` | `0x4745324D` | "GE2M" — ged → player: server disconnected |
| `kServerAssignedMagic` | `0x4745324E` | "GE2N" — ged → player: assigned server name |
| `kSqlpipeMsgMagic` | `0x47453254` | "GE2T" — bidirectional sqlpipe messages |
| `kVideoStreamMagic` | `0x47453256` | "GE2V" — server → ged: H.264 NAL units |
| `kStreamStartMagic` | `0x47453257` | "GE2W" — ged → player: start streaming |
| `kStreamStopMagic` | `0x47453258` | "GE2X" — ged → player: stop streaming |
| `kSafeAreaMagic` | `0x47453245` | "GE2E" — player → server: safe area update |
| `kAspectLockMagic` | `0x47453260` | "GE2`" — server → player: lock aspect ratio |

### Address Resolution

Game servers connect to the ged daemon broker. `ge::run` resolves the daemon address in order:
1. `GE_DAEMON_ADDR` environment variable (format: `"host:port"`)
2. Default: `localhost:42069`

Players connect via ged, which handles QR codes, WebSocket routing, and session management.

## Player

The ge player is a standalone H.264 video player. It receives encoded frames from the server (via ged), decodes them via VideoToolbox (macOS/iOS) or MediaCodec (Android), and renders to an SDL window. Input is forwarded back to the server over the same WebSocket channel.

The player has no app-specific code — it works with any ge app.

### Reconnection

The player retries on disconnect with exponential backoff: 10ms initial, doubling to 2000ms cap, reset on success. This means you can restart the server and the player will reconnect automatically.

### Ged Quiet Mode

Use `-no-open` to prevent ged from opening the dashboard in the browser on first server connection:

```bash
bin/ged -no-open
```

### Dashboard Development

The ged dashboard is a React/Vite app in `ge/web/`. For hot-reload iteration:

```bash
cd ge/web && npm run dev   # Hot-reload dashboard on :5173, proxies API/WS/MCP to ged
```

The Vite dev server proxies `/api`, `/ws`, and `/mcp` to ged at `localhost:42069`.

### Mobile Builds

**iOS and Android player builds are currently broken** — they still reference Dawn/WebGPU and need to be ported to bgfx + H.264 decode. The CMakeLists files and build scripts have been scrubbed of Dawn references and marked TODO.

## ged Features

### MCP Server

ged exposes an MCP server at `/mcp` (streamable HTTP) with tools: `info`, `tweak_list`, `tweak_get`, `tweak_set`, `tweak_reset`, `logs`. Configure in `.mcp.json`:

```json
{"mcpServers":{"ged":{"type":"http","url":"http://localhost:42069/mcp"}}}
```

### Server Supersede

When a new game server connects with the same name as an existing one, ged sends SIGINT to the old server process. This enables seamless restarts — just `make && bin/myapp` without manually killing the old process.

### launchd

ged can run as a launchd agent for auto-start on login and restart-on-crash.

## Public API

### Session Host

- **`ge::run(Factory, SessionHostConfig)`** (`SessionHost.h`) — Blocks until SIGINT or all sessions end. Connects to ged via sideband WebSocket, sets up bgfx rendering (headless H.264 encode by default, or native window when `headless=false`), and calls the factory for each attaching player. The factory receives a `ge::Context` and returns a `RunConfig`. `SessionHostConfig` controls default dimensions, headless mode, and app identity for the persistent database path.
- **`ge::Context`** — Platform context passed to the factory. Provides `width()`, `height()`, `deviceClass()`, and `db()` (the engine-managed sqlpipe database). Cheaply copyable (shared_ptr internals); safe to capture by value in lambdas.
- **`ge::RunConfig`** — Render loop callbacks: `onUpdate(dt)`, `onRender(w, h)`, `onEvent(SDL_Event)`, `onShutdown()`.
- **`ge::Factory`** — `std::function<RunConfig(Context)>`.

### Rendering

- **`BgfxContext`** (`BgfxContext.h`) — Manages the bgfx device lifecycle: initialization (Metal on macOS, Vulkan on Android), frame begin/end, and headless vs. windowed mode. Used internally by `SessionHost`; apps interact with bgfx directly via its API rather than through this class.

### Protocol

- **`Protocol`** (`Protocol.h`) — Wire protocol structs (`DeviceInfo`, `SafeAreaUpdate`, `AspectLock`, `MessageHeader`) and magic number constants. Header-only.

### Assets

- **`ManifestSchema`** (`ManifestSchema.h`) — JSON-serializable types: `MeshRef`, `ModelDef<Meta>`, `ManifestDoc<Meta>`. Templated on application-specific metadata.
- **`ModelFormat`** (`ModelFormat.h`) — `ge::MeshVertex` struct (x, y, z, u, v).
- **`Model`** (`Model.h`) — Associates mesh data with metadata.

### Animation

- **`GlobeController`** (`GlobeController.h`) — Encapsulates `DampedRotation` + drag state + input source arbitration (mouse vs finger). `event()` handles SDL touch/mouse events, `update(dt)` flushes drag accumulation and applies inertia. Supports two-finger pinch-rotate (log-scale zoom delta via `consumePinchDelta()`, rotation around camera view axis). `setSensitivity()` and `setDamping()` for runtime tuning. `pinching()` getter for pinch state. Velocity decays to zero during stationary drag — no residual momentum on release. Header-only.
- **`DampedRotation`** (`DampedRotation.h`) — Quaternion orientation + angular velocity with exponential decay. Supports screen-space drag, inertia, framerate-independent damping (`damping^(60*dt)`). `setDamping()` for runtime tuning. `isMoving()` checks if velocity is above threshold. `matrix()` returns the 4x4 rotation matrix for rendering.
- **`DampedValue`** (`DampedValue.h`) — 1D value + velocity with exponential decay.
- **`DeltaTimer`** (`DeltaTimer.h`) — Frame delta-time helper.

### Tweak System

- **`Tweak<T>`** (`Tweak.h`) — Generic runtime-tunable parameter with atomic `shared_ptr` for lock-free reads. Specialized types: `EnumTweak` (int with named labels for dropdown UI), `Vec2Tweak` (float2 with per-axis screen direction via `Dir` enum), `AxisTweak` (float with drag axis vector encoding direction+sensitivity), `Color` (float4 alias). Database: `loadOverrides()` opens SQLite DB and applies saved values, `save()` persists a tweak, `resetOne()`/`resetAll()` restore defaults. JSON API: `allToJson()` emits name, value, default, and type-specific metadata; `parseAndApply()` sets a value from JSON; `parseAndReset()` resets by name or all. Global generation counter (`generation()`) increments on every `set()` for change tracking. Header-only, in `tweak::` namespace.

### Platform

- **`Resource`** (`Resource.h`) — `ge::resource(path)` resolves asset paths. Returns the path unchanged on desktop; prepends the iOS app bundle `Resources/` directory on iOS. Header-only.
- **`SdlContext`** (`SdlContext.h`) — RAII SDL3 window creation. Used by the player; not typically used by the server. pImpl.
- **`Signal`** (`Signal.h`) — SIGINT handler registration for graceful shutdown.

### I/O

- **`FileIO`** (`FileIO.h`) — `ge::openFile(path)` returns a `std::unique_ptr<std::istream>`. Uses `SDL_IOFromFile` internally for platform-agnostic file access (Android APK assets, iOS bundles, normal filesystem).
- **`WebSocketClient`** (`WebSocketClient.h`) — Async WebSocket client used by `SessionHost` to connect to ged. pImpl.

### Video

- **`VideoEncoder`** (`VideoEncoder.h`) — H.264 encoder interface. Platform implementation: `VideoEncoder_apple.mm` (VideoToolbox). Used internally by `SessionHost` when running headless. pImpl.
- **`VideoDecoder`** (`VideoDecoder.h`) — H.264 decoder interface. Platform implementation: `VideoDecoder_apple.mm` (VideoToolbox). Used by the player. pImpl.

### Testing

- **`ImageDiff`** (`ImageDiff.h`) — `imgdiff::compareCPU()` for pixel-level RMS comparison.

## Tests

Unit tests use doctest. `ge/src/main_test.cpp` provides the test runner; other `*_test.cpp` files register test cases.

```bash
make unit-test    # Build and run ge unit tests
```

## Namespaces

- `ge::` — Engine types and functions (`run`, `Context`, `RunConfig`, `resource`, `MeshVertex`)
- `wire::` — Protocol constants and structs (`DeviceInfo`, `MessageHeader`, `kVideoStreamMagic`, etc.)
- `tweak::` — Tweak system (`Tweak<T>`, `EnumTweak`, `Vec2Tweak`, `Color`)
- `imgdiff::` — Image comparison utilities
- Top-level — `DampedRotation`, `DampedValue`, `DeltaTimer`, `SdlContext`

## Working with Claude Code

### Modifying the engine

Changes to `ge/` affect all apps that consume it. After modifying engine code, rebuild both the app and player to ensure compatibility:

```bash
make && make player
```

### Modifying the player

The player entry point is `ge/tools/player.cpp`. The Apple capture backend is `ge/tools/player_capture_apple.mm`. Mobile entry points in `ge/tools/ios/` and `ge/tools/android/` are currently broken (need bgfx port).

The player is app-agnostic — it decodes and displays whatever H.264 stream it receives. Avoid adding app-specific logic to the player.

### Modifying the streaming protocol

Protocol changes require updating both `SessionHost.mm` (server side) and `player.cpp` (player side) in lockstep. Bump `kProtocolVersion` in `Protocol.h` when making breaking changes.

### Adding a new public API class

1. Header in `include/ge/ClassName.h`
2. Implementation in `src/ClassName.cpp` (or `.mm` for ObjC++)
3. Use pImpl for classes that pull in bgfx/SDL/asio headers (see parent project's CLAUDE.md for pImpl guidelines)
4. Add to `ge/SRC` in `Module.mk` if it's a new source file
5. Update this CLAUDE.md's Public API section

### Mobile smoke testing

**Before asking the user whether something is rendering on a mobile device, exhaust all programmatic checks first.** The user cannot easily tell you what's on screen during an automated workflow — treat "ask user to look at device" as a last resort, not a first step.

After building and deploying to a device/simulator, run the smoke test script:

```bash
# iOS Simulator — specify phone or tablet form factor
ge/tools/smoke-test.sh --platform ios-sim --device tablet
ge/tools/smoke-test.sh --platform ios-sim --device phone

# iOS Device — specific device by name or UDID
ge/tools/smoke-test.sh --platform ios-device --device Pippa

# Android emulator
ge/tools/smoke-test.sh --platform android-emu --package com.squz.player

# Android device — specific device by serial
ge/tools/smoke-test.sh --platform android-device --device R5CT900XYZ

# Desktop player
ge/tools/smoke-test.sh --platform desktop
```

The `--device` flag meaning varies by platform:
- **ios-sim**: `phone` or `tablet` — picks the latest booted simulator of that form factor. Omit to use any sole booted sim (errors if multiple are booted).
- **ios-device**: device name or UDID (substring match, case-insensitive). Omit for the sole connected device. Lists all registered physical devices with `[connected]`/`[disconnected]` state when the target isn't found.
- **android**: serial or model substring. Omit for the sole connected device.

Use `--install <path>` to ensure the device runs the latest build. This performs an atomic terminate → install → launch cycle and verifies the new process starts:

```bash
# Deploy latest build to simulator before testing
ge/tools/smoke-test.sh --platform ios-sim --device tablet \
    --install ios/build/xcode/Debug-iphonesimulator/YourWorld.app

# Deploy APK to Android
ge/tools/smoke-test.sh --platform android-emu \
    --install ge/tools/android/app/build/outputs/apk/debug/app-debug.apk
```

Without `--install`, the script checks passively (is the app installed? is it running? is the running process newer than the binary?). **Always prefer `--install`** after a rebuild to avoid debugging stale binaries.

The script checks, in order:

1. **ged reachable** — port listening, `/api/info` responds, game server connected, active session count
2. **Game server running** — process alive (if `--server-pid` given)
3. **Device/simulator reachable** — `simctl`, `devicectl`, or `adb` confirms device present
4. **App deployed and running** — with `--install`: terminate → install → launch → verify PID. Without: check installation, process state, and binary freshness.
5. **Player connected** — polls ged `/api/info` for active sessions (up to `--timeout` seconds)
6. **Player logs** — checks logcat (Android) or crash reports (iOS) for recent errors

Each check prints PASS/FAIL/WARN. The script exits non-zero if any check fails. **Do not ask the user about visual output until this script passes.** If it fails, diagnose and fix the failure — don't escalate to the user.

Only after the smoke test passes and the problem is still unclear, ask the user what they see — but state what you already verified: "Smoke test passed (ged connected, player session active, no crash reports) — can you confirm whether the globe is rendering?"

**Device preference**: When the user tells you which device to test on (e.g. "use Pippa"), save it to auto-memory so you remember across sessions. Always pass the preferred device via `--device`. If the smoke test fails because that device isn't found, tell the user which device was expected and list the devices that *are* available (the script prints them), then ask how they'd like to proceed.
