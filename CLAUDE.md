# sq/ Engine Module

Reusable rendering and asset engine built on bgfx + SDL3. Consumed as a git submodule; build integration via `Module.mk`.

## Build

The parent project includes `sq/Module.mk`, which exports variables and rules. There is no standalone build — `sq/` is always built through the parent Makefile.

Key exports: `sq/LIB` (static library), `sq/OBJ`, `sq/TEST_SRC`, `sq/COMPILED_TEST_SHADERS`, `sq/FRAMEWORK_LIBS`, `sq/SHADERC`.

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

- **`BgfxResource<T>`** — RAII move-only wrapper for any bgfx handle. Throws on invalid handle at construction. Type aliases: `VertexBufferHandle`, `IndexBufferHandle`, `ShaderHandle`, `ProgramHandle`, `TextureHandle`, `UniformHandle`, `FrameBufferHandle`.
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
- Top-level — `BgfxResource`, `Mesh`, `Texture`, `Model`, `DampedRotation`, `DampedValue`, `DeltaTimer`, `BgfxContext`, `SdlContext`
