#pragma once

#include <sqlite3.h>
#include <nlohmann/json.hpp>

#include <atomic>
#include <cstring>
#include <memory>
#include <sstream>
#include <string>
#include <vector>

namespace tweak {

enum class Scale { Linear, Log };

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

    void resetToDefault() override {
        set(defaultVal);
    }

private:
    std::shared_ptr<const T> ptr_;
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
    // Reset in-memory value to default
    for (auto* tw : TweakBase::all()) {
        if (std::strcmp(tw->name, name) == 0) {
            tw->resetToDefault();
            break;
        }
    }
    // Clear persisted override
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
    // Reset all in-memory values to defaults
    for (auto* tw : TweakBase::all()) {
        tw->resetToDefault();
    }
    // Clear persisted overrides
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
        os << "{\"name\":\"" << tw->name << "\",\"value\":" << tw->toJson() << '}';
    }
    os << ']';
    return os.str();
}

inline bool parseAndApply(const std::string& body) {
    auto namePos = body.find("\"name\"");
    if (namePos == std::string::npos) return false;
    auto nameStart = body.find('"', namePos + 6) + 1;
    auto nameEnd = body.find('"', nameStart);
    if (nameEnd == std::string::npos) return false;
    std::string name = body.substr(nameStart, nameEnd - nameStart);

    auto valPos = body.find("\"value\"");
    if (valPos == std::string::npos) return false;
    auto colonPos = body.find(':', valPos + 7);
    if (colonPos == std::string::npos) return false;
    // Extract everything after "value": up to the next } or end
    auto valEnd = body.find('}', colonPos);
    std::string valStr = body.substr(colonPos + 1, valEnd - colonPos - 1);

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
