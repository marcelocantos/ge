// Android implementation of ge::scanQRCode().
// Uses JNI to invoke Google Code Scanner via QRScannerBridge.java.

#include "QRScanner.h"

#include <SDL3/SDL.h>
#include <spdlog/spdlog.h>
#include <jni.h>

#include <cstring>
#include <string>

namespace ge {

ScanResult scanQRCode() {
    JNIEnv* env = static_cast<JNIEnv*>(SDL_GetAndroidJNIEnv());
    jobject activity = static_cast<jobject>(SDL_GetAndroidActivity());

    if (!env || !activity) {
        SPDLOG_ERROR("Failed to get Android JNI environment");
        return {};
    }

    jclass bridgeClass = env->FindClass("com/squz/player/QRScannerBridge");
    if (!bridgeClass) {
        SPDLOG_ERROR("Failed to find QRScannerBridge class");
        return {};
    }

    // Launch the scanner
    jmethodID startScan = env->GetStaticMethodID(
        bridgeClass, "startScan", "(Landroid/app/Activity;)V");
    env->CallStaticVoidMethod(bridgeClass, startScan, activity);

    // Wait for the scan to complete
    jmethodID isComplete = env->GetStaticMethodID(
        bridgeClass, "isScanComplete", "()Z");

    while (!env->CallStaticBooleanMethod(bridgeClass, isComplete)) {
        SDL_Delay(50);
    }

    // Get the scanned URL
    jmethodID getUrl = env->GetStaticMethodID(
        bridgeClass, "getScannedUrl", "()Ljava/lang/String;");
    auto url = static_cast<jstring>(
        env->CallStaticObjectMethod(bridgeClass, getUrl));

    ScanResult result;
    if (url) {
        const char* urlStr = env->GetStringUTFChars(url, nullptr);

        // Parse squz-remote://host:port
        std::string urlString(urlStr);
        const std::string prefix = "squz-remote://";
        if (urlString.rfind(prefix, 0) == 0) {
            auto hostPort = urlString.substr(prefix.size());
            auto colon = hostPort.rfind(':');
            if (colon != std::string::npos) {
                result.host = hostPort.substr(0, colon);
                result.port = static_cast<uint16_t>(
                    std::stoi(hostPort.substr(colon + 1)));
            } else {
                result.host = hostPort;
            }
        }

        env->ReleaseStringUTFChars(url, urlStr);
        SPDLOG_INFO("Scanned: {}:{}", result.host, result.port);
    } else {
        SPDLOG_WARN("QR scan cancelled or failed");
    }

    env->DeleteLocalRef(bridgeClass);
    return result;
}

} // namespace ge
