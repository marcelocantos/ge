# Adreno 830 / Android 16 — bgfx Vulkan crash in draw submission

**Status:** historical record. ge no longer ships a Vulkan backend on Android — direct-mode rendering uses OpenGL ES 3.2. This document is preserved for if/when the engine revisits Vulkan (e.g. a future app needs features GLES doesn't expose) and needs to know what it's walking back into.
**Date:** 2026-04-18.

## One-line problem

On a Snapdragon 8 Elite Gen (Adreno 830) running Android 16, any bgfx draw call
(transient **or** static vertex buffer, with any shader/program) crashes the
Adreno Vulkan driver with a null-pointer dereference at a fixed small offset.
Empty frames (`setViewClear` + `touch`, no draw) run stably. bgfx init,
swap chain creation, surface handoff from SDL, and present all succeed.

## Device / driver

| | |
|---|---|
| Model | Asus ROG Phone 9 Pro (ASUSAI2501C, `ASUSAI2501`) |
| Build fingerprint | `asus/WWAI2501/ASUSAI2501:16/BQ2A.250525.001/36.0810.1810.68-0:user/release-keys` |
| SoC | QTI SM8750 (Snapdragon 8 Elite Gen — mislabeled in marketing as "Gen 4"; verify) |
| GPU | **Adreno 830** |
| Android | 16 (SDK 36) |
| Vulkan driver | `/vendor/lib64/hw/vulkan.adreno.so` — BuildId `6f82c8e7ce246e220ced45aea3d88e32` |
| Driver GIT | `3656bb992e` (I0abb6f342e), dated 2025-09-08 |
| OpenGL ES string | `Qualcomm, Adreno (TM) 830, OpenGL ES 3.2 V@0800.56` |
| ABI | arm64-v8a |

The device's Android build is from 2025-05-25; the GPU driver is from
2025-09-08, so it reflects a relatively recent Qualcomm driver.

## Software stack under test

- **bgfx** at `7ac84ae6d` (our fork = upstream `e9a4f671b` + two cherry-picks):
  - `d4de16a2f` — "Fix mobile crashes: guard iOS Metal query, disable Android timer queries"
  - `7ac84ae6d` — "Add CMake build for shaderc (no GENie dependency)"
- **bx** at upstream `c6131ec`
- **bimg** at current vendored version (no recent upstream movement)
- **SDL3** 3.2.x vendored, providing the ANativeWindow surface
- Compiled as an amalgamated single-binary build inside the ge engine (not using
  bgfx's GENie build system); source list in
  `tools/android-template/app/src/main/cpp/CMakeLists.txt.in` under
  the `GE_ROOT` block.

### bgfx init parameters

From `src/BgfxContext.mm`, the Android branch:

```cpp
init.type = bgfx::RendererType::Vulkan;
init.resolution.width  = config.width;
init.resolution.height = config.height;
init.resolution.reset  = BGFX_RESET_VSYNC;

m->window = SDL_CreateWindow(title, config.width, config.height,
    SDL_WINDOW_VULKAN | SDL_WINDOW_RESIZABLE);
SDL_PropertiesID props = SDL_GetWindowProperties(m->window);
init.platformData.nwh = SDL_GetPointerProperty(props,
    SDL_PROP_WINDOW_ANDROID_WINDOW_POINTER, nullptr);
```

No validation layers enabled.

### Existing Adreno workarounds already in our fork

We already carry one Adreno-specific patch:

**`d4de16a2f` (bgfx/src/renderer_vk.cpp):** disable timer queries on Android.
Adreno reports `timestampComputeAndGraphics` support but crashes in
`vkCmdResetQueryPool`. This was discovered earlier in the same project.
So the current `vkCmdCopyBuffer` / `vkCmdPipelineBarrier` crash is a
**second** Adreno-specific misbehaviour in the same driver build, at a
different API site.

## Observations across 3 code configurations

All three tested against identical device, same APK build system, only
`sample/tiltbuggy/src/Renderer.cpp` varying.

### 1. Transient vertex buffer (original tiltbuggy renderer)

`Renderer::drawFrame` uses `bgfx::allocTransientVertexBuffer` +
`bgfx::setVertexBuffer` + `bgfx::submit(0, program)`.

**Result:** SIGSEGV within 1–5 seconds of first frame.

```
signal 11 (SIGSEGV), code 1 (SEGV_MAPERR), fault addr 0x0000000000000080
Cause: null pointer dereference
backtrace:
  #00 pc 0x2a6f58  vulkan.adreno.so   !!!0000!78367b13ab12c0cba5f33ae0b35a2c!3656bb992e!+24
  #01 pc 0x1b1238  vulkan.adreno.so   !!!0000!9491a5bff7b448a595868b97e79f67!3656bb992e!+40
  #02 pc 0x1b193c  vulkan.adreno.so   !!!0000!d02eaf653ed404e413c8c644159872!3656bb992e!+972
  #03 pc 0x1726a4  vulkan.adreno.so   qglinternal::vkCmdCopyBuffer2(VkCommandBuffer_T*, VkCopyBufferInfo2 const*)+148
  #04 pc 0x1725e8  vulkan.adreno.so   qglinternal::vkCmdCopyBuffer(VkCommandBuffer_T*, VkBuffer_T*, VkBuffer_T*, unsigned int, VkBufferCopy const*)+120
  #05 libmain.so   bgfx::vk::BufferVK::update(VkCommandBuffer, offset, size, data, discard)+212
  #06 libmain.so   bgfx::vk::RendererContextVK::submit(bgfx::Frame*, ClearQuad&, TextVideoMemBlitter&)+528
  #07 libmain.so   bgfx::Context::renderFrame(int)+284
  #08 libmain.so   bgfx::renderFrame(int)+168
  #09 libmain.so   bgfx::Context::renderThread(bx::Thread*, void*)+44
  #10 libmain.so   bx::Thread::entry()+96
  #11 libmain.so   bx::ThreadInternal::threadFunc(void*)+44
  #12 libc.so      __pthread_start(void*)+184
  #13 libc.so      __start_thread+68
```

`BufferVK::update` (bgfx `src/renderer_vk.cpp:5369`) is:

```cpp
void BufferVK::update(VkCommandBuffer _cb, uint32_t _offset, uint32_t _size, void* _data, bool _discard) {
    StagingBufferVK staging = s_renderVK->allocFromScratchStagingBuffer(_size, 16, _data);
    VkBufferCopy region{ staging.m_offset, _offset, _size };
    vkCmdCopyBuffer(_cb, staging.m_buffer, m_buffer, 1, &region);
    setMemoryBarrier(_cb, VK_PIPELINE_STAGE_TRANSFER_BIT, VK_PIPELINE_STAGE_TRANSFER_BIT);
    ...
}
```

The scratch staging path (`allocFromScratchStagingBuffer`) was introduced
upstream in `1109f3c5b` (June 2024). The function was later touched by
`b0d32c079` (Jan 2026) which increased the alignment from 8 to 16 bytes to
fix a PowerVR Rogue GE8320 flicker — we have that fix applied. Our crash is
a different failure mode (null deref, not flicker) on a different mobile GPU.

### 2. Static vertex buffer, no transient path

Replaced the renderer with a single triangle using `bgfx::createVertexBuffer(makeRef(...), layout)`.
No transient buffer, no `BufferVK::update` per frame — but still a draw submit
with shader + program.

**Result:** SIGSEGV, different site.

```
signal 11 (SIGSEGV), code 1 (SEGV_MAPERR), fault addr 0x00000000000000bc
Cause: null pointer dereference
backtrace:
  #00 vulkan.adreno.so  qglinternal::vkCmdPipelineBarrier(...)+100
  #01 libmain.so        bgfx::vk::setMemoryBarrier(VkCommandBuffer, unsigned, unsigned)+124
  #02 libmain.so        bgfx::vk::RendererContextVK::submit(Frame*, ClearQuad&, TextVideoMemBlitter&)+1128
  #03 libmain.so        bgfx::Context::renderFrame(int)+284
  ...
```

Same class of bug (null-deref inside `vulkan.adreno.so` at a small fixed
offset), different bgfx / Vulkan entry point. Submitting *any* draw trips
the Adreno driver somewhere in its barrier or command-recording machinery.

### 3. Clear + touch only (no draw calls)

```cpp
void Renderer::drawFrame(const Scene&, int w, int h, float, float) {
    bgfx::setViewRect(0, 0, 0, w, h);
    bgfx::setViewClear(0, BGFX_CLEAR_COLOR | BGFX_CLEAR_DEPTH, 0x303080ff, 1.0f, 0);
    bgfx::touch(0);
}
```

**Result:** no crash. Process runs indefinitely, logcat shows normal SDL +
Adreno driver init, no signals, no errors.

Side observation: the navy clear colour does not appear on screen — the
SurfaceView stays black — but `screencap` may not capture HWC-composited
surfaces on this device. Worth re-verifying once the crash is fixed (this
could itself be a secondary bug, or just screen-capture limitations).

## Conclusion / diagnosis

Adreno 830 + bgfx Vulkan backend fails on the submit path when *any* draw
call is recorded, but works correctly for the clear+present-only path.
The two observed crash sites (`vkCmdCopyBuffer2` and `vkCmdPipelineBarrier`)
are both entered from `RendererContextVK::submit`, at null-deref offsets
that look like fixed-offset field accesses through a null pointer inside
the driver — consistent with an Adreno driver bug provoked by a specific
command pattern bgfx emits around draw recording.

Both crash sites are *after* successful Vulkan setup and instance creation
— so it is not an API-version mismatch or device-creation issue. The
driver itself faults on the command pattern. This parallels the earlier
`vkCmdResetQueryPool` Adreno crash we already patch around.

## What *does* work

- Android x86 emulator (Vulkan via SwiftShader/llvmpipe ICD): renders
  correctly *shape-wise*, but with R and B channels swapped at the
  framebuffer level (🎯T23 — unrelated).
- iOS Metal (simulator + planned device): renders correctly.
- Desktop macOS Metal: renders correctly.

So the bug is isolated to Adreno Vulkan, not to our bgfx integration in
general.

## Hypotheses to investigate (next session)

1. **Reproduce with an unmodified bgfx upstream sample.** bgfx's own
   `examples/00-helloworld` doesn't draw anything (just debug text, which
   uses an internal transient buffer path) — it might reproduce or not,
   and either outcome is informative. `01-cubes` is a full draw and should
   reproduce if the bug is bgfx-side.
   Needs Android entry-point infrastructure from bgfx (which the ge
   amalgamated build doesn't use). An easier first step is probably
   adapting `01-cubes`'s draw pattern into our existing Android harness.

2. **Enable Vulkan validation layers** and re-run. If the driver crash is
   provoked by an API misuse on bgfx's part, the validation layer should
   log a warning before the driver dereferences the null pointer. Requires
   shipping the Android validation layer `.so` files in the APK and
   setting `VK_LAYER_PATH` / `VK_INSTANCE_LAYERS` from bgfx init.

3. **Compare the barrier pattern** bgfx emits vs. known-working Vulkan
   renderers on Adreno (e.g. Godot, Filament, Wgpu). bgfx's `submit`
   function is large — the specific barrier at crash-site #2 could be
   compared against those projects.

4. **Try disabling multithreaded rendering in bgfx** (`BGFX_CONFIG_MULTITHREADED=0`
   at compile time, or pass a flag to `bgfx::init`). The crash happens on
   the render thread; if it's a threading / state-visibility issue between
   the API thread and render thread, single-threaded mode would expose or
   avoid it.

5. **Bisect bgfx history.** Our vendored bgfx is close to HEAD. The scratch
   staging buffer path (`1109f3c5b`, June 2024) is the candidate for crash
   #1. Test an older bgfx without that path to see if crash #1 disappears.
   Less obvious candidate for crash #2.

6. **Check for filed Adreno 830 issues** in bgfx, Godot, Filament, etc.
   Adreno 830 is new (Snapdragon 8 Elite Gen, 2024+). There may be public
   reports of similar Vulkan crashes.

7. **File upstream bgfx issue.** Reproduction steps, crash stacks, device
   details — everything in this document.

## Supporting material in this repo

- Reproducer app: `sample/tiltbuggy/` — already builds via `make ge/android`,
  APK at `sample/tiltbuggy/android/app/build/outputs/apk/debug/app-debug.apk`.
- Device harness: `adb -s T1AIOC662722687` (user's physical Asus device).
  Emulator (Pixel 9 Pro XL AVD, x86, emulated Vulkan) does **not** reproduce.
- Relevant source:
  - `src/BgfxContext.mm` — bgfx init for Apple/Android.
  - `sample/tiltbuggy/src/Renderer.cpp` — where the three reproductions
    above were prepared (currently reverted to the scene-aware / transient
    buffer version, which crashes on physical Android).
  - `tools/android-template/app/src/main/cpp/CMakeLists.txt.in` —
    amalgamated bgfx/bx/bimg build for Android.
- Related prior fix: `a9779c7f0` in
  `vendor/github.com/bkaradzic/bgfx/src/renderer_vk.cpp` disables Android
  timer queries to avoid a different Adreno crash (`vkCmdResetQueryPool`).
- Related unrelated issue on same platform: 🎯T23 — Android emulator R/B
  channel swap.

## Contact

- Project: `~/work/github.com/squz/ge/`
- Branch: `render-engine-bridge-split`
- Target: 🎯T24 (`bullseye_get cwd=<ge> id=T24`)
