#include <sq/Resource.h>
#include <SDL3/SDL.h>
#if defined(__APPLE__)
#include <TargetConditionals.h>
#endif

namespace sq {

std::string resource(const std::string& relativePath) {
#if (defined(__APPLE__) && TARGET_OS_IOS) || defined(__ANDROID__)
    // Already absolute — don't prepend base path again
    if (!relativePath.empty() && relativePath[0] == '/') {
        return relativePath;
    }
    static const std::string base = [] {
        auto p = SDL_GetBasePath();
        return p ? std::string(p) : std::string();
    }();
    return base + relativePath;
#else
    return relativePath;
#endif
}

} // namespace sq
