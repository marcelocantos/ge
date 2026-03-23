// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include <ge/UniformRing.h>

namespace ge {

UniformPool::UniformPool(wgpu::Device device, wgpu::BindGroupLayout layout,
                         uint32_t binding, uint32_t uniformSize, uint32_t maxSlots) {
    slots_.resize(maxSlots);
    for (auto& slot : slots_) {
        wgpu::BufferDescriptor bufDesc{
            .usage = wgpu::BufferUsage::Uniform | wgpu::BufferUsage::CopyDst,
            .size = uniformSize,
        };
        slot.buffer = device.CreateBuffer(&bufDesc);

        wgpu::BindGroupEntry entry{.binding = binding, .buffer = slot.buffer, .size = uniformSize};
        wgpu::BindGroupDescriptor desc{.layout = layout, .entryCount = 1, .entries = &entry};
        slot.bindGroup = device.CreateBindGroup(&desc);
    }
}

wgpu::BindGroup UniformPool::write(wgpu::Queue queue, const void* data, uint32_t size) {
    auto& slot = slots_[cursor_];
    queue.WriteBuffer(slot.buffer, 0, data, size);
    cursor_++;
    if (cursor_ >= slots_.size()) cursor_ = 0;
    return slot.bindGroup;
}

} // namespace ge
