// Receiver — shared wire rendering receiver implementation.
// Platform-specific entry points: receiver.cpp (desktop), ios/main.mm (iOS).

#define ASIO_STANDALONE
#include <asio.hpp>

#include "Receiver.h"
#include "receiver_platform.h"

#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>
#include <dawn/native/DawnNative.h>
#include <dawn/dawn_proc.h>
#include <dawn/wire/WireServer.h>
#include <webgpu/webgpu_cpp.h>

#include <sq/Protocol.h>

#include <memory>
#include <string>
#include <vector>

namespace {

enum class ConnectionResult { Quit, Disconnected };

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

        try {
            wire::MessageHeader header{wire::kWireResponseMagic, static_cast<uint32_t>(buffer_.size())};
            asio::write(socket_, asio::buffer(&header, sizeof(header)));
            asio::write(socket_, asio::buffer(buffer_));
            buffer_.clear();
            return true;
        } catch (const std::exception& e) {
            SPDLOG_ERROR("SocketSerializer::Flush failed: {}", e.what());
            buffer_.clear();
            return false;
        }
    }

    size_t GetMaximumAllocationSize() const override {
        return wire::kMaxMessageSize;
    }

private:
    asio::ip::tcp::socket& socket_;
    std::vector<char> buffer_;
};

void sendEvent(asio::ip::tcp::socket& socket, const SDL_Event& event) {
    wire::MessageHeader header{wire::kSdlEventMagic, sizeof(SDL_Event)};
    asio::write(socket, asio::buffer(&header, sizeof(header)));
    asio::write(socket, asio::buffer(&event, sizeof(event)));
}

} // namespace

struct Receiver::M {
    std::string host;
    uint16_t port;
    int width;
    int height;
    int backoffMs = 10;

    SDL_Window* window = nullptr;

    std::unique_ptr<dawn::native::Instance> dawnInstance;
    wgpu::Adapter adapter;
    wgpu::Device device;
    wgpu::Queue queue;
    wgpu::Surface surface;
    wgpu::TextureFormat swapChainFormat = wgpu::TextureFormat::BGRA8Unorm;

    void initWindow();
    void initGpu();
    ConnectionResult connectAndRun();
};

Receiver::Receiver(std::string host, uint16_t port, int width, int height)
    : m(std::make_unique<M>()) {
    m->host = std::move(host);
    m->port = port;
    m->width = width;
    m->height = height;
}

Receiver::~Receiver() = default;

int Receiver::run() {
    try {
        m->initWindow();
        m->initGpu();

        while (true) {
            auto result = m->connectAndRun();
            if (result == ConnectionResult::Quit)
                break;

            SPDLOG_INFO("Reconnecting in {}ms...", m->backoffMs);
            SDL_Delay(m->backoffMs);
            m->backoffMs = std::min(m->backoffMs * 2, 2000);

            SDL_Event event;
            while (SDL_PollEvent(&event)) {
                if (event.type == SDL_EVENT_QUIT)
                    return 0;
                if (event.type == SDL_EVENT_KEY_DOWN && event.key.key == SDLK_Q)
                    return 0;
            }
        }
        return 0;
    } catch (const std::exception& e) {
        SPDLOG_ERROR("Fatal error: {}", e.what());
        return 1;
    }
}

void Receiver::M::initWindow() {
    if (!SDL_Init(SDL_INIT_VIDEO)) {
        throw std::runtime_error(std::string("SDL_Init failed: ") + SDL_GetError());
    }

    SPDLOG_INFO("SDL3 initialized");

    window = SDL_CreateWindow("Wire Receiver", width, height, platform::windowFlags());
    if (!window) {
        SDL_Quit();
        throw std::runtime_error(std::string("SDL_CreateWindow failed: ") + SDL_GetError());
    }

    SPDLOG_INFO("Window created: {}x{}", width, height);
}

