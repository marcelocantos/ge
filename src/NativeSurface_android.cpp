#include "NativeSurface.h"

WGPUSurface createNativeSurface(WGPUInstance instance, void* nativeHandle,
                                const DawnProcTable* procs) {
    WGPUSurfaceSourceAndroidNativeWindow androidSource =
        WGPU_SURFACE_SOURCE_ANDROID_NATIVE_WINDOW_INIT;
    androidSource.window = nativeHandle;

    WGPUSurfaceDescriptor surfaceDesc{};
    surfaceDesc.nextInChain = reinterpret_cast<WGPUChainedStruct*>(&androidSource);

    if (procs) {
        return procs->instanceCreateSurface(instance, &surfaceDesc);
    }
    return wgpuInstanceCreateSurface(instance, &surfaceDesc);
}
