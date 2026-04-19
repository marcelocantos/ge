// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/VideoDecoder.h>

#include <media/NdkMediaCodec.h>
#include <media/NdkMediaFormat.h>
#include <spdlog/spdlog.h>

#include <atomic>
#include <cstring>
#include <mutex>
#include <vector>

namespace ge {

// COLOR_FormatYUV420SemiPlanar (NV12): Y plane followed by interleaved U/V
// plane. This is the most widely supported format on Android hardware decoders.
static constexpr int kColorFormatNV12 = 0x00000015; // 21

// Fallback: some decoders expose BGRA directly.
static constexpr int kColorFormatBGRA = 0x7F00A000;

// Timeout in microseconds for input/output buffer operations.
static constexpr int64_t kInputTimeoutUs = 10000;  // 10ms — wait for input buffer
static constexpr int64_t kOutputTimeoutUs = 0;     // non-blocking output drain

struct VideoDecoder::M {
    FrameCallback callback;

    AMediaCodec*  codec      = nullptr;
    int           width      = 0;
    int           height     = 0;
    int           colorFormat = kColorFormatNV12;

    // SPS/PPS stored for late codec creation (e.g. first decode call).
    std::vector<uint8_t> spsData;
    std::vector<uint8_t> ppsData;

    // Protect concurrent drain calls from decode() vs flush().
    std::mutex drainMutex;

    ~M() {
        if (codec) {
            AMediaCodec_stop(codec);
            AMediaCodec_delete(codec);
            codec = nullptr;
        }
    }

    // Create and configure the codec from the stored SPS/PPS.
    bool createCodec();

    // Strip Annex B start code and return pointer to NAL body + its size.
    static const uint8_t* stripStartCode(const uint8_t* data, size_t size,
                                          size_t& bodySize);

    // Queue one raw NAL body (no start code, no length prefix) into the codec.
    bool queueNal(const uint8_t* body, size_t bodySize);

    // Drain all available output buffers, calling the frame callback for each.
    void drainOutput();