void Receiver::M::initGpu() {
    SPDLOG_INFO("Initializing native WebGPU...");

    dawnProcSetProcs(&dawn::native::GetProcs());

    wgpu::InstanceDescriptor instanceDesc{};
    dawnInstance = std::make_unique<dawn::native::Instance>(&instanceDesc);

    auto rawSurface = platform::createSurface(dawnInstance->Get(), window);
    if (!rawSurface) {
        throw std::runtime_error("Failed to create WebGPU surface");
    }
    surface = wgpu::Surface::Acquire(rawSurface);

    wgpu::RequestAdapterOptions adapterOpts{
        .powerPreference = wgpu::PowerPreference::HighPerformance,
        .compatibleSurface = surface,
    };
    auto adapters = dawnInstance->EnumerateAdapters(&adapterOpts);
    if (adapters.empty()) {
        throw std::runtime_error("No WebGPU adapters found");
    }
    adapter = wgpu::Adapter(adapters[0].Get());

    wgpu::AdapterInfo info{};
    adapter.GetInfo(&info);
    SPDLOG_INFO("WebGPU adapter: {} ({})",
                std::string_view(info.device.data, info.device.length),
                std::string_view(info.description.data, info.description.length));

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

    device = adapter.CreateDevice(&deviceDesc);
    if (!device) {
        throw std::runtime_error("Failed to create WebGPU device");
    }

    queue = device.GetQueue();

    wgpu::SurfaceCapabilities caps{};
    surface.GetCapabilities(adapter, &caps);
    swapChainFormat = caps.formatCount > 0 ? caps.formats[0] : wgpu::TextureFormat::BGRA8Unorm;

    SPDLOG_INFO("WebGPU initialized: format={}", static_cast<int>(swapChainFormat));
}

