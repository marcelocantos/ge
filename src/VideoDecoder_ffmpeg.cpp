// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// H.264 decoder using FFmpeg libavcodec. Used on Android where the
// native MediaCodec API is fragile. Produces BGRA output for SDL.

#ifdef __ANDROID__

#include <ge/VideoDecoder.h>
#include <spdlog/spdlog.h>

extern "C" {
#include <libavcodec/avcodec.h>
#include <libavutil/imgutils.h>
#include <libswscale/swscale.h>
}

#include <cstring>
#include <mutex>
#include <vector>

namespace ge {

struct VideoDecoder::M {
    FrameCallback callback;

    const AVCodec* codec = nullptr;
    AVCodecContext* ctx = nullptr;
    AVCodecParserContext* parser = nullptr;
    AVFrame* frame = nullptr;
    AVPacket* pkt = nullptr;
    SwsContext* sws = nullptr;

    // BGRA output buffer
    uint8_t* bgraData[4] = {};
    int bgraLinesize[4] = {};
    int bgraWidth = 0, bgraHeight = 0;

    std::mutex decodeMutex;

    ~M() {
        if (sws) sws_freeContext(sws);
        if (bgraData[0]) av_freep(&bgraData[0]);
        av_frame_free(&frame);
        av_packet_free(&pkt);
        av_parser_close(parser);
        avcodec_free_context(&ctx);
    }

    void init() {
        codec = avcodec_find_decoder(AV_CODEC_ID_H264);
        if (!codec) {
            SPDLOG_ERROR("VideoDecoder: H.264 decoder not found");
            return;
        }

        ctx = avcodec_alloc_context3(codec);
        ctx->thread_count = 2;

        if (avcodec_open2(ctx, codec, nullptr) < 0) {
            SPDLOG_ERROR("VideoDecoder: avcodec_open2 failed");
            avcodec_free_context(&ctx);
            return;
        }

        parser = av_parser_init(AV_CODEC_ID_H264);
        frame = av_frame_alloc();
        pkt = av_packet_alloc();
        SPDLOG_INFO("VideoDecoder: FFmpeg H.264 decoder ready");
    }

    void ensureBgraBuffer(int w, int h) {
        if (bgraWidth == w && bgraHeight == h) return;
        if (bgraData[0]) av_freep(&bgraData[0]);
        av_image_alloc(bgraData, bgraLinesize, w, h, AV_PIX_FMT_BGRA, 1);
        bgraWidth = w;
        bgraHeight = h;

        if (sws) sws_freeContext(sws);
        sws = sws_getContext(w, h, ctx->pix_fmt,
                             w, h, AV_PIX_FMT_BGRA,
                             SWS_BILINEAR, nullptr, nullptr, nullptr);
        SPDLOG_INFO("VideoDecoder: BGRA buffer {}x{}", w, h);
    }

    void deliverDecodedFrames() {
        int ret = 0;
        while (ret >= 0) {
            ret = avcodec_receive_frame(ctx, frame);
            if (ret == AVERROR(EAGAIN) || ret == AVERROR_EOF) break;
            if (ret < 0) {
                SPDLOG_ERROR("VideoDecoder: avcodec_receive_frame error {}", ret);
                break;
            }

            int w = frame->width;
            int h = frame->height;
            ensureBgraBuffer(w, h);

            sws_scale(sws, frame->data, frame->linesize, 0, h,
                      bgraData, bgraLinesize);

            callback(bgraData[0], w, h, static_cast<size_t>(bgraLinesize[0]));
        }
    }
};

VideoDecoder::VideoDecoder(FrameCallback onFrame)
    : m(std::make_unique<M>()) {
    m->callback = std::move(onFrame);
    m->init();
}

VideoDecoder::~VideoDecoder() = default;

void VideoDecoder::setParameterSets(const uint8_t* sps, size_t spsSize,
                                     const uint8_t* pps, size_t ppsSize) {
    // FFmpeg's parser handles SPS/PPS from the bitstream.
    // No explicit configuration needed — they'll be parsed from the
    // first keyframe which includes them inline.
    SPDLOG_INFO("VideoDecoder: SPS/PPS set ({} + {} bytes)", spsSize, ppsSize);
}

void VideoDecoder::decode(const uint8_t* nalData, size_t nalSize) {
    if (!m->ctx || !m->parser || nalSize == 0) return;

    std::lock_guard<std::mutex> lock(m->decodeMutex);

    // Feed data to the parser. It assembles complete access units
    // and calls avcodec_send_packet when ready.
    const uint8_t* data = nalData;
    int remaining = static_cast<int>(nalSize);

    while (remaining > 0) {
        uint8_t* outBuf = nullptr;
        int outSize = 0;

        int consumed = av_parser_parse2(
            m->parser, m->ctx,
            &outBuf, &outSize,
            data, remaining,
            AV_NOPTS_VALUE, AV_NOPTS_VALUE, 0);

        if (consumed < 0) break;
        data += consumed;
        remaining -= consumed;

        if (outSize > 0) {
            m->pkt->data = outBuf;
            m->pkt->size = outSize;
            int ret = avcodec_send_packet(m->ctx, m->pkt);
            if (ret < 0 && ret != AVERROR(EAGAIN)) {
                SPDLOG_ERROR("VideoDecoder: avcodec_send_packet error {}", ret);
                continue;
            }
            m->deliverDecodedFrames();
        }
    }
}

void VideoDecoder::flush() {
    if (!m->ctx) return;
    std::lock_guard<std::mutex> lock(m->decodeMutex);
    avcodec_send_packet(m->ctx, nullptr);
    m->deliverDecodedFrames();
}

} // namespace ge

#endif // __ANDROID__
