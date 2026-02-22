# ge/ Engine Module

**IMPORTANT: When adding new functionality, always consider whether it belongs in `ge/` (general-purpose engine feature usable by any app) or in the parent project (game-specific logic). If unsure, ask before implementing.**

Reusable rendering and asset engine built on Dawn (WebGPU) + SDL3. Consumed as a git submodule; build integration via `Module.mk`.

Apps built on ge use a **server/player architecture**: the app (server) issues WebGPU draw commands through Dawn's wire protocol over TCP, and the platform-native Squz Player renders them and sends input back. This means the app itself has zero platform-specific code — ge and the player handle all of that.

## Integrating ge into a New App

### Minimal Example

A complete ge app needs three things: a `Makefile`, a `main.cpp`, and game logic.

**main.cpp** — the standard entry point pattern:

```cpp
#include <ge/SessionHost.h>
#include <ge/Session.h>

int main() {
    MyState state;  // Persistent game state (survives reconnects)

    ge::SessionHost host;
    host.run([&](ge::Session& session) -> ge::Session::RunConfig {
        auto& ctx = session.gpu();
        auto app = std::make_shared<MyApp>(ctx);

        return {
            .onUpdate = [&, app](float dt) { app->update(dt, state); },
            .onRender = [&, app](wgpu::TextureView target, int w, int h) {
                app->render(ctx, state, target);
            },
            .onEvent  = [&, app](const SDL_Event& e) { app->event(e, state); },
        };
    });
}
```

Key points:
- **`SessionHost`** connects to the ged daemon broker and spawns a session per player
- **State lives outside the host** so it persists across player reconnects
- **App/GPU resources are created per session** (each player gets its own wire handles)
- The factory callback receives a connected `Session&` and returns a `RunConfig`
- `session.run()` drives the render loop at ~60fps with frame delta timing
- `RunConfig` uses designated initializers: `onUpdate`, `onRender`, `onEvent`, `onResize`
- The engine manages frame view acquisition, present, and window resize internally
- Ctrl+C terminates the process gracefully

**Makefile** — minimal integration:

```makefile
BUILD_DIR := build
CXX := clang++

-include ge/Module.mk
ge/Module.mk:
	git submodule update --init --recursive

CXXFLAGS := -std=c++20 -O2 $(ge/INCLUDES)
SDL_CFLAGS := $(shell sdl3-config --cflags 2>/dev/null)
SDL_LIBS := $(shell sdl3-config --libs 2>/dev/null)
FRAMEWORKS := -framework Metal -framework QuartzCore -framework Foundation

SRC := src/main.cpp src/MyApp.cpp
OBJ := $(SRC:%.cpp=$(BUILD_DIR)/%.o)
APP := bin/myapp

COMPILE_DB_DEPS += $(SRC) Makefile

$(APP): $(OBJ) $(ge/LIB) $(ge/FRAMEWORK_LIBS)
	@mkdir -p $(@D)
	$(CXX) $(OBJ) $(ge/LIB) $(ge/DAWN_LIBS) $(FRAMEWORKS) $(SDL_LIBS) -o $@

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
| GPU device setup | WireSession acquires adapter/device/queue via wire | Nothing |
| Window/surface | Player creates native window + Metal/Vulkan surface | Nothing |
| Frame loop | `session.run()` with delta timing + signal handling | `onUpdate(dt)` + `onRender(target)` callbacks |
| Input | Player captures SDL events, sends over TCP | `onEvent(e)` callback |
| Window resize | Engine calls `GpuContext::resize()` automatically | Optional `onResize(w, h)` callback |
| Reconnection | SessionHost spawns new session per player | Separate State from App |
| Session routing | ged daemon manages connections + QR codes | Nothing |
| Asset loading | `ge::loadManifest<T>()` for meshes + textures | manifest.json + data files |
| Shaders | WGSL loaded at runtime via `Pipeline` | .wgsl shader files |
| Mobile builds | iOS/Android player projects in `ge/tools/` | Nothing (shared player) |

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
| `ge/INCLUDES` | `-I` flags for engine + vendor headers (includes Dawn) |
| `ge/SRC`, `ge/OBJ` | Engine source files and derived objects |
| `ge/LIB` | Static library path (`$(BUILD_DIR)/libge.a`) |
| `ge/DAWN_LIBS` | Dawn static libraries (dawn_proc, webgpu_dawn, dawn_wire) |
| `ge/FRAMEWORK_LIBS` | Alias for `$(ge/DAWN_LIBS)` |
| `ge/TEST_SRC`, `ge/TEST_OBJ` | Unit test sources and objects |
| `ge/TRIANGLE_OBJ` | Triangle library object (for tools that need triangulation) |
| `ge/PLAYER_SRC`, `ge/PLAYER_OBJ` | Squz Player source and object |
| `ge/PLAYER` | Squz Player binary path (`bin/player`) |

### Shared Variables

Module.mk provides sensible defaults for project-wide variables. The parent extends these with `+=`:

| Variable | Default | Parent extends with |
|----------|---------|---------------------|
| `CLEAN` | `bin build` | Additional directories for `make clean` |
| `COMPILE_DB_DEPS` | `$(ge/SRC) $(ge/TEST_SRC) $(ge/PLAYER_SRC) ge/Module.mk` | App sources and Makefile |

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

Link the app against `$(ge/LIB)` and the Dawn libraries:

```makefile
$(APP): $(APP_OBJ) $(ge/LIB) $(ge/FRAMEWORK_LIBS)
	$(CXX) $(APP_OBJ) $(ge/LIB) $(ge/DAWN_LIBS) $(FRAMEWORKS) $(SDL_LIBS) -o $@
