#pragma once

#include <sqlite3.h>

#include <atomic>
#include <cstring>
#include <sstream>
#include <string>
#include <vector>

namespace tweak {

enum class Scale { Linear, Log };

struct Float;

// Singleton registry of all tweak variables (populated by Float constructors).
inline std::vector<Float*>& registry() {
    static std::vector<Float*> r;
    return r;
}

// Global generation counter — incremented on every set() call.
// Consumers can check this to know when tunable values have changed.
inline std::atomic<uint64_t>& generation() {
    static std::atomic<uint64_t> g{0};
    return g;
}

// SQLite handle for persistence (null until loadOverrides is called).
inline sqlite3*& db() {
    static sqlite3* d = nullptr;
    return d;
}

struct Float {
    const char* name;
    std::atomic<float> value;
    float defaultVal;
    Scale scale;
    float speed;

    Float(const char* name, float def, Scale s, float spd = 1.0f)
        : name(name), value(def), defaultVal(def), scale(s), speed(spd) {
        registry().push_back(this);
    }

    operator float() const { return value.load(std::memory_order_relaxed); }

    void set(float v) {
        value.store(v, std::memory_order_relaxed);
        generation().fetch_add(1, std::memory_order_relaxed);
    }
};

// Open (or create) the tweaks database and apply saved overrides.
inline void loadOverrides(const char* path) {
    if (sqlite3_open(path, &db()) != SQLITE_OK) {
        db() = nullptr;
        return;
    }
    sqlite3_exec(db(),
        "CREATE TABLE IF NOT EXISTS tweaks (name TEXT PRIMARY KEY, value REAL)",
        nullptr, nullptr, nullptr);

    sqlite3_stmt* stmt = nullptr;
    if (sqlite3_prepare_v2(db(), "SELECT name, value FROM tweaks", -1, &stmt, nullptr) == SQLITE_OK) {
        while (sqlite3_step(stmt) == SQLITE_ROW) {
            auto* n = reinterpret_cast<const char*>(sqlite3_column_text(stmt, 0));
            double v = sqlite3_column_double(stmt, 1);
            for (auto* tw : registry()) {
                if (std::strcmp(tw->name, n) == 0) {
                    tw->value.store(static_cast<float>(v), std::memory_order_relaxed);
                    break;
                }
            }
        }
        sqlite3_finalize(stmt);
    }
}

// Persist a single tweak value to the database.
inline void save(const char* name, float value) {
    if (!db()) return;
    sqlite3_stmt* stmt = nullptr;
    if (sqlite3_prepare_v2(db(),
            "INSERT INTO tweaks (name, value) VALUES (?, ?) "
            "ON CONFLICT(name) DO UPDATE SET value = excluded.value",
            -1, &stmt, nullptr) == SQLITE_OK) {
        sqlite3_bind_text(stmt, 1, name, -1, SQLITE_STATIC);
        sqlite3_bind_double(stmt, 2, value);
        sqlite3_step(stmt);
        sqlite3_finalize(stmt);
    }
}

// Reset one tweak to its compiled default and remove from database.
inline void resetOne(const char* name) {
    for (auto* tw : registry()) {
        if (std::strcmp(tw->name, name) == 0) {
            tw->set(tw->defaultVal);
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

// Reset all tweaks to compiled defaults and clear the database.
inline void resetAll() {
    for (auto* tw : registry()) {
        tw->set(tw->defaultVal);
    }
    if (!db()) return;
    sqlite3_exec(db(), "DELETE FROM tweaks", nullptr, nullptr, nullptr);
}

// Serialize all tweaks to JSON.
inline std::string toJson() {
    std::ostringstream os;
    os << '[';
    bool first = true;
    for (const auto* tw : registry()) {
        if (!first) os << ',';
        first = false;
        os << "{\"name\":\"" << tw->name << '"'
           << ",\"value\":" << tw->value.load(std::memory_order_relaxed)
           << ",\"default\":" << tw->defaultVal
           << ",\"scale\":\"" << (tw->scale == Scale::Log ? "log" : "linear") << '"'
           << ",\"speed\":" << tw->speed
           << '}';
    }
    os << ']';
    return os.str();
}

// Minimal JSON parsing: find "name":"X" and "value":Y pairs.
// Expects body like: {"name":"WallRestitution","value":0.5}
inline bool parseAndApply(const std::string& body) {
    // Find "name":"..."
    auto namePos = body.find("\"name\"");
    if (namePos == std::string::npos) return false;
    auto nameStart = body.find('"', namePos + 6);
    if (nameStart == std::string::npos) return false;
    nameStart++;
    auto nameEnd = body.find('"', nameStart);
    if (nameEnd == std::string::npos) return false;
    std::string name = body.substr(nameStart, nameEnd - nameStart);

    // Find "value":number
    auto valPos = body.find("\"value\"");
    if (valPos == std::string::npos) return false;
    auto colonPos = body.find(':', valPos + 7);
    if (colonPos == std::string::npos) return false;
    float val = std::stof(body.substr(colonPos + 1));

    for (auto* tw : registry()) {
        if (name == tw->name) {
            tw->set(val);
            save(tw->name, val);
            return true;
        }
    }
    return false;
}

// Parse reset request body.
// {"name":"X"} resets one, {"all":true} resets all.
inline void parseAndReset(const std::string& body) {
    if (body.find("\"all\"") != std::string::npos) {
        resetAll();
        return;
    }
    auto namePos = body.find("\"name\"");
    if (namePos == std::string::npos) return;
    auto nameStart = body.find('"', namePos + 6);
    if (nameStart == std::string::npos) return;
    nameStart++;
    auto nameEnd = body.find('"', nameStart);
    if (nameEnd == std::string::npos) return;
    std::string name = body.substr(nameStart, nameEnd - nameStart);
    resetOne(name.c_str());
}

} // namespace tweak
