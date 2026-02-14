#pragma once

#include <cstddef>
#include <cstdint>
#include <memory>
#include <vector>

namespace wire { struct AudioCommand; }

namespace sq {

class Audio {
public:
    Audio();
    ~Audio();

    Audio(const Audio&) = delete;
    Audio& operator=(const Audio&) = delete;

    struct LoadOptions {
        bool loop = false;
        float volume = 1.0f;
    };

    // Load an audio file (WAV or MP3). Returns a 0-based clip ID.
    int load(const char* path, LoadOptions opts);

    // Playback control (sends commands to player over wire).
    void play(int id);
    void stop(int id);
    void setVolume(int id, float volume);

    // --- Internal accessors for WireSession ---
    int clipCount() const;
    const uint8_t* clipData(int id) const;
    size_t clipDataSize(int id) const;
    uint32_t clipFormat(int id) const;
    bool clipLoop(int id) const;
    std::vector<wire::AudioCommand> drainCommands();

private:
    struct M;
    std::unique_ptr<M> m;
};

} // namespace sq
