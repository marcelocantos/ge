// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <string>

namespace ge {

// A reference to a font file suitable for TTF_OpenFont /
// TTF_OpenFontIndex / stb_truetype etc.
struct FontRef {
    std::string path;       // Absolute file path
    int faceIndex = 0;      // For .ttc collections; 0 for single-face .ttf
};

// Resolve a font URI to a FontRef.
//
// Supported schemes:
//   "system:<name>"   System-provided font by logical name. Standard
//                     names: sans-serif, sans-serif-bold, serif,
//                     serif-bold, monospace, monospace-bold.
//   "file:<path>"     Explicit absolute file path.
//   "<path>"          Relative path, resolved via ge::resource().
//
// Returns an empty FontRef (empty path) if the font can't be resolved.
FontRef resolveFont(const std::string& uri);

} // namespace ge
