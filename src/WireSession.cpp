#define ASIO_STANDALONE
#include <asio.hpp>

#include <sq/WireSession.h>
#include <sq/DeltaTimer.h>
#include <sq/Protocol.h>
#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>
#include <dawn/dawn_proc.h>
#include <dawn/wire/WireClient.h>
#include <webgpu/webgpu_cpp.h>

#include <qrcodegen.hpp>

#include <csignal>
#include <cstdlib>
#include <stdexcept>
#include <string>
#include <vector>

namespace {

// Signal flag shared between WireSession::run() and the OS signal handler.
volatile std::sig_atomic_t g_running = 1;

void signalHandler(int) {
    g_running = 0;
}

// CommandSerializer that sends wire commands over TCP
class SocketSerializer : public dawn::wire::CommandSerializer {
public:
    explicit SocketSerializer(asio::ip::tcp::socket& socket)
        : socket_(socket) {
        buffer_.reserve(64 * 1024);
    }

    void* GetCmdSpace(size_t size) override {
        if (size > wire::kMaxMessageSize) {
            return nullptr;
        }
        size_t offset = buffer_.size();
        buffer_.resize(offset + size);
        return buffer_.data() + offset;
    }

    bool Flush() override {
        if (buffer_.empty()) return true;

        wire::MessageHeader header{wire::kWireCommandMagic, static_cast<uint32_t>(buffer_.size())};
        asio::write(socket_, asio::buffer(&header, sizeof(header)));
        asio::write(socket_, asio::buffer(buffer_));
        buffer_.clear();
        return true;
    }

    size_t GetMaximumAllocationSize() const override {
        return wire::kMaxMessageSize;
    }

    void processResponses(dawn::wire::WireClient& client,
                           const std::function<void(const SDL_Event&)>& onEvent) {
        while (socket_.available() > 0) {
            wire::MessageHeader header{};
            asio::read(socket_, asio::buffer(&header, sizeof(header)));

            if (header.magic == wire::kWireResponseMagic) {
                responseBuffer_.resize(header.length);
                asio::read(socket_, asio::buffer(responseBuffer_.data(), header.length));

                const volatile char* result = client.HandleCommands(
                    responseBuffer_.data(), responseBuffer_.size());
                if (result == nullptr) {
                    SPDLOG_ERROR("WireClient failed to handle responses");
                }
            } else if (header.magic == wire::kSdlEventMagic) {
                SDL_Event event{};
                asio::read(socket_, asio::buffer(&event, sizeof(event)));
                if (onEvent) {
                    onEvent(event);
                }
            } else {
                SPDLOG_ERROR("Unknown message magic: 0x{:08X}", header.magic);
                if (header.length > 0 && header.length <= wire::kMaxMessageSize) {
                    responseBuffer_.resize(header.length);
                    asio::read(socket_, asio::buffer(responseBuffer_.data(), header.length));
                }
            }
        }
    }

private:
    asio::ip::tcp::socket& socket_;
    std::vector<char> buffer_;
    std::vector<char> responseBuffer_;
};

void parseListenAddr(const std::string& listenAddr, std::string& address, uint16_t& port) {
    auto colonPos = listenAddr.rfind(':');
    if (colonPos != std::string::npos) {
        address = listenAddr.substr(0, colonPos);
        port = static_cast<uint16_t>(std::stoi(listenAddr.substr(colonPos + 1)));
    } else {
        port = static_cast<uint16_t>(std::stoi(listenAddr));
    }
}

std::string resolveListenAddr() {
    const char* env = std::getenv("SQ_WIRE_ADDR");
    if (env && env[0]) return env;
    return "42069";
}

// Get the first non-loopback IPv4 address by connecting a UDP socket
// to a public address (no packets are actually sent).
std::string getLanAddress(asio::io_context& io) {
    try {
        asio::ip::udp::socket sock(io, asio::ip::udp::v4());
        sock.connect(asio::ip::udp::endpoint(asio::ip::make_address("8.8.8.8"), 80));
        auto addr = sock.local_endpoint().address();
        sock.close();
        if (!addr.is_loopback()) {
            return addr.to_string();
        }
    } catch (...) {}
    return "127.0.0.1";
}

void printQrCode(const std::string& url) {
    auto qr = qrcodegen::QrCode::encodeText(url.c_str(), qrcodegen::QrCode::Ecc::LOW);
    int size = qr.getSize();

    // Use Unicode block elements: two rows per character line
    // Upper half = top row, lower half = bottom row
    std::string out("\n");
    for (int y = -1; y < size + 1; y += 2) {
        out += "  ";
        for (int x = -1; x < size + 1; x++) {
            bool top = (y >= 0 && y < size) ? qr.getModule(x, y) : false;
            bool bot = (y + 1 >= 0 && y + 1 < size) ? qr.getModule(x, y + 1) : false;
            if (top && bot)        out += "\u2588";
            else if (top && !bot)  out += "\u2580";
            else if (!top && bot)  out += "\u2584";
            else                   out += " ";
        }
        out += "\n";
    }
    out += "  " + url + "\n";
    fprintf(stderr, "%s", out.c_str());
}

} // namespace