```

Link the player:

```makefile
player: $(ge/PLAYER)
```

## Module Structure

| Directory | Contents |
|-----------|----------|
| `include/` | Public headers (one per class) |
| `src/` | Implementation files + test files (`*_test.cpp`) |
| `tools/` | Player: shared core (`player_core.cpp`), desktop entry (`player.cpp`), platform backends |
| `tools/ios/` | iOS player: Xcode project, QR scanner, build scripts |
| `tools/android/` | Android player: Gradle project, QR scanner |
| `vendor/` | Third-party dependencies: Dawn, spdlog, linalg.h, earcut.hpp, doctest, Triangle, asio, SQLite3 |

**Note:** SQLite3 is compiled into `libge.a` (from the vendored amalgamation `vendor/src/sqlite3.c`). Do not add `-lsqlite3` to link lines — it's already included.

## Wire Protocol

The server and player communicate over TCP using a custom framing protocol on top of Dawn's wire serialization.

### Connection Handshake

```
Player → Server:  DeviceInfo   (dimensions, pixel ratio, texture format)
Server → Player:  SessionInit  (reserved wire handles for instance/adapter/device/queue/surface)
Player → Server:  SessionReady (resources injected, ready to render)
```

### Steady-State Messages

```
Server → Player:  MessageHeader{kWireCommandMagic} + Dawn wire commands
Player → Server:  MessageHeader{kWireResponseMagic} + Dawn wire responses
Player → Server:  MessageHeader{kSdlEventMagic} + SDL_Event structs (input)
```

### Key Constants (`Protocol.h`)

| Constant | Value | Purpose |
|----------|-------|---------|
| `kProtocolVersion` | 1 | Protocol version for compatibility checking |
| `kMaxMessageSize` | 512 MB | Accommodates initial texture uploads over wire |
| `kDeviceInfoMagic` | `0x59573244` | "YW2D" — player device info |
| `kSessionInitMagic` | `0x59573253` | "YW2S" — server session init |
| `kSessionReadyMagic` | `0x59573259` | "YW2Y" — player ready |
| `kWireCommandMagic` | `0x59573243` | "YW2C" — GPU commands |
| `kWireResponseMagic` | `0x59573252` | "YW2R" — GPU responses |
| `kSdlEventMagic` | `0x59573249` | "YW2I" — input events |

### Address Resolution

Game servers connect to the ged daemon broker. `SessionHost` resolves the daemon address in order:
1. `GE_DAEMON_ADDR` environment variable (format: `"host:port"`)
2. Default: `localhost:42069`

Players connect via ged, which handles QR codes, WebSocket routing, and session management.

## Player

The Squz Player is a shared binary that works with any ge app. It has no app-specific code — it just renders whatever wire commands the server sends and forwards input back.

### Platform Backends

The player uses a thin platform abstraction (`player_platform.h`):

```cpp
SDL_WindowFlags windowFlags();              // SDL_WINDOW_METAL on Apple
WGPUSurface createSurface(instance, window); // Platform-specific surface
void syncDrawableSize(window, &w, &h);      // iOS: force-resize on rotation
```

Implementations: `player_platform_apple.cpp` (macOS/iOS Metal), `player_platform_android.cpp` (Android Vulkan).

### Reconnection

The player retries on disconnect with exponential backoff: 10ms initial, doubling to 2000ms cap, reset on success. This means you can restart the server and the player will reconnect automatically.

### Headless Mode

Use `--headless` to run the player with a hidden window (no visible UI). Useful for background debugging sessions where the player window would steal focus:

```bash
bin/player --headless
```

The player still connects, processes wire commands, and logs normally — the window is simply not shown.

### Ged Quiet Mode

Use `-no-open` to prevent ged from opening the dashboard in the browser on first server connection:

```bash
bin/ged -no-open
```

### Mobile Builds

**iOS:** `ge/tools/ios/build-deps.sh` cross-compiles Dawn + SDL3 for iOS arm64. `CMakeLists.txt` generates an Xcode project. Entry point: `main.mm`.

**Android:** Gradle project in `ge/tools/android/`. Entry point: `main.cpp`.

## Android Player Deployment

### Prerequisites

- Android SDK installed (set `sdk.dir` in `ge/tools/android/local.properties`)
- Dawn pre-built for Android arm64 (already committed at `ge/vendor/dawn/lib/android-arm64/`)
- A physical device or emulator connected via `adb`

### Building

```bash
cd ge/tools/android
./gradlew assembleDebug
```

The APK is output to `app/build/outputs/apk/debug/app-debug.apk`.

### Installing

```bash
adb install -r ge/tools/android/app/build/outputs/apk/debug/app-debug.apk
```

**Important:** The package name is `com.squz.player` (not `com.squz.remote`). The main activity is `.SqzActivity`.

### Running

1. Start the app server from the project root (the server needs `ge/web/dist/` relative to cwd):
   ```bash
   bin/myapp        # Starts wire server, prints QR code
   ```
2. Launch the player on the device:
   ```bash
   adb shell am start -n com.squz.player/.SqzActivity
   ```
3. Point the phone camera at the terminal QR code (encodes `squz-remote://<lan-ip>:<port>`).
4. The phone connects via WebSocket and renders the app.

