#define ASIO_STANDALONE
#include <asio.hpp>

#include "HttpServer.h"
#include <sha1.h>
#include <spdlog/spdlog.h>

#include <algorithm>
#include <condition_variable>
#include <filesystem>
#include <fstream>
#include <mutex>
#include <queue>
#include <sstream>
#include <thread>
#include <unordered_map>

using asio::ip::tcp;

namespace ge {

namespace {

// MIME types for static file serving.
std::string mimeType(const std::string& path) {
    auto ext = std::filesystem::path(path).extension().string();
    std::transform(ext.begin(), ext.end(), ext.begin(), ::tolower);
    if (ext == ".html") return "text/html";
    if (ext == ".js")   return "application/javascript";
    if (ext == ".css")  return "text/css";
    if (ext == ".json") return "application/json";
    if (ext == ".png")  return "image/png";
    if (ext == ".svg")  return "image/svg+xml";
    if (ext == ".ico")  return "image/x-icon";
    if (ext == ".woff2") return "font/woff2";
    if (ext == ".woff") return "font/woff";
    if (ext == ".map")  return "application/json";
    return "application/octet-stream";
}

// Parse HTTP request line + headers from a socket.
// Returns false if the connection was closed or malformed.
bool parseHttpRequest(tcp::socket& socket, HttpRequest& req) {
    asio::streambuf buf;
    asio::error_code ec;
    asio::read_until(socket, buf, "\r\n\r\n", ec);
    if (ec) return false;

    std::istream is(&buf);
    std::string line;

    // Request line: GET /path HTTP/1.1
    if (!std::getline(is, line) || line.size() < 2) return false;
    if (line.back() == '\r') line.pop_back();

    auto sp1 = line.find(' ');
    auto sp2 = line.find(' ', sp1 + 1);
    if (sp1 == std::string::npos || sp2 == std::string::npos) return false;

    req.method = line.substr(0, sp1);
    req.path = line.substr(sp1 + 1, sp2 - sp1 - 1);

    // Headers
    size_t contentLength = 0;
    while (std::getline(is, line) && line != "\r" && !line.empty()) {
        if (line.back() == '\r') line.pop_back();
        auto colon = line.find(':');
        if (colon == std::string::npos) continue;
        auto key = line.substr(0, colon);
        auto val = line.substr(colon + 1);
        // Trim leading whitespace from value
        while (!val.empty() && val[0] == ' ') val.erase(0, 1);
        // Case-insensitive header matching
        std::transform(key.begin(), key.end(), key.begin(), ::tolower);
        if (key == "host") req.host = val;
        else if (key == "upgrade") req.upgrade = val;
        else if (key == "sec-websocket-key") req.wsKey = val;
        else if (key == "content-length") contentLength = std::stoull(val);
    }

    // Read request body if Content-Length was specified
    if (contentLength > 0) {
        req.body.resize(contentLength);
        // Some body bytes may already be buffered from read_until
        size_t buffered = buf.size();
        size_t toCopy = std::min(buffered, contentLength);
        if (toCopy > 0) {
            is.read(req.body.data(), toCopy);
        }
        if (toCopy < contentLength) {
            asio::read(socket, asio::buffer(req.body.data() + toCopy,
                       contentLength - toCopy), ec);
            if (ec) return false;
        }
    }

    return true;
}

// Send an HTTP response on the socket.
void sendHttpResponse(tcp::socket& socket, const HttpResponse& res) {
    std::ostringstream oss;
    oss << "HTTP/1.1 " << res.status << " " << res.statusText << "\r\n"
        << "Content-Type: " << res.contentType << "\r\n"
        << "Content-Length: " << res.body.size() << "\r\n"
        << "Cache-Control: no-cache\r\n"
        << "Connection: close\r\n"
        << "\r\n";
    auto header = oss.str();
    asio::error_code ec;
    asio::write(socket, asio::buffer(header), ec);
    if (!ec && !res.body.empty()) {
        asio::write(socket, asio::buffer(res.body), ec);
    }
}

// Send WebSocket upgrade response.
void sendWsUpgrade(tcp::socket& socket, const std::string& acceptKey) {
    std::string response =
        "HTTP/1.1 101 Switching Protocols\r\n"
        "Upgrade: websocket\r\n"
        "Connection: Upgrade\r\n"
        "Sec-WebSocket-Accept: " + acceptKey + "\r\n"
        "\r\n";
    asio::error_code ec;
    asio::write(socket, asio::buffer(response), ec);
}

} // namespace

// WebSocket connection backed by a TCP socket.
class TcpWsConnection : public WsConnection {
public:
    // Server-side: socket comes from the server's io_context (which outlives us).
    explicit TcpWsConnection(tcp::socket socket, bool serverSide = true)
        : socket_(std::move(socket)), serverSide_(serverSide) { setNoDelay(); }