ConnectionResult Receiver::M::connectAndRun() {
    asio::io_context io;
    asio::ip::tcp::socket socket(io);

    SPDLOG_INFO("Connecting to {}:{}...", host, port);
    try {
        asio::ip::tcp::resolver resolver(io);
        auto endpoints = resolver.resolve(host, std::to_string(port));
        asio::connect(socket, endpoints);
    } catch (const std::exception& e) {
        SPDLOG_WARN("Connection failed: {}", e.what());
        return ConnectionResult::Disconnected;
    }
    SPDLOG_INFO("Connected to game server");

    wire::DeviceInfo deviceInfo{};
    deviceInfo.width = static_cast<uint16_t>(width);
    deviceInfo.height = static_cast<uint16_t>(height);
    deviceInfo.pixelRatio = 2;
    deviceInfo.preferredFormat = static_cast<uint32_t>(swapChainFormat);

    try {
        asio::write(socket, asio::buffer(&deviceInfo, sizeof(deviceInfo)));
    } catch (const std::exception& e) {
        SPDLOG_WARN("Failed to send DeviceInfo: {}", e.what());
        return ConnectionResult::Disconnected;
    }
    SPDLOG_INFO("Sent DeviceInfo");

    wire::SessionInit sessionInit{};
    try {
        asio::read(socket, asio::buffer(&sessionInit, sizeof(sessionInit)));
    } catch (const std::exception& e) {
        SPDLOG_WARN("Failed to read SessionInit: {}", e.what());
        return ConnectionResult::Disconnected;
    }
    if (sessionInit.magic != wire::kSessionInitMagic) {
        SPDLOG_WARN("Invalid SessionInit magic");
        return ConnectionResult::Disconnected;
    }
    SPDLOG_INFO("Received SessionInit with instance handle={{id={}, gen={}}}",
                sessionInit.instanceHandle.id, sessionInit.instanceHandle.generation);

    auto serializer = std::make_unique<SocketSerializer>(socket);
    dawn::wire::WireServerDescriptor serverDesc{
        .procs = &dawn::native::GetProcs(),
        .serializer = serializer.get(),
    };
    auto wireServer = std::make_unique<dawn::wire::WireServer>(serverDesc);

    dawn::wire::Handle instanceHandle{sessionInit.instanceHandle.id, sessionInit.instanceHandle.generation};
    if (!wireServer->InjectInstance(dawnInstance->Get(), instanceHandle)) {
        SPDLOG_WARN("Failed to inject instance");
        return ConnectionResult::Disconnected;
    }
    SPDLOG_INFO("Injected native instance");

    dawn::wire::Handle surfaceHandle{sessionInit.surfaceHandle.id, sessionInit.surfaceHandle.generation};
    if (!wireServer->InjectSurface(surface.Get(), surfaceHandle, instanceHandle)) {
        SPDLOG_WARN("Failed to inject surface");
        return ConnectionResult::Disconnected;
    }
    SPDLOG_INFO("Injected native surface");

    wire::SessionReady sessionReady{};
    try {
        asio::write(socket, asio::buffer(&sessionReady, sizeof(sessionReady)));
    } catch (const std::exception& e) {
        SPDLOG_WARN("Failed to send SessionReady: {}", e.what());
        return ConnectionResult::Disconnected;
    }
    SPDLOG_INFO("Sent SessionReady, entering render loop");

    backoffMs = 10;

    SPDLOG_INFO("Starting render loop...");
    std::vector<char> commandBuffer;
    commandBuffer.reserve(64 * 1024);

    while (true) {
        SDL_Event event;
        while (SDL_PollEvent(&event)) {
            switch (event.type) {
                case SDL_EVENT_QUIT:
                    return ConnectionResult::Quit;
                case SDL_EVENT_KEY_DOWN:
                    if (event.key.key == SDLK_Q)
                        return ConnectionResult::Quit;
                    break;
                case SDL_EVENT_FINGER_DOWN:
                case SDL_EVENT_FINGER_MOTION:
                case SDL_EVENT_FINGER_UP:
                case SDL_EVENT_MOUSE_BUTTON_DOWN:
                case SDL_EVENT_MOUSE_BUTTON_UP:
                case SDL_EVENT_MOUSE_MOTION:
                    try {
                        sendEvent(socket, event);
                    } catch (const std::exception&) {
                        SPDLOG_WARN("Connection lost (event send)");
                        return ConnectionResult::Disconnected;
                    }
                    break;
            }
        }

        io.poll();

        if (socket.is_open()) {
            asio::error_code availEc;
            size_t avail = socket.available(availEc);
            if (availEc) {
                SPDLOG_WARN("Connection lost (available check): {}", availEc.message());
                return ConnectionResult::Disconnected;
            }
            if (avail == 0) {
                char peekBuf;
                socket.non_blocking(true);
                asio::error_code peekEc;
                socket.receive(asio::buffer(&peekBuf, 1), asio::ip::tcp::socket::message_peek, peekEc);
                socket.non_blocking(false);
                if (peekEc == asio::error::eof) {
                    SPDLOG_WARN("Connection closed by server");
                    return ConnectionResult::Disconnected;
                }
            }
        }

        if (socket.is_open() && socket.available() > 0) {
            wire::MessageHeader header{};
            asio::error_code ec;
            asio::read(socket, asio::buffer(&header, sizeof(header)), ec);

            if (ec) {
                SPDLOG_WARN("Connection lost (header read): {}", ec.message());
                return ConnectionResult::Disconnected;
            }

            if (header.magic != wire::kWireCommandMagic) {
                SPDLOG_WARN("Invalid message magic: 0x{:08X}", header.magic);
                return ConnectionResult::Disconnected;
            }

            if (header.length > wire::kMaxMessageSize) {
                SPDLOG_WARN("Message too large: {} bytes", header.length);
                return ConnectionResult::Disconnected;
            }

            commandBuffer.resize(header.length);
            asio::read(socket, asio::buffer(commandBuffer.data(), header.length), ec);

            if (ec) {
                SPDLOG_WARN("Connection lost (payload read): {}", ec.message());
                return ConnectionResult::Disconnected;
            }

            const volatile char* result = wireServer->HandleCommands(
                commandBuffer.data(), commandBuffer.size());
            if (result == nullptr) {
                SPDLOG_ERROR("WireServer failed to handle commands");
            }

            serializer->Flush();
        }

        SDL_Delay(1);
    }
}