**Emulator:** Connects automatically to `10.0.2.2:42069` (host localhost alias), so set `GE_WIRE_ADDR=42069` when launching the server.

### Debugging

Spdlog output is routed to Android logcat via the `android_sink`. View logs with:

```bash
adb logcat -s "SquzPlayer"
```

### Adding Source Files to the Android Build

The Android player's native sources are listed in `ge/tools/android/app/src/main/cpp/CMakeLists.txt`. If a new ge source file is referenced by `player_core.cpp`, add it to the `add_library(main SHARED ...)` block. Current sources:

- `main.cpp` — Android entry point (spdlog android sink setup, QR scan, player launch)
- `QRScanner_android.cpp` — Google ML Kit barcode scanner via JNI
- `player_platform_android.cpp` — Vulkan surface creation
- `${GE_ROOT}/tools/player_core.cpp` — Shared player logic
- `${GE_ROOT}/src/WireTransport.cpp` — Wire transport
- `${GE_ROOT}/src/WebSocketClient.cpp` — WebSocket client (`connectWebSocket`)

## Standalone iOS App (Direct Mode)

Apps can also run directly on iOS without the wire player, rendering natively on-device. This uses `Session` compiled with `SessionDirect.cpp` instead of `SessionWire.cpp` — same API, no networking.

### Prerequisites

Cross-compile Dawn, SDL3, and SDL3_image for iOS:

```bash
cd ge/tools/ios && bash build-deps.sh --simulator   # iOS Simulator
cd ge/tools/ios && bash build-deps.sh --device       # Real device (default)
cd ge/tools/ios && bash build-deps.sh --all          # Both
```

This produces static libraries under `ge/vendor/dawn/lib/ios-arm64{,-simulator}/` and `ge/vendor/sdl3/lib/ios-arm64{,-simulator}/`. Only needs to run once (or after upgrading Dawn/SDL).

### Project Structure

Create an `ios/` directory at the project root with:

- **`CMakeLists.txt`** — CMake project that generates an Xcode project
- **`Info.plist`** — iOS app metadata (orientation, fullscreen, etc.)

The CMake project compiles game sources + a subset of ge engine sources (direct mode — no wire, no asio, no QR). It links against the prebuilt Dawn and SDL3 static libraries.

