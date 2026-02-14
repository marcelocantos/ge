// spdlog sink that broadcasts log messages to WebSocket clients.
// Each connected client on /ws/logs receives JSON messages:
//   {"ts":"2026-02-11T12:34:56.789","level":"info","msg":"..."}
// New clients receive a replay of recent messages on connect.
#pragma once

#include "../sq/src/HttpServer.h"
#include <spdlog/sinks/base_sink.h>
#include <spdlog/details/synchronous_factory.h>

#include <chrono>
#include <ctime>
#include <deque>
#include <iomanip>
#include <mutex>
#include <sstream>
#include <vector>

class DashboardSink : public spdlog::sinks::base_sink<std::mutex> {
public:
    // Register as a WebSocket handler for /ws/logs on the given HttpServer.
    sq::WsAcceptHandler handler() {
        return [this](std::shared_ptr<sq::WsConnection> conn) {
            // Cap blocking writes at 2s so a stale client can't block logging
            conn->setSendTimeout(2000);
            std::lock_guard lock(clientsMtx_);
            // Replay buffered messages to the new client
            for (auto& msg : history_) {
                conn->sendText(msg);
            }
            clients_.push_back(std::move(conn));
        };
    }

    // Probe all clients for disconnect (EOF detection) and return the number
    // of live clients remaining. Dead clients are pruned.
    size_t checkClients() {
        std::lock_guard lock(clientsMtx_);
        auto it = clients_.begin();
        while (it != clients_.end()) {
            (*it)->available();  // triggers EOF detection via non-blocking peek
            if ((*it)->isOpen()) {
                ++it;
            } else {
                it = clients_.erase(it);
            }
        }
        return clients_.size();
    }

protected:
    void sink_it_(const spdlog::details::log_msg& msg) override {
        // Format timestamp as ISO 8601
        auto tp = msg.time;
        auto time_t = std::chrono::system_clock::to_time_t(tp);
        auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(
            tp.time_since_epoch()) % 1000;

        std::tm tm{};
        localtime_r(&time_t, &tm);

        std::ostringstream ts;
        ts << std::put_time(&tm, "%Y-%m-%dT%H:%M:%S")
           << '.' << std::setfill('0') << std::setw(3) << ms.count();

        // Level string
        auto level = spdlog::level::to_string_view(msg.level);

        // Build JSON (escape quotes in message)
        std::string escaped;
        std::string_view payload(msg.payload.data(), msg.payload.size());
        for (char c : payload) {
            if (c == '"') escaped += "\\\"";
            else if (c == '\\') escaped += "\\\\";
            else if (c == '\n') escaped += "\\n";
            else escaped += c;
        }

        std::ostringstream json;
        json << "{\"ts\":\"" << ts.str()
             << "\",\"level\":\"" << std::string_view(level.data(), level.size())
             << "\",\"msg\":\"" << escaped << "\"}";

        auto text = json.str();

        // Buffer for replay to future clients
        std::lock_guard lock(clientsMtx_);
        history_.push_back(text);
        if (history_.size() > kMaxHistory) {
            history_.pop_front();
        }

        // Broadcast to connected clients (probe for EOF first to avoid
        // blocking writes on dead connections)
        auto it = clients_.begin();
        while (it != clients_.end()) {
            (*it)->available();  // non-blocking EOF probe
            if ((*it)->isOpen()) {
                (*it)->sendText(text);
                ++it;
            } else {
                it = clients_.erase(it);
            }
        }
    }

    void flush_() override {}

private:
    static constexpr size_t kMaxHistory = 1000;
    std::mutex clientsMtx_;
    std::vector<std::shared_ptr<sq::WsConnection>> clients_;
    std::deque<std::string> history_;
};
