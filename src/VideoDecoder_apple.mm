// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/VideoDecoder.h>

#import <VideoToolbox/VideoToolbox.h>
#import <CoreMedia/CoreMedia.h>
#import <CoreVideo/CoreVideo.h>
#include <spdlog/spdlog.h>

#include <mutex>
#include <vector>

namespace ge {

struct VideoDecoder::M {
    FrameCallback callback;
    VTDecompressionSessionRef session = nullptr;
    CMVideoFormatDescriptionRef formatDesc = nullptr;
    int width;
    int height;
    bool sessionReady = false;

    // Latest decoded frame, protected by mutex for cross-thread access.
    std::mutex frameMutex;
    std::vector<uint8_t> frameBuffer;
    int frameWidth = 0;
    int frameHeight = 0;
    size_t frameBytesPerRow = 0;

    ~M() {
        if (session) {
            VTDecompressionSessionWaitForAsynchronousFrames(session);
            VTDecompressionSessionInvalidate(session);
            CFRelease(session);
        }
        if (formatDesc) {
            CFRelease(formatDesc);
        }
    }

    // Extract SPS and PPS from AVCC data (keyframe with prepended param sets).
    // Returns true if session was created successfully.
    bool initFromKeyframe(const uint8_t* avccData, size_t avccSize);

    void createSession();