### CMakeLists.txt Essentials

```cmake
cmake_minimum_required(VERSION 3.22)
project(MyApp LANGUAGES CXX OBJCXX)
set(CMAKE_CXX_STANDARD 20)

set(PROJECT_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/..)
set(GE_ROOT ${PROJECT_ROOT}/ge)

# Game sources
set(GAME_SOURCES ${PROJECT_ROOT}/src/main.cpp ${PROJECT_ROOT}/src/MyApp.cpp)

# ge engine sources (direct mode subset)
set(GE_SOURCES
    ${GE_ROOT}/src/SessionDirect.cpp
    ${GE_ROOT}/src/GpuContext.cpp
    ${GE_ROOT}/src/SdlContext.cpp
    ${GE_ROOT}/src/WireTransport.cpp   # GpuContext references it (no networking deps)
    ${GE_ROOT}/src/Texture.cpp
    ${GE_ROOT}/src/Mesh.cpp
    ${GE_ROOT}/src/Model.cpp
    ${GE_ROOT}/src/ManifestLoader.cpp
    ${GE_ROOT}/src/Pipeline.cpp
    ${GE_ROOT}/src/BindGroup.cpp
    ${GE_ROOT}/src/Resource.cpp
)

add_executable(MyApp MACOSX_BUNDLE ${GAME_SOURCES} ${GE_SOURCES})

# ObjC++ for files that use ObjC types (CAMetalLayer, UIApplication)
set_source_files_properties(${PROJECT_ROOT}/src/main.cpp PROPERTIES LANGUAGE OBJCXX)
set_source_files_properties(${GE_ROOT}/src/SdlContext.cpp PROPERTIES LANGUAGE OBJCXX)
set_source_files_properties(${GE_ROOT}/src/GpuContext.cpp PROPERTIES LANGUAGE OBJCXX)

# Headers
target_include_directories(MyApp PRIVATE
    ${PROJECT_ROOT}/src
    ${GE_ROOT}/include
    ${GE_ROOT}/vendor/include
    ${GE_ROOT}/vendor/github.com/gabime/spdlog/include
    ${GE_ROOT}/vendor/dawn/include
    ${GE_ROOT}/vendor/github.com/libsdl-org/SDL/include
    ${GE_ROOT}/vendor/sdl3/include
)

# Libraries
target_link_libraries(MyApp PRIVATE -ldawn_proc -lwebgpu_dawn -ldawn_wire -lSDL3 -lSDL3_image)

# iOS frameworks (SDL3 requires all of these)
target_link_libraries(MyApp PRIVATE
    "-framework Foundation" "-framework UIKit" "-framework Metal"
    "-framework QuartzCore" "-framework IOKit" "-framework IOSurface"
    "-framework CoreGraphics" "-framework CoreServices" "-framework CoreFoundation"
    "-framework CoreBluetooth" "-framework AudioToolbox" "-framework AVFoundation"
    "-framework CoreMedia" "-framework CoreVideo" "-framework GameController"
    "-framework CoreHaptics" "-framework CoreMotion" "-framework ImageIO"
    "-framework OpenGLES" "-lobjc"
)

# SDK-conditional library search paths (one project works for device + simulator)
set(DAWN_DEVICE_DIR ${GE_ROOT}/vendor/dawn/lib/ios-arm64)
set(DAWN_SIM_DIR    ${GE_ROOT}/vendor/dawn/lib/ios-arm64-simulator)
set(SDL_DEVICE_DIR  ${GE_ROOT}/vendor/sdl3/lib/ios-arm64)
set(SDL_SIM_DIR     ${GE_ROOT}/vendor/sdl3/lib/ios-arm64-simulator)

set_target_properties(MyApp PROPERTIES
    MACOSX_BUNDLE_INFO_PLIST ${CMAKE_CURRENT_SOURCE_DIR}/Info.plist
    "XCODE_ATTRIBUTE_LIBRARY_SEARCH_PATHS[sdk=iphoneos*]" "${DAWN_DEVICE_DIR} ${SDL_DEVICE_DIR}"
    "XCODE_ATTRIBUTE_LIBRARY_SEARCH_PATHS[sdk=iphonesimulator*]" "${DAWN_SIM_DIR} ${SDL_SIM_DIR}"
    XCODE_GENERATE_SCHEME TRUE
    XCODE_SCHEME_ENABLE_GPU_API_VALIDATION OFF   # Simulator GPU doesn't support depth clip mode
)
```

