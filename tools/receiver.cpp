// Wire Rendering Receiver
// Simulates a mobile device, receives Dawn wire commands over TCP, renders natively.
//
// Usage: bin/receiver [host:port] [width] [height]
// Examples:
//   bin/receiver                          # Connect to localhost:42069, 390x844
//   bin/receiver 192.168.1.100:42069     # Connect to specific host
//   bin/receiver localhost:9000 1080 1920 # Custom port and dimensions

#define ASIO_STANDALONE
#include <asio.hpp>

#include <SDL3/SDL.h>
#include <SDL3/SDL_metal.h>
#include <spdlog/spdlog.h>
#include <dawn/native/DawnNative.h>
#include <dawn/dawn_proc.h>
#include <dawn/wire/WireServer.h>
#include <webgpu/webgpu_cpp.h>

#include <sq/Protocol.h>

#include <cstdlib>
#include <memory>
#include <string>
#include <vector>

namespace {

enum class ConnectionResult { Quit, Disconnected };

// Default device simulation parameters
constexpr int kDefaultWidth = 390;
constexpr int kDefaultHeight = 844;
constexpr char kDefaultHost[] = "localhost";
constexpr uint16_t kDefaultPort = 42069;

// CommandSerializer that sends responses over TCP
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
            // Send with length prefix
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

class Receiver {
public:
    Receiver(std::string host, uint16_t port, int width, int height)
        : host_(std::move(host))
        , port_(port)
        , width_(width)
        , height_(height) {}

