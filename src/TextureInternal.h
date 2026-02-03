#pragma once
// Internal header - only for sq/ implementation files

#include <sq/Texture.h>
#include <sq/BgfxResource.h>

struct Texture::M {
    TextureHandle handle;
    int width = 0;
    int height = 0;
};
