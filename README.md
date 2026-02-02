# sq

Rendering and asset engine for bgfx + SDL3 applications. Provides RAII resource management, manifest-driven asset loading, and animation utilities.

## Dependencies

- [bgfx](https://github.com/bkaradzic/bgfx) — Cross-platform rendering
- [SDL3](https://libsdl.org/) + SDL3_image — Windowing, input, image loading
- [spdlog](https://github.com/gabime/spdlog) — Logging (header-only)
- [linalg.h](https://github.com/sgorsten/linalg) — Linear algebra (header-only)
- [doctest](https://github.com/doctest/doctest) — Testing (header-only)
- [Triangle](https://www.cs.cmu.edu/~quake/triangle.html) — Constrained Delaunay triangulation

Dependencies live in `vendor/` as git submodules or vendored sources.

## Integration

sq is consumed as a git submodule. The parent project includes `Module.mk` from its own Makefile:

```makefile
include sq/Module.mk
```

This exports variables (`sq/LIB`, `sq/OBJ`, `sq/FRAMEWORK_LIBS`, etc.) and pattern rules for compiling engine sources, test sources, and shaders. There is no standalone build.

## Structure

```
include/        Public headers (one per class)
src/            Implementation + unit tests (*_test.cpp)
shaders/        Test shaders (app shaders live in the parent project)
vendor/         Third-party dependencies
Module.mk       Build rules and exported variables
```

## API Overview

### Platform

| Header | Description |
|--------|-------------|
| `BgfxContext.h` | RAII bgfx initialization from a native window handle |
| `SdlContext.h` | RAII SDL3 window and event loop setup |

### Resources

| Header | Description |
|--------|-------------|
| `BgfxResource.h` | Move-only RAII wrapper for bgfx handles (`VertexBufferHandle`, `ProgramHandle`, `TextureHandle`, etc.) |
| `CaptureTarget.h` | Offscreen framebuffer with RGBA8 color texture for readback |
| `ShaderUtil.h` | `sq::loadProgram()` — load compiled vertex + fragment shaders |

### Assets

| Header | Description |
|--------|-------------|
| `Mesh.h` | Vertex/index buffer pair with binary stream loader |
| `Texture.h` | GPU texture loaded from image files via SDL3_image |
| `Model.h` | Mesh + texture binding |
| `ModelFormat.h` | `sq::MeshVertex` — vertex layout (pos3f + uv2f) |
| `ManifestSchema.h` | JSON-serializable manifest types, templated on app metadata |
| `ManifestLoader.h` | `sq::loadManifest<Meta>()` — loads manifest + mesh pack + textures |

### Animation

| Header | Description |
|--------|-------------|
| `DampedRotation.h` | Quaternion rotation with angular velocity and exponential decay |
| `DampedValue.h` | 1D value with velocity and exponential decay |
| `DeltaTimer.h` | Frame delta-time tracking |

### Testing

| Header | Description |
|--------|-------------|
| `ImageDiff.h` | CPU and GPU pixel comparison (RMS difference) |

## License

See individual files and `vendor/` subdirectories for license terms.