    int run() {
        try {
            initWindow();
            initGpu();

            while (true) {
                auto result = connectAndRun();
                if (result == ConnectionResult::Quit)
                    break;

                // Connection lost — retry with backoff
                SPDLOG_INFO("Reconnecting in {}ms...", backoffMs_);
                SDL_Delay(backoffMs_);
                backoffMs_ = std::min(backoffMs_ * 2, 2000);

                // Pump SDL events so the window stays responsive
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

private:
    void initWindow() {
        if (!SDL_Init(SDL_INIT_VIDEO)) {
            throw std::runtime_error(std::string("SDL_Init failed: ") + SDL_GetError());
        }

        SPDLOG_INFO("SDL3 initialized");

        // Create window at mobile device dimensions
        window_ = SDL_CreateWindow("Wire Receiver", width_, height_,
                                   SDL_WINDOW_METAL);
        if (!window_) {
            SDL_Quit();
            throw std::runtime_error(std::string("SDL_CreateWindow failed: ") + SDL_GetError());
        }

        SPDLOG_INFO("Window created: {}x{}", width_, height_);

        metalView_ = SDL_Metal_CreateView(window_);
        if (!metalView_) {
            SDL_DestroyWindow(window_);
            SDL_Quit();
            throw std::runtime_error(std::string("SDL_Metal_CreateView failed: ") + SDL_GetError());
        }

        SPDLOG_INFO("Metal view created");
    }

    void initGpu() {
        SPDLOG_INFO("Initializing native WebGPU...");

        // Set native procs globally
        dawnProcSetProcs(&dawn::native::GetProcs());

        // Create Dawn instance
        wgpu::InstanceDescriptor instanceDesc{};
        dawnInstance_ = std::make_unique<dawn::native::Instance>(&instanceDesc);

        // Create surface from Metal layer
        void* metalLayer = SDL_Metal_GetLayer(metalView_);
        WGPUSurfaceSourceMetalLayer metalSource = WGPU_SURFACE_SOURCE_METAL_LAYER_INIT;
        metalSource.layer = metalLayer;

        WGPUSurfaceDescriptor surfaceDesc{};
        surfaceDesc.nextInChain = reinterpret_cast<WGPUChainedStruct*>(&metalSource);

        surface_ = wgpu::Surface::Acquire(
            wgpuInstanceCreateSurface(dawnInstance_->Get(), &surfaceDesc));
        if (!surface_) {
            throw std::runtime_error("Failed to create WebGPU surface");
        }

        // Get adapter
        wgpu::RequestAdapterOptions adapterOpts{
            .powerPreference = wgpu::PowerPreference::HighPerformance,
            .compatibleSurface = surface_,
        };
        auto adapters = dawnInstance_->EnumerateAdapters(&adapterOpts);
        if (adapters.empty()) {
            throw std::runtime_error("No WebGPU adapters found");
        }
        adapter_ = wgpu::Adapter(adapters[0].Get());

        wgpu::AdapterInfo info{};
        adapter_.GetInfo(&info);
        SPDLOG_INFO("WebGPU adapter: {} ({})",
                    std::string_view(info.device.data, info.device.length),
                    std::string_view(info.description.data, info.description.length));

        // Create device
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

        device_ = adapter_.CreateDevice(&deviceDesc);
        if (!device_) {
            throw std::runtime_error("Failed to create WebGPU device");
        }

        queue_ = device_.GetQueue();

        // Query preferred format (for DeviceInfo) — game will configure surface through wire
        wgpu::SurfaceCapabilities caps{};
        surface_.GetCapabilities(adapter_, &caps);

        swapChainFormat_ = caps.formatCount > 0 ? caps.formats[0] : wgpu::TextureFormat::BGRA8Unorm;

        SPDLOG_INFO("WebGPU initialized: format={}", static_cast<int>(swapChainFormat_));
    }

    ConnectionResult connectAndRun() {
        asio::io_context io;
        asio::ip::tcp::socket socket(io);

        // Resolve and connect
        SPDLOG_INFO("Connecting to {}:{}...", host_, port_);
        try {
            asio::ip::tcp::resolver resolver(io);
            auto endpoints = resolver.resolve(host_, std::to_string(port_));
            asio::connect(socket, endpoints);
        } catch (const std::exception& e) {
            SPDLOG_WARN("Connection failed: {}", e.what());
            return ConnectionResult::Disconnected;
        }
        SPDLOG_INFO("Connected to game server");

        // Send DeviceInfo
        wire::DeviceInfo deviceInfo{};
        deviceInfo.width = static_cast<uint16_t>(width_);
        deviceInfo.height = static_cast<uint16_t>(height_);
        deviceInfo.pixelRatio = 2;  // Assume retina
        deviceInfo.preferredFormat = static_cast<uint32_t>(swapChainFormat_);

        try {
            asio::write(socket, asio::buffer(&deviceInfo, sizeof(deviceInfo)));
        } catch (const std::exception& e) {
            SPDLOG_WARN("Failed to send DeviceInfo: {}", e.what());
            return ConnectionResult::Disconnected;
        }
        SPDLOG_INFO("Sent DeviceInfo");

        // Wait for SessionInit with reserved handles
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

        // Create wire server with socket serializer
        auto serializer = std::make_unique<SocketSerializer>(socket);
        dawn::wire::WireServerDescriptor serverDesc{
            .procs = &dawn::native::GetProcs(),
            .serializer = serializer.get(),
        };
        auto wireServer = std::make_unique<dawn::wire::WireServer>(serverDesc);

        // Inject native resources with handles from SessionInit
        dawn::wire::Handle instanceHandle{sessionInit.instanceHandle.id, sessionInit.instanceHandle.generation};
        if (!wireServer->InjectInstance(dawnInstance_->Get(), instanceHandle)) {
            SPDLOG_WARN("Failed to inject instance");
            return ConnectionResult::Disconnected;
        }
        SPDLOG_INFO("Injected native instance");

        dawn::wire::Handle surfaceHandle{sessionInit.surfaceHandle.id, sessionInit.surfaceHandle.generation};
        if (!wireServer->InjectSurface(surface_.Get(), surfaceHandle, instanceHandle)) {
            SPDLOG_WARN("Failed to inject surface");
            return ConnectionResult::Disconnected;
        }
        SPDLOG_INFO("Injected native surface");

        // Send SessionReady
        wire::SessionReady sessionReady{};
        try {
            asio::write(socket, asio::buffer(&sessionReady, sizeof(sessionReady)));
        } catch (const std::exception& e) {
            SPDLOG_WARN("Failed to send SessionReady: {}", e.what());
            return ConnectionResult::Disconnected;
        }
        SPDLOG_INFO("Sent SessionReady, entering render loop");

        // Reset backoff on successful connection
        backoffMs_ = 10;

        // Main loop
        SPDLOG_INFO("Starting render loop...");
        std::vector<char> commandBuffer;
        commandBuffer.reserve(64 * 1024);

        while (true) {
            // 1. Process SDL events
            SDL_Event event;
            while (SDL_PollEvent(&event)) {
                if (event.type == SDL_EVENT_QUIT)
                    return ConnectionResult::Quit;
                if (event.type == SDL_EVENT_KEY_DOWN && event.key.key == SDLK_Q)
                    return ConnectionResult::Quit;
            }

            // 2. Process Asio events (check for incoming data)
            io.poll();

            // 3. Detect remote close — available() returns 0 on a dead socket,
            //    so peek with a non-blocking read to check for EOF.
            if (socket.is_open()) {
                asio::error_code availEc;
                size_t avail = socket.available(availEc);
                if (availEc) {
                    SPDLOG_WARN("Connection lost (available check): {}", availEc.message());
                    return ConnectionResult::Disconnected;
                }
                if (avail == 0) {
                    // No data yet — check if the connection is still alive by peeking
                    char peekBuf;
                    socket.non_blocking(true);
                    asio::error_code peekEc;
                    socket.receive(asio::buffer(&peekBuf, 1), asio::ip::tcp::socket::message_peek, peekEc);
                    socket.non_blocking(false);
                    if (peekEc == asio::error::eof) {
                        SPDLOG_WARN("Connection closed by server");
                        return ConnectionResult::Disconnected;
                    }
                    // would_block means no data yet — connection is alive
                }
            }

            if (socket.is_open() && socket.available() > 0) {
                // Read message header
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

                // Read command payload
                commandBuffer.resize(header.length);
                asio::read(socket, asio::buffer(commandBuffer.data(), header.length), ec);

                if (ec) {
                    SPDLOG_WARN("Connection lost (payload read): {}", ec.message());
                    return ConnectionResult::Disconnected;
                }

                // Process commands through wire server
                const volatile char* result = wireServer->HandleCommands(
                    commandBuffer.data(), commandBuffer.size());
                if (result == nullptr) {
                    SPDLOG_ERROR("WireServer failed to handle commands");
                }

                // Flush any responses
                serializer->Flush();
            }

            // 4. Frame pacing — rendering is driven by the game through wire commands
            SDL_Delay(1);
        }
    }

    // Parameters
    std::string host_;
    uint16_t port_;
    int width_;
    int height_;
    int backoffMs_ = 10;

    // SDL
    SDL_Window* window_ = nullptr;
    SDL_MetalView metalView_ = nullptr;

    // WebGPU (native)
    std::unique_ptr<dawn::native::Instance> dawnInstance_;
    wgpu::Adapter adapter_;
    wgpu::Device device_;
    wgpu::Queue queue_;
    wgpu::Surface surface_;
    wgpu::TextureFormat swapChainFormat_ = wgpu::TextureFormat::BGRA8Unorm;
};

void parseHostPort(const char* arg, std::string& host, uint16_t& port) {
    std::string s(arg);
    auto colonPos = s.rfind(':');
    if (colonPos != std::string::npos) {
        host = s.substr(0, colonPos);
        port = static_cast<uint16_t>(std::stoi(s.substr(colonPos + 1)));
    } else {
        host = s;
        // Keep default port
    }
}

}  // namespace

int main(int argc, char* argv[]) {
    std::string host = kDefaultHost;
    uint16_t port = kDefaultPort;
    int width = kDefaultWidth;
    int height = kDefaultHeight;

    // Parse arguments
    if (argc >= 2) {
        parseHostPort(argv[1], host, port);
    }
    if (argc >= 3) {
        width = std::stoi(argv[2]);
    }
    if (argc >= 4) {
        height = std::stoi(argv[3]);
    }

    SPDLOG_INFO("Wire Receiver starting...");
    SPDLOG_INFO("Target: {}:{}, dimensions: {}x{}", host, port, width, height);

    Receiver receiver(host, port, width, height);
    return receiver.run();
}
