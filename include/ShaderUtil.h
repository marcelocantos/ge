#pragma once

#include "BgfxResource.h"

namespace sq {

// Load a shader program from compiled vertex and fragment shader files.
ProgramHandle loadProgram(const char* vsPath, const char* fsPath);

} // namespace sq