namespace sq {

struct WireSession::M {
    asio::io_context io;
    asio::ip::tcp::socket socket{io};
    std::unique_ptr<SocketSerializer> serializer;
    std::unique_ptr<dawn::wire::WireClient> wireClient;
    wgpu::Instance instance;
    std::unique_ptr<GpuContext> gfx;
    std::function<void(const SDL_Event&)> onEvent;
};

WireSession::WireSession()
    : m(std::make_unique<M>())
{
    auto addr = resolveListenAddr();

    // Parse address
    std::string address = "0.0.0.0";
    uint16_t port = 42069;
    parseListenAddr(addr, address, port);

    SPDLOG_INFO("Starting wire server on {}:{}...", address, port);

    // Listen and accept
    asio::ip::tcp::endpoint endpoint(asio::ip::make_address(address), port);
    asio::ip::tcp::acceptor acceptor(m->io);
    acceptor.open(endpoint.protocol());
    acceptor.set_option(asio::socket_base::reuse_address(true));
    acceptor.bind(endpoint);
    acceptor.listen();

    auto lanIp = getLanAddress(m->io);
    auto url = "squz-remote://" + lanIp + ":" + std::to_string(port);
    SPDLOG_INFO("Waiting for receiver connection...");
    printQrCode(url);
    acceptor.accept(m->socket);
    SPDLOG_INFO("Receiver connected from {}",
                m->socket.remote_endpoint().address().to_string());

    // Receive DeviceInfo
    wire::DeviceInfo deviceInfo{};
    asio::read(m->socket, asio::buffer(&deviceInfo, sizeof(deviceInfo)));

    if (deviceInfo.magic != wire::kDeviceInfoMagic) {
        throw std::runtime_error("Invalid DeviceInfo magic");
    }

    SPDLOG_INFO("Receiver: {}x{} @ {}x, format={}",
                deviceInfo.width, deviceInfo.height,
                deviceInfo.pixelRatio, deviceInfo.preferredFormat);

    // Create wire client
    m->serializer = std::make_unique<SocketSerializer>(m->socket);
    dawn::wire::WireClientDescriptor clientDesc{
        .serializer = m->serializer.get(),
    };
    m->wireClient = std::make_unique<dawn::wire::WireClient>(clientDesc);

    dawnProcSetProcs(&dawn::wire::client::GetProcs());

    // Reserve handles
    auto instanceReservation = m->wireClient->ReserveInstance();
    WGPUSurfaceCapabilities surfaceCaps{};
    auto surfaceReservation = m->wireClient->ReserveSurface(
        instanceReservation.instance, &surfaceCaps);

    // Send SessionInit
    wire::SessionInit sessionInit{};
    sessionInit.instanceHandle = {instanceReservation.handle.id, instanceReservation.handle.generation};
    sessionInit.surfaceHandle = {surfaceReservation.handle.id, surfaceReservation.handle.generation};

    asio::write(m->socket, asio::buffer(&sessionInit, sizeof(sessionInit)));
    SPDLOG_INFO("Sent SessionInit");

    // Wait for SessionReady
    wire::SessionReady sessionReady{};
    asio::read(m->socket, asio::buffer(&sessionReady, sizeof(sessionReady)));

    if (sessionReady.magic != wire::kSessionReadyMagic) {
        throw std::runtime_error("Invalid SessionReady magic");
    }

    SPDLOG_INFO("Session ready");

    m->instance = wgpu::Instance(instanceReservation.instance);

    // Request adapter through wire
    wgpu::Adapter adapter;
    bool adapterReceived = false;

    wgpu::RequestAdapterOptions adapterOpts{
        .powerPreference = wgpu::PowerPreference::HighPerformance,
    };
    m->instance.RequestAdapter(
        &adapterOpts,
        wgpu::CallbackMode::AllowProcessEvents,
        [&](wgpu::RequestAdapterStatus status, wgpu::Adapter result, wgpu::StringView message) {
            if (status == wgpu::RequestAdapterStatus::Success) {
                adapter = result;
                adapterReceived = true;
            } else {
                SPDLOG_ERROR("Failed to get adapter: {}", std::string_view(message.data, message.length));
            }
        });

    m->serializer->Flush();
    while (!adapterReceived && g_running) {
        m->io.poll();
        m->serializer->processResponses(*m->wireClient, m->onEvent);
        m->instance.ProcessEvents();
    }

    if (!adapter) {
        throw std::runtime_error("No adapter received");
    }

    SPDLOG_INFO("Got adapter through wire");

    // Request device through wire
    wgpu::Device device;
    bool deviceReceived = false;

    wgpu::DeviceDescriptor deviceDesc{};
    deviceDesc.SetDeviceLostCallback(
        wgpu::CallbackMode::AllowSpontaneous,
        [](const wgpu::Device&, wgpu::DeviceLostReason reason, wgpu::StringView message) {
            if (reason != wgpu::DeviceLostReason::Destroyed) {
                SPDLOG_ERROR("Device lost: {}", std::string_view(message.data, message.length));
            }
        });
    deviceDesc.SetUncapturedErrorCallback(
        [](const wgpu::Device&, wgpu::ErrorType type, wgpu::StringView message) {
            SPDLOG_ERROR("WebGPU error: {}", std::string_view(message.data, message.length));
        });

    adapter.RequestDevice(
        &deviceDesc,
        wgpu::CallbackMode::AllowProcessEvents,
        [&](wgpu::RequestDeviceStatus status, wgpu::Device result, wgpu::StringView message) {
            if (status == wgpu::RequestDeviceStatus::Success) {
                device = result;
                deviceReceived = true;
            } else {
                SPDLOG_ERROR("Failed to get device: {}", std::string_view(message.data, message.length));
            }
        });

    m->serializer->Flush();
    while (!deviceReceived && g_running) {
        m->io.poll();
        m->serializer->processResponses(*m->wireClient, m->onEvent);
        m->instance.ProcessEvents();
    }

    if (!device) {
        throw std::runtime_error("No device received");
    }

    wgpu::Queue queue = device.GetQueue();
    SPDLOG_INFO("Got device and queue through wire");

    // Create GpuContext with wire resources
    wgpu::Surface surface(surfaceReservation.surface);
    auto format = static_cast<wgpu::TextureFormat>(deviceInfo.preferredFormat);

    m->gfx = std::make_unique<GpuContext>(device, queue, surface, format,
                                          deviceInfo.width, deviceInfo.height);

    // Flush surface configuration commands
    flush();
}

WireSession::~WireSession() = default;

GpuContext& WireSession::gpu() {
    return *m->gfx;
}

void WireSession::flush() {
    m->serializer->processResponses(*m->wireClient, m->onEvent);
    m->instance.ProcessEvents();
    m->serializer->Flush();
}

WireSession::StopReason WireSession::run(std::function<void(float dt)> onFrame,
                                         std::function<void(const SDL_Event&)> onEvent) {
    m->onEvent = std::move(onEvent);

    std::signal(SIGINT, signalHandler);
    std::signal(SIGTERM, signalHandler);

    // Flush any resource creation commands issued between construction and run()
    flush();

    DeltaTimer frameTimer;

    SPDLOG_INFO("Entering render loop (Ctrl+C to stop)...");

    while (g_running) {
        float dt = frameTimer.tick();

        try {
            flush();
            onFrame(dt);
            flush();
        } catch (const asio::system_error& e) {
            SPDLOG_WARN("Receiver disconnected: {}", e.what());
            return StopReason::Disconnected;
        }

        SDL_Delay(16);
    }

    SPDLOG_INFO("Shutting down...");
    return StopReason::Signal;
}

} // namespace sq
