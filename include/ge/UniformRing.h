// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
#pragma once

#include <webgpu/webgpu_cpp.h>
#include <cstdint>
#include <vector>

namespace ge {

// Pool of reusable per-draw uniform buffers + bind groups.
// Replaces createImmediateUniform which creates ephemeral buffers that
// exhaust Dawn's Metal resource pool when device.Tick() runs.
//
// Usage:
//   UniformPool pool(device, layout, binding, uniformSize, maxSlots);
//   // Each frame:
//   pool.reset();
//   for each draw:
//     pool.write(queue, &data, sizeof(data));
//     pass.SetBindGroup(group, pool.current());
class UniformPool {
public:
    UniformPool() = default;
    UniformPool(wgpu::Device device, wgpu::BindGroupLayout layout,
                uint32_t binding, uint32_t uniformSize, uint32_t maxSlots);

    void reset() { cursor_ = 0; }

    // Write data to the next slot and advance. Returns the bind group.
    wgpu::BindGroup write(wgpu::Queue queue, const void* data, uint32_t size);

private:
    struct Slot {
        wgpu::Buffer buffer;
        wgpu::BindGroup bindGroup;
    };
    std::vector<Slot> slots_;
    uint32_t cursor_ = 0;
};

} // namespace ge
