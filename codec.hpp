// Copyright 2024 Marcelo Cantos <marcelo.cantos@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
#pragma once

#include <array>
#include <bit>
#include <concepts>
#include <cstdint>
#include <functional>
#include <memory>
#include <string>
#include <unordered_map>
#include <vector>

// Encode C++ structures for efficient transmission over the wire.
//
// This library encodes and decodes a variety of C++ data types for
// storage or transmission. It supports a limited set of types out of the box
// but can be extended arbitrarily by implementing operator%.
//
// Usage:
//
//  int x = 42;
//  std::string bytes = ge::codec::encoded(x);
//  auto y = ge::codec::decoded<int>(bytes);
//
//  // low level interface (arbitrary readers and writers)
//  std::stringstream ss;
//
//  std::array<int, 5> in{1, 4, 9, 16, 25};
//  codec::encode(in, [&](const char *s, size_t n) { ss.write(s, n); });
//
//  std::array<int, 5> out;
//  codec::decode(out, [&](char *s, size_t n) { ss.read(s, n); });
//
//
// Format specification ([x]y denotes x bytes of y):
//  - bool: [1]x
//  - unsigned integers and single-byte chars:
//    - sizeof(x) == 1: [1]x
//    - < 31: [1]x
//    - >= 31: [1](32 + n) + [n]le(x) where n covers all non-zero bytes.
//  - signed integers and single-byte chars:
//    - sizeof(x) == 1: [1]x
//    - >= 0: 2 * unsigned(x)
//    - < 0: 2 * ~unsigned(x) - 1
//  - multi-byte chars: [x]sizeof(x)
//  - floating point: [sizeof(x)]le(x)
//  - std::(shared|unique)_ptr: bool(x) + (if true) *x
//  - std::string: x.size() + [x.size()]x.data()
//  - std::array: x[0] + x[1] + ... + x[n - 1]
//  - std::vector: x.size() + x[0] + x[1] + ... + x[x.size() - 1]
//  - std::(unordered_)?map: x.size() + k[0] + v[0] + ...
//  - T:
//      template <::ge::codec::Codec C> void operator%(C &c, T &x) {
//        // T is a struct in this example, though any type is permitted.
//        c % x.a;
//        c % x.b;
//        ⋮
//        c % x.z;
//      }
//
// Notes:
//
//  - (x, n) denotes the first n bytes of x.
//  - le(x) denotes x in little-endian byte order.
//  - Numeric types can be at most 64-bits in size.
//  - The format is not self-describing.

#ifndef GE_CODEC_ALLOW_BIG_ENDIAN
static_assert(std::endian::native == std::endian::little,
              "Only little endian has been tested.");
#endif

namespace ge::codec {

enum class Kind {
  BOOL,
  CHAR,
  UINT,
  INT,
};

using write = std::function<void(const char *, size_t)>;

struct Encoder {
  write w;

  Encoder &operator()(const void *data, size_t n) {
    w((const char *)data, n);
    return *this;
  }
};

using read = std::function<void(char *, size_t)>;

struct Decoder {
  read r;

