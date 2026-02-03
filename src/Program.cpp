#include "ProgramInternal.h"
#include <bgfx/bgfx.h>
#include <format>
#include <fstream>
#include <stdexcept>

Program::Program() : m(std::make_unique<M>()) {}
Program::~Program() = default;
Program::Program(Program&&) noexcept = default;
Program& Program::operator=(Program&&) noexcept = default;

Program::Program(std::unique_ptr<M> impl) : m(std::move(impl)) {}

bool Program::isValid() const { return m && m->handle.isValid(); }

namespace {

const bgfx::Memory* loadShaderMem(const char* path) {
    try {
        std::ifstream file(path, std::ios::binary | std::ios::ate);
        if (!file) {
            throw std::runtime_error("file not found");
        }

        auto size = file.tellg();
        file.seekg(0);

        const bgfx::Memory* mem = bgfx::alloc(static_cast<uint32_t>(size) + 1);
        file.read(reinterpret_cast<char*>(mem->data), size);
        mem->data[size] = '\0';

        return mem;
    } catch (const std::exception& e) {
        throw std::runtime_error(
            std::format("Failed to load shader {}: {}", path, e.what()));
    }
}

} // anonymous namespace

Program Program::load(const char* vsPath, const char* fsPath) {
    try {
        ShaderHandle vsh(bgfx::createShader(loadShaderMem(vsPath)));
        ShaderHandle fsh(bgfx::createShader(loadShaderMem(fsPath)));

        auto impl = std::make_unique<M>();
        impl->handle = ProgramHandle(bgfx::createProgram(vsh, fsh, false));
        return Program(std::move(impl));
    } catch (const std::exception& e) {
        throw std::runtime_error(
            std::format("Failed to link program {} + {}: {}", vsPath, fsPath, e.what()));
    }
}
