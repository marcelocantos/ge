# sq/ Engine Module

Reusable rendering and asset engine built on Dawn (WebGPU) + SDL3. Consumed as a git submodule; build integration via `Module.mk`.

Apps built on sq use a **server/receiver architecture**: the app (server) issues WebGPU draw commands through Dawn's wire protocol over TCP, and a platform-native receiver renders them and sends input back. This means the app itself has zero platform-specific code — sq and the receiver handle all of that.

## Integrating sq into a New App

### Minimal Example

A complete sq app needs three things: a `Makefile`, a `main.cpp`, and game logic.

**main.cpp** — the standard entry point pattern:

```cpp
#include <sq/WireSession.h>

int main() {
    MyState state;  // Persistent game state (survives reconnects)

    for (;;) {
        sq::WireSession session;            // Blocks until a receiver connects
        MyApp app(session.gpu());           // Create GPU resources

        auto reason = session.run(
            [&](float dt) { app.render(dt, state); },
            [&](const SDL_Event& e) {
                if (e.type == SDL_EVENT_WINDOW_PIXEL_SIZE_CHANGED)
                    app.resize({e.window.data1, e.window.data2});
                else
                    app.handleInput(e, state);
            }
        );

        if (reason == sq::WireSession::StopReason::Signal) break;
        // Disconnected → loop back, wait for next receiver
    }
}
```

Key points:
- **State lives outside the session loop** so it persists across receiver reconnects
- **App/GPU resources are recreated** each connection (new wire handles)
- `session.run()` drives the render loop at ~60fps with frame delta timing
- Returns `Signal` on Ctrl+C or `Disconnected` when the receiver drops

**Makefile** — minimal integration:

```makefile
BUILD_DIR := build
CXX := clang++

-include sq/Module.mk
sq/Module.mk:
	git submodule update --init --recursive

CXXFLAGS := -std=c++20 -O2 $(sq/INCLUDES)
SDL_CFLAGS := $(shell sdl3-config --cflags 2>/dev/null)
SDL_LIBS := $(shell sdl3-config --libs 2>/dev/null)
FRAMEWORKS := -framework Metal -framework QuartzCore -framework Foundation

SRC := src/main.cpp src/MyApp.cpp
OBJ := $(SRC:%.cpp=$(BUILD_DIR)/%.o)
APP := bin/myapp

COMPILE_DB_DEPS += $(SRC) Makefile

$(APP): $(OBJ) $(sq/LIB) $(sq/FRAMEWORK_LIBS)
	@mkdir -p $(@D)
	$(CXX) $(OBJ) $(sq/LIB) $(sq/DAWN_LIBS) $(FRAMEWORKS) $(SDL_LIBS) -o $@

receiver: $(sq/RECEIVER)

$(BUILD_DIR)/%.o: %.cpp
	@mkdir -p $(@D)
	$(CXX) $(CXXFLAGS) $(SDL_CFLAGS) -c $< -o $@
```

### Running Your App

```bash
make && bin/myapp          # Terminal 1: server (prints QR code)
make receiver && bin/receiver   # Terminal 2: desktop receiver
```

The server prints a QR code to stderr. Mobile receivers scan it; desktop receivers connect to localhost.

### What sq Gives You

| Concern | sq handles it | You write |
|---------|--------------|-----------|
| GPU device setup | WireSession acquires adapter/device/queue via wire | Nothing |
| Window/surface | Receiver creates native window + Metal/Vulkan surface | Nothing |
| Frame loop | `session.run()` with delta timing + signal handling | `onFrame(dt)` callback |
| Input | Receiver captures SDL events, sends over TCP | `onEvent(e)` callback |
| Reconnection | Outer loop in main.cpp | Separate State from App |
| QR code | Auto-generated from LAN IP | Nothing |
| Asset loading | `sq::loadManifest<T>()` for meshes + textures | manifest.json + data files |
| Shaders | WGSL loaded at runtime via `Pipeline` | .wgsl shader files |
| Mobile builds | iOS/Android receiver projects in `sq/tools/` | Nothing (shared receiver) |

## Module.mk Integration

There is no standalone build. The parent Makefile includes `sq/Module.mk`, which provides variables, pattern rules, and generic targets. The parent defines a few variables before the include, extends shared variables with `+=` after it, and writes its own link rules using the exported `sq/` variables.

