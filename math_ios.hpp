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

#include <algorithm>
#include <iostream>
#include <string>

#include "math.h"

namespace ge {

namespace detail {

std::string padding{"                    "};

std::array<std::string_view, 2> split2(std::string_view str, char delim) {
  std::size_t pos = str.find(delim);

  if (pos == std::string_view::npos) {
    // Character not found: return the whole string in the first element
    return {str, ""};
  } else {
    // Split into two parts
    return {str.substr(0, pos), str.substr(pos)};
  }
}

template <class T, class Size> std::string to_string(const T &t, Size prec) {
  std::ostringstream oss;
  oss.precision(prec);
  oss << t; // This uses the same formatting as std::cout << f
  return oss.str();
}

} // namespace detail

inline std::ostream &operator<<(std::ostream &os, const vec3 &v) {
  return os << "[" << v.x << ", " << v.y << ", " << v.z << "]";
}

inline std::ostream &operator<<(std::ostream &os, const vec4 &v) {
  return os << "[" << v.x << ", " << v.y << ", " << v.z << ", " << v.w << "]";
}

inline std::ostream &operator<<(std::ostream &os, const mat4 &m) {
  std::ostringstream s, t, u, v;
  s << "⎧";
  t << "⎭";
  u << "⎫";
  v << "⎩";
  int i = 0;
  auto pad = [&](const char *suffix = "") {
    auto width = std::max({s.tellp(), t.tellp(), u.tellp(), v.tellp()});
    for (auto f : {&s, &t, &u, &v}) {
      *f << std::setw(width - f->tellp()) << "" << suffix;
    }
  };
  for (auto &col : m.data()) {
    if (i++) {
      pad(", ");
    }
    auto prec = os.precision();
    auto xs = detail::to_string(col.x, prec);
    auto [xi, xd] = detail::split2(xs, '.');
    auto ys = detail::to_string(col.y, prec);
    auto [yi, yd] = detail::split2(ys, '.');
    auto zs = detail::to_string(col.z, prec);
    auto [zi, zd] = detail::split2(zs, '.');
    auto ws = detail::to_string(col.w, prec);
    auto [wi, wd] = detail::split2(ws, '.');
    size_t widthi = std::max({xi.size(), yi.size(), zi.size(), wi.size()});
    s << std::right << std::setw(widthi) << xi << xd;
    t << std::right << std::setw(widthi) << yi << yd;
    u << std::right << std::setw(widthi) << zi << zd;
    v << std::right << std::setw(widthi) << wi << wd;
    // s << col.x;
    // t << col.y;
    // u << col.z;
    // v << col.w;
  };
  pad();
  s << "⎫\n";
  t << "⎩\n";
  u << "⎧\n";
  v << "⎭";
  return os << s.str() << t.str() << u.str() << v.str();
}

} // namespace ge