    // Client-side: we own the io_context the socket was created on.
    TcpWsConnection(std::unique_ptr<asio::io_context> io, tcp::socket socket)
        : ownedIo_(std::move(io)), socket_(std::move(socket)), serverSide_(false) { setNoDelay(); }

    void sendBinary(const void* data, size_t len) override {
        sendFrame(0x02, data, len);
    }

    void sendText(const std::string& text) override {
        sendFrame(0x01, text.data(), text.size());
    }

    bool recvBinary(std::vector<char>& out) override {
        return recvFrame(out);
    }

    void close() override {
        std::lock_guard lock(writeMtx_);
        if (open_) {
            open_ = false;
            asio::error_code ec;
            // Send close frame
            uint8_t closeFrame[2] = {0x88, 0x00};
            asio::write(socket_, asio::buffer(closeFrame, 2), ec);
            socket_.close(ec);
        }
    }

    bool isOpen() const override { return open_; }

    size_t available() override {
        asio::error_code ec;
        size_t n = socket_.available(ec);
        if (ec) { open_ = false; return 0; }
        // Peek at the socket to detect remote close or WebSocket close frame.
        char buf;
        auto fd = socket_.native_handle();
        ssize_t r = ::recv(fd, &buf, 1, MSG_PEEK | MSG_DONTWAIT);
        if (r == 0) { open_ = false; return 0; }  // TCP EOF
        if (r > 0 && (static_cast<uint8_t>(buf) & 0x0F) == 0x08) {
            // WebSocket close frame (opcode 0x8) — mark connection as dead
            open_ = false;
            return 0;
        }
        if (r > 0 && n == 0) return 1;  // Data arrived between available() and peek
        return n;
    }

    tcp::socket& socket() { return socket_; }

private:
    void sendFrame(uint8_t opcode, const void* data, size_t len) {
        std::lock_guard lock(writeMtx_);
        if (!open_) return;

        // Build frame into a single buffer (header + optional mask + payload)
        // to avoid Nagle/delayed-ACK interaction from split writes.
        bool mask = !serverSide_;
        uint8_t maskBit = mask ? 0x80 : 0x00;

        size_t headerLen;
        uint8_t header[10];
        header[0] = 0x80 | opcode;  // FIN + opcode

        if (len < 126) {
            header[1] = maskBit | static_cast<uint8_t>(len);
            headerLen = 2;
        } else if (len < 65536) {
            header[1] = maskBit | 126;
            header[2] = (len >> 8) & 0xFF;
            header[3] = len & 0xFF;
            headerLen = 4;
        } else {
            header[1] = maskBit | 127;
            for (int i = 0; i < 8; ++i)
                header[2 + i] = (len >> (56 - i * 8)) & 0xFF;
            headerLen = 10;
        }

        size_t maskLen = mask ? 4 : 0;
        std::vector<uint8_t> buf(headerLen + maskLen + len);
        std::memcpy(buf.data(), header, headerLen);

        if (mask) {
            uint8_t maskKey[4] = {0x12, 0x34, 0x56, 0x78};
            std::memcpy(buf.data() + headerLen, maskKey, 4);
            auto* src = static_cast<const uint8_t*>(data);
            for (size_t i = 0; i < len; ++i)
                buf[headerLen + 4 + i] = src[i] ^ maskKey[i % 4];
        } else {
            std::memcpy(buf.data() + headerLen, data, len);
        }

        asio::error_code ec;
        asio::write(socket_, asio::buffer(buf), ec);
        if (ec) open_ = false;
    }

