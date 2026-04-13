// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/SessionHost.h>

namespace ge {

struct Context::M {
    int width;
    int height;
    DeviceClass deviceClass;
    std::shared_ptr<sqlpipe::Database> db;
};

Context::Context(int width, int height, DeviceClass deviceClass,
                 const std::string& dbPath)
    : m(std::make_shared<M>(M{width, height, deviceClass,
        std::make_shared<sqlpipe::Database>(dbPath)})) {}

int Context::width() const { return m->width; }
int Context::height() const { return m->height; }
DeviceClass Context::deviceClass() const { return m->deviceClass; }
std::shared_ptr<sqlpipe::Database> Context::db() const { return m->db; }

} // namespace ge