    // Deliver a decoded output buffer to the callback.
    void deliverFrame(uint8_t* buf, size_t bufSize,
                      AMediaCodecBufferInfo& info);
};

bool VideoDecoder::M::createCodec() {
    if (codec) {
        AMediaCodec_stop(codec);
        AMediaCodec_delete(codec);
        codec = nullptr;
    }

    codec = AMediaCodec_createDecoderByType("video/avc");
    if (!codec) {
        SPDLOG_ERROR("VideoDecoder: AMediaCodec_createDecoderByType failed");
        return false;
    }

    AMediaFormat* fmt = AMediaFormat_new();
    AMediaFormat_setString(fmt, AMEDIAFORMAT_KEY_MIME, "video/avc");
    AMediaFormat_setInt32(fmt, AMEDIAFORMAT_KEY_WIDTH,  width);
    AMediaFormat_setInt32(fmt, AMEDIAFORMAT_KEY_HEIGHT, height);

    // Provide SPS as csd-0 and PPS as csd-1 (raw NAL body, no start code).
    AMediaFormat_setBuffer(fmt, "csd-0",
        const_cast<uint8_t*>(spsData.data()), spsData.size());
    AMediaFormat_setBuffer(fmt, "csd-1",
        const_cast<uint8_t*>(ppsData.data()), ppsData.size());

    // Always use NV12 — universally supported. BGRA is accepted by some
    // codecs at configure time but silently produces no output (emulator).
    colorFormat = kColorFormatNV12;
    AMediaFormat_setInt32(fmt, AMEDIAFORMAT_KEY_COLOR_FORMAT, kColorFormatNV12);

    media_status_t status = AMediaCodec_configure(
        codec, fmt, /*surface=*/nullptr, /*crypto=*/nullptr, /*flags=*/0);

    AMediaFormat_delete(fmt);

    if (status != AMEDIA_OK) {
        // Retry with NV12, which every hardware decoder supports.
        SPDLOG_WARN("VideoDecoder: BGRA color format rejected ({}), retrying with NV12",
                    static_cast<int>(status));
        colorFormat = kColorFormatNV12;

        AMediaFormat* fmt2 = AMediaFormat_new();
        AMediaFormat_setString(fmt2, AMEDIAFORMAT_KEY_MIME, "video/avc");
        AMediaFormat_setInt32(fmt2, AMEDIAFORMAT_KEY_WIDTH,  width);
        AMediaFormat_setInt32(fmt2, AMEDIAFORMAT_KEY_HEIGHT, height);
        AMediaFormat_setBuffer(fmt2, "csd-0",
            const_cast<uint8_t*>(spsData.data()), spsData.size());
        AMediaFormat_setBuffer(fmt2, "csd-1",
            const_cast<uint8_t*>(ppsData.data()), ppsData.size());
        AMediaFormat_setInt32(fmt2, AMEDIAFORMAT_KEY_COLOR_FORMAT, kColorFormatNV12);

        status = AMediaCodec_configure(
            codec, fmt2, /*surface=*/nullptr, /*crypto=*/nullptr, /*flags=*/0);
        AMediaFormat_delete(fmt2);

        if (status != AMEDIA_OK) {
            SPDLOG_ERROR("VideoDecoder: AMediaCodec_configure failed: {}",
                         static_cast<int>(status));
            AMediaCodec_delete(codec);
            codec = nullptr;
            return false;
        }
    }
    // colorFormat already set to kColorFormatNV12 above.

    status = AMediaCodec_start(codec);
    if (status != AMEDIA_OK) {
        SPDLOG_ERROR("VideoDecoder: AMediaCodec_start failed: {}",
                     static_cast<int>(status));
        AMediaCodec_delete(codec);
        codec = nullptr;
        return false;
    }

    SPDLOG_INFO("VideoDecoder: codec started {}x{} colorFormat={}",
                width, height, colorFormat);
    return true;
}

const uint8_t* VideoDecoder::M::stripStartCode(const uint8_t* data, size_t size,
                                                 size_t& bodySize) {
    if (size >= 4 &&
        data[0] == 0x00 && data[1] == 0x00 &&
        data[2] == 0x00 && data[3] == 0x01) {
        bodySize = size - 4;
        return data + 4;
    }
    if (size >= 3 &&
        data[0] == 0x00 && data[1] == 0x00 && data[2] == 0x01) {
        bodySize = size - 3;
        return data + 3;
    }
    bodySize = size;
    return data;
}

bool VideoDecoder::M::queueNal(const uint8_t* body, size_t bodySize) {
    if (!codec || bodySize == 0) return false;

    // Log first few NALs for debugging
    { static int n = 0; if (n++ < 10) {
        // Find NAL type (first byte after start code, if present)
        int off = 0;
        if (bodySize >= 4 && body[0]==0 && body[1]==0 && body[2]==0 && body[3]==1) off = 4;
        else if (bodySize >= 3 && body[0]==0 && body[1]==0 && body[2]==1) off = 3;
        int nalType = (off < (int)bodySize) ? (body[off] & 0x1F) : -1;
        SPDLOG_INFO("queueNal: size={} nalType={} off={}", bodySize, nalType, off);
    }}

    ssize_t idx = AMediaCodec_dequeueInputBuffer(codec, kInputTimeoutUs);
    if (idx < 0) {
        // No input buffer available right now; the frame will be dropped.
        SPDLOG_WARN("VideoDecoder: no input buffer available (idx={})", idx);
        return false;
    }

    size_t bufSize = 0;
    uint8_t* buf = AMediaCodec_getInputBuffer(codec,
                                               static_cast<size_t>(idx),
                                               &bufSize);
    if (!buf) {
        SPDLOG_ERROR("VideoDecoder: AMediaCodec_getInputBuffer returned null");
        return false;
    }

    if (bodySize > bufSize) {
        SPDLOG_ERROR("VideoDecoder: NAL body {} > input buffer size {}", bodySize, bufSize);
        bodySize = bufSize;
    }

    std::memcpy(buf, body, bodySize);

    media_status_t status = AMediaCodec_queueInputBuffer(
        codec,
        static_cast<size_t>(idx),
        /*offset=*/0,
        bodySize,
        /*presentationTimeUs=*/0,
        /*flags=*/0
    );

    if (status != AMEDIA_OK) {
        SPDLOG_ERROR("VideoDecoder: AMediaCodec_queueInputBuffer failed: {}",
                     static_cast<int>(status));
        return false;
    }
    return true;
}

void VideoDecoder::M::deliverFrame(uint8_t* buf, size_t bufSize,
                                    AMediaCodecBufferInfo& info) {
    if (info.size <= 0 || !buf) return;

    // We always request NV12 at configure time. Some devices nonetheless
    // return BGRA; detect by buffer size and forward in either format
    // without conversion — the renderer (SDL_PIXELFORMAT_NV12 /
    // SDL_PIXELFORMAT_BGRA32) handles colour-space conversion on the GPU.
    const size_t expectedBgra = static_cast<size_t>(width) * height * 4;
    const size_t expectedNv12 = static_cast<size_t>(width) * height * 3 / 2;
    const size_t frameBytes   = static_cast<size_t>(info.size);

    uint8_t* src = buf + info.offset;

    VideoFrame f;
    f.width = width;
    f.height = height;

    if (frameBytes >= expectedBgra) {
        f.format = VideoFrame::Format::BGRA;
        f.planes[0] = src;
        f.strides[0] = width * 4;
    } else if (frameBytes >= expectedNv12) {
        // NV12 layout: Y plane (width*height bytes) followed by interleaved
        // UV plane (width*height/2 bytes). Stride==width is the universal
        // assumption matching the existing code; codecs that use different
        // strides would require querying AMEDIAFORMAT_KEY_STRIDE.
        f.format = VideoFrame::Format::NV12;
        f.planes[0] = src;
        f.planes[1] = src + width * height;
        f.strides[0] = width;
        f.strides[1] = width;
    } else {
        SPDLOG_WARN("VideoDecoder: unexpected output buffer size {} "
                    "(expected BGRA={} or NV12={})",
                    frameBytes, expectedBgra, expectedNv12);
        return;
    }

    callback(f);
}

void VideoDecoder::M::drainOutput() {
    if (!codec) return;

    std::lock_guard<std::mutex> drain(drainMutex);

    for (;;) {
        AMediaCodecBufferInfo info{};
        ssize_t idx = AMediaCodec_dequeueOutputBuffer(codec, &info, kOutputTimeoutUs);

        if (idx == AMEDIACODEC_INFO_OUTPUT_FORMAT_CHANGED) {
            // The output format changed; re-read width/height/colorFormat.
            AMediaFormat* outFmt = AMediaCodec_getOutputFormat(codec);
            if (outFmt) {
                int32_t w = 0, h = 0, cf = 0;
                AMediaFormat_getInt32(outFmt, AMEDIAFORMAT_KEY_WIDTH,  &w);
                AMediaFormat_getInt32(outFmt, AMEDIAFORMAT_KEY_HEIGHT, &h);
                AMediaFormat_getInt32(outFmt, AMEDIAFORMAT_KEY_COLOR_FORMAT, &cf);
                if (w > 0) width  = w;
                if (h > 0) height = h;
                if (cf > 0) colorFormat = cf;
                SPDLOG_INFO("VideoDecoder: output format changed {}x{} cf={}",
                            width, height, colorFormat);
                AMediaFormat_delete(outFmt);
            }
            continue;
        }

        if (idx == AMEDIACODEC_INFO_OUTPUT_BUFFERS_CHANGED) {
            // The output buffer set was reallocated; nothing to do — the next
            // dequeueOutputBuffer call will see the new buffers.
            continue;
        }

        if (idx == AMEDIACODEC_INFO_TRY_AGAIN_LATER || idx < 0) {
            break;
        }

        SPDLOG_INFO("VideoDecoder: output buffer idx={} size={}", idx, info.size);

        // idx >= 0: valid output buffer.
        size_t bufSize = 0;
        uint8_t* buf = AMediaCodec_getOutputBuffer(
            codec, static_cast<size_t>(idx), &bufSize);

        if (buf && !(info.flags & AMEDIACODEC_BUFFER_FLAG_END_OF_STREAM)) {
            deliverFrame(buf, bufSize, info);
        }

        AMediaCodec_releaseOutputBuffer(codec, static_cast<size_t>(idx),
                                        /*render=*/false);

        if (info.flags & AMEDIACODEC_BUFFER_FLAG_END_OF_STREAM) {
            SPDLOG_INFO("VideoDecoder: end-of-stream");
            break;
        }
    }
}

// ---------------------------------------------------------------------------
// VideoDecoder public interface
// ---------------------------------------------------------------------------

VideoDecoder::VideoDecoder(FrameCallback onFrame)
    : m(std::make_unique<M>()) {
    m->callback = std::move(onFrame);
}

VideoDecoder::~VideoDecoder() = default;

void VideoDecoder::setParameterSets(const uint8_t* sps, size_t spsSize,
                                     const uint8_t* pps, size_t ppsSize) {
    // MediaCodec csd-0 / csd-1 require Annex B start codes (00 00 00 01).
    // The caller may provide raw NAL body or Annex B — ensure start code.
    static const uint8_t kStartCode[] = {0x00, 0x00, 0x00, 0x01};
    auto ensureStartCode = [](const uint8_t* data, size_t size) {
        std::vector<uint8_t> out;
        bool hasStart = (size >= 4 && data[0]==0 && data[1]==0 && data[2]==0 && data[3]==1);
        if (!hasStart) {
            out.insert(out.end(), kStartCode, kStartCode + 4);
        }
        out.insert(out.end(), data, data + size);
        return out;
    };

    m->spsData = ensureStartCode(sps, spsSize);
    m->ppsData = ensureStartCode(pps, ppsSize);

    // Extract width and height from the SPS NAL unit.
    // The SPS contains the sequence parameter set RBSP. The dimensions are
    // encoded deep inside the RBSP, so we rely on MediaFormat to report them
    // after configure(). Set placeholder values for now; createCodec() will
    // feed them to AMediaFormat and the output-format-changed callback will
    // update m->width/m->height when the first frame arrives.
    //
    // For the initial configure we need a non-zero dimension. We cannot easily
    // parse the SPS RBSP here, so we use a safe default that most decoders
    // accept; the codec corrects it via AMEDIACODEC_INFO_OUTPUT_FORMAT_CHANGED.
    if (m->width == 0)  m->width  = 1280;
    if (m->height == 0) m->height = 720;

    SPDLOG_INFO("VideoDecoder: setParameterSets sps={} pps={} bytes",
                m->spsData.size(), m->ppsData.size());

    m->createCodec();
}

void VideoDecoder::decode(const uint8_t* nalData, size_t nalSize) {
    if (!m->codec) return;

    // Feed Annex B data (with start codes) directly to MediaCodec.
    if (nalSize == 0) return;

    // Drain output first — frees internal buffers so queueNal can succeed.
    m->drainOutput();

    m->queueNal(nalData, nalSize);

    // Drain again — the NAL we just queued might produce immediate output.
    m->drainOutput();
}

void VideoDecoder::flush() {
    if (!m->codec) return;

    // Signal end-of-stream so the codec flushes its internal pipeline.
    ssize_t idx = AMediaCodec_dequeueInputBuffer(m->codec, 5000 /*5 ms*/);
    if (idx >= 0) {
        AMediaCodec_queueInputBuffer(
            m->codec,
            static_cast<size_t>(idx),
            /*offset=*/0,
            /*size=*/0,
            /*presentationTimeUs=*/0,
            AMEDIACODEC_BUFFER_FLAG_END_OF_STREAM
        );
    }

    // Drain remaining output.
    m->drainOutput();

    // Flush any buffered state inside the codec, resetting it to a clean
    // start-of-stream state without releasing the codec itself.
    media_status_t status = AMediaCodec_flush(m->codec);
    if (status != AMEDIA_OK) {
        SPDLOG_WARN("VideoDecoder: AMediaCodec_flush failed: {}",
                    static_cast<int>(status));
    }
}

} // namespace ge
