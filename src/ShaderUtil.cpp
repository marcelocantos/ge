#include "ShaderUtil.h"
#include <spdlog/spdlog.h>
#include <fstream>
#include <stdexcept>

namespace sq {

namespace {

ShaderHandle loadShaderFile(const char* path) {
    std::ifstream file(path, std::ios::binary | std::ios::ate);
    if (!file) {
        throw std::runtime_error(
            fmt::format("Failed to open shader file: {}", path));
    }

    auto size = file.tellg();
    file.seekg(0);

    const bgfx::Memory* mem = bgfx::alloc(static_cast<uint32_t>(size) + 1);
    file.read(reinterpret_cast<char*>(mem->data), size);
    mem->data[size] = '\0';

    try {
        return ShaderHandle(bgfx::createShader(mem));
    } catch (const std::exception& e) {
        throw std::runtime_error(
            fmt::format("Failed to create shader from {}: {}", path, e.what()));
    }
}

} // anonymous namespace

ProgramHandle loadProgram(const char* vsPath, const char* fsPath) {
    try {
        ShaderHandle vsh = loadShaderFile(vsPath);
        ShaderHandle fsh = loadShaderFile(fsPath);
        return ProgramHandle(bgfx::createProgram(vsh, fsh, false));
    } catch (const std::exception& e) {
        throw std::runtime_error(
            fmt::format("Failed to link program {} + {}: {}", vsPath, fsPath, e.what()));
    }
}

} // namespace sq
