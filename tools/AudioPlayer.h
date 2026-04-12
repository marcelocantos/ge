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

private:
    struct M;
    std::unique_ptr<M> m;
};
