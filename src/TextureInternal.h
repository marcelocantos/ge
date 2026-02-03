#pragma once
// Internal header - only for sq/ implementation files

#include <sq/Texture.h>
#include <sq/GpuResource.h>

struct Texture::M {
    TextureHandle handle;
    int width = 0;
    int height = 0;
};
