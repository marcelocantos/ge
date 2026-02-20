#pragma once
#include <cstdint>
#include <string>

namespace ge {

struct ScanResult {
    std::string host;
    uint16_t port = 0;
};

// Presents a full-screen camera view and waits for a squz-remote:// QR code.
// Returns the parsed host and port. Blocks until a valid code is scanned.
ScanResult scanQRCode();

} // namespace ge
