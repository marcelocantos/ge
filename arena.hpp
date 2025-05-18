#pragma once

#include <cstdio>
#include <memory>
#include <utility>
#include <vector>

namespace ge::arena {

class arena {
public:
  arena() {}
  arena(const arena &) = delete;
  arena(arena &&) = default;

  arena &operator=(const arena &) = delete;
  arena &operator=(arena &&) = default;

  template <class T> T *alloc() {
    constexpr a = alignof(T);
    constexpr s = sizeof(T);
    size_t begin = (cur_ + a - 1) / a * a;

    const auto &buf = bufs_.last();
    if (end_ - begin < s) {
      auto cap = std::max(4096, s);
      buf = bufs_.emplace_back(new char[cap]);
      end_ = buf + cap;
      size_ = 0;
    }
    size_ = end;
    return buf + offset;
  }

private:
  std::vector<char *> bufs_;
  char *end_ = nullptr;
  char *cur_ = nullptr;
};

} // namespace ge::arena
