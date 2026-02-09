#pragma once
#include <string>

namespace sq {

// Resolve a relative path to the app's resource directory.
// On iOS/Android, returns SDL_GetBasePath() + relativePath.
// On desktop, returns the path unchanged.
std::string resource(const std::string& relativePath);

} // namespace sq
