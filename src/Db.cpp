// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/Db.h>

#include <sqldeep.h>
#include <sqlpipe.h>
#include <sqlite3.h>
#include <spdlog/spdlog.h>

#include <set>
#include <stdexcept>
#include <unordered_map>

namespace ge {

// ── Db::M ──────────────────────────────────────────────────────

struct Db::M {
    sqlite3* db;
    sqlpipe::QueryWatch watch;

    // Tables modified since the last notification sweep.
    std::set<std::string> dirtyTables;

    // Subscription callbacks keyed by sqlpipe SubscriptionId.
    std::unordered_map<sqlpipe::SubscriptionId,
                       std::function<void(const QueryResult&)>> callbacks;

    explicit M(sqlite3* handle) : db(handle), watch(handle) {
        // Track which tables are modified by any write.
        sqlite3_update_hook(db, updateHook, this);
    }

    ~M() {
        sqlite3_update_hook(db, nullptr, nullptr);
        sqlite3_close(db);
    }

    /// Flush dirty tables through QueryWatch, fire callbacks.
    void notifySubscribers() {
        if (dirtyTables.empty() || callbacks.empty()) {
            dirtyTables.clear();
            return;
        }
        auto results = watch.notify(dirtyTables);
        dirtyTables.clear();
        for (auto& qr : results) {
            auto it = callbacks.find(qr.id);
            if (it != callbacks.end()) {
                it->second(convert(qr));
            }
        }
    }

    static QueryResult convert(const sqlpipe::QueryResult& src) {
        QueryResult dst;
        dst.columns = src.columns;
        dst.rows.reserve(src.rows.size());
        for (auto& row : src.rows) {
            std::vector<Value> dstRow;
            dstRow.reserve(row.size());
            for (auto& v : row) {
                std::visit([&](auto&& val) {
                    using T = std::decay_t<decltype(val)>;
                    if constexpr (std::is_same_v<T, std::monostate>)
                        dstRow.emplace_back(std::monostate{});
                    else
                        dstRow.emplace_back(val);
                }, v);
            }
            dst.rows.push_back(std::move(dstRow));
        }
        return dst;
    }

    static void updateHook(void* ctx, int /*op*/,
                           const char* /*dbName*/, const char* table,
                           sqlite3_int64 /*rowid*/) {
        static_cast<M*>(ctx)->dirtyTables.insert(table);
    }
};

Db::Db(sqlite3* handle) : m(std::make_shared<M>(handle)) {}

sqlite3* Db::handle() const { return m->db; }

Stmt Db::prepare(std::string_view sql) {
    Stmt s;
    s.m = std::make_shared<Stmt::M>(m, std::string(sql));
    return s;
}

// ── Stmt::M ────────────────────────────────────────────────────

struct Stmt::M {
    std::shared_ptr<Db::M> db;
    std::string sql;

    M(std::shared_ptr<Db::M> db_, std::string sql_)
        : db(std::move(db_)), sql(std::move(sql_)) {}

    /// Run sqldeep transpilation. Returns the original SQL unchanged
    /// if sqldeep reports a parse error (plain SQL passthrough).
    std::string transpile() const {
        char* err_msg = nullptr;
        int err_line = 0, err_col = 0;
        char* result = sqldeep_transpile(sql.c_str(),
                                         &err_msg, &err_line, &err_col);
        if (!result) {
            // Plain SQL that sqldeep can't parse — use as-is.
            if (err_msg) sqldeep_free(err_msg);
            return sql;
        }
        std::string out(result);
        sqldeep_free(result);
        return out;
    }
};

void Stmt::exec() {
    char* err = nullptr;
    int rc = sqlite3_exec(m->db->db, m->sql.c_str(),
                          nullptr, nullptr, &err);
    if (rc != SQLITE_OK) {
        std::string msg = err ? err : "unknown error";
        sqlite3_free(err);
        throw std::runtime_error("Stmt::exec: " + msg);
    }
    m->db->notifySubscribers();
}

QueryResult Stmt::query() {
    auto transformed = m->transpile();

    sqlite3_stmt* stmt = nullptr;
    int rc = sqlite3_prepare_v2(m->db->db, transformed.c_str(),
                                -1, &stmt, nullptr);
    if (rc != SQLITE_OK) {
        throw std::runtime_error(
            std::string("Stmt::query prepare: ") +
            sqlite3_errmsg(m->db->db));
    }

    QueryResult result;
    int ncols = sqlite3_column_count(stmt);
    result.columns.reserve(ncols);
    for (int i = 0; i < ncols; ++i)
        result.columns.emplace_back(sqlite3_column_name(stmt, i));

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        std::vector<Value> row;
        row.reserve(ncols);
        for (int i = 0; i < ncols; ++i) {
            switch (sqlite3_column_type(stmt, i)) {
            case SQLITE_INTEGER:
                row.emplace_back(sqlite3_column_int64(stmt, i));
                break;
            case SQLITE_FLOAT:
                row.emplace_back(sqlite3_column_double(stmt, i));
                break;
            case SQLITE_TEXT:
                row.emplace_back(std::string(
                    reinterpret_cast<const char*>(
                        sqlite3_column_text(stmt, i))));
                break;
            case SQLITE_BLOB: {
                auto* data = static_cast<const uint8_t*>(
                    sqlite3_column_blob(stmt, i));
                int len = sqlite3_column_bytes(stmt, i);
                row.emplace_back(
                    std::vector<uint8_t>(data, data + len));
                break;
            }
            default:
                row.emplace_back(std::monostate{});
                break;
            }
        }
        result.rows.push_back(std::move(row));
    }
    sqlite3_finalize(stmt);
    return result;
}

// ── Subscription::M ────────────────────────────────────────────

struct Subscription::M {
    std::shared_ptr<Db::M> db;
    sqlpipe::SubscriptionId id;

    ~M() {
        db->watch.unsubscribe(id);
        db->callbacks.erase(id);
    }
};

Subscription Stmt::subscribe(
        std::function<void(const QueryResult&)> callback) {
    auto transformed = m->transpile();
    auto id = m->db->watch.subscribe(transformed);
    m->db->callbacks[id] = std::move(callback);

    Subscription sub;
    sub.m = std::make_shared<Subscription::M>(
        Subscription::M{m->db, id});
    return sub;
}

} // namespace ge
