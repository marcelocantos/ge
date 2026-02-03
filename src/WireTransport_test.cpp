#include <doctest.h>
#include <sq/WireTransport.h>
#include <dawn/native/DawnNative.h>
#include <spdlog/spdlog.h>

TEST_CASE("WireTransport initialization") {
    // Get native Dawn procs
    DawnProcTable nativeProcs = dawn::native::GetProcs();

    // Create wire transport
    sq::WireTransport transport;
    transport.initialize(nativeProcs);

    // Check that wire procs are returned
    const DawnProcTable& wireProcs = transport.wireProcs();
    CHECK(wireProcs.createInstance != nullptr);
    CHECK(wireProcs.instanceRequestAdapter != nullptr);
    CHECK(wireProcs.deviceCreateBuffer != nullptr);

    SPDLOG_INFO("WireTransport initialization test passed");
}

TEST_CASE("WireTransport instance injection" * doctest::skip(true)) {
    // Skip by default - requires GPU
    // Run with: bin/unit_test -tc="WireTransport instance injection" -ns

    DawnProcTable nativeProcs = dawn::native::GetProcs();

    // Create native instance
    WGPUInstanceDescriptor instanceDesc{};
    WGPUInstance nativeInstance = nativeProcs.createInstance(&instanceDesc);
    REQUIRE(nativeInstance != nullptr);

    // Create wire transport
    sq::WireTransport transport;
    transport.initialize(nativeProcs);

    // Inject native instance into wire
    WGPUInstance wireInstance = transport.injectInstance(nativeInstance);
    REQUIRE(wireInstance != nullptr);

    // Flush to process any pending commands
    transport.flush();

    SPDLOG_INFO("WireTransport instance injection test passed");

    // Cleanup
    transport.wireProcs().instanceRelease(wireInstance);
    nativeProcs.instanceRelease(nativeInstance);
}
