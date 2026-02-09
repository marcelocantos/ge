#include "NativeSurface.h"

WGPUSurface createNativeSurface(WGPUInstance instance, void* nativeHandle,
                                const DawnProcTable* procs) {
    WGPUSurfaceSourceMetalLayer metalSource = WGPU_SURFACE_SOURCE_METAL_LAYER_INIT;
    metalSource.layer = nativeHandle;

    WGPUSurfaceDescriptor surfaceDesc{};
    surfaceDesc.nextInChain = reinterpret_cast<WGPUChainedStruct*>(&metalSource);

    if (procs) {
        return procs->instanceCreateSurface(instance, &surfaceDesc);
    }
    return wgpuInstanceCreateSurface(instance, &surfaceDesc);
}
