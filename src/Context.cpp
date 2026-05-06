// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/SessionHost.h>

namespace ge {

struct Context::M {
    int surfaceWidth;
    int surfaceHeight;
    DeviceClass deviceClass;
    SafeAreaInsets drawInsets;  // display cutouts only
    SafeAreaInsets uiInsets;    // cutouts + gesture / tappable zones
    std::shared_ptr<sqlpipe::Database> db;
};

namespace {
Rect rectFromInsets(int sw, int sh, const SafeAreaInsets& sa) {
    return Rect{float(sa.left), float(sa.top),
                float(sw - sa.left - sa.right), float(sh - sa.top - sa.bottom)};
}
}

Context::Context(int surfaceWidth, int surfaceHeight, DeviceClass deviceClass,
                 const std::string& dbPath,
                 const std::string& schemaDdl)
    : m(std::make_shared<M>(M{surfaceWidth, surfaceHeight, deviceClass, {}, {},
        std::make_shared<sqlpipe::Database>(dbPath, schemaDdl)})) {}

Rect Context::drawSafeRect() const {
    return rectFromInsets(m->surfaceWidth, m->surfaceHeight, m->drawInsets);
}
Rect Context::uiSafeRect() const {
    return rectFromInsets(m->surfaceWidth, m->surfaceHeight, m->uiInsets);
}
Rect Context::fullRect() const {
    return Rect{0, 0, float(m->surfaceWidth), float(m->surfaceHeight)};
}

DeviceClass Context::deviceClass() const { return m->deviceClass; }
std::shared_ptr<sqlpipe::Database> Context::db() const { return m->db; }

void Context::setDimensions(int surfaceWidth, int surfaceHeight) {
    m->surfaceWidth  = surfaceWidth;
    m->surfaceHeight = surfaceHeight;
}
void Context::setDrawSafeInsets(SafeAreaInsets sa) { m->drawInsets = sa; }
void Context::setUiSafeInsets(SafeAreaInsets sa)   { m->uiInsets   = sa; }

} // namespace ge
