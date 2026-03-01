#pragma once
#include <string>

namespace ge {

// Resolve a relative path to the app's resource directory.
// On iOS/Android, prepends the app bundle path (SDL_GetBasePath()).
// On desktop, prepends the binary's parent directory (project root).
std::string resource(const std::string& relativePath);

} // namespace ge
