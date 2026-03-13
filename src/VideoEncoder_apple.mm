// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/VideoEncoder.h>

#import <VideoToolbox/VideoToolbox.h>
#import <CoreMedia/CoreMedia.h>
#import <CoreVideo/CoreVideo.h>
#include <spdlog/spdlog.h>

namespace ge {

struct VideoEncoder::M {
    VTCompressionSessionRef session = nullptr;
    NALCallback callback;
    std::vector<uint8_t> sps_;
    std::vector<uint8_t> pps_;
    int width;
    int height;
    int fps;
    int64_t frameCount = 0;
    bool parameterSetsExtracted = false;

    void createSession();
    static void outputCallback(void* ctx, void* sourceFrameRefCon,
                                OSStatus status, VTEncodeInfoFlags flags,
                                CMSampleBufferRef sampleBuffer);
};

void VideoEncoder::M::createSession() {
    NSDictionary* encoderSpec = @{};

    NSDictionary* pixelBufferAttrs = @{
        (NSString*)kCVPixelBufferPixelFormatTypeKey: @(kCVPixelFormatType_32BGRA),
        (NSString*)kCVPixelBufferWidthKey: @(width),
        (NSString*)kCVPixelBufferHeightKey: @(height),
    };

    OSStatus err = VTCompressionSessionCreate(
        nullptr,                      // allocator
        width, height,
        kCMVideoCodecType_H264,
        (__bridge CFDictionaryRef)encoderSpec,
        (__bridge CFDictionaryRef)pixelBufferAttrs,
        nullptr,                      // compressedDataAllocator
        &M::outputCallback,
        this,                         // refcon
        &session
    );

    if (err != noErr) {
        SPDLOG_ERROR("VTCompressionSessionCreate failed: {}", static_cast<int>(err));
        return;
    }

    VTSessionSetProperty(session, kVTCompressionPropertyKey_RealTime, kCFBooleanTrue);
    VTSessionSetProperty(session, kVTCompressionPropertyKey_ProfileLevel,
                         kVTProfileLevel_H264_Baseline_AutoLevel);
    VTSessionSetProperty(session, kVTCompressionPropertyKey_AllowFrameReordering,
                         kCFBooleanFalse);

    int32_t bitrate = 2000000; // 2 Mbps
    CFNumberRef bitrateRef = CFNumberCreate(nullptr, kCFNumberSInt32Type, &bitrate);
    VTSessionSetProperty(session, kVTCompressionPropertyKey_AverageBitRate, bitrateRef);
    CFRelease(bitrateRef);

    int32_t maxKeyFrameInterval = 30;
    CFNumberRef keyFrameRef = CFNumberCreate(nullptr, kCFNumberSInt32Type, &maxKeyFrameInterval);
    VTSessionSetProperty(session, kVTCompressionPropertyKey_MaxKeyFrameInterval, keyFrameRef);
    CFRelease(keyFrameRef);

    VTCompressionSessionPrepareToEncodeFrames(session);
    SPDLOG_INFO("VideoEncoder: created {}x{} @ {} fps, 2 Mbps H.264 Baseline", width, height, fps);
}

void VideoEncoder::M::outputCallback(void* ctx, void* /*sourceFrameRefCon*/,
                                      OSStatus status, VTEncodeInfoFlags /*flags*/,
                                      CMSampleBufferRef sampleBuffer) {
    if (status != noErr || !sampleBuffer) {
        SPDLOG_ERROR("VideoEncoder output callback error: {}", static_cast<int>(status));
        return;
    }

    auto* self = static_cast<M*>(ctx);

    // Extract SPS/PPS from format description on first callback
    if (!self->parameterSetsExtracted) {
        CMFormatDescriptionRef formatDesc = CMSampleBufferGetFormatDescription(sampleBuffer);
        if (formatDesc) {
            size_t spsSize = 0, ppsSize = 0;
            const uint8_t* spsData = nullptr;
            const uint8_t* ppsData = nullptr;
            size_t paramCount = 0;

            CMVideoFormatDescriptionGetH264ParameterSetAtIndex(
                formatDesc, 0, &spsData, &spsSize, &paramCount, nullptr);
            if (spsData && spsSize > 0) {
                self->sps_.assign(spsData, spsData + spsSize);
            }

            CMVideoFormatDescriptionGetH264ParameterSetAtIndex(
                formatDesc, 1, &ppsData, &ppsSize, nullptr, nullptr);
            if (ppsData && ppsSize > 0) {
                self->pps_.assign(ppsData, ppsData + ppsSize);
            }

            if (!self->sps_.empty() && !self->pps_.empty()) {
                SPDLOG_INFO("VideoEncoder: extracted SPS ({} bytes) + PPS ({} bytes)",
                            self->sps_.size(), self->pps_.size());
                self->parameterSetsExtracted = true;
            }
        }
    }

    // Get the H.264 data (AVCC format)
    CMBlockBufferRef blockBuffer = CMSampleBufferGetDataBuffer(sampleBuffer);
    if (!blockBuffer) return;

    size_t totalLength = 0;
    char* dataPointer = nullptr;
    OSStatus blockErr = CMBlockBufferGetDataPointer(blockBuffer, 0, nullptr,
                                                     &totalLength, &dataPointer);
    if (blockErr != noErr || !dataPointer || totalLength == 0) return;

    // Convert AVCC to Annex B: replace 4-byte length prefixes with start codes
    size_t offset = 0;
    while (offset + 4 < totalLength) {
        // Read 4-byte AVCC length (big-endian)
        uint32_t nalLength = 0;
        nalLength |= static_cast<uint32_t>(static_cast<uint8_t>(dataPointer[offset + 0])) << 24;
        nalLength |= static_cast<uint32_t>(static_cast<uint8_t>(dataPointer[offset + 1])) << 16;
        nalLength |= static_cast<uint32_t>(static_cast<uint8_t>(dataPointer[offset + 2])) << 8;
        nalLength |= static_cast<uint32_t>(static_cast<uint8_t>(dataPointer[offset + 3]));

        if (nalLength == 0 || offset + 4 + nalLength > totalLength) break;

        // Build Annex B NAL: start code + NAL data
        std::vector<uint8_t> annexB(4 + nalLength);
        annexB[0] = 0x00;
        annexB[1] = 0x00;
        annexB[2] = 0x00;
        annexB[3] = 0x01;
        std::memcpy(annexB.data() + 4, dataPointer + offset + 4, nalLength);

        // Check NAL type for keyframe (IDR = 5)
        uint8_t nalType = annexB[4] & 0x1F;
        bool isKeyframe = (nalType == 5);

        NALUnit nal{annexB.data(), annexB.size(), isKeyframe};
        self->callback(nal);

        offset += 4 + nalLength;
    }
}

VideoEncoder::VideoEncoder(int width, int height, int fps, NALCallback onNAL)
    : m(std::make_unique<M>()) {
    m->width = width;
    m->height = height;
    m->fps = fps;
    m->callback = std::move(onNAL);
    m->createSession();
}

VideoEncoder::~VideoEncoder() {
    if (m->session) {
        VTCompressionSessionInvalidate(m->session);
        CFRelease(m->session);
    }
}

void VideoEncoder::encode(const uint8_t* bgraPixels, size_t bytesPerRow) {
    if (!m->session) return;

    CVPixelBufferRef pixelBuffer = nullptr;
    OSStatus err = CVPixelBufferCreateWithBytes(
        nullptr,
        m->width, m->height,
        kCVPixelFormatType_32BGRA,
        const_cast<uint8_t*>(bgraPixels),
        bytesPerRow,
        nullptr,  // releaseCallback
        nullptr,  // releaseRefCon
        nullptr,  // pixelBufferAttributes
        &pixelBuffer
    );

    if (err != noErr || !pixelBuffer) {
        SPDLOG_ERROR("CVPixelBufferCreateWithBytes failed: {}", static_cast<int>(err));
        return;
    }

    CMTime pts = CMTimeMake(m->frameCount++, m->fps);
    err = VTCompressionSessionEncodeFrame(
        m->session,
        pixelBuffer,
        pts,
        kCMTimeInvalid,  // duration
        nullptr,         // frameProperties
        nullptr,         // sourceFrameRefCon
        nullptr          // infoFlagsOut
    );

    CVPixelBufferRelease(pixelBuffer);

    if (err != noErr) {
        SPDLOG_ERROR("VTCompressionSessionEncodeFrame failed: {}", static_cast<int>(err));
    }
}

const std::vector<uint8_t>& VideoEncoder::sps() const {
    return m->sps_;
}

const std::vector<uint8_t>& VideoEncoder::pps() const {
    return m->pps_;
}

void VideoEncoder::flush() {
    if (m->session) {
        VTCompressionSessionCompleteFrames(m->session, kCMTimeInvalid);
    }
}

void VideoEncoder::resize(int width, int height) {
    if (m->session) {
        VTCompressionSessionInvalidate(m->session);
        CFRelease(m->session);
        m->session = nullptr;
    }
    m->width = width;
    m->height = height;
    m->frameCount = 0;
    m->parameterSetsExtracted = false;
    m->sps_.clear();
    m->pps_.clear();
    m->createSession();
}

} // namespace ge