  Decoder &operator()(void *data, size_t n) {
    r((char *)data, n);
    return *this;
  }
};

namespace detail {

// Swap bytes on a big endian architecture.
template <typename T> constexpr T swap_big_endian(T x) {
//  if constexpr (std::endian::native == std::endian::little) {
    return x;
//  } else {
//    return std::byteswap(x);
//  }
}

template <typename T>
concept SmartPointer = requires(T ptr, typename T::element_type *rawPtr) {
  { ptr.get() } -> std::convertible_to<typename T::element_type *>;
  typename T::element_type;
  T{rawPtr};
};

template <typename T>
concept WideChar = (std::same_as<T, wchar_t> || std::same_as<T, char16_t> ||
                    std::same_as<T, char32_t>) &&
                   sizeof(T) > 1;

template <typename T>
concept EncodableInt = !detail::WideChar<T> && sizeof(T) <= 8;

} // namespace detail

template <typename C>
concept Codec = std::same_as<C, Encoder> || std::same_as<C, Decoder>;

template <std::unsigned_integral T>
  requires(detail::EncodableInt<T>)
void operator%(Encoder &e, T x) {
  if constexpr (sizeof(T) == 1) {
    e(&x, 1);
  } else if (x < 31) {
    e(&x, 1);
  } else {
    uint8_t nbytes = 1 + (std::bit_width(x) - 1) / 8;
    uint8_t prefix = nbytes * 32 - 1;
    x = detail::swap_big_endian(x);
    e(&prefix, 1)(&x, nbytes);
  }
}

template <std::unsigned_integral T>
  requires(detail::EncodableInt<T>)
void operator%(Decoder &d, T &x) {
  if constexpr (sizeof(T) == 1) {
    d(&x, 1);
  }
  uint8_t prefix;
  d % prefix;
  if (prefix < 31) {
    x = prefix;
  } else {
    T y = 0;
    auto nbytes = (prefix + 1) / 32;
    d(&y, nbytes);
    x = detail::swap_big_endian(y);
  }
}

template <std::signed_integral T>
  requires(detail::EncodableInt<T>)
void operator%(Encoder &e, T x) {
  auto u = std::make_unsigned_t<T>(x);
  if constexpr (sizeof(T) == 1) {
    e(&x, 1);
  } else if (x >= 0) {
    e % (2 * u);
  } else {
    e % (2 * ~u + 1);
  }
}

template <std::signed_integral T>
  requires(detail::EncodableInt<T>)
void operator%(Decoder &d, T &x) {
  if constexpr (sizeof(T) == 1) {
    d(&x, 1);
  } else {
    using U = std::make_unsigned_t<T>;
    U u;
    d % u;
    if (u & 1) {
      x = ~T((u - 1) / 2);
    } else {
      x = u / 2;
    }
  }
}

template <detail::WideChar T> void operator%(Encoder &e, T &x) {
  x = detail::swap_big_endian(x);
  e(&x, sizeof(x));
}

template <detail::WideChar T> void operator%(Decoder &d, T &x) {
  d(&x, sizeof(x));
  x = detail::swap_big_endian(x);
}

template <std::floating_point T> void operator%(Encoder &e, T &x) {
  x = detail::swap_big_endian(x);
  e(&x, sizeof(T));
}

template <std::floating_point T> void operator%(Decoder &d, T &x) {
  d(&x, sizeof(T));
  x = detail::swap_big_endian(x);
}

template <detail::SmartPointer P> void operator%(Encoder &e, const P &x) {
  e % bool(x);
  if (x) {
    e % *const_cast<typename P::element_type *>(x.get());
  }
}

template <detail::SmartPointer P> void operator%(Decoder &d, P &x) {
  bool exists;
  d % exists;
  if (exists) {
    auto t = new typename P::element_type;
    d % *t;
    x = P(t);
  }
}

template <class Ch> void operator%(Encoder &c, const std::basic_string<Ch> &x) {
  c % x.length();
  c(x.data(), x.length() * sizeof(Ch));
}

template <class Ch> void operator%(Decoder &d, std::basic_string<Ch> &x) {
  size_t n;
  d % n;
  x.resize(n);
  d(x.data(), n * sizeof(Ch));
}

template <Codec C, class T, size_t N>
void operator%(C &c, std::array<T, N> &x) {
  for (auto &t : x) {
    c % t;
  }
}

template <class T> void operator%(Decoder &d, std::vector<T> &x) {
  size_t n;
  d % n;
  x.clear();
  x.reserve(n);
  while (n--) {
    T t;
    d % t;
    x.push_back(std::move(t));
  }
}

template <class T> void operator%(Encoder &e, const std::vector<T> &x) {
  e % x.size();
  for (auto &t : x) {
    e % const_cast<T &>(t);
  }
}

namespace detail {
template <typename T>
concept AssociativeMap =
    requires(T a, typename T::key_type key, typename T::mapped_type value) {
      typename T::key_type;
      typename T::mapped_type;
    };
} // namespace detail

template <detail::AssociativeMap M> void operator%(Encoder &e, const M &x) {
  e % x.size();
  for (auto [k, v] : x) {
    using K = typename M::key_type;
    using V = typename M::mapped_type;
    e % const_cast<K &>(k);
    e % const_cast<V &>(v);
  }
}

template <detail::AssociativeMap M> void operator%(Decoder &d, M &x) {
  size_t n;
  d % n;
  while (n--) {
    typename M::key_type k;
    typename M::mapped_type v;
    d % k;
    d % v;
    x[std::move(k)] = std::move(v);
  }
}

write make_writer(std::string &s) {
  return [&](const char *data, size_t n) { s.append(data, n); };
}

template <class T> void encode(const T &t, write w) {
  Encoder enc{w};
  enc % const_cast<T &>(t);
}

template <class T> std::string encoded(const T &t, size_t cap = 1024) {
  std::string s;
  auto enc = Encoder{make_writer(s)};
  enc % const_cast<T &>(t);
  return s;
}

read make_reader(std::string_view data) {
  auto state = std::make_shared<std::string_view>(data);
  return [state = std::move(state)](char *dest, size_t n) {
    if (state->length() < n) {
      throw std::runtime_error{"eof"};
    }
    std::memcpy(dest, state->data(), n);
    *state = state->substr(n);
  };
}

template <class T> void decode(T &t, read r) {
  auto dec = Decoder{r};
  dec % t;
}

template <class T> T decoded(read r) {
  T t;
  decode(t, r);
  return t;
}

template <class T> T decoded(std::string_view v) {
  return decoded<T>(make_reader(v));
}

} // namespace ge::codec