### Prerequisites

The parent must define these **before** the include:

| Variable | Purpose | Example |
|----------|---------|---------|
| `BUILD_DIR` | Output directory for all build artifacts | `build` |
| `CXX` | C++ compiler | `/usr/bin/clang++` |

These are referenced **after** the include but must be defined before any rules run:

| Variable | Purpose | Example |
|----------|---------|---------|
| `CXXFLAGS` | C++ flags (must include `$(sq/INCLUDES)`) | `-std=c++20 -Wall $(sq/INCLUDES)` |
| `SDL_CFLAGS` | SDL3 header search path | `-I/opt/homebrew/include` |

### Including Module.mk

Use `-include` (with leading dash) so the first clone works before the submodule exists, paired with a rebuild rule that auto-clones:

```makefile
-include sq/Module.mk

sq/Module.mk:
	git submodule update --init --recursive
```

Make will see that `sq/Module.mk` is missing, run the rebuild rule to clone, then restart and re-read the now-present file.

### Exported Variables

Engine-internal variables use the `sq/` prefix. These are read-only — the parent references them but does not modify them.

| Variable | Contents |
|----------|----------|
| `sq/INCLUDES` | `-I` flags for engine + vendor headers (includes Dawn) |
| `sq/SRC`, `sq/OBJ` | Engine source files and derived objects |
| `sq/LIB` | Static library path (`$(BUILD_DIR)/libsq.a`) |
| `sq/DAWN_LIBS` | Dawn static libraries (dawn_proc, webgpu_dawn, dawn_wire) |
| `sq/FRAMEWORK_LIBS` | Alias for `$(sq/DAWN_LIBS)` |
| `sq/TEST_SRC`, `sq/TEST_OBJ` | Unit test sources and objects |
| `sq/TRIANGLE_OBJ` | Triangle library object (for tools that need triangulation) |
| `sq/RECEIVER_SRC`, `sq/RECEIVER_OBJ` | Wire receiver source and object |
| `sq/RECEIVER` | Wire receiver binary path (`bin/receiver`) |

### Shared Variables

Module.mk provides sensible defaults for project-wide variables. The parent extends these with `+=`:

| Variable | Default | Parent extends with |
|----------|---------|---------------------|
| `CLEAN` | `bin build` | Additional directories for `make clean` |
| `COMPILE_DB_DEPS` | `$(sq/SRC) $(sq/TEST_SRC) $(sq/RECEIVER_SRC) sq/Module.mk` | App sources and Makefile |

Example:

```makefile
# After the -include sq/Module.mk line:
COMPILE_DB_DEPS += $(SRC) Makefile
```

### Generic Targets

Module.mk defines these targets so the parent doesn't need to:

| Target | Action |
|--------|--------|
| `clean` | `rm -rf $(CLEAN)` |
| `compile_commands.json` | Generate clangd compile database from `$(COMPILE_DB_DEPS)` |

### Developer Setup

`sq/init` installs common prerequisites (Homebrew packages, Git LFS, VS Code settings, compiledb). The parent's `init` target should depend on it and expand the `sq/INIT_DONE` canned recipe at the end:

```makefile
.PHONY: init
init: sq/init
	@echo "── Project setup ──"
	# ... project-specific steps ...
	$(sq/INIT_DONE)
```

### Linking

Link the app against `$(sq/LIB)` and the Dawn libraries:

```makefile
$(APP): $(APP_OBJ) $(sq/LIB) $(sq/FRAMEWORK_LIBS)
	$(CXX) $(APP_OBJ) $(sq/LIB) $(sq/DAWN_LIBS) $(FRAMEWORKS) $(SDL_LIBS) -o $@
```

Link the receiver:

```makefile
receiver: $(sq/RECEIVER)
```

## Module Structure

| Directory | Contents |
|-----------|----------|
| `include/` | Public headers (one per class) |
| `src/` | Implementation files + test files (`*_test.cpp`) |
| `tools/` | Receiver: shared core (`receiver_core.cpp`), desktop entry (`receiver.cpp`), platform backends |
| `tools/ios/` | iOS receiver: Xcode project, QR scanner, build scripts |
| `tools/android/` | Android receiver: Gradle project, QR scanner |
| `vendor/` | Third-party dependencies: Dawn, spdlog, linalg.h, earcut.hpp, doctest, Triangle, asio, qrcodegen |

