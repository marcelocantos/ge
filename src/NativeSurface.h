#pragma once
#include <dawn/dawn_proc_table.h>
#include <webgpu/webgpu.h>

// Platform-specific WebGPU surface creation from a native window handle.
// Apple: nativeHandle is CAMetalLayer*
// Android: nativeHandle is ANativeWindow*
// If procs is non-null, uses procs->instanceCreateSurface (for wire mode).
// Otherwise uses the global wgpuInstanceCreateSurface.
WGPUSurface createNativeSurface(WGPUInstance instance, void* nativeHandle,
                                const DawnProcTable* procs = nullptr);
