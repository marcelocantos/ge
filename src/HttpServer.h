// Minimal HTTP + WebSocket server built on standalone asio.
// Supports GET routes, static file serving, WebSocket upgrade, and binary frames.
#pragma once

#include <cstdint>
#include <functional>
#include <memory>
#include <string>
#include <vector>

namespace sq {

// A single HTTP request (parsed from the socket).
struct HttpRequest {
    std::string method;
    std::string path;
    std::string host;
    std::string upgrade;
    std::string wsKey;  // Sec-WebSocket-Key
    std::string body;   // POST request body (read if Content-Length present)
};

// HTTP response builder.
struct HttpResponse {
    int status = 200;
    std::string statusText = "OK";
    std::string contentType = "text/plain";
    std::vector<char> body;

    void text(const std::string& s) {
        contentType = "text/plain";
        body.assign(s.begin(), s.end());
    }
    void html(const std::string& s) {
        contentType = "text/html";
        body.assign(s.begin(), s.end());
    }
    void json(const std::string& s) {
        contentType = "application/json";
        body.assign(s.begin(), s.end());
    }
    void png(const void* data, size_t len) {
        contentType = "image/png";
        body.assign(static_cast<const char*>(data),
                    static_cast<const char*>(data) + len);
    }
    void notFound() {
        status = 404;
        statusText = "Not Found";
        text("Not Found");
    }
};

// A WebSocket connection (upgraded from HTTP).
class WsConnection {
public:
    virtual ~WsConnection() = default;
    virtual void sendBinary(const void* data, size_t len) = 0;
    virtual void sendText(const std::string& text) = 0;
    virtual bool recvBinary(std::vector<char>& out) = 0;  // blocks, returns false on close
    virtual void close() = 0;
    virtual bool isOpen() const = 0;
    virtual size_t available() = 0;  // TCP bytes available (nonzero ≈ frame ready)
};

using HttpHandler = std::function<void(const HttpRequest&, HttpResponse&)>;
using WsAcceptHandler = std::function<void(std::shared_ptr<WsConnection>)>;

class HttpServer {
public:
    explicit HttpServer(uint16_t port);
    ~HttpServer();

    HttpServer(const HttpServer&) = delete;
    HttpServer& operator=(const HttpServer&) = delete;

    // Register a GET handler for an exact path.
    void get(const std::string& path, HttpHandler handler);

    // Register a POST handler for an exact path.
    void post(const std::string& path, HttpHandler handler);

    // Register a WebSocket accept handler for an exact path.
    // Called on the server's IO thread when a client upgrades.
    void ws(const std::string& path, WsAcceptHandler handler);

    // Serve static files from a directory for paths under prefix.
    void serveStatic(const std::string& prefix, const std::string& dir);

    // Block until a WebSocket client connects to the given path.
    // Returns the connection (thread-safe, can be called from any thread).
    std::shared_ptr<WsConnection> acceptWs(const std::string& path);

    // Wait up to `timeoutMs` milliseconds for a WebSocket client to connect.
    // Returns nullptr on timeout.
    std::shared_ptr<WsConnection> tryAcceptWs(const std::string& path, int timeoutMs);

    // Start accepting connections (runs IO on a background thread).
    void start();

    // Stop the server and join the IO thread.
    void stop();

    // Get the port the server is listening on.
    uint16_t port() const;

private:
    struct M;
    std::unique_ptr<M> m;
};

// Connect to a WebSocket endpoint as a client. Returns null on failure.
std::shared_ptr<WsConnection> connectWebSocket(
    const std::string& host, uint16_t port, const std::string& path);

} // namespace sq
