#pragma once

#include <linalg.h>
#include <sqlite3.h>
#include <nlohmann/json.hpp>

#include <atomic>
#include <cstring>
#include <memory>
#include <sstream>
#include <string>
#include <vector>

// ─── JSON for linalg types (must be in linalg namespace for ADL) ─────

namespace linalg {

inline void to_json(nlohmann::json& j, const vec<float,2>& v) { j = {v.x, v.y}; }
inline void from_json(const nlohmann::json& j, vec<float,2>& v) { v.x = j[0]; v.y = j[1]; }

inline void to_json(nlohmann::json& j, const vec<float,4>& v) { j = {v.x, v.y, v.z, v.w}; }
inline void from_json(const nlohmann::json& j, vec<float,4>& v) {
    v.x = j[0]; v.y = j[1]; v.z = j[2];
    v.w = j.size() > 3 ? j[3].get<float>() : 1.0f;
}

} // namespace linalg

namespace tweak {

enum class Scale { Linear, Log };

using float2 = linalg::vec<float, 2>;
using float4 = linalg::vec<float, 4>;

// Alias for color tweaks (RGBA).
using Color = float4;

// Alias for color tweaks (RGBA).
using Color = float4;

// Global generation counter — incremented on every set() call.
inline std::atomic<uint64_t>& generation() {
    static std::atomic<uint64_t> g{0};
    return g;
}

// SQLite handle for persistence.
inline sqlite3*& db() {
    static sqlite3* d = nullptr;
    return d;
}

// ─── Type-erased base ─────────────────────────────────────────────────

struct TweakBase {
    const char* name;
    TweakBase(const char* n) : name(n) { all().push_back(this); }
    virtual ~TweakBase() = default;
    virtual void loadJson(const std::string& json) = 0;
    virtual std::string toJson() const = 0;
    virtual std::string defaultJson() const = 0;
    virtual std::string metadataJson() const = 0;
    virtual void resetToDefault() = 0;

    static std::vector<TweakBase*>& all() {
        static std::vector<TweakBase*> r;
        return r;
    }
};

// ─── Tweak<T> ─────────────────────────────────────────────────────────

template<typename T>
struct Tweak : TweakBase {
    T defaultVal;
    Scale scale;
    float speed;

    Tweak(const char* name, T def = T{}, Scale s = Scale::Linear, float spd = 1.0f)
        : TweakBase(name), defaultVal(std::move(def)), scale(s), speed(spd),
          ptr_(std::make_shared<const T>(defaultVal)) {}

    T get() const { return *std::atomic_load(&ptr_); }
    operator T() const { return get(); }

    void set(T v) {
        std::atomic_store(&ptr_, std::make_shared<const T>(std::move(v)));
        generation().fetch_add(1, std::memory_order_relaxed);
    }

    void loadJson(const std::string& json) override {
        set(nlohmann::json::parse(json).get<T>());
    }

    std::string toJson() const override {
        return nlohmann::json(get()).dump();
    }

    std::string defaultJson() const override {
        return nlohmann::json(defaultVal).dump();
    }

    std::string metadataJson() const override {
        std::ostringstream os;
        os << "\"scale\":\"" << (scale == Scale::Log ? "log" : "linear") << "\""
           << ",\"speed\":" << speed;
        return os.str();
    }

    void resetToDefault() override {
        set(defaultVal);
    }

private:
    std::shared_ptr<const T> ptr_;
};

// ─── EnumTweak ────────────────────────────────────────────────────────

struct EnumTweak : Tweak<int> {
    std::vector<std::string> labels;

    EnumTweak(const char* name, int def, std::vector<std::string> lbls)
        : Tweak<int>(name, def), labels(std::move(lbls)) {}

    // Update labels after construction (e.g. from config file).
    // Bumps generation so the dashboard picks up the new metadata.
    void setLabels(std::vector<std::string> lbls) {
        labels = std::move(lbls);
        generation().fetch_add(1, std::memory_order_relaxed);
    }

    std::string metadataJson() const override {
        std::ostringstream os;
        os << "\"type\":\"enum\",\"labels\":" << nlohmann::json(labels).dump();
        return os.str();
    }
};

// ─── AxisTweak ────────────────────────────────────────────────────────

// A scalar tweak with a screen-space drag axis.
// The axis encodes both direction and sensitivity:
//   direction = normalize(axis)  — which way to drag to increase the value
//   sensitivity = 1 / length(axis) — longer axis = slower change
// Examples: {1,0} = drag right, normal speed. {0,-1} = drag up, normal speed.
//           {0,-5} = drag up, 5x slower. {3,4} = drag toward lower-right, 5x slower.
struct AxisTweak : Tweak<float> {
    float2 axis;

    AxisTweak(const char* name, float def, float2 ax, Scale s = Scale::Linear)
        : Tweak<float>(name, def, s, 1.0f), axis(ax) {}

    std::string metadataJson() const override {
        std::ostringstream os;
        os << "\"type\":\"axis\""
           << ",\"scale\":\"" << (scale == Scale::Log ? "log" : "linear") << "\""
           << ",\"axis\":[" << axis.x << "," << axis.y << "]";
        return os.str();
    }
};

// ─── Vec2Tweak ────────────────────────────────────────────────────────

// Screen direction that increases a component's value.
enum class Dir { Right, Left, Up, Down };

struct Vec2Tweak : Tweak<float2> {
    Dir xDir, yDir;