## Wire Protocol

The server and receiver communicate over TCP using a custom framing protocol on top of Dawn's wire serialization.

### Connection Handshake

```
Receiver → Server:  DeviceInfo   (dimensions, pixel ratio, texture format)
Server  → Receiver: SessionInit  (reserved wire handles for instance/adapter/device/queue/surface)
Receiver → Server:  SessionReady (resources injected, ready to render)
```

### Steady-State Messages

```
Server  → Receiver: MessageHeader{kWireCommandMagic} + Dawn wire commands
Receiver → Server:  MessageHeader{kWireResponseMagic} + Dawn wire responses
Receiver → Server:  MessageHeader{kSdlEventMagic} + SDL_Event structs (input)
```

### Key Constants (`Protocol.h`)

| Constant | Value | Purpose |
|----------|-------|---------|
| `kProtocolVersion` | 1 | Protocol version for compatibility checking |
| `kMaxMessageSize` | 512 MB | Accommodates initial texture uploads over wire |
| `kDeviceInfoMagic` | `0x59573244` | "YW2D" — receiver device info |
| `kSessionInitMagic` | `0x59573253` | "YW2S" — server session init |
| `kSessionReadyMagic` | `0x59573259` | "YW2Y" — receiver ready |
| `kWireCommandMagic` | `0x59573243` | "YW2C" — GPU commands |
| `kWireResponseMagic` | `0x59573252` | "YW2R" — GPU responses |
| `kSdlEventMagic` | `0x59573249` | "YW2I" — input events |

### Address Resolution

`WireSession` resolves the listen address in order:
1. `SQ_WIRE_ADDR` environment variable
2. Default: `"42069"`

Format: `"port"` (listen on all interfaces) or `"address:port"`.

The server auto-discovers its LAN IP (via UDP socket to 8.8.8.8, no packets sent) and encodes it into a QR code: `squz-remote://<lan-ip>:<port>`.

## QR Code Connection

The server prints a QR code to stderr on startup containing `squz-remote://<lan-ip>:<port>`. Mobile receivers scan this to connect:

- **iOS device:** `QRScanner.mm` uses AVFoundation camera to detect QR codes with the `squz-remote://` scheme
- **iOS simulator:** Skips QR scan, connects directly to `localhost:42069`
- **Android device:** Uses Google barcode scanner
- **Android emulator:** Connects to `10.0.2.2:42069` (host localhost alias)
- **Desktop:** CLI argument or `localhost:42069` default

## Receiver

The receiver is a shared binary that works with any sq app. It has no app-specific code — it just renders whatever wire commands the server sends and forwards input back.

### Platform Backends

The receiver uses a thin platform abstraction (`receiver_platform.h`):

```cpp
SDL_WindowFlags windowFlags();              // SDL_WINDOW_METAL on Apple
WGPUSurface createSurface(instance, window); // Platform-specific surface
void syncDrawableSize(window, &w, &h);      // iOS: force-resize on rotation
```

Implementations: `receiver_platform_apple.cpp` (macOS/iOS Metal), `receiver_platform_android.cpp` (Android Vulkan).

### Reconnection

The receiver retries on disconnect with exponential backoff: 10ms initial, doubling to 2000ms cap, reset on success. This means you can restart the server and the receiver will reconnect automatically.

### Mobile Builds

**iOS:** `sq/tools/ios/build-deps.sh` cross-compiles Dawn + SDL3 for iOS arm64. `CMakeLists.txt` generates an Xcode project. Entry point: `main.mm`.

**Android:** Gradle project in `sq/tools/android/`. Entry point: `main.cpp`.

## Public API

### Wire Transport

- **`WireSession`** — TCP wire server session. Listens for a receiver connection, performs the Dawn wire handshake, acquires adapter/device/queue through wire. Owns the resulting `GpuContext`. `run()` manages the render loop with signal handling and frame timing. pImpl.
- **`WireTransport`** — In-process wire transport connecting WireClient to WireServer via memory buffers. Used for testing. pImpl.
- **`Protocol`** — Wire protocol structs (`DeviceInfo`, `SessionInit`, `SessionReady`, `MessageHeader`) and magic numbers. Header-only.

