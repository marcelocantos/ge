#pragma once
#include <functional>
#include <memory>

struct SDL_Window;
union SDL_Event;

// RAII handle for an SDL event watch. Removes the watch when destroyed.
class EventWatchHandle {
public:
    EventWatchHandle() = default;
    ~EventWatchHandle();

    EventWatchHandle(EventWatchHandle&& other) noexcept;
    EventWatchHandle& operator=(EventWatchHandle&& other) noexcept;

    EventWatchHandle(const EventWatchHandle&) = delete;
    EventWatchHandle& operator=(const EventWatchHandle&) = delete;

private:
    friend class SdlContext;
    struct M;
    std::unique_ptr<M> impl_;
    explicit EventWatchHandle(std::unique_ptr<M> impl);
};

// RAII wrapper for SDL lifecycle (platform-specific initialization)
class SdlContext {
public:
    // Event filter receives SDL_Event, returns true to propagate event
    using EventFilter = std::function<bool(const SDL_Event&)>;

    SdlContext(const char* windowTitle, int width, int height);
    ~SdlContext();

    SDL_Window* window() const;

    // For WebGPU/Dawn: returns platform-native surface handle.
    // Apple: CAMetalLayer*  Android: ANativeWindow*
    void* nativeSurface() const;

    // Add event watch called during modal event loops (e.g., resize on macOS).
    // Use this to render during live window resize.
    // Returns RAII handle that removes the watch when destroyed.
    [[nodiscard]] EventWatchHandle addEventWatch(EventFilter filter);

private:
    struct M;
    std::unique_ptr<M> m;
};
