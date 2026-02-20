# ge

Rendering and asset engine for Dawn (WebGPU) + SDL3 applications. Provides RAII resource management, manifest-driven asset loading, and animation utilities.

## Dependencies

- [Dawn](https://dawn.googlesource.com/dawn) — WebGPU implementation
- [SDL3](https://libsdl.org/) + SDL3_image — Windowing, input, image loading
- [spdlog](https://github.com/gabime/spdlog) — Logging (header-only)
- [linalg.h](https://github.com/sgorsten/linalg) — Linear algebra (header-only)
- [doctest](https://github.com/doctest/doctest) — Testing (header-only)
- [Triangle](https://www.cs.cmu.edu/~quake/triangle.html) — Constrained Delaunay triangulation

Dependencies live in `vendor/` as git submodules or vendored sources.

## Integration

ge is consumed as a git submodule. The parent project includes `Module.mk` from its own Makefile:

```makefile
include ge/Module.mk
```

This exports variables (`ge/LIB`, `ge/OBJ`, `ge/FRAMEWORK_LIBS`, etc.) and pattern rules for compiling engine sources, test sources, and shaders. There is no standalone build.

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
| `GpuContext.h` | WebGPU device/queue/surface lifecycle |
| `SdlContext.h` | RAII SDL3 window and event loop setup |

### Resources

| Header | Description |
|--------|-------------|
| `WgpuResource.h` | Move-only RAII wrapper for WebGPU handles (`BufferHandle`, `TextureHandle`, `SamplerHandle`, etc.) |
| `CaptureTarget.h` | Offscreen framebuffer with RGBA8 color texture for readback |
| `ShaderUtil.h` | `ge::loadProgram()` — load compiled vertex + fragment shaders |

### Assets

| Header | Description |
|--------|-------------|
| `Mesh.h` | Vertex/index buffer pair with binary stream loader |
| `Texture.h` | GPU texture loaded from image files via SDL3_image |
| `Model.h` | Mesh + texture binding |
| `ModelFormat.h` | `ge::MeshVertex` — vertex layout (pos3f + uv2f) |
| `ManifestSchema.h` | JSON-serializable manifest types, templated on app metadata |
| `ManifestLoader.h` | `ge::loadManifest<Meta>()` — loads manifest + mesh pack + textures |

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