    bool recvFrame(std::vector<char>& out) {
        out.clear();

        // Reassemble fragmented messages
        while (true) {
            uint8_t header[2];
            asio::error_code ec;
            asio::read(socket_, asio::buffer(header, 2), ec);
            if (ec) { open_ = false; return false; }

            bool fin = header[0] & 0x80;
            uint8_t opcode = header[0] & 0x0F;
            bool masked = header[1] & 0x80;
            uint64_t payloadLen = header[1] & 0x7F;

            if (payloadLen == 126) {
                uint8_t ext[2];
                asio::read(socket_, asio::buffer(ext, 2), ec);
                if (ec) { open_ = false; return false; }
                payloadLen = (uint64_t(ext[0]) << 8) | ext[1];
            } else if (payloadLen == 127) {
                uint8_t ext[8];
                asio::read(socket_, asio::buffer(ext, 8), ec);
                if (ec) { open_ = false; return false; }
                payloadLen = 0;
                for (int i = 0; i < 8; ++i)
                    payloadLen = (payloadLen << 8) | ext[i];
            }

            uint8_t maskKey[4] = {};
            if (masked) {
                asio::read(socket_, asio::buffer(maskKey, 4), ec);
                if (ec) { open_ = false; return false; }
            }

            size_t prevSize = out.size();
            out.resize(prevSize + payloadLen);

            if (payloadLen > 0) {
                asio::read(socket_, asio::buffer(out.data() + prevSize, payloadLen), ec);
                if (ec) { open_ = false; return false; }

                if (masked) {
                    for (size_t i = 0; i < payloadLen; ++i)
                        out[prevSize + i] ^= maskKey[i % 4];
                }
            }

            // Handle control frames
            if (opcode == 0x08) {  // Close
                open_ = false;
                return false;
            }
            if (opcode == 0x09) {  // Ping → Pong
                sendFrame(0x0A, out.data() + prevSize, payloadLen);
                out.resize(prevSize);  // Remove ping payload
                continue;
            }
            if (opcode == 0x0A) {  // Pong — ignore
                out.resize(prevSize);
                continue;
            }

            if (fin) break;  // Complete message
        }

        return true;
    }

    void setSendTimeout(int ms) override {
        struct timeval tv;
        tv.tv_sec = ms / 1000;
        tv.tv_usec = (ms % 1000) * 1000;
        setsockopt(socket_.native_handle(), SOL_SOCKET, SO_SNDTIMEO, &tv, sizeof(tv));
    }

    void setNoDelay() {
        asio::error_code ec;
        socket_.set_option(tcp::no_delay(true), ec);
    }

    std::unique_ptr<asio::io_context> ownedIo_;  // before socket_ so it outlives it
    tcp::socket socket_;
    std::mutex writeMtx_;
    bool serverSide_;
    bool open_ = true;
};

// HttpServer implementation.
struct HttpServer::M {
    uint16_t port;
    asio::io_context io;
    tcp::acceptor acceptor{io};
    std::thread ioThread;
    bool running = false;

    // Routes
    std::unordered_map<std::string, HttpHandler> getHandlers;
    std::unordered_map<std::string, HttpHandler> postHandlers;
    std::unordered_map<std::string, WsAcceptHandler> wsHandlers;
    std::string staticPrefix;
    std::string staticDir;

    // WebSocket accept queues (for acceptWs blocking call)
    std::mutex wsMtx;
    std::condition_variable wsCv;
    std::unordered_map<std::string, std::queue<std::shared_ptr<WsConnection>>> wsQueues;