    Vec2Tweak(const char* name, float2 def, Dir xd = Dir::Right, Dir yd = Dir::Down,
              float spd = 1.0f)
        : Tweak<float2>(name, def, Scale::Linear, spd), xDir(xd), yDir(yd) {}

    std::string metadataJson() const override {
        auto dirStr = [](Dir d) {
            switch (d) {
                case Dir::Right: return "right";
                case Dir::Left:  return "left";
                case Dir::Up:    return "up";
                case Dir::Down:  return "down";
            }
            return "right";
        };
        std::ostringstream os;
        os << "\"type\":\"vec2\",\"speed\":" << speed
           << ",\"xDir\":\"" << dirStr(xDir) << "\""
           << ",\"yDir\":\"" << dirStr(yDir) << "\"";
        return os.str();
    }
};

// ─── Database ─────────────────────────────────────────────────────────

inline void loadOverrides(const char* path) {
    if (sqlite3_open(path, &db()) != SQLITE_OK) {
        db() = nullptr;
        return;
    }
    sqlite3_exec(db(),
        "CREATE TABLE IF NOT EXISTS tweaks (name TEXT PRIMARY KEY, json TEXT NOT NULL)",
        nullptr, nullptr, nullptr);

    sqlite3_stmt* stmt = nullptr;
    if (sqlite3_prepare_v2(db(), "SELECT name, json FROM tweaks",
                           -1, &stmt, nullptr) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            auto* n = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 0));
            auto* j = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 1));
            if (!n || !j) continue;
            for (auto* tw : TweakBase::all()) {
                if (std::strcmp(tw->name, n) == 0) {
                    try { tw->loadJson(j); } catch (...) {}
                    break;
                }
            }
        }
        sqlite3_finalize(stmt);
    }
}

inline void save(const char* name, const std::string& json) {
    if (!db()) return;
    sqlite3_stmt* stmt = nullptr;
    if (sqlite3_prepare_v2(db(),
            "INSERT INTO tweaks (name, json) VALUES (?, ?) "
            "ON CONFLICT(name) DO UPDATE SET json = excluded.json",
            -1, &stmt, nullptr) == SQLITE_OK) {
        sqlite3_bind_text(stmt, 1, name, -1, SQLITE_STATIC);
        sqlite3_bind_text(stmt, 2, json.c_str(), -1, SQLITE_STATIC);
        sqlite3_step(stmt);
        sqlite3_finalize(stmt);
    }
}

template<typename T>
void save(Tweak<T>& tw) {
    save(tw.name, tw.toJson());
}

inline void resetOne(const char* name) {
    for (auto* tw : TweakBase::all()) {
        if (std::strcmp(tw->name, name) == 0) {
            tw->resetToDefault();
            break;
        }
    }
    if (!db()) return;
    sqlite3_stmt* stmt = nullptr;
    if (sqlite3_prepare_v2(db(), "DELETE FROM tweaks WHERE name = ?",
            -1, &stmt, nullptr) == SQLITE_OK) {
        sqlite3_bind_text(stmt, 1, name, -1, SQLITE_STATIC);
        sqlite3_step(stmt);
        sqlite3_finalize(stmt);
    }
}

inline void resetAll() {
    for (auto* tw : TweakBase::all()) {
        tw->resetToDefault();
    }
    if (!db()) return;
    sqlite3_exec(db(), "DELETE FROM tweaks", nullptr, nullptr, nullptr);
}

// ─── JSON API ─────────────────────────────────────────────────────────

inline std::string allToJson() {
    std::ostringstream os;
    os << '[';
    bool first = true;
    for (const auto* tw : TweakBase::all()) {
        if (!first) os << ',';
        first = false;
        os << "{\"name\":\"" << tw->name
           << "\",\"value\":" << tw->toJson()
           << ",\"default\":" << tw->defaultJson()
           << "," << tw->metadataJson()
           << '}';
    }
    os << ']';
    return os.str();
}

inline bool parseAndApply(const std::string& body) {
    auto doc = nlohmann::json::parse(body, nullptr, false);
    if (doc.is_discarded() || !doc.contains("name") || !doc.contains("value"))
        return false;

    std::string name = doc["name"];
    std::string valStr = doc["value"].dump();

    for (auto* tw : TweakBase::all()) {
        if (name == tw->name) {
            try {
                tw->loadJson(valStr);
                save(name.c_str(), tw->toJson());
            } catch (...) { return false; }
            return true;
        }
    }
    return false;
}

inline void parseAndReset(const std::string& body) {
    if (body.find("\"all\"") != std::string::npos) {
        resetAll();
        return;
    }
    auto namePos = body.find("\"name\"");
    if (namePos == std::string::npos) return;
    auto nameStart = body.find('"', namePos + 6) + 1;
    auto nameEnd = body.find('"', nameStart);
    if (nameEnd == std::string::npos) return;
    resetOne(body.substr(nameStart, nameEnd - nameStart).c_str());
}

} // namespace tweak
