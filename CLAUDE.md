# sq/ Engine Module

Reusable rendering and asset engine built on bgfx + SDL3. Consumed as a git submodule; build integration via `Module.mk`.

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
| `sq/INCLUDES` | `-I` flags for engine + vendor headers |
| `sq/SRC`, `sq/OBJ` | Engine source files and derived objects |
| `sq/LIB` | Static library path (`$(BUILD_DIR)/libsq.a`) |
| `sq/FRAMEWORK_LIBS` | bgfx, bx, bimg static libraries |
| `sq/TEST_SRC`, `sq/TEST_OBJ` | Unit test sources and objects |
| `sq/COMPILED_TEST_SHADERS` | Compiled test shader binaries |
| `sq/TRIANGLE_OBJ` | Triangle library object (for tools that need triangulation) |
| `sq/SHADERC` | Path to the bgfx shader compiler binary |

### Shared Variables

Module.mk provides sensible defaults for project-wide variables. The parent extends these with `+=`:

| Variable | Default | Parent extends with |
|----------|---------|---------------------|
| `CLEAN` | `bin build` | Additional directories for `make clean` |
| `CLEAN_SHADERS` | `$(BUILD_DIR)/shaders $(BUILD_DIR)/sq/shaders` | Additional shader output directories |
| `COMPILED_SHADERS` | *(empty)* | App shader binaries, e.g. `$(BUILD_DIR)/shaders/foo_vs.bin` |
| `COMPILE_DB_DEPS` | `$(sq/SRC) $(sq/TEST_SRC) sq/Module.mk` | App sources and Makefile |

Example:

```makefile
# After the -include sq/Module.mk line:
COMPILED_SHADERS += \
	$(BUILD_DIR)/shaders/atlas_vs.bin \
	$(BUILD_DIR)/shaders/atlas_fs.bin

COMPILE_DB_DEPS += $(SRC) Makefile
```

### Shader Compilation

Module.mk provides two unified pattern rules (vertex and fragment) that map any `%_vs.sc` / `%_fs.sc` source to `$(BUILD_DIR)/%_vs.bin` / `%_fs.bin`. The rules use `.SECONDEXPANSION:` to automatically locate the `varying.def.sc` in the same directory as the shader source.

To add app shaders, place them in any directory with a `varying.def.sc` alongside them, then append to `COMPILED_SHADERS`:

```
shaders/
  atlas_vs.sc
  atlas_fs.sc
  varying.def.sc      # must exist in the same directory as the .sc files
```

```makefile
COMPILED_SHADERS += \
	$(BUILD_DIR)/shaders/atlas_vs.bin \
	$(BUILD_DIR)/shaders/atlas_fs.bin
```

At runtime, load compiled shaders from `build/`:

```cpp
auto program = sq::loadProgram("build/shaders/atlas_vs.bin", "build/shaders/atlas_fs.bin");
```

### Generic Targets

Module.mk defines these targets so the parent doesn't need to:

| Target | Action |
|--------|--------|
| `clean` | `rm -rf $(CLEAN)` |
| `clean-shaders` | `rm -rf $(CLEAN_SHADERS)` |
| `shaders` | Build `$(COMPILED_SHADERS)` |
| `frameworks` | Build bgfx/bx/bimg static libraries |
| `clean-frameworks` | Remove framework libraries and clean bgfx build |
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

Link the app against `$(sq/LIB)` and the framework libraries:

```makefile
$(APP): $(APP_OBJ) $(sq/LIB) $(sq/FRAMEWORK_LIBS) $(COMPILED_SHADERS)
	$(CXX) $(APP_OBJ) $(sq/LIB) $(FRAMEWORKS) $(LIBS) $(SDL_LIBS) -o $@
```

Link unit tests against `$(sq/TEST_OBJ)` and depend on `$(sq/COMPILED_TEST_SHADERS)`:

```makefile
$(UNIT_TEST): $(sq/TEST_OBJ) $(sq/LIB) $(sq/FRAMEWORK_LIBS) $(sq/COMPILED_TEST_SHADERS)
	$(CXX) $(sq/TEST_OBJ) $(sq/LIB) $(FRAMEWORKS) $(LIBS) $(SDL_LIBS) -o $@
```

## Module Structure

| Directory | Contents |
|-----------|----------|
| `include/` | Public headers (one per class) |
| `src/` | Implementation files + test files (`*_test.cpp`) |
| `shaders/` | Test shaders only (app shaders live in the parent) |
| `vendor/` | Third-party dependencies: bgfx, bx, bimg, spdlog, linalg.h, earcut.hpp, doctest, Triangle |

## Public API

### Platform

- **`BgfxContext`** — RAII bgfx init/shutdown with native window handle. pImpl.
- **`SdlContext`** — RAII SDL3 window creation. pImpl.

### GPU Resource Management

- **`GpuResource<T>`** — RAII move-only wrapper for any bgfx handle. Throws on invalid handle at construction. Type aliases: `VertexBufferHandle`, `IndexBufferHandle`, `ShaderHandle`, `ProgramHandle`, `TextureHandle`, `UniformHandle`, `FrameBufferHandle`.
- **`CaptureTarget`** — Offscreen framebuffer + RGBA8 color texture for pixel readback.
- **`ShaderUtil`** — `sq::loadProgram(vsPath, fsPath)` loads compiled shader binaries into a `ProgramHandle`.

### Assets

- **`Mesh`** — Vertex + index buffer pair. `Mesh::fromStream()` reads binary format (vertex count, index count, vertex data, index data). Vertex layout: position (3f) + texcoord (2f).
- **`Texture`** — GPU texture from image file. `Texture::fromFile()` loads via SDL3_image, converts to RGBA8.
- **`Model`** — Pairs a `Mesh` with a `const Texture*`.
- **`ModelFormat`** — `sq::MeshVertex` struct (x, y, z, u, v).

### Manifest System

- **`ManifestSchema`** — JSON-serializable types: `MeshRef`, `ModelDef<Meta>`, `ManifestDoc<Meta>`. Templated on application-specific metadata.
- **`ManifestLoader`** — `sq::loadManifest<Meta>(path)` loads a JSON manifest + binary mesh pack + textures. Returns `std::unique_ptr<Manifest<Meta>>` containing `textures` map, `entries` vector (each with `name`, `parts[]`, `metadata`).

### Animation

- **`DampedRotation`** — Quaternion orientation + angular velocity with exponential decay. Supports screen-space drag, inertia, framerate-independent damping.
- **`DampedValue`** — 1D value + velocity with exponential decay.
- **`DeltaTimer`** — Frame delta-time helper.

### Testing

- **`ImageDiff`** — `imgdiff::compareCPU()` for pixel-level RMS comparison. `imgdiff::Comparator` for GPU-accelerated comparison via mipmap reduction.

## Tests

Unit tests use doctest. `sq/src/main_test.cpp` provides the test runner; other `*_test.cpp` files register test cases.

```bash
make unit-test    # Build and run sq unit tests
```

Test shaders in `sq/shaders/` are compiled by rules in `Module.mk` and used by `BgfxContext_test.cpp` for GPU rendering tests.

## Namespaces

- `sq::` — Engine types (`CaptureTarget`, `loadManifest`, `loadProgram`, `MeshVertex`)
- `sq::detail::` — Internal helpers (`loadMeshPack`)
- `imgdiff::` — Image comparison utilities
- Top-level — `GpuResource`, `Mesh`, `Texture`, `Model`, `DampedRotation`, `DampedValue`, `DeltaTimer`, `BgfxContext`, `SdlContext`