    void handleConnection(tcp::socket socket);
    void handleStaticFile(const std::string& path, HttpResponse& res);
};

HttpServer::HttpServer(uint16_t port)
    : m(std::make_unique<M>()) {
    m->port = port;

    tcp::endpoint endpoint(tcp::v4(), port);
    m->acceptor.open(endpoint.protocol());
    m->acceptor.set_option(tcp::acceptor::reuse_address(true));
    m->acceptor.bind(endpoint);
    m->acceptor.listen();

    // Read back the actual port (relevant when binding to port 0)
    m->port = m->acceptor.local_endpoint().port();

    SPDLOG_INFO("HttpServer listening on port {}", m->port);
}

HttpServer::~HttpServer() {
    stop();
}

void HttpServer::get(const std::string& path, HttpHandler handler) {
    m->getHandlers[path] = std::move(handler);
}

void HttpServer::post(const std::string& path, HttpHandler handler) {
    m->postHandlers[path] = std::move(handler);
}

void HttpServer::ws(const std::string& path, WsAcceptHandler handler) {
    m->wsHandlers[path] = std::move(handler);
}

void HttpServer::serveStatic(const std::string& prefix, const std::string& dir) {
    m->staticPrefix = prefix;
    m->staticDir = dir;
}

std::shared_ptr<WsConnection> HttpServer::acceptWs(const std::string& path) {
    std::unique_lock lock(m->wsMtx);
    m->wsCv.wait(lock, [&] {
        auto it = m->wsQueues.find(path);
        return it != m->wsQueues.end() && !it->second.empty();
    });
    auto conn = m->wsQueues[path].front();
    m->wsQueues[path].pop();
    return conn;
}

std::shared_ptr<WsConnection> HttpServer::tryAcceptWs(const std::string& path, int timeoutMs) {
    std::unique_lock lock(m->wsMtx);
    bool found = m->wsCv.wait_for(lock, std::chrono::milliseconds(timeoutMs), [&] {
        auto it = m->wsQueues.find(path);
        return it != m->wsQueues.end() && !it->second.empty();
    });
    if (!found) return nullptr;
    auto conn = m->wsQueues[path].front();
    m->wsQueues[path].pop();
    return conn;
}

void HttpServer::start() {
    if (m->running) return;
    m->running = true;

    // Start async accept loop
    auto doAccept = [this]() {
        auto self = this;
        std::function<void()> acceptOne;
        acceptOne = [self, &acceptOne]() {
            auto socket = std::make_shared<tcp::socket>(self->m->io);
            self->m->acceptor.async_accept(*socket,
                [self, socket, &acceptOne](const asio::error_code& ec) {
                    if (ec) return;
                    // Handle in a detached thread so the accept loop continues
                    std::thread([self, s = std::move(*socket)]() mutable {
                        self->m->handleConnection(std::move(s));
                    }).detach();
                    acceptOne();
                });
        };
        acceptOne();
        self->m->io.run();
    };

    m->ioThread = std::thread(doAccept);
}

void HttpServer::stop() {
    if (!m->running) return;
    m->running = false;
    m->io.stop();
    // Wake any threads waiting on acceptWs
    m->wsCv.notify_all();
    if (m->ioThread.joinable()) {
        m->ioThread.join();
    }
}

uint16_t HttpServer::port() const {
    return m->port;
}

void HttpServer::M::handleConnection(tcp::socket socket) {
    HttpRequest req;
    if (!parseHttpRequest(socket, req)) return;

    // WebSocket upgrade?
    if (!req.upgrade.empty() && !req.wsKey.empty()) {
        std::string upgradeLower = req.upgrade;
        std::transform(upgradeLower.begin(), upgradeLower.end(),
                       upgradeLower.begin(), ::tolower);
        if (upgradeLower == "websocket") {
            auto acceptKey = sha1::websocketAccept(req.wsKey);
            sendWsUpgrade(socket, acceptKey);

            auto conn = std::make_shared<TcpWsConnection>(std::move(socket), true);

            // Check for registered handler
            auto it = wsHandlers.find(req.path);
            if (it != wsHandlers.end()) {
                it->second(conn);
                return;
            }

            // Queue for acceptWs
            {
                std::lock_guard lock(wsMtx);
                wsQueues[req.path].push(conn);
            }
            wsCv.notify_all();
            return;
        }
    }

    // GET route handler?
    if (req.method == "GET") {
        auto it = getHandlers.find(req.path);
        if (it != getHandlers.end()) {
            HttpResponse res;
            it->second(req, res);
            sendHttpResponse(socket, res);
            return;
        }
    }

    // POST route handler?
    if (req.method == "POST") {
        auto it = postHandlers.find(req.path);
        if (it != postHandlers.end()) {
            HttpResponse res;
            it->second(req, res);
            sendHttpResponse(socket, res);
            return;
        }
    }

    // Static file serving?
    if (req.method == "GET" && !staticDir.empty() && !staticPrefix.empty()) {
        auto prefixLen = staticPrefix.size();
        if (req.path.substr(0, prefixLen) == staticPrefix) {
            auto relPath = req.path.substr(prefixLen);
            if (relPath.empty() || relPath == "/") relPath = "/index.html";
            else if (relPath[0] != '/') relPath = "/" + relPath;
            HttpResponse res;
            handleStaticFile(relPath, res);
            sendHttpResponse(socket, res);
            return;
        }
    }

    // 404
    HttpResponse res;
    res.notFound();
    sendHttpResponse(socket, res);
}

void HttpServer::M::handleStaticFile(const std::string& relPath, HttpResponse& res) {
    // Prevent directory traversal
    if (relPath.find("..") != std::string::npos) {
        res.notFound();
        return;
    }

    auto fullPath = staticDir + relPath;
    if (!std::filesystem::exists(fullPath) || std::filesystem::is_directory(fullPath)) {
        // SPA fallback: serve index.html for non-file paths
        fullPath = staticDir + "/index.html";
        if (!std::filesystem::exists(fullPath)) {
            res.notFound();
            return;
        }
    }

    std::ifstream file(fullPath, std::ios::binary);
    if (!file) {
        res.notFound();
        return;
    }

    auto size = std::filesystem::file_size(fullPath);
    res.body.resize(size);
    file.read(res.body.data(), size);
    res.contentType = mimeType(fullPath);
}

std::shared_ptr<WsConnection> connectWebSocket(
    const std::string& host, uint16_t port, const std::string& path)
{
    try {
        auto io = std::make_unique<asio::io_context>();
        tcp::resolver resolver(*io);
        auto endpoints = resolver.resolve(host, std::to_string(port));

        tcp::socket socket(*io);
        asio::connect(socket, endpoints);

        // Generate a client key (16 bytes base64-encoded)
        std::string clientKey = sha1::base64(
            reinterpret_cast<const uint8_t*>("squz-ws-client!!"), 16);

        // Send WebSocket upgrade request
        std::ostringstream req;
        req << "GET " << path << " HTTP/1.1\r\n"
            << "Host: " << host << ":" << port << "\r\n"
            << "Upgrade: websocket\r\n"
            << "Connection: Upgrade\r\n"
            << "Sec-WebSocket-Key: " << clientKey << "\r\n"
            << "Sec-WebSocket-Version: 13\r\n"
            << "\r\n";
        auto reqStr = req.str();
        asio::write(socket, asio::buffer(reqStr));

        // Read upgrade response
        asio::streambuf buf;
        asio::read_until(socket, buf, "\r\n\r\n");

        std::istream is(&buf);
        std::string line;
        std::getline(is, line);
        if (line.find("101") == std::string::npos) {
            SPDLOG_WARN("WebSocket upgrade rejected: {}", line);
            return nullptr;
        }

        // Drain remaining header lines
        while (std::getline(is, line) && line != "\r" && !line.empty()) {}

        return std::make_shared<TcpWsConnection>(std::move(io), std::move(socket));
    } catch (const std::exception& e) {
        SPDLOG_WARN("WebSocket connect failed: {}", e.what());
        return nullptr;
    }
}

} // namespace ge
