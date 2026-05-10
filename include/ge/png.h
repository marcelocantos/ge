// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#pragma once

#include <ge/sprite.h>

#include <string>

namespace ge {

// Load a PNG / JPEG / BMP / etc. image from a path and upload it as a
// `Sprite`. Path is resolved via `ge::resource` so iOS bundle and Android
// APK assets work uniformly.
//
// The image is converted to RGBA8 with premultiplied alpha before upload
// (SDL_image does not premultiply by default; ge's render pipeline
// expects premultiplied).
//
// On failure (file missing, unsupported format, OOM), returns a null
// `Sprite` and logs the error via `spdlog::error`. `bgfx` must be
// initialized before calling.
Sprite loadImage(const std::string& path);

} // namespace ge
