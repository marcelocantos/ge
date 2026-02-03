#pragma once

#include <memory>

class Renderer;
class Uniform;

// Pure asset class for textures - no rendering knowledge exposed in header
class Texture {
public:
    Texture();
    ~Texture();
    Texture(Texture&&) noexcept;
    Texture& operator=(Texture&&) noexcept;

    // Load texture from image file (PNG, etc.)
    static Texture fromFile(const char* path);

    bool isValid() const;
    int width() const;
    int height() const;

private:
    struct M;
    std::unique_ptr<M> m;

    Texture(std::unique_ptr<M> impl);
    friend class Renderer;
    friend void setTextureImpl(uint8_t, const Uniform&, const Texture&);
};
