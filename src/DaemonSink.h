// spdlog sink that forwards log messages to sqd daemon via sideband WebSocket.
// Each log entry is sent as a JSON text frame:
//   {"type":"log","data":{"ts":"2026-02-11T12:34:56.789","level":"info","msg":"..."}}
#pragma once

#include "HttpServer.h"
#include <spdlog/sinks/base_sink.h>

#include <chrono>
#include <ctime>
#include <iomanip>
#include <mutex>
#include <sstream>

class DaemonSink : public spdlog::sinks::base_sink<std::mutex> {
public:
    explicit DaemonSink(std::shared_ptr<sq::WsConnection> conn)
        : conn_(std::move(conn)) {}

protected:
    void sink_it_(const spdlog::details::log_msg& msg) override {
        if (!conn_ || !conn_->isOpen()) return;

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

        // Escape JSON special chars in message
        std::string escaped;
        std::string_view payload(msg.payload.data(), msg.payload.size());
        for (char c : payload) {
            if (c == '"') escaped += "\\\"";
            else if (c == '\\') escaped += "\\\\";
            else if (c == '\n') escaped += "\\n";
            else escaped += c;
        }

        std::ostringstream json;
        json << R"({"type":"log","data":{"ts":")" << ts.str()
             << R"(","level":")" << std::string_view(level.data(), level.size())
             << R"(","msg":")" << escaped << "\"}}";

        try {
            conn_->sendText(json.str());
        } catch (...) {
            // Don't let send failures break logging
        }
    }

    void flush_() override {}

private:
    std::shared_ptr<sq::WsConnection> conn_;
};
