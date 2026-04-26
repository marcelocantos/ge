#pragma once

#include <cstddef>
#include <cstdint>
#include <memory>

class AudioPlayer {
public:
    AudioPlayer();
    ~AudioPlayer();

    AudioPlayer(const AudioPlayer&) = delete;
    AudioPlayer& operator=(const AudioPlayer&) = delete;

    void loadClip(uint32_t id, uint32_t format, uint32_t flags,
                  const void* data, size_t size);
    void handleCommand(uint32_t command, uint32_t id, float volume);

    // Pause/resume all audio output. Called automatically when the OS
    // backgrounds/foregrounds the app via SDL_EVENT_DID_ENTER_BACKGROUND /
    // SDL_EVENT_DID_ENTER_FOREGROUND. Game code does not need to call these.
    void pause();
    void resume();

private:
    struct M;
    std::unique_ptr<M> m;
};
