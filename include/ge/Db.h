// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Game database interface. The engine provides a Db via Context; the game
// prepares statements and subscribes to query results without knowing
// whether the backing store is a local file or a replicated :memory: DB.
#pragma once

#include <cstdint>
#include <functional>
#include <memory>
#include <string>
#include <string_view>
#include <variant>
#include <vector>

struct sqlite3;

namespace ge {

/// Column value — mirrors SQLite's type system.
using Value = std::variant<
    std::monostate,             // NULL
    std::int64_t,               // INTEGER
    double,                     // REAL
    std::string,                // TEXT
    std::vector<std::uint8_t>   // BLOB
>;

/// Result set returned by Stmt::query() and delivered to subscriptions.
struct QueryResult {
    std::vector<std::string>              columns;
    std::vector<std::vector<Value>>       rows;
};

/// RAII query subscription. Unsubscribes when the last copy is destroyed.
class Subscription {
public:
    Subscription() = default;

private:
    struct M;
    std::shared_ptr<M> m;
    friend class Stmt;
};

/// Prepared statement. exec() runs plain SQL; query() and subscribe()
/// transform the SQL through sqldeep before execution.
class Stmt {
public:
    /// Execute the statement (plain SQL, no sqldeep transformation).
    void exec();

    /// Execute the statement as a query (sqldeep-transformed) and return
    /// the full result set.
    QueryResult query();

    /// Subscribe to the query (sqldeep-transformed). The callback fires
    /// whenever the result set changes due to a write on this Db.
    /// Returns an RAII Subscription whose destructor unsubscribes.
    Subscription subscribe(std::function<void(const QueryResult&)> callback);

private:
    struct M;
    std::shared_ptr<M> m;
    friend class Db;
};

/// Game database. Wraps a sqlite3 handle with query subscriptions
/// (via sqlpipe QueryWatch) and sqldeep query transformation.
/// Cheaply copyable (shared_ptr internals).
class Db {
public:
    Db() = default;

    /// Prepare a statement. The SQL may use sqldeep syntax for query()
    /// and subscribe(), or plain SQL for exec().
    Stmt prepare(std::string_view sql);

    /// Raw handle — temporary bridge for legacy code (GameDb) that uses
    /// sqlite3 prepared statements directly. Will be removed once all
    /// game queries migrate to Stmt.
    sqlite3* handle() const;

    /// True if this Db wraps a live database.
    explicit operator bool() const { return m != nullptr; }

private:
    struct M;
    std::shared_ptr<M> m;

    // Engine constructs Db with a raw handle.
    explicit Db(sqlite3* handle);
    friend class Context;
    friend class Stmt;
    friend class Subscription;
};

} // namespace ge