### Bundle Resources

Data files (manifest, meshes, textures, shaders) must be bundled into the app. Add them as sources and set `MACOSX_PACKAGE_LOCATION` to preserve directory structure:

```cmake
set(RESOURCE_FILES
    ${PROJECT_ROOT}/data/manifest.json
    ${PROJECT_ROOT}/data/meshes.bin
    ${PROJECT_ROOT}/shaders/atlas.wgsl
)
file(GLOB TEXTURE_FILES ${PROJECT_ROOT}/data/textures/*)
list(APPEND RESOURCE_FILES ${TEXTURE_FILES})
target_sources(MyApp PRIVATE ${RESOURCE_FILES})

foreach(FILE ${RESOURCE_FILES})
    file(RELATIVE_PATH REL_PATH ${PROJECT_ROOT} ${FILE})
    get_filename_component(REL_DIR ${REL_PATH} DIRECTORY)
    set_source_files_properties(${FILE} PROPERTIES
        MACOSX_PACKAGE_LOCATION "Resources/${REL_DIR}")
endforeach()
```

At runtime, `ge::resource("data/manifest.json")` resolves to the correct bundle path.

### Generating and Building

```bash
# Generate Xcode project (simulator)
cd ios && cmake -G Xcode -B build/xcode \
    -DCMAKE_SYSTEM_NAME=iOS \
    -DCMAKE_OSX_SYSROOT=iphonesimulator \
    -DCMAKE_OSX_ARCHITECTURES=arm64 \
    -DCMAKE_OSX_DEPLOYMENT_TARGET=16.0

# Open in Xcode and build/run
open build/xcode/MyApp.xcodeproj
```

For real devices, omit `-DCMAKE_OSX_SYSROOT=iphonesimulator` (defaults to `iphoneos`).

### Key Differences from Wire Mode

| Concern | Wire mode | Direct mode |
|---------|-----------|-------------|
| Session | `SessionWire.cpp` (wire via ged) | `SessionDirect.cpp` (SDL window) |
| Rendering | Player renders on-device | App renders directly via Metal |
| Dependencies | asio, WebSocket client | None (no networking) |
| Entry point | `main()` (plain C++) | `main(int, char*[])` with `SDL_main.h` |
| Asset paths | Relative to working directory | `ge::resource()` resolves to bundle |
| Texture format | ASTC (if device supports it) | Runtime fallback: ASTC or ETC2 |

### Texture Compression

The iOS Simulator GPU supports ETC2 but not ASTC. Generate both formats during precompute (`.astc.getex` and `.etc2.getex`), and the manifest loader automatically selects the right one at runtime based on `device.HasFeature(wgpu::FeatureName::TextureCompressionASTC)`.

### Input Handling

Use `SDL_EVENT_FINGER_*` events exclusively for touch/drag input. SDL3 synthesizes finger events from mouse input on desktop (`SDL_HINT_MOUSE_TOUCH_EVENTS` defaults on), so the same code path works everywhere. Finger event coordinates are normalized 0-1; convert to point space by multiplying by `width / pixelRatio`.

## Public API

### Wire Transport

- **`WireSession`** — Wire session that connects to ged via WebSocket, performs the Dawn wire handshake, acquires adapter/device/queue through wire. Owns the resulting `GpuContext`. `run()` manages the render loop with signal handling and frame timing. pImpl.
- **`SessionHost`** — Manages the sideband connection to ged and spawns `Session` threads for each player that attaches. `run(Factory)` takes a factory callback that configures each session's render loop. pImpl.
- **`WireTransport`** — In-process wire transport connecting WireClient to WireServer via memory buffers. Used for testing. pImpl.
- **`Protocol`** — Wire protocol structs (`DeviceInfo`, `SessionInit`, `SessionReady`, `MessageHeader`) and magic numbers. Header-only.

### Platform

- **`GpuContext`** — WebGPU device/queue/surface lifecycle. Supports native init (from `SdlContext`) or wire-mode init (device, queue, surface, format, dimensions). `currentFrameView()` + `present()` for frame rendering. pImpl.
- **`Session`** — Unified session interface. Compiles as wire mode (`SessionWire.cpp`) or direct native mode (`SessionDirect.cpp`). Same API: `gpu()`, `pixelRatio()`, `run(RunConfig)`. `RunConfig` has `onUpdate`, `onRender`, `onEvent`, `onResize` callbacks. pImpl.
- **`SdlContext`** — RAII SDL3 window creation with Metal layer for WebGPU surface. pImpl.
- **`Resource`** — `ge::resource(path)` resolves asset paths. Returns the path unchanged on desktop; prepends the iOS app bundle `Resources/` directory on iOS. Header-only.

