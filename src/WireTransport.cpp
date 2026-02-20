#include <ge/WireTransport.h>
#include <dawn/dawn_proc_table.h>
#include <spdlog/spdlog.h>
#include <cstring>

// Dawn Wire base class implementations (not included in prebuilt libraries)
namespace dawn::wire {
CommandSerializer::CommandSerializer() = default;
CommandSerializer::~CommandSerializer() = default;
void CommandSerializer::OnSerializeError() {}
CommandHandler::CommandHandler() = default;
CommandHandler::~CommandHandler() = default;
}  // namespace dawn::wire

namespace ge {

// Memory-based command serializer for in-process wire transport
class MemorySerializer : public dawn::wire::CommandSerializer {
public:
    static constexpr size_t kInitialBufferSize = 64 * 1024;  // 64KB
    static constexpr size_t kMaxAllocationSize = 16 * 1024 * 1024;  // 16MB

    MemorySerializer() {
        buffer_.reserve(kInitialBufferSize);
    }

    void* GetCmdSpace(size_t size) override {
        if (size > kMaxAllocationSize) {
            return nullptr;
        }
        size_t offset = buffer_.size();
        buffer_.resize(offset + size);
        return buffer_.data() + offset;
    }

    bool Flush() override {
        // For in-process, Flush is a no-op - data is immediately available
        return true;
    }

    size_t GetMaximumAllocationSize() const override {
        return kMaxAllocationSize;
    }

    // Get accumulated commands and clear the buffer
    std::vector<char> takeCommands() {
        std::vector<char> result;
        result.swap(buffer_);
        buffer_.reserve(kInitialBufferSize);
        return result;
    }

    // Check if there are pending commands
    bool hasCommands() const {
        return !buffer_.empty();
    }

    size_t size() const {
        return buffer_.size();
    }

private:
    std::vector<char> buffer_;
};

struct WireTransport::M {
    std::unique_ptr<MemorySerializer> clientSerializer;
    std::unique_ptr<MemorySerializer> serverSerializer;
    std::unique_ptr<dawn::wire::WireClient> wireClient;
    std::unique_ptr<dawn::wire::WireServer> wireServer;
    const DawnProcTable* wireProcs = nullptr;
    const DawnProcTable* nativeProcs = nullptr;

    // Stored from injectInstance for surface injection
    WGPUInstance clientInstance = nullptr;
    dawn::wire::Handle instanceHandle = {0, 0};
};

WireTransport::WireTransport() : m(std::make_unique<M>()) {}
WireTransport::~WireTransport() = default;

void WireTransport::initialize(const DawnProcTable& nativeProcs) {
    // Store native procs for creating resources to inject
    m->nativeProcs = &nativeProcs;

    // Create serializers for bidirectional communication
    m->clientSerializer = std::make_unique<MemorySerializer>();
    m->serverSerializer = std::make_unique<MemorySerializer>();

    // Create wire server (receives commands, executes on native GPU)
    dawn::wire::WireServerDescriptor serverDesc{
        .procs = &nativeProcs,
        .serializer = m->serverSerializer.get(),
    };
    m->wireServer = std::make_unique<dawn::wire::WireServer>(serverDesc);

    // Create wire client (serializes WebGPU calls)
    dawn::wire::WireClientDescriptor clientDesc{
        .serializer = m->clientSerializer.get(),
    };
    m->wireClient = std::make_unique<dawn::wire::WireClient>(clientDesc);

    // Get the wire procs for the client side
    m->wireProcs = &dawn::wire::client::GetProcs();

    SPDLOG_INFO("WireTransport initialized");
}

const DawnProcTable& WireTransport::wireProcs() const {
    return *m->wireProcs;
}

const DawnProcTable& WireTransport::nativeProcs() const {
    return *m->nativeProcs;
}

WGPUInstance WireTransport::injectInstance(WGPUInstance nativeInstance) {
    // Reserve a client-side instance
    auto reservation = m->wireClient->ReserveInstance();

    // Inject the native instance into the server with the matching handle
    if (!m->wireServer->InjectInstance(nativeInstance, reservation.handle)) {
        SPDLOG_ERROR("Failed to inject instance into wire server");
        return nullptr;
    }

    // Store for later use in injectSurface
    m->clientInstance = reservation.instance;
    m->instanceHandle = reservation.handle;

    SPDLOG_INFO("Injected instance: handle={{id={}, gen={}}}",
                reservation.handle.id, reservation.handle.generation);

    return reservation.instance;
}

WGPUSurface WireTransport::injectSurface(WGPUSurface nativeSurface) {
    if (!m->clientInstance) {
        SPDLOG_ERROR("injectSurface: must call injectInstance first");
        return nullptr;
    }

    // Reserve a client-side surface using the stored instance
    // NOTE: ReserveSurface currently blocks - this is a known issue.
    // See: https://github.com/user/project/issues/XXX
    auto reservation = m->wireClient->ReserveSurface(m->clientInstance, nullptr);

    // Inject the native surface into the server using the stored instance handle
    if (!m->wireServer->InjectSurface(nativeSurface, reservation.handle, m->instanceHandle)) {
        SPDLOG_ERROR("Failed to inject surface into wire server");
        return nullptr;
    }

    SPDLOG_INFO("Injected surface: handle={{id={}, gen={}}}",
                reservation.handle.id, reservation.handle.generation);

    return reservation.surface;
}

void WireTransport::flush() {
    // Process client→server commands
    if (m->clientSerializer->hasCommands()) {
        auto commands = m->clientSerializer->takeCommands();
        const volatile char* ptr = m->wireServer->HandleCommands(
            commands.data(), commands.size());
        if (ptr == nullptr) {
            SPDLOG_ERROR("WireServer failed to handle commands");
        }
    }

    // Process server→client responses
    if (m->serverSerializer->hasCommands()) {
        auto responses = m->serverSerializer->takeCommands();
        const volatile char* ptr = m->wireClient->HandleCommands(
            responses.data(), responses.size());
        if (ptr == nullptr) {
            SPDLOG_ERROR("WireClient failed to handle responses");
        }
    }
}

dawn::wire::WireClient& WireTransport::client() {
    return *m->wireClient;
}

dawn::wire::WireServer& WireTransport::server() {
    return *m->wireServer;
}

} // namespace ge