    static void outputCallback(void* decompressionOutputRefCon,
                                void* sourceFrameRefCon,
                                OSStatus status,
                                VTDecodeInfoFlags infoFlags,
                                CVImageBufferRef imageBuffer,
                                CMTime presentationTimeStamp,
                                CMTime presentationDuration);
};

bool VideoDecoder::M::initFromKeyframe(const uint8_t* avccData, size_t avccSize) {
    // Parse AVCC data to find SPS and PPS NAL units.
    // Format: [4-byte length][NAL data][4-byte length][NAL data]...
    // NAL type is (first byte of NAL data) & 0x1F:
    //   7 = SPS, 8 = PPS, 5 = IDR slice
    std::vector<const uint8_t*> paramPtrs;
    std::vector<size_t> paramSizes;

    size_t offset = 0;
    while (offset + 4 < avccSize) {
        uint32_t nalLen = (uint32_t(avccData[offset]) << 24) |
                          (uint32_t(avccData[offset+1]) << 16) |
                          (uint32_t(avccData[offset+2]) << 8) |
                          uint32_t(avccData[offset+3]);
        offset += 4;
        if (nalLen == 0 || offset + nalLen > avccSize) break;

        uint8_t nalType = avccData[offset] & 0x1F;
        if (nalType == 7 || nalType == 8) {
            // SPS (7) or PPS (8)
            paramPtrs.push_back(avccData + offset);
            paramSizes.push_back(nalLen);
        }
        offset += nalLen;
    }

    if (paramPtrs.size() < 2) {
        SPDLOG_WARN("VideoDecoder: keyframe missing SPS/PPS ({} param sets found)",
                     paramPtrs.size());
        return false;
    }

    // Release old format description
    if (formatDesc) {
        CFRelease(formatDesc);
        formatDesc = nullptr;
    }

    OSStatus err = CMVideoFormatDescriptionCreateFromH264ParameterSets(
        nullptr,
        paramPtrs.size(),
        paramPtrs.data(),
        paramSizes.data(),
        4,  // NALUnitHeaderLength (AVCC uses 4-byte length prefix)
        &formatDesc
    );

    if (err != noErr) {
        SPDLOG_ERROR("CMVideoFormatDescriptionCreateFromH264ParameterSets failed: {}",
                     static_cast<int>(err));
        formatDesc = nullptr;
        return false;
    }

    CMVideoDimensions dims = CMVideoFormatDescriptionGetDimensions(formatDesc);
    SPDLOG_INFO("VideoDecoder: initialized from keyframe, {}x{}", dims.width, dims.height);

    createSession();
    return sessionReady;
}

void VideoDecoder::M::createSession() {
    if (session) {
        VTDecompressionSessionWaitForAsynchronousFrames(session);
        VTDecompressionSessionInvalidate(session);
        CFRelease(session);
        session = nullptr;
    }
    sessionReady = false;

    if (!formatDesc) return;

    NSDictionary* destAttrs = @{
        (NSString*)kCVPixelBufferPixelFormatTypeKey: @(kCVPixelFormatType_32BGRA),
    };

    VTDecompressionOutputCallbackRecord callbackRecord{};
    callbackRecord.decompressionOutputCallback = &M::outputCallback;
    callbackRecord.decompressionOutputRefCon = this;

    OSStatus err = VTDecompressionSessionCreate(
        nullptr, formatDesc, nullptr,
        (__bridge CFDictionaryRef)destAttrs,
        &callbackRecord, &session
    );

    if (err != noErr) {
        SPDLOG_ERROR("VTDecompressionSessionCreate failed: {}", static_cast<int>(err));
        session = nullptr;
        return;
    }

    sessionReady = true;
    SPDLOG_INFO("VideoDecoder: H.264 decompression session created");
}

void VideoDecoder::M::outputCallback(void* decompressionOutputRefCon,
                                      void* /*sourceFrameRefCon*/,
                                      OSStatus status,
                                      VTDecodeInfoFlags /*infoFlags*/,
                                      CVImageBufferRef imageBuffer,
                                      CMTime /*presentationTimeStamp*/,
                                      CMTime /*presentationDuration*/) {
    if (status != noErr) {
        // Don't log every error — some frame drops are expected
        return;
    }
    if (!imageBuffer) return;

    auto* self = static_cast<M*>(decompressionOutputRefCon);

    CVPixelBufferLockBaseAddress(imageBuffer, kCVPixelBufferLock_ReadOnly);

    int w = static_cast<int>(CVPixelBufferGetWidth(imageBuffer));
    int h = static_cast<int>(CVPixelBufferGetHeight(imageBuffer));
    size_t bytesPerRow = CVPixelBufferGetBytesPerRow(imageBuffer);
    const uint8_t* baseAddr = static_cast<const uint8_t*>(
        CVPixelBufferGetBaseAddress(imageBuffer));

    if (baseAddr) {
        std::lock_guard<std::mutex> lock(self->frameMutex);
        size_t totalBytes = bytesPerRow * h;
        self->frameBuffer.resize(totalBytes);
        std::memcpy(self->frameBuffer.data(), baseAddr, totalBytes);
        self->frameWidth = w;
        self->frameHeight = h;
        self->frameBytesPerRow = bytesPerRow;

        // Deliver frame via callback while still under lock
        self->callback(self->frameBuffer.data(), w, h, bytesPerRow);
    }

    CVPixelBufferUnlockBaseAddress(imageBuffer, kCVPixelBufferLock_ReadOnly);
}

VideoDecoder::VideoDecoder(int width, int height, FrameCallback onFrame)
    : m(std::make_unique<M>()) {
    m->width = width;
    m->height = height;
    m->callback = std::move(onFrame);
    // Session created lazily when first keyframe arrives
}

VideoDecoder::~VideoDecoder() = default;

void VideoDecoder::decode(const uint8_t* data, size_t size, bool isKeyframe) {
    if (size < 5) return;

    // Initialize decoder from first keyframe (contains SPS/PPS)
    if (isKeyframe && !m->sessionReady) {
        m->initFromKeyframe(data, size);
        if (!m->sessionReady) return;
    }

    if (!m->session || !m->formatDesc) return;

    // The data is already in AVCC format (4-byte length prefixed NAL units).
    // Create a CMBlockBuffer directly from it.
    CMBlockBufferRef blockBuffer = nullptr;
    OSStatus err = CMBlockBufferCreateWithMemoryBlock(
        nullptr, nullptr, size,
        kCFAllocatorDefault, nullptr,
        0, size, 0, &blockBuffer
    );

    if (err != noErr || !blockBuffer) return;

    err = CMBlockBufferReplaceDataBytes(data, blockBuffer, 0, size);
    if (err != noErr) {
        CFRelease(blockBuffer);
        return;
    }

    CMSampleBufferRef sampleBuffer = nullptr;
    const size_t sampleSizeArray[1] = {size};

    err = CMSampleBufferCreateReady(
        nullptr, blockBuffer, m->formatDesc,
        1, 0, nullptr, 1, sampleSizeArray, &sampleBuffer
    );

    CFRelease(blockBuffer);
    if (err != noErr || !sampleBuffer) return;

    VTDecodeInfoFlags flagsOut = 0;
    err = VTDecompressionSessionDecodeFrame(
        m->session, sampleBuffer, 0, nullptr, &flagsOut
    );

    CFRelease(sampleBuffer);
}

void VideoDecoder::flush() {
    if (m->session) {
        VTDecompressionSessionWaitForAsynchronousFrames(m->session);
    }
}

} // namespace ge
