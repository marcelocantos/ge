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
#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"

#include "codec.hpp"

using namespace ge;

namespace std {
template <class T>
std::ostream &operator<<(std::ostream &os, const std::vector<T> &v) {
  os << "[";
  for (auto t : v) {
    os << " " << t;
  }
  return os << " ]";
}
} // namespace std

std::string bytes(const std::string &str) {
  std::ostringstream oss;
  oss << "<" << std::hex;
  for (size_t i = 0; i < str.size(); ++i) {
    if (i) {
      oss << " ";
    }
    oss << (int)(unsigned char)str[i];
  }
  oss << std::dec << ">:" << str.length();
  return oss.str();
}

#define check_encode(value, expected)                                          \
  do {                                                                         \
    auto v = (value);                                                          \
    auto e = (expected);                                                       \
    auto actual = codec::encoded(v);                                           \
    CHECK_MESSAGE(actual == e, "expected ", #value, " => ", bytes(e),          \
                  " but got ", bytes(actual));                                 \
  } while (0)

TEST_CASE("codec::encode basic") {
  check_encode(int64_t{1}, std::string{"\x02"});
  check_encode(int64_t{2048}, (std::string{"\x3f\0\x10", 3}));
  check_encode(uint64_t{2048}, (std::string{"\x3f\0\x08", 3}));
  check_encode(std::string{"hello"}, (std::string{"\x05hello", 1 + 5}));
  check_encode(std::u8string{u8"Hello, 世界"},
               (std::string{"\x0dHello, \xe4\xb8\x96\xe7\x95\x8c", 1 + 13}));
}

#define check_decode(expected, code)                                           \
  do {                                                                         \
    auto e = (expected);                                                       \
    auto c = (code);                                                           \
    auto actual = codec::decoded<decltype(expected)>(c);                       \
    CHECK_MESSAGE(actual == e, "expected ", code, " => ", #expected,           \
                  " but got ", actual);                                        \
  } while (0)

TEST_CASE("codec::decode basic") {
  check_decode(int64_t{1}, std::string{"\x02"});
  check_decode(int64_t{2048}, (std::string{"\x3f\0\x10", 3}));
  check_decode(uint64_t{2048}, (std::string{"\x3f\0\x08", 3}));
  check_decode(std::string{"hello"}, (std::string{"\x05hello", 1 + 5}));
  check_decode(std::u8string{u8"Hello, 世界"},
               (std::string{"\x0dHello, \xe4\xb8\x96\xe7\x95\x8c", 1 + 13}));
}

#define check_roundtrip(value)                                                 \
  do {                                                                         \
    auto e = codec::encoded(value);                                            \
    auto actual = codec::decoded<decltype(value)>(e);                          \
    CHECK_MESSAGE(actual == value, value, " => ", bytes(e), " => ", actual);   \
  } while (0)

TEST_CASE("codec::rountrip basic") {
  check_roundtrip(true);
  check_roundtrip(false);
  check_roundtrip(1);
  check_roundtrip(1U);
  check_roundtrip(-1);
  check_roundtrip(2048);
  check_roundtrip(2048U);
  check_roundtrip(2048ULL);
  check_roundtrip(-2048);
  check_roundtrip('x');
  check_roundtrip(u8'x');
  check_roundtrip(U'世');
  check_roundtrip(std::numeric_limits<int>::max());
  check_roundtrip(std::numeric_limits<int>::min());
  check_roundtrip(std::numeric_limits<unsigned>::max());
  check_roundtrip(std::numeric_limits<int64_t>::max());
  check_roundtrip(std::numeric_limits<int64_t>::min());
  check_roundtrip(std::numeric_limits<uint64_t>::max());
  check_roundtrip(std::string{"hello"});
  check_roundtrip(std::u8string{u8"Hello, 世界"});
}

TEST_CASE("ge:codec roundtrip ints") {
  for (int i = -10'000; i <= 10'000; i++) {
    check_roundtrip(i);
  }

  for (int exp = 0; exp < 64; exp++) {
    for (uint64_t off = -2; off <= 2; off++) {
      uint64_t i = (1ull << exp) + off;
      check_roundtrip(i);
    }
  }
}

TEST_CASE("codec roundtrip vector") {
  check_roundtrip((std::vector<std::string>{"au", "us", "uk"}));
  check_roundtrip((std::vector<int>{65, 1, 44}));
}

TEST_CASE("codec roundtrip array") {
  check_roundtrip((std::array<std::string, 3>{"au", "us", "uk"}));
  check_roundtrip((std::array<int, 3>{65, 1, 44}));
}

TEST_CASE("codec roundtrip map") {
  check_roundtrip((
      std::unordered_map<std::string, int>{{"au", 65}, {"us", 1}, {"uk", 44}}));
}

TEST_CASE("codec roundtrip shared_ptr") {
  auto p = std::make_shared<int>(42);
  auto e = codec::encoded(p);
  auto q = codec::decoded<std::shared_ptr<int>>(e);
  CHECK(*q == *p);

  p.reset();
  e = codec::encoded(p);
  q = codec::decoded<std::shared_ptr<int>>(e);
  CHECK(!q);
}

TEST_CASE("codec roundtrip unique_ptr") {
  auto p = std::make_unique<int>(42);
  auto e = codec::encoded(p);
  auto q = codec::decoded<std::shared_ptr<int>>(e);
  CHECK(*q == *p);

  p.reset();
  e = codec::encoded(p);
  q = codec::decoded<std::shared_ptr<int>>(e);
  CHECK(!q);
}

TEST_CASE("codec roundtrip array") {
  check_roundtrip((std::array<int, 5>{1, 2, 4, 3, 5}));
}

struct Foo {
  std::string x;
  std::shared_ptr<double> y;
  std::vector<Foo> children;

  bool operator==(const Foo &that) const {
    return x == that.x && (!y == !that.y && (!y || *y == *that.y)) &&
           children == that.children;
  }
};

template <codec::Codec C> C &operator%(C &c, Foo &x) {
  return c % x.x % x.y % x.children;
}

TEST_CASE("codec roundtrip") {
  auto shared = [](auto d) { return std::make_shared<decltype(d)>(d); };
  Foo foo = {
      "/",
      shared(3.142),
      {
          {"abc", shared(2.718)},
          {
              "tmol",
              shared(42.0),
              {
                  {"trmol", shared(56.0)},
              },
          },
      },
  };
  check_roundtrip(foo);
}

TEST_CASE("codec low level") {
  std::stringstream ss;

  std::array<int, 5> in{1, 4, 9, 16, 25};
  codec::encode(in, [&](const char *s, size_t n) { ss.write(s, n); });

  std::array<int, 5> out;
  codec::decode(out, [&](char *s, size_t n) { ss.read(s, n); });

  CHECK(in == out);
}
