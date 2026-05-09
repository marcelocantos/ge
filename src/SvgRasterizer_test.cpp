// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <doctest.h>
#include <ge/SvgRasterizer.h>

#include <string_view>

using namespace std::string_view_literals;

namespace {

constexpr std::string_view kRedRectSvg = R"SVG(<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4">
  <rect x="0" y="0" width="4" height="4" fill="#FF0000"/>
</svg>)SVG"sv;

// SVG that exercises clipPath — nanosvg (the path SDL_image used to take)
// can't render this; lunasvg can. The test verifies the clipped region is
// red and the unclipped region is transparent.
constexpr std::string_view kClippedSvg = R"SVG(<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8">
  <defs>
    <clipPath id="leftHalf">
      <rect x="0" y="0" width="4" height="8"/>
    </clipPath>
  </defs>
  <rect x="0" y="0" width="8" height="8" fill="#FF0000" clip-path="url(#leftHalf)"/>
</svg>)SVG"sv;

// Read an RGBA pixel from a SvgPixels buffer.
struct Px { uint8_t r, g, b, a; };
Px pixelAt(const ge::SvgPixels& p, int x, int y) {
    const uint8_t* base = p.rgba.data() + (static_cast<size_t>(y) * p.width + x) * 4;
    return Px{base[0], base[1], base[2], base[3]};
}

} // namespace

TEST_CASE("rasterizeSvgToPixels: solid red 4x4 produces all-red premultiplied pixels") {
    auto pixels = ge::rasterizeSvgToPixels(kRedRectSvg, 4, 4);
    REQUIRE_FALSE(pixels.isNull());
    CHECK(pixels.width == 4);
    CHECK(pixels.height == 4);
    CHECK(pixels.rgba.size() == 4u * 4u * 4u);

    for (int y = 0; y < 4; ++y) {
        for (int x = 0; x < 4; ++x) {
            auto px = pixelAt(pixels, x, y);
            CHECK(px.r == 255);
            CHECK(px.g == 0);
            CHECK(px.b == 0);
            CHECK(px.a == 255);
        }
    }
}

TEST_CASE("rasterizeSvgToPixels: clipPath divides red and transparent regions") {
    auto pixels = ge::rasterizeSvgToPixels(kClippedSvg, 8, 8);
    REQUIRE_FALSE(pixels.isNull());
    CHECK(pixels.width == 8);
    CHECK(pixels.height == 8);

    // Left half: clipped-in, fully red.
    for (int y = 0; y < 8; ++y) {
        for (int x = 0; x < 4; ++x) {
            auto px = pixelAt(pixels, x, y);
            CHECK(px.r == 255);
            CHECK(px.a == 255);
        }
    }

    // Right half: clipped-out, transparent.
    for (int y = 0; y < 8; ++y) {
        for (int x = 4; x < 8; ++x) {
            auto px = pixelAt(pixels, x, y);
            CHECK(px.a == 0);
        }
    }
}

TEST_CASE("rasterizeSvgToPixels: malformed SVG returns null") {
    auto pixels = ge::rasterizeSvgToPixels("not an svg"sv, 4, 4);
    CHECK(pixels.isNull());
    CHECK(pixels.rgba.empty());
}

TEST_CASE("rasterizeSvgToPixels: <text> renders glyphs via the lazy default font") {
    // 64×32 with a "Hi" at y=22 in a 20px sans-serif. The actual glyph metrics
    // depend on which platform font resolveFont picks, but any reasonable
    // sans-serif draws SOME ink in the left portion of the image. We only
    // assert "non-trivial number of opaque pixels in the text band" rather
    // than exact glyph shapes, which would be brittle across platforms.
    constexpr std::string_view svg = R"SVG(<svg xmlns="http://www.w3.org/2000/svg" width="64" height="32">
  <text x="2" y="22" font-family="sans-serif" font-size="20" fill="#000000">Hi</text>
</svg>)SVG"sv;

    auto pixels = ge::rasterizeSvgToPixels(svg, 64, 32);
    REQUIRE_FALSE(pixels.isNull());
    CHECK(pixels.width == 64);
    CHECK(pixels.height == 32);

    int inkPixels = 0;
    for (int y = 0; y < pixels.height; ++y) {
        for (int x = 0; x < pixels.width; ++x) {
            if (pixelAt(pixels, x, y).a > 0) ++inkPixels;
        }
    }

    // Rough sanity floor: a 20px-tall "Hi" should ink at least a couple of
    // dozen pixels even on the most lightweight default font. If this hits
    // zero, the font path is broken (or no system font found at all).
    CHECK(inkPixels > 20);
}

TEST_CASE("rasterizeSvgToPixels: 50% alpha rect produces premultiplied pixels") {
    constexpr std::string_view svg = R"SVG(<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2">
  <rect x="0" y="0" width="2" height="2" fill="#FF0000" fill-opacity="0.5"/>
</svg>)SVG"sv;
    auto pixels = ge::rasterizeSvgToPixels(svg, 2, 2);
    REQUIRE_FALSE(pixels.isNull());

    // 50% alpha red premultiplied: R=128, G=0, B=0, A=128 (give or take rounding).
    auto px = pixelAt(pixels, 0, 0);
    CHECK(px.a >= 126);
    CHECK(px.a <= 130);
    CHECK(px.r >= 126);
    CHECK(px.r <= 130);
    CHECK(px.g == 0);
    CHECK(px.b == 0);
    // Premultiplication invariant: R <= A (within 1 LSB of rounding).
    CHECK(px.r <= px.a + 1);
}