### Platform

- **`GpuContext`** — WebGPU device/queue/surface lifecycle. Supports native init (from `SdlContext`) or wire-mode init (device, queue, surface, format, dimensions). `currentFrameView()` + `present()` for frame rendering. pImpl.
- **`SdlContext`** — RAII SDL3 window creation with Metal layer for WebGPU surface. pImpl.

### GPU Resources

- **`WgpuResource<T>`** — RAII move-only wrapper for WebGPU handles. Type aliases: `BufferHandle`, `TextureHandle`, `SamplerHandle`, etc.
- **`Pipeline`** — WebGPU render pipeline created from WGSL shader source with bind group layouts. pImpl.
- **`BindGroupBuilder`** — Builder pattern for constructing bind groups with buffers, textures, and samplers.
- **`UniformBuffer`** — GPU buffer for uniform data with queue-based writes.
- **`CaptureTarget`** — Offscreen RGBA8 render target for pixel readback.
- **`ShaderUtil`** — `sq::loadProgram()` loads compiled shader binaries.

### Assets

- **`Mesh`** — Vertex + index buffer pair. `Mesh::fromStream()` reads binary format. Vertex layout: position (3f) + texcoord (2f).
- **`Texture`** — GPU texture from image file. `Texture::fromFile()` loads via SDL3_image, converts to RGBA8.
- **`Model`** — Pairs a `Mesh` with a `const Texture*`.
- **`ModelFormat`** — `sq::MeshVertex` struct (x, y, z, u, v).

### Manifest System

- **`ManifestSchema`** — JSON-serializable types: `MeshRef`, `ModelDef<Meta>`, `ManifestDoc<Meta>`. Templated on application-specific metadata.
- **`ManifestLoader`** — `sq::loadManifest<Meta>(path)` loads a JSON manifest + binary mesh pack + textures. Returns `std::unique_ptr<Manifest<Meta>>`.

### Animation

- **`DampedRotation`** — Quaternion orientation + angular velocity with exponential decay. Supports screen-space drag, inertia, framerate-independent damping.
- **`DampedValue`** — 1D value + velocity with exponential decay.
- **`DeltaTimer`** — Frame delta-time helper.

### Testing

- **`ImageDiff`** — `imgdiff::compareCPU()` for pixel-level RMS comparison.

## Tests

Unit tests use doctest. `sq/src/main_test.cpp` provides the test runner; other `*_test.cpp` files register test cases.

```bash
make unit-test    # Build and run sq unit tests
```

## Namespaces

- `sq::` — Engine types (`GpuContext`, `WireSession`, `Pipeline`, `loadManifest`, `loadProgram`, `MeshVertex`)
- `wire::` — Wire protocol constants and types (`DeviceInfo`, `SessionInit`, `kMaxMessageSize`)
- `sq::detail::` — Internal helpers (`loadMeshPack`)
- `imgdiff::` — Image comparison utilities
- Top-level — `Mesh`, `Texture`, `Model`, `DampedRotation`, `DampedValue`, `DeltaTimer`, `SdlContext`

## Working with Claude Code

### Modifying the engine

Changes to `sq/` affect all apps that consume it. After modifying engine code, rebuild both the app and receiver to ensure compatibility:

```bash
make && make receiver
```

### Modifying the receiver

Shared receiver logic lives in `tools/receiver_core.cpp`. Platform-specific code is in `tools/receiver_platform_*.cpp`. Mobile entry points are in `tools/ios/main.mm` and `tools/android/`. The desktop entry point is `tools/receiver.cpp`.

The receiver is app-agnostic — it renders whatever wire commands it receives. Avoid adding app-specific logic to the receiver.

### Modifying the wire protocol

Protocol changes require updating both `WireSession` (server side) and `receiver_core.cpp` (receiver side) in lockstep. Bump `kProtocolVersion` in `Protocol.h` when making breaking changes.

### Adding a new public API class

1. Header in `include/sq/ClassName.h`
2. Implementation in `src/ClassName.cpp`
3. Use pImpl for classes that pull in Dawn/SDL/asio headers (see parent project's CLAUDE.md for pImpl guidelines)
4. Add to `sq/SRC` in `Module.mk` if it's a new source file
5. Update this CLAUDE.md's Public API section
