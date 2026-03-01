#include <ge/Resource.h>
#include <SDL3/SDL.h>
#if defined(__APPLE__)
#include <TargetConditionals.h>
#endif

namespace ge {

std::string resource(const std::string& relativePath) {
    // Already absolute — return unchanged.
    if (!relativePath.empty() && relativePath[0] == '/') {
        return relativePath;
    }

    static const std::string base = [] {
        auto p = SDL_GetBasePath();
        if (!p) return std::string();
        std::string dir(p);
#if (defined(__APPLE__) && TARGET_OS_IOS) || defined(__ANDROID__)
        // SDL_GetBasePath() returns the app bundle Resources/ directory.
        return dir;
#else
        // SDL_GetBasePath() returns the binary's directory, e.g. "/path/to/bin/".
        // Go up one level to the project root (convention: binary lives in bin/).
        if (dir.size() > 1 && dir.back() == '/') dir.pop_back();
        auto pos = dir.rfind('/');
        return pos != std::string::npos ? dir.substr(0, pos + 1) : std::string();
#endif
    }();

    return base + relativePath;
}

} // namespace ge
