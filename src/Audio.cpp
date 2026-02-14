#include <sq/Audio.h>
#include <sq/Protocol.h>
#include <sq/FileIO.h>
#include <spdlog/spdlog.h>

#include <cstring>
#include <sstream>
#include <string>
#include <vector>

namespace sq {

struct Audio::M {
    struct Clip {
        std::vector<uint8_t> data;
        uint32_t format = 0; // 0 = WAV, 1 = MP3
        bool loop = false;
        float volume = 1.0f;
    };
    std::vector<Clip> clips;
    std::vector<wire::AudioCommand> pendingCommands;
};

Audio::Audio() : m(std::make_unique<M>()) {}
Audio::~Audio() = default;

int Audio::load(const char* path, LoadOptions opts) {
    auto f = sq::openFile(path, true);
    if (!f || !*f) {
        SPDLOG_ERROR("Audio: Failed to open {}", path);
        return -1;
    }

    std::ostringstream buf;
    buf << f->rdbuf();
    auto str = buf.str();

    M::Clip clip;
    clip.data.assign(str.begin(), str.end());
    clip.loop = opts.loop;
    clip.volume = opts.volume;

    // Detect format from extension
    std::string p(path);
    if (p.size() >= 4 && p.substr(p.size() - 4) == ".mp3") {
        clip.format = 1;
    } else {
        clip.format = 0;
    }

    int id = static_cast<int>(m->clips.size());
    SPDLOG_INFO("Audio: Loaded clip {} ({}, {:.1f} KB, {})",
                id, path, clip.data.size() / 1024.0,
                clip.format == 1 ? "MP3" : "WAV");
    m->clips.push_back(std::move(clip));
    return id;
}

void Audio::play(int id) {
    if (id < 0 || id >= (int)m->clips.size()) return;
    wire::AudioCommand cmd{};
    cmd.command = 0; // play
    cmd.audioId = static_cast<uint32_t>(id);
    cmd.volume = m->clips[id].volume;
    m->pendingCommands.push_back(cmd);
}

void Audio::stop(int id) {
    if (id < 0 || id >= (int)m->clips.size()) return;
    wire::AudioCommand cmd{};
    cmd.command = 1; // stop
    cmd.audioId = static_cast<uint32_t>(id);
    m->pendingCommands.push_back(cmd);
}

void Audio::setVolume(int id, float volume) {
    if (id < 0 || id >= (int)m->clips.size()) return;
    m->clips[id].volume = volume;
    wire::AudioCommand cmd{};
    cmd.command = 2; // setVolume
    cmd.audioId = static_cast<uint32_t>(id);
    cmd.volume = volume;
    m->pendingCommands.push_back(cmd);
}

int Audio::clipCount() const { return static_cast<int>(m->clips.size()); }

const uint8_t* Audio::clipData(int id) const {
    return m->clips[id].data.data();
}

size_t Audio::clipDataSize(int id) const {
    return m->clips[id].data.size();
}

uint32_t Audio::clipFormat(int id) const {
    return m->clips[id].format;
}

bool Audio::clipLoop(int id) const {
    return m->clips[id].loop;
}

std::vector<wire::AudioCommand> Audio::drainCommands() {
    return std::move(m->pendingCommands);
}

} // namespace sq
