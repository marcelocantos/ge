// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Engine-private — declarations shared between iap.cpp (dispatcher +
// StubStore) and the platform implementations (iap_apple.mm,
// iap_android.cpp). Not part of the public surface.

#pragma once

#include <ge/iap.h>

#include <memory>
#include <mutex>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

namespace ge::iap::detail {

// Internal backend interface. Platform impls subclass and provide a
// makePlatformStore() factory; the dispatcher in iap.cpp delegates
// public-API calls to whichever Store the env-var selected.
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

// Per-platform factory. Defined in iap_apple.mm on Apple,
// iap_android.cpp on Android, and src/iap.cpp (weak default) on
// desktop. Returns nullptr when the platform backend isn't available
// at runtime — the dispatcher then falls back to StubStore.
std::unique_ptr<Store> makePlatformStore();

} // namespace ge::iap::detail
