// iOS ge player entry point.
// Scans a QR code on startup to discover the game server, then runs the shared player core.
//
// Set GE_DAEMON_ADDR=host:port to skip QR scanning and connect directly.
// Example: xcrun devicectl device process launch -e '{"GE_DAEMON_ADDR":"192.168.1.217:42069"}' ...

#include <TargetConditionals.h>
#include "player_core.h"
#include "QRScanner.h"
#include <SDL3/SDL_main.h>
#include <spdlog/spdlog.h>
#include <spdlog/sinks/base_sink.h>

#import <Foundation/Foundation.h>

#include <cstdlib>
#include <string>
#include <thread>

// HTTP PUT sink — sends each log line to a logging server on the host.
// Uses the GE_DAEMON_ADDR host (or localhost for simulator).
static std::string g_logHost = "192.168.1.217";

template<typename Mutex>
class http_sink : public spdlog::sinks::base_sink<Mutex> {
protected:
    void sink_it_(const spdlog::details::log_msg& msg) override {
        spdlog::memory_buf_t formatted;
        spdlog::sinks::base_sink<Mutex>::formatter_->format(msg, formatted);
        std::string body = fmt::to_string(formatted);

        std::string urlCpp = "http://" + g_logHost + ":9999/log";
        std::thread([body = std::move(body), urlCpp = std::move(urlCpp)] {
            @autoreleasepool {
                NSString* urlStr = [NSString stringWithUTF8String:urlCpp.c_str()];
                NSURL* url = [NSURL URLWithString:urlStr];
                NSMutableURLRequest* req = [NSMutableURLRequest requestWithURL:url];
                req.HTTPMethod = @"PUT";
                req.HTTPBody = [NSData dataWithBytes:body.c_str() length:body.size()];
                req.timeoutInterval = 1.0;

                dispatch_semaphore_t sem = dispatch_semaphore_create(0);
                [[NSURLSession.sharedSession dataTaskWithRequest:req
                    completionHandler:^(NSData*, NSURLResponse*, NSError*) {
                        dispatch_semaphore_signal(sem);
                    }] resume];
                dispatch_semaphore_wait(sem, dispatch_time(DISPATCH_TIME_NOW, NSEC_PER_SEC));
            }
        }).detach();
    }
    void flush_() override {}
};

static constexpr uint16_t kDefaultPort = 42069;

int main(int argc, char* argv[]) {
    auto sink = std::make_shared<http_sink<std::mutex>>();
    auto logger = std::make_shared<spdlog::logger>("player", sink);
    logger->set_level(spdlog::level::info);
    spdlog::set_default_logger(logger);

    SPDLOG_INFO("ge player (iOS) starting...");

    std::string host;
    uint16_t port = kDefaultPort;

    // Fast, non-blocking overrides first.
    if (const char* addr = std::getenv("GE_DAEMON_ADDR")) {
        std::string s(addr);
        host = s;
        if (auto colon = s.rfind(':'); colon != std::string::npos) {
            host = s.substr(0, colon);
            port = static_cast<uint16_t>(std::stoi(s.substr(colon + 1)));
        }
        SPDLOG_INFO("GE_DAEMON_ADDR: {}:{}", host, port);
    }
#if TARGET_OS_SIMULATOR
    else {
        SPDLOG_INFO("Simulator: using localhost:{}", kDefaultPort);
        host = "localhost";
        port = kDefaultPort;
    }
#else
    else {
        // Blocking QR scan to discover the server.
        ge::ScanResult result = ge::scanQRCode();
        host = result.host;
        port = result.port;
    }
#endif

    return playerCore(host, port);
}