### GPU Resources

- **`WgpuResource<T>`** — RAII move-only wrapper for WebGPU handles. Type aliases: `BufferHandle`, `TextureHandle`, `SamplerHandle`, etc.
- **`Pipeline`** — WebGPU render pipeline created from WGSL shader source with bind group layouts. pImpl.
- **`BindGroupBuilder`** — Builder pattern for constructing bind groups with buffers, textures, and samplers.
- **`UniformBuffer`** — GPU buffer for uniform data with queue-based writes.
- **`CaptureTarget`** — Offscreen RGBA8 render target for pixel readback.
- **`ShaderUtil`** — `ge::loadProgram()` loads compiled shader binaries.

### Assets

- **`Mesh`** — Vertex + index buffer pair. `Mesh::fromStream()` reads binary format. Vertex layout: position (3f) + texcoord (2f).
- **`Texture`** — GPU texture from image file. `Texture::fromFile()` loads via SDL3_image, converts to RGBA8.
- **`Model`** — Pairs a `Mesh` with a `const Texture*`.
- **`ModelFormat`** — `ge::MeshVertex` struct (x, y, z, u, v).

### Manifest System

- **`ManifestSchema`** — JSON-serializable types: `MeshRef`, `ModelDef<Meta>`, `ManifestDoc<Meta>`. Templated on application-specific metadata.
- **`ManifestLoader`** — `ge::loadManifest<Meta>(path)` loads a JSON manifest + binary mesh pack + textures. Returns `std::unique_ptr<Manifest<Meta>>`.

### Animation

- **`GlobeController`** — Encapsulates `DampedRotation` + drag state + input source arbitration (mouse vs finger). `event()` handles SDL touch/mouse events, `update(dt)` flushes drag accumulation and applies inertia. Header-only.
- **`DampedRotation`** — Quaternion orientation + angular velocity with exponential decay. Supports screen-space drag, inertia, framerate-independent damping.
- **`DampedValue`** — 1D value + velocity with exponential decay.
- **`DeltaTimer`** — Frame delta-time helper.

### Testing

- **`ImageDiff`** — `imgdiff::compareCPU()` for pixel-level RMS comparison.

## Tests

Unit tests use doctest. `ge/src/main_test.cpp` provides the test runner; other `*_test.cpp` files register test cases.

```bash
make unit-test    # Build and run ge unit tests
```

## Namespaces

- `ge::` — Engine types (`GpuContext`, `WireSession`, `Pipeline`, `loadManifest`, `loadProgram`, `MeshVertex`)
- `wire::` — Wire protocol constants and types (`DeviceInfo`, `SessionInit`, `kMaxMessageSize`)
- `ge::detail::` — Internal helpers (`loadMeshPack`)
- `imgdiff::` — Image comparison utilities
- Top-level — `Mesh`, `Texture`, `Model`, `DampedRotation`, `DampedValue`, `DeltaTimer`, `SdlContext`

## Working with Claude Code

### Modifying the engine

Changes to `ge/` affect all apps that consume it. After modifying engine code, rebuild both the app and player to ensure compatibility:

```bash
make && make player
```

### Modifying the player

Shared player logic lives in `tools/player_core.cpp`. Platform-specific code is in `tools/player_platform_*.cpp`. Mobile entry points are in `tools/ios/main.mm` and `tools/android/`. The desktop entry point is `tools/player.cpp`.

The player is app-agnostic — it renders whatever wire commands it receives. Avoid adding app-specific logic to the player.

### Modifying the wire protocol

Protocol changes require updating both `WireSession` (server side) and `player_core.cpp` (player side) in lockstep. Bump `kProtocolVersion` in `Protocol.h` when making breaking changes.

### Adding a new public API class

1. Header in `include/ge/ClassName.h`
2. Implementation in `src/ClassName.cpp`
3. Use pImpl for classes that pull in Dawn/SDL/asio headers (see parent project's CLAUDE.md for pImpl guidelines)
4. Add to `ge/SRC` in `Module.mk` if it's a new source file
5. Update this CLAUDE.md's Public API section

