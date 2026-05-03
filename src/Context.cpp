// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/SessionHost.h>

namespace ge {

struct Context::M {
    int width;
    int height;
    DeviceClass deviceClass;
    SafeAreaInsets safeArea;
    std::shared_ptr<sqlpipe::Database> db;
};

Context::Context(int width, int height, DeviceClass deviceClass,
                 const std::string& dbPath,
                 const std::string& schemaDdl)
    : m(std::make_shared<M>(M{width, height, deviceClass, {},
        std::make_shared<sqlpipe::Database>(dbPath, schemaDdl)})) {}

int Context::width() const { return m->width; }
int Context::height() const { return m->height; }
DeviceClass Context::deviceClass() const { return m->deviceClass; }
SafeAreaInsets Context::safeArea() const { return m->safeArea; }
void Context::setSafeArea(SafeAreaInsets sa) { m->safeArea = sa; }
std::shared_ptr<sqlpipe::Database> Context::db() const { return m->db; }

} // namespace ge
