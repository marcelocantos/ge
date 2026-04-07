// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/Db.h>

namespace ge {

struct Db::M {
    sqlpipe::Database db;
    M(const std::string& path) : db(path) {}
};

Db::Db(const std::string& path) : m(std::make_shared<M>(path)) {}

void Db::exec(const std::string& sql) { m->db.exec(sql); }

QueryResult Db::query(const std::string& sql) const {
    return m->db.query(sql);
}

Subscription Db::subscribe(const std::string& sql, SubscriptionCallback cb) {
    return m->db.subscribe(sql, std::move(cb));
}

void Db::notify() { m->db.notify(); }

void Db::notify(const std::set<std::string>& tables) {
    m->db.notify(tables);
}

sqlite3* Db::handle() const { return m->db.handle(); }

} // namespace ge
