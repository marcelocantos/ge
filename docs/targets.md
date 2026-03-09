# Convergence Targets

## 🎯 T1: Game servers can run inside the player via WebAssembly

**Desired state**: A ge game server (C++ app using the ge API) can be
compiled to WebAssembly and loaded directly into the player process.
In this mode, the server's Dawn wire commands are routed in-process
rather than over TCP, eliminating network latency and the need for a
separate server process in single-player scenarios.

**Context**: The current architecture requires three processes (ged,
game server, player) connected via TCP/WebSocket. This is ideal for
multi-player and remote rendering, but adds unnecessary complexity for
single-player use on a single device. If the game server can be
compiled to Wasm and embedded in the player, a single app binary can
run the full experience — particularly valuable for mobile deployment
where running a background TCP server is impractical or forbidden.

**Key considerations**:
- ge already has `SessionDirect.cpp` for in-process rendering (no wire).
  Wasm deployment is a middle ground: the server runs in-process but
  still uses the wire protocol (since the server targets the Dawn wire
  client, not native Dawn).
- The in-process wire transport (`WireTransport.cpp`) already exists
  for testing — could serve as the Wasm transport layer.
- Emscripten (`emcc`) is available for C++ → Wasm compilation.
- Platform-specific code in game servers (file I/O, threading) would
  need Wasm-compatible alternatives or abstractions.
- Asset loading strategy: bundle in Wasm module vs fetch from network.
- Threading model: Wasm threads (SharedArrayBuffer) vs single-threaded
  event loop.

**Status**: Not started. Idea stage — feasibility not yet assessed.

## 🎯 T2: Smoke test validates network connectivity between laptop and device

**Desired state**: `smoke-test.sh` detects when the device cannot reach ged over the network, before any player launch or code debugging begins. Reports the specific failure (no WiFi IP, firewall blocking, device unreachable, or device→laptop path broken) with actionable remediation.

**Context**: Lost 2+ hours debugging code when the actual problem was laptop WiFi silently stopped accepting incoming connections. All local checks passed (ged listening, device registered via USB). The device→laptop network path was broken but nothing detected it. Need two layers: local network sanity checks (WiFi IP, firewall, ping device) and a `ge-probe` iOS app for definitive device→laptop HTTP connectivity testing.

**Weight**: 0.5 (value 1 / cost 2)

**Origin**: discovered while using smoke-test.sh during yourworld 🎯T8 debugging

**Status**: identified

## 🎯 T3: Player sends mip cache manifest before rendering begins

**Desired state**: On connect, player sends all cached mip hash values to the server (via ge) before the first wire command. Server skips texture upload commands for any mip already cached on the device. Rendering pipeline is only mutated for uncached textures. Reconnection with a fully-cached device produces no texture upload wire commands.

**Context**: Currently the server sends all texture data and the player reactively checks its local mip cache (hit/miss). This still mutates the rendering pipeline with large WriteTexture commands even when the player already has the data. For ~270MB of initial textures, this dominates reconnection time. A preemptive cache manifest exchange would let the server skip cached uploads entirely.

**Weight**: 2 (value 8 / cost 5)

**Status**: identified

## 🎯 T4: playerLoop takes a config struct with named fields

**Desired state**: `playerLoop()` accepts a single `PlayerLoopConfig` struct (or similar) instead of positional parameters. Call sites use designated initializers (`.checkOverride = ...`, `.discover = ...`, `.name = ...`). The `Player` constructor may also be refactored to a config struct if touched.

**Context**: `playerLoop` accumulated parameters across iterations (discover → checkOverride + discover + name). Positional args are opaque at call sites. Named fields via a config struct make the API self-documenting and easier to extend.

**Weight**: 2 (value 3 / cost 2)

**Status**: identified

## 🎯 T5: Player has a connection management screen

**Desired state**: Player has a gesture-accessible screen to scan a new QR code, manually enter a server address, or forget the saved address. Accessible from the connected state (not just on startup).

**Context**: The persistence mechanism works (player remembers server address), but there's no UI for the user to manage saved connections.

**Weight**: 1 (value 3 / cost 3)

**Status**: identified

## 🎯 T6: Player can switch between active servers without QR

**Desired state**: Dashboard has a "move player to server" control. Player switches seamlessly via `kServerAssignedMagic`. No disconnect/reconnect visible to user.

**Context**: With persistent address, player auto-connects to saved server. If two servers are on the same network, player has no reason to fall back to QR. Dashboard is the natural control plane.

**Weight**: 1 (value 2 / cost 2)

**Status**: identified

## 🎯 T7: Audio pauses when the app is backgrounded

**Desired state**: When a ge app enters background on mobile (iOS/Android), the engine automatically pauses all active audio. When it returns to foreground, audio resumes. This works in all session types (wire, direct) without game-specific code.

**Context**: User reported music keeps playing when the iOS app is backgrounded. Currently `ge::Audio` (server-side) sends play/stop/volume commands, and `AudioPlayer` (player-side, wire mode) or equivalent direct-mode playback handles them. Neither layer responds to app lifecycle events. The engine should intercept `SDL_EVENT_DID_ENTER_BACKGROUND` / `SDL_EVENT_DID_ENTER_FOREGROUND` and pause/resume audio automatically. In wire mode this means the player pauses its `AudioPlayer`; in direct mode the session or audio subsystem does it directly.

**Acceptance**: On iOS and Android, backgrounding the app silences all ge audio. Foregrounding resumes it. Works in both wire mode (player) and direct mode (standalone app). No game code changes required. Desktop platforms are unaffected.

**Weight**: 3 (value 5 / cost 2)

**Origin**: manual (user-reported from yourworld)

**Status**: identified
