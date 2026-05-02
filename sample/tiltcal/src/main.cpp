// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// TiltCal — raw SDL3 accelerometer readout, monster text. No state
// machine, no orientation lock — just X / Y / Z values continually.

#include <ge/Protocol.h>
#include <ge/SessionHost.h>

#include <bgfx/bgfx.h>
#include <SDL3/SDL.h>
#include <SDL3/SDL_main.h>

#include <cstdio>
#include <cstring>

#ifdef GE_IOS
#import <Foundation/Foundation.h>
#endif

namespace {

float g_data[3] = {0, 0, 0};

// 7×5 bitmap font for the characters we need: 0-9, '.', '+', '-', ':',
// 'X', 'Y', 'Z', and ' '. Each glyph is 7 rows of 5 columns; bit 4 (0x10)
// is the leftmost pixel.
struct Glyph { uint8_t rows[7]; };
constexpr Glyph kFont[] = {
    // '0'
    {{0b01110, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b01110}},
    // '1'
    {{0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110}},
    // '2'
    {{0b01110, 0b10001, 0b00001, 0b00010, 0b00100, 0b01000, 0b11111}},
    // '3'
    {{0b11110, 0b00001, 0b00001, 0b01110, 0b00001, 0b00001, 0b11110}},
    // '4'
    {{0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010}},
    // '5'
    {{0b11111, 0b10000, 0b11110, 0b00001, 0b00001, 0b10001, 0b01110}},
    // '6'
    {{0b00110, 0b01000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110}},
    // '7'
    {{0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000}},
    // '8'
    {{0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110}},
    // '9'
    {{0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00010, 0b01100}},
    // '.'
    {{0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b01100, 0b01100}},
    // '+'
    {{0b00000, 0b00100, 0b00100, 0b11111, 0b00100, 0b00100, 0b00000}},
    // '-'
    {{0b00000, 0b00000, 0b00000, 0b11111, 0b00000, 0b00000, 0b00000}},
    // ':'
    {{0b00000, 0b01100, 0b01100, 0b00000, 0b01100, 0b01100, 0b00000}},
    // 'X'
    {{0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001}},
    // 'Y'
    {{0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100}},
    // 'Z'
    {{0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111}},
    // ' '
    {{0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000, 0b00000}},
};

const Glyph* glyphFor(char c) {
    switch (c) {
    case '0': case '1': case '2': case '3': case '4':
    case '5': case '6': case '7': case '8': case '9':
        return &kFont[c - '0'];
    case '.': return &kFont[10];
    case '+': return &kFont[11];
    case '-': return &kFont[12];
    case ':': return &kFont[13];
    case 'X': return &kFont[14];
    case 'Y': return &kFont[15];
    case 'Z': return &kFont[16];
    default:  return &kFont[17];  // space / unknown
    }
}

// Print a string at (cellRow, cellCol) using `█` blocks per glyph pixel,
// scaled by `scale` (each glyph pixel becomes scale×scale dbgText cells).
void drawBig(int row, int col, const char* s, int scale, uint8_t color) {
    constexpr int glyphW = 5;
    constexpr int glyphH = 7;
    constexpr char kBlock = (char)0xDB;  // █
    char rowbuf[256];

    int len = (int)std::strlen(s);
    int strideCols = (glyphW + 1) * scale;  // +1 pixel gap between glyphs

    for (int gy = 0; gy < glyphH; ++gy) {
        for (int sy = 0; sy < scale; ++sy) {
            int outCol = 0;
            std::memset(rowbuf, ' ', sizeof(rowbuf));
            for (int i = 0; i < len; ++i) {
                const Glyph* g = glyphFor(s[i]);
                uint8_t bits = g->rows[gy];
                for (int gx = 0; gx < glyphW; ++gx) {
                    bool on = (bits >> (glyphW - 1 - gx)) & 1;
                    char ch = on ? kBlock : ' ';
                    for (int sx = 0; sx < scale; ++sx) {
                        if (outCol < (int)sizeof(rowbuf) - 1) {
                            rowbuf[outCol++] = ch;
                        }
                    }
                }
                // Inter-glyph gap.
                for (int sx = 0; sx < scale; ++sx) {
                    if (outCol < (int)sizeof(rowbuf) - 1) {
                        rowbuf[outCol++] = ' ';
                    }
                }
            }
            rowbuf[outCol] = 0;
            int textRow = row + gy * scale + sy;
            bgfx::dbgTextPrintf(col, textRow, color, "%s", rowbuf);
        }
    }
    (void)strideCols;
}

}  // namespace

int main(int /*argc*/, char* /*argv*/[]) {
    ge::run([&](ge::Context /*ctx*/) -> ge::RunConfig {
        bgfx::setDebug(BGFX_DEBUG_TEXT);
        return {
            .onUpdate = [&](float /*dt*/) {},
            .onRender = [&](int w, int h) {
                bgfx::setViewClear(0, BGFX_CLEAR_COLOR, 0xff00ffff, 1.0f, 0);  // diag: magenta clear
                bgfx::setViewRect(0, 0, 0, (uint16_t)w, (uint16_t)h);
                bgfx::touch(0);
                bgfx::dbgTextClear();

                int cols = w / 8;     // dbgText cell is 8x16 px
                int rows = h / 16;

                // Pick the largest scale that fits 3 lines of "X: +9.99"
                // (8 chars wide, 5+1=6 glyph-cols each = 48 glyph-cols,
                // plus 7 glyph-rows tall × 3 lines + gaps).
                int maxScaleW = cols / (8 * 6);              // 48 glyph-cols
                int maxScaleH = rows / (3 * (7 + 2));        // 3 lines, 9 glyph-rows each
                int scale = maxScaleW < maxScaleH ? maxScaleW : maxScaleH;
                if (scale < 1) scale = 1;

                int blockW = 8 * 6 * scale;
                int blockH = 3 * (7 + 2) * scale;
                int col0 = (cols - blockW) / 2;
                int row0 = (rows - blockH) / 2;
                if (col0 < 0) col0 = 0;
                if (row0 < 0) row0 = 0;

                char line[32];
                for (int axis = 0; axis < 3; ++axis) {
                    char label = "XYZ"[axis];
                    std::snprintf(line, sizeof(line), "%c: %+05.1f", label, g_data[axis]);
                    int r = row0 + axis * (7 + 2) * scale;
                    drawBig(r, col0, line, scale, 0x0F);
                }
            },
            .onEvent = [&](const SDL_Event& e) {
                if (e.type == SDL_EVENT_SENSOR_UPDATE) {
                    g_data[0] = e.sensor.data[0];
                    g_data[1] = e.sensor.data[1];
                    g_data[2] = e.sensor.data[2];
                }
            },
            .onShutdown = [] {},
        };
    }, {
        .width = 1024, .height = 768,
        .headless = false,
        .appName = "tiltcal",
        .sensors = wire::kSensorAccelerometer,
        .orientation = 0,  // no lock
        .disableScreenSaver = true,
    });
}
