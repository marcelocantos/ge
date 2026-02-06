#define ASIO_STANDALONE
#include <asio.hpp>

#include <sq/WireSession.h>
#include <sq/Protocol.h>
#include <spdlog/spdlog.h>
#include <dawn/dawn_proc.h>
#include <dawn/wire/WireClient.h>
#include <webgpu/webgpu_cpp.h>

#include <stdexcept>
#include <vector>

namespace {

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

    // Process any responses from the receiver
    void processResponses(dawn::wire::WireClient& client) {
        while (socket_.available() > 0) {
            wire::MessageHeader header{};
            asio::read(socket_, asio::buffer(&header, sizeof(header)));

            if (header.magic != wire::kWireResponseMagic) {
                SPDLOG_ERROR("Invalid response magic: 0x{:08X}", header.magic);
                return;
            }

            responseBuffer_.resize(header.length);
            asio::read(socket_, asio::buffer(responseBuffer_.data(), header.length));

            const volatile char* result = client.HandleCommands(
                responseBuffer_.data(), responseBuffer_.size());
            if (result == nullptr) {
                SPDLOG_ERROR("WireClient failed to handle responses");
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

} // namespace

namespace sq {

struct WireSession::M {
    asio::io_context io;
    asio::ip::tcp::socket socket{io};
    std::unique_ptr<SocketSerializer> serializer;
    std::unique_ptr<dawn::wire::WireClient> wireClient;
    wgpu::Instance instance;
    std::unique_ptr<GpuContext> gfx;
};

WireSession::WireSession(const std::string& listenAddr,
                         std::function<bool()> shouldContinue)
    : m(std::make_unique<M>())
{
    auto cont = [&]{ return !shouldContinue || shouldContinue(); };

    // Parse address
    std::string address = "0.0.0.0";
    uint16_t port = 8080;
    parseListenAddr(listenAddr, address, port);

    SPDLOG_INFO("Starting wire server on {}:{}...", address, port);

    // Listen and accept
    asio::ip::tcp::endpoint endpoint(asio::ip::make_address(address), port);
    asio::ip::tcp::acceptor acceptor(m->io);
    acceptor.open(endpoint.protocol());
    acceptor.set_option(asio::socket_base::reuse_address(true));
    acceptor.bind(endpoint);
    acceptor.listen();

    SPDLOG_INFO("Waiting for receiver connection...");
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
    while (!adapterReceived && cont()) {
        m->io.poll();
        m->serializer->processResponses(*m->wireClient);
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
    while (!deviceReceived && cont()) {
        m->io.poll();
        m->serializer->processResponses(*m->wireClient);
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
    m->serializer->processResponses(*m->wireClient);
    m->instance.ProcessEvents();
    m->serializer->Flush();
}

} // namespace sq
