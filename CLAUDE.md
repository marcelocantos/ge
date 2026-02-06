# sq/ Engine Module

Reusable rendering and asset engine built on Dawn (WebGPU) + SDL3. Consumed as a git submodule; build integration via `Module.mk`.

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
| `tools/` | Standalone binaries (`receiver.cpp`) |
| `vendor/` | Third-party dependencies: Dawn, spdlog, linalg.h, earcut.hpp, doctest, Triangle, asio |

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
- `sq::wire::` — Wire protocol constants and types (`DeviceInfo`, `SessionInit`, `kMaxMessageSize`)
- `sq::detail::` — Internal helpers (`loadMeshPack`)
- `imgdiff::` — Image comparison utilities
- Top-level — `Mesh`, `Texture`, `Model`, `DampedRotation`, `DampedValue`, `DeltaTimer`, `SdlContext`
