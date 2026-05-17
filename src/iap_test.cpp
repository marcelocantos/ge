// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <doctest.h>
#include <ge/iap.h>

#include <algorithm>

namespace iap = ge::iap;

namespace {

// Each test starts from a clean slate. The backend singleton is
// process-scoped, but testing::clearAll resets entitlement state.
// Catalogue is additive across tests, which is fine — the tests
// reference distinct IDs and don't assume an empty catalogue.
struct Reset {
    Reset() { iap::testing::clearAll(); }
};

bool listed(const std::vector<iap::LocalisedProduct>& list, const std::string& id) {
    return std::any_of(list.begin(), list.end(),
                       [&](const auto& p) { return p.id == id; });
}

} // namespace

TEST_CASE("iap: owned() is false before setCatalogue") {
    Reset r;
    CHECK_FALSE(iap::owned("never_registered"));
}

TEST_CASE("iap: setCatalogue registers products that appear in products()") {
    Reset r;
    iap::setCatalogue({
        {.id = "pro",      .type = iap::Type::NonConsumable},
        {.id = "hints_10", .type = iap::Type::Consumable},
    });

    auto list = iap::products();
    CHECK(listed(list, "pro"));
    CHECK(listed(list, "hints_10"));
}

TEST_CASE("iap: setCatalogue is idempotent for same-id same-type") {
    Reset r;
    iap::setCatalogue({{.id = "pro", .type = iap::Type::NonConsumable}});
    iap::setCatalogue({{.id = "pro", .type = iap::Type::NonConsumable}});
    // No assertion fired; products() still lists pro.
    CHECK(listed(iap::products(), "pro"));
}

TEST_CASE("iap: buy succeeds and flips owned for non-consumables") {
    Reset r;
    iap::setCatalogue({{.id = "pro", .type = iap::Type::NonConsumable}});

    iap::Result r2;
    iap::buy("pro", [&](iap::Result res) { r2 = std::move(res); });

    CHECK(r2.ok);
    CHECK(r2.id == "pro");
    CHECK(r2.error.empty());
    CHECK(iap::owned("pro"));
}

TEST_CASE("iap: consumables stay un-owned after buy (re-buyable)") {
    Reset r;
    iap::setCatalogue({{.id = "hints_10", .type = iap::Type::Consumable}});

    iap::Result r2;
    iap::buy("hints_10", [&](iap::Result res) { r2 = std::move(res); });

    CHECK(r2.ok);
    CHECK_FALSE(iap::owned("hints_10"));
}

TEST_CASE("iap: buy unknown product returns ok=false") {
    Reset r;
    iap::Result r2;
    iap::buy("never_registered_here", [&](iap::Result res) { r2 = std::move(res); });

    CHECK_FALSE(r2.ok);
    CHECK(r2.id == "never_registered_here");
    CHECK_FALSE(r2.error.empty());
}

TEST_CASE("iap: restore fires the callback with ok=true on stub") {
    Reset r;
    bool fired = false;
    iap::restore([&](iap::Result res) {
        fired = true;
        CHECK(res.ok);
    });
    CHECK(fired);
}

TEST_CASE("iap: testing::setOwned controls owned() directly") {
    Reset r;
    iap::setCatalogue({{.id = "pro", .type = iap::Type::NonConsumable}});

    CHECK_FALSE(iap::owned("pro"));
    iap::testing::setOwned("pro", true);
    CHECK(iap::owned("pro"));
    iap::testing::setOwned("pro", false);
    CHECK_FALSE(iap::owned("pro"));
}

TEST_CASE("iap: testing::clearAll wipes entitlement state") {
    Reset r;
    iap::setCatalogue({
        {.id = "pro",       .type = iap::Type::NonConsumable},
        {.id = "premium",   .type = iap::Type::NonConsumable},
    });
    iap::testing::setOwned("pro", true);
    iap::testing::setOwned("premium", true);
    CHECK(iap::owned("pro"));
    CHECK(iap::owned("premium"));

    iap::testing::clearAll();
    CHECK_FALSE(iap::owned("pro"));
    CHECK_FALSE(iap::owned("premium"));
}
