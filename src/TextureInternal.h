#pragma once
// Internal header - only for sq/ implementation files

#include "Texture.h"
#include "BgfxResource.h"

struct Texture::M {
    TextureHandle handle;
    int width = 0;
    int height = 0;
};
