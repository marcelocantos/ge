#pragma once

#include <memory>

class Renderer;

// Opaque shader program - no rendering knowledge exposed in header
class Program {
public:
    Program();
    ~Program();
    Program(Program&&) noexcept;
    Program& operator=(Program&&) noexcept;

    // Load program from compiled vertex and fragment shader files
    static Program load(const char* vsPath, const char* fsPath);

    bool isValid() const;

private:
    struct M;
    std::unique_ptr<M> m;

    Program(std::unique_ptr<M> impl);
    friend class Renderer;
    friend void submitImpl(uint16_t, const Program&);
};
