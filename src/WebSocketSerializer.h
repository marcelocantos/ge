// Dawn wire CommandSerializer over WebSocket.
// Each Flush() sends the accumulated buffer as a single WebSocket binary frame,
// prefixed with a wire::MessageHeader. Server-side code (WireSession.cpp)
// overrides Flush() to add deferred-mip filtering.
#pragma once

#include "WebSocketClient.h"
#include <ge/Protocol.h>
#include <dawn/wire/Wire.h>

#include <cstring>
#include <vector>

namespace ge {

class WebSocketSerializer : public dawn::wire::CommandSerializer {
public:
    explicit WebSocketSerializer(std::shared_ptr<WsConnection> conn,
                                  uint32_t flushMagic = wire::kWireCommandMagic)
        : conn_(std::move(conn)), flushMagic_(flushMagic) {
        buffer_.reserve(64 * 1024);
    }

    void* GetCmdSpace(size_t size) override {
        if (size > wire::kMaxMessageSize) return nullptr;
        size_t offset = buffer_.size();
        buffer_.resize(offset + size);
        return buffer_.data() + offset;
    }

    bool Flush() override {
        if (buffer_.empty()) return true;
        sendMessage(flushMagic_, buffer_.data(), buffer_.size());
        buffer_.clear();
        return true;
    }

    size_t GetMaximumAllocationSize() const override {
        return wire::kMaxMessageSize;
    }

    // Send a protocol message as a single WebSocket binary frame.
    void sendMessage(uint32_t magic, const void* data = nullptr, size_t len = 0) {
        wire::MessageHeader hdr{magic, static_cast<uint32_t>(len)};
        if (len == 0) {
            conn_->sendBinary(&hdr, sizeof(hdr));
        } else {
            frame_.resize(sizeof(hdr) + len);
            std::memcpy(frame_.data(), &hdr, sizeof(hdr));
            std::memcpy(frame_.data() + sizeof(hdr), data, len);
            conn_->sendBinary(frame_.data(), frame_.size());
        }
    }

    // Read one protocol message from the WebSocket. Blocks until a frame arrives.
    // Returns false on connection close.
    bool recvMessage(wire::MessageHeader& hdr, std::vector<char>& payload) {
        std::vector<char> frame;
        if (!conn_->recvBinary(frame)) return false;
        if (frame.size() < sizeof(wire::MessageHeader)) return false;
        std::memcpy(&hdr, frame.data(), sizeof(hdr));
        payload.assign(frame.begin() + sizeof(wire::MessageHeader), frame.end());
        return true;
    }

    WsConnection& connection() { return *conn_; }
    std::vector<char>& buffer() { return buffer_; }

protected:
    std::shared_ptr<WsConnection> conn_;
    uint32_t flushMagic_;
    std::vector<char> buffer_;
    std::vector<char> frame_;  // reusable scratch for sendMessage
};

} // namespace ge
