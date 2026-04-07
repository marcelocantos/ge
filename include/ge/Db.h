// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Game database interface. The engine provides a Db via Context; the game
// prepares statements and subscribes to query results without knowing
// whether the backing store is a local file or a replicated :memory: DB.
//
// Thin wrapper around sqlpipe::Database — adds the engine ownership
// model (Context creates, game consumes) and shared_ptr semantics.
#pragma once

#include <sqlpipe.h>

#include <memory>
#include <string>

struct sqlite3;

namespace ge {

// Re-export sqlpipe types used by the game layer.
using Value = sqlpipe::Value;
using QueryResult = sqlpipe::QueryResult;
using SubscriptionCallback = sqlpipe::SubscriptionCallback;

/// RAII query subscription. Unsubscribes when destroyed.
using Subscription = sqlpipe::Subscription;

/// Game database. Wraps sqlpipe::Database with shared_ptr semantics
/// so it can be cheaply copied into lambdas and shared across systems.
class Db {
public:
    Db() = default;

    /// Execute DDL/DML SQL (sqldeep-transformed). Fires subscriptions
    /// if data changes.
    void exec(const std::string& sql);

    /// Execute a query (sqldeep-transformed) and return the result set.
    QueryResult query(const std::string& sql) const;

    /// Subscribe to a query (sqldeep-transformed). The callback fires
    /// whenever the result set changes. Fires once immediately with
    /// the initial result. Returns an RAII Subscription.
    Subscription subscribe(const std::string& sql, SubscriptionCallback cb);

    /// Fire subscriptions after external writes (e.g. sqlpipe replication).
    void notify();
    void notify(const std::set<std::string>& affected_tables);

    /// Raw handle — temporary bridge for legacy code (GameDb) that uses
    /// sqlite3 prepared statements directly. Will be removed once all
    /// game queries migrate to exec/query/subscribe.
    sqlite3* handle() const;

    /// True if this Db wraps a live database.
    explicit operator bool() const { return m != nullptr; }

private:
    struct M;
    std::shared_ptr<M> m;

    // Engine constructs Db with a path (":memory:" or file path).
    explicit Db(const std::string& path);
    friend class Context;
};

} // namespace ge
