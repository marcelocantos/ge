// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// ge::iap floor: backend dispatcher + StubStore implementation.
// Platform backends (StoreKit 2 in iap_apple.mm, Play Billing in
// iap_android.cpp) will land in T65.2 and T65.3 and slot in via
// the same Store interface.

#include <ge/iap.h>

#include <spdlog/spdlog.h>

#include <cassert>
#include <cstdlib>
#include <memory>
#include <mutex>
#include <unordered_map>
#include <unordered_set>

namespace ge::iap {

namespace {

// Internal backend interface. Not exposed in the public header —
// games don't need to know about backends, and the choice is made
// once at process startup.
struct Store {
    virtual ~Store() = default;
    virtual void setCatalogue(std::vector<Product>)              = 0;
    virtual bool owned(const std::string& id) const              = 0;
    virtual std::vector<LocalisedProduct> products() const       = 0;
    virtual void buy(const std::string& id, BuyCallback)         = 0;
    virtual void restore(RestoreCallback)                        = 0;
    virtual void testingSetOwned(const std::string& id, bool)    = 0;
    virtual void testingClearAll()                               = 0;
};

// In-memory backend. CI default, debug-menu backing store,
// unit-test substrate. Threadsafe under a coarse mutex — IAP is
// not a hot path.
struct StubStore : Store {
    mutable std::mutex                              mu;
    std::unordered_map<std::string, Product>        catalogue;
    std::unordered_set<std::string>                 entitled;

    void setCatalogue(std::vector<Product> next) override {
        std::lock_guard lock(mu);
        for (const auto& p : next) {
            auto [it, inserted] = catalogue.try_emplace(p.id, p);
            // Re-registering with a different type is a programmer
            // error — fail loud in development.
            assert(inserted || it->second.type == p.type);
        }
    }

    bool owned(const std::string& id) const override {
        std::lock_guard lock(mu);
        return entitled.contains(id);
    }

    std::vector<LocalisedProduct> products() const override {
        std::lock_guard lock(mu);
        std::vector<LocalisedProduct> out;
        out.reserve(catalogue.size());
        // Synthetic prices so dev UI can render. Real prices come
        // from the platform store when T65.2 / T65.3 land.
        for (const auto& [id, p] : catalogue) {
            out.push_back({
                .id          = id,
                .title       = id,
                .description = "(stub) " + id,
                .price       = "$0.99",
                .currency    = "USD",
            });
        }
        return out;
    }

    void buy(const std::string& id, BuyCallback cb) override {
        Result r;
        {
            std::lock_guard lock(mu);
            if (catalogue.find(id) == catalogue.end()) {
                r = {.ok = false, .id = id, .error = "unknown product"};
            } else {
                // Consumables stay re-buyable; non-consumables become
                // permanently entitled. Subscriptions in StubStore
                // behave like non-consumables — no expiry simulation.
                const Product& p = catalogue.at(id);
                if (p.type != Type::Consumable) {
                    entitled.insert(id);
                }
                r = {.ok = true, .id = id, .error = {}};
            }
        }
        if (cb) cb(std::move(r));
    }

    void restore(RestoreCallback cb) override {
        // No remote store to re-query; entitlements are exactly what
        // testing::setOwned or prior buy() calls left them at.
        if (cb) cb({.ok = true, .id = {}, .error = {}});
    }

    void testingSetOwned(const std::string& id, bool yes) override {
        std::lock_guard lock(mu);
        if (yes) entitled.insert(id);
        else     entitled.erase(id);
    }

    void testingClearAll() override {
        std::lock_guard lock(mu);
        entitled.clear();
    }
};

// Single backend instance, lazily constructed on first access.
// `std::once_flag` guarantees the env-var probe + selection happens
// exactly once even under concurrent first-touch from multiple threads.
Store& store() {
    static std::unique_ptr<Store> instance;
    static std::once_flag         init;
    std::call_once(init, [] {
        const char* mode = std::getenv("GE_IAP_MODE");
        const std::string m = mode ? mode : "";
        if (m.empty() || m == "stub") {
            instance = std::make_unique<StubStore>();
        } else {
            // local / platform backends will slot in here when
            // T65.2 / T65.3 / T65.4 land. Until then, anything
            // non-stub falls back to stub with a warning.
            SPDLOG_WARN("GE_IAP_MODE={} not yet implemented; falling back to stub", m);
            instance = std::make_unique<StubStore>();
        }
    });
    return *instance;
}

} // namespace

void setCatalogue(std::vector<Product> c)                     { store().setCatalogue(std::move(c)); }
bool owned(const std::string& id)                             { return store().owned(id); }
std::vector<LocalisedProduct> products()                      { return store().products(); }
void buy(const std::string& id, BuyCallback cb)               { store().buy(id, std::move(cb)); }
void restore(RestoreCallback cb)                              { store().restore(std::move(cb)); }

namespace testing {

void setOwned(const std::string& id, bool yes) { store().testingSetOwned(id, yes); }
void clearAll()                                { store().testingClearAll(); }

} // namespace testing

// ── DebugPanel ─────────────────────────────────────────────────────

std::vector<DebugPanel::Row> DebugPanel::rows() const {
    auto list = products();
    std::vector<Row> out;
    out.reserve(list.size());
    for (const auto& p : list) {
        // Type isn't surfaced by products(), so re-derive presence via
        // owned() and leave type defaulted — the debug panel cares
        // about owned/not-owned, not consumable vs non-consumable.
        out.push_back({.id = p.id, .type = Type::NonConsumable, .owned = owned(p.id)});
    }
    return out;
}

void DebugPanel::onRowTap(const std::string& id) {
    testing::setOwned(id, !owned(id));
}

void DebugPanel::onResetAll() {
    testing::clearAll();
}

void DebugPanel::onForceRestore(RestoreCallback cb) {
    restore(std::move(cb));
}

} // namespace ge::iap
