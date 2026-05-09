// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/SessionHost.h>

#include <algorithm>

namespace ge {

Rect Rect::intersection(const Rect& other) const {
    if (empty() || other.empty()) return {};
    const float l = std::max(x, other.x);
    const float t = std::max(y, other.y);
    const float r = std::min(x + w, other.x + other.w);
    const float b = std::min(y + h, other.y + other.h);
    if (r <= l || b <= t) return {};
    return Rect{l, t, r - l, b - t};
}

Rect Rect::unioned(const Rect& other) const {
    if (empty()) return other;
    if (other.empty()) return *this;
    const float l = std::min(x, other.x);
    const float t = std::min(y, other.y);
    const float r = std::max(x + w, other.x + other.w);
    const float b = std::max(y + h, other.y + other.h);
    return Rect{l, t, r - l, b - t};
}

struct Context::M {
    int surfaceWidth;
    int surfaceHeight;
    DeviceClass deviceClass;
    SafeAreaInsets drawInsets;  // display cutouts only
    SafeAreaInsets uiInsets;    // cutouts + gesture / tappable zones
    float pixelsPerPt = 1.0f;
    float deviceUiScale = 1.0f;
    la::float2 parallax{0.0f, 0.0f};
    std::shared_ptr<sqlpipe::Database> db;
};

Context::Context(int surfaceWidth, int surfaceHeight, DeviceClass deviceClass,
                 const std::string& dbPath,
                 const std::string& schemaDdl)
    : m(std::make_shared<M>(M{
        .surfaceWidth = surfaceWidth,
        .surfaceHeight = surfaceHeight,
        .deviceClass = deviceClass,
        .db = std::make_shared<sqlpipe::Database>(dbPath, schemaDdl),
    })) {}

Rect Context::drawSafeRect() const { return fullRect().inset(m->drawInsets); }
Rect Context::uiSafeRect()   const { return fullRect().inset(m->uiInsets);   }
Rect Context::fullRect()     const {
    return Rect{0, 0, float(m->surfaceWidth), float(m->surfaceHeight)};
}

DeviceClass Context::deviceClass() const { return m->deviceClass; }
float Context::pixelsPerPt() const  { return m->pixelsPerPt; }
float Context::ptsPerPixel() const  { return 1.0f / m->pixelsPerPt; }
float Context::deviceUiScale() const { return m->deviceUiScale; }
la::float2 Context::parallax() const { return m->parallax; }
std::shared_ptr<sqlpipe::Database> Context::db() const { return m->db; }

void Context::setDimensions(int surfaceWidth, int surfaceHeight) {
    m->surfaceWidth  = surfaceWidth;
    m->surfaceHeight = surfaceHeight;
}
void Context::setDrawSafeInsets(SafeAreaInsets sa) { m->drawInsets = sa; }
void Context::setUiSafeInsets(SafeAreaInsets sa)   { m->uiInsets   = sa; }
void Context::setPixelsPerPt(float v)              { m->pixelsPerPt = v; }
void Context::setDeviceUiScale(float v)            { m->deviceUiScale = v; }
void Context::setParallax(la::float2 p)            { m->parallax = p; }

} // namespace ge
