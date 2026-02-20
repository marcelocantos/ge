#pragma once

#include <ge/Program.h>

namespace ge {

// Load a shader program from compiled vertex and fragment shader files.
// Convenience wrapper around Program::load().
inline Program loadProgram(const char* vsPath, const char* fsPath) {
    return Program::load(vsPath, fsPath);
}

} // namespace ge
