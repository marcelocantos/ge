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

#include <cmath>
#include <numbers>
#include <random>

#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"

#include "math.hpp"
#include "math_ios.hpp"

using namespace ge;

constexpr float π = std::numbers::pi;
constexpr float rr2 = 1 / std::numbers::sqrt2;

template <class T> struct approx_t {
  const T &t;
  float epsilon;
};

template <class T>
std::ostream &operator<<(std::ostream &os, const approx_t<T> &a) {
  return os << a.t;
}

template <class T>
approx_t<T> approx(const T &t,
                   float epsilon = std::numeric_limits<float>::epsilon() *
                                   100) {
  return {t, epsilon};
}

bool operator==(const vec3 &u, const approx_t<vec3> &v) {
  return u.x == doctest::Approx(v.t.x).epsilon(v.epsilon) &&
         u.y == doctest::Approx(v.t.y).epsilon(v.epsilon) &&
         u.z == doctest::Approx(v.t.z).epsilon(v.epsilon);
}

bool operator==(const vec4 &u, const approx_t<vec4> &v) {
  return u.x == doctest::Approx(v.t.x).epsilon(v.epsilon) &&
         u.y == doctest::Approx(v.t.y).epsilon(v.epsilon) &&
         u.z == doctest::Approx(v.t.z).epsilon(v.epsilon) &&
         u.w == doctest::Approx(v.t.w).epsilon(v.epsilon);
}

bool operator==(const mat4 &m, const approx_t<mat4> &n) {
  auto &md = m.data();
  auto &nd = n.t.data();
  for (int c = 0; c < 4; c++) {
    if (md[c] != approx(nd[c], n.epsilon)) {
      return false;
    }
  }
  return true;
}

float rms(const mat4 &m) {
  float numsq = 0;
  for (int i = 0; i < 4; i++) {
    for (int j = 0; j < 4; j++) {
      float x = m(i, j);
      numsq += x * x;
    }
  }
  return sqrt(numsq / 16);
}

TEST_CASE("vec3 neg") {
  CHECK(-vec3{} == vec3{});
  CHECK(-vec3{0.5, 1, -1.5} == vec3{-0.5, -1, 1.5});
}

TEST_CASE("vec3 add") {
  CHECK(vec3{} + vec3{} == vec3{});
  CHECK(vec3{0.5, -1, 1.5} + vec3{2, 4, -8} == vec3{2.5, 3, -6.5});
  CHECK(vec3{1, 0, 0} + vec3{0, -2, 0} + vec3{0, 0, 3} == vec3{1, -2, 3});
}

TEST_CASE("vec3 sub") {
  CHECK(vec3{} + vec3{} == vec3{});
  CHECK(vec3{1, 2, 3} - vec3{2, 4, 8} == vec3{-1, -2, -5});
  CHECK(vec3{1, 0, 0} - vec3{0, 1, 0} - vec3{0, 0, 1} == vec3{1, -1, -1});
}

TEST_CASE("vec3 mul") {
  CHECK(vec3{} * 1 == vec3{});
  CHECK(vec3{1, 2, 3} * 0 == vec3{});
  CHECK(vec3{0.5, -0.5, 1} * 2 == vec3{1, -1, 2});
  CHECK(1 * vec3{} == vec3{});
  CHECK(0 * vec3{1, 2, 3} == vec3{});
  CHECK(2 * vec3{0.5, -0.5, 1} == vec3{1, -1, 2});
}

TEST_CASE("vec3 len") {
  CHECK(vec3{}.len() == 0);
  CHECK(vec3{1, 0, 0}.len() == 1);
  CHECK(vec3{3, 4, 0}.len() == 5);
  CHECK(vec3{2, 3, 6}.len() == 7);
  CHECK(vec3{1, 2, 3}.lensq() == 14);
}

TEST_CASE("vec3 unit") {
  CHECK(vec3{}.unit() == vec3{});
  CHECK(vec3{1, 0, 0}.unit() == vec3{1, 0, 0});
  CHECK(vec3{0, 1, 0}.unit() == vec3{0, 1, 0});
  CHECK(vec3{0, 0, 1}.unit() == vec3{0, 0, 1});
  CHECK(vec3{3, 4, 0}.unit() == vec3{0.6, 0.8, 0});
  CHECK(vec3{2, 3, 6}.unit() == approx(vec3{2, 3, 6} / 7));
}

TEST_CASE("vec3 cross") {
  CHECK(cross(vec3{}, vec3{}) == vec3{});
  CHECK(cross(vec3{1, 2, 3}, vec3{}) == vec3{});
  CHECK(cross(vec3{}, vec3{1, 2, 3}) == vec3{});
  CHECK(cross(vec3{1, 0, 0}, vec3{0, 1, 0}) == vec3{0, 0, 1});
  CHECK(cross(vec3{0, 1, 0}, vec3{0, 0, 1}) == vec3{1, 0, 0});
  CHECK(cross(vec3{0, 0, 1}, vec3{1, 0, 0}) == vec3{0, 1, 0});
}

TEST_CASE("vec3 dot") {
  CHECK(dot(vec3{}, vec3{}) == 0);
  CHECK(dot(vec3{1, 0, 0}, vec3{0, 1, 0}) == 0);
  CHECK(dot(vec3{1, 0, 0}, vec3{0, 0, 1}) == 0);
  CHECK(dot(vec3{0, 1, 0}, vec3{0, 0, 1}) == 0);
  CHECK(dot(vec3{1, 0, 0}, vec3{1, 0, 0}) == 1);
  CHECK(dot(vec3{1, 1, 0}, vec3{1, 1, 0}) == 2);
  CHECK(dot(vec3{1, 1, 1}, vec3{1, 1, 1}) == 3);
  CHECK(dot(vec3{1, 0.5, 0.125}, vec3{1, -0.5, 0.125}) == 1 - 0.25 + 0.015625);
}

TEST_CASE("vec3 angle") {
  CHECK(angle(vec3{}, vec3{}) == 0);
  CHECK(angle(vec3{1, 0, 0}, vec3{0, 1, 1}) == doctest::Approx(π / 2));
  CHECK(angle(vec3{-1, 0, 0}, vec3{0, 1, 1}) == doctest::Approx(π / 2));
  CHECK(angle(vec3{1, 1, 0}, vec3{0, 1, 1}) == doctest::Approx(π / 3));
  CHECK(angle(vec3{1, 1, 0}, vec3{0, -1, 1}) == doctest::Approx(2 * π / 3));
  CHECK(angle(vec3{1, 1, 0}, vec3{-1, -1, 0}) == doctest::Approx(π));
}

TEST_CASE("vec3 project") {
  CHECK(project(vec3{}, vec3{}) == vec3{});
  CHECK(project(vec3{1, 0, 0}, vec3{0, 1, 0}) == vec3{});
  CHECK(project(vec3{0, 1, 0}, vec3{0, 0, 1}) == vec3{});
  CHECK(project(vec3{1, 0, 0}, vec3{1, 1, 0}) == vec3{1, 0, 0});
  CHECK(project(vec3{1, 0, 0}, vec3{0.5, 1, 0}) == vec3{0.5, 0, 0});
  CHECK(project(vec3{1, 1, 0}, vec3{1, 0, 0}) == vec3{rr2, rr2, 0});
}

TEST_CASE("vec4 neg") {
  CHECK(-vec4{} == vec4{});
  CHECK(-vec4{0.5, 1, -1.5, 3} == vec4{-0.5, -1, 1.5, -3});
}

TEST_CASE("vec4 add") {
  CHECK(vec4{} + vec4{} == vec4{});
  CHECK(vec4{0.5, -1, 1, 3} + vec4{2, 4, -8, 1} == vec4{2.5, 3, -7, 4});
}

TEST_CASE("vec4 sub") {
  CHECK(vec4{} + vec4{} == vec4{});
  CHECK(vec4{1, 2, 3, 4} - vec4{2, 4, 8, 16} == vec4{-1, -2, -5, -12});
}

TEST_CASE("vec4 mul") {
  CHECK(vec4{} * 1 == vec4{});
  CHECK(vec4{1, 2, 3, 4} * 0 == vec4{});
  CHECK(vec4{0.5, -0.5, 1, 3} * 2 == vec4{1, -1, 2, 6});
  CHECK(1 * vec4{} == vec4{});
  CHECK(0 * vec4{1, 2, 3, 4} == vec4{});
  CHECK(2 * vec4{0.5, -0.5, 1, 3} == vec4{1, -1, 2, 6});
}

TEST_CASE("vec4 dot") {
  CHECK(dot(vec4{}, vec4{}) == 0);
  CHECK(dot(vec4{1, 0, 0, 0}, vec4{0, 1, 0, 0}) == 0);
  CHECK(dot(vec4{1, 0, 0, 0}, vec4{0, 0, 1, 0}) == 0);
  CHECK(dot(vec4{1, 0, 0, 0}, vec4{0, 0, 0, 1}) == 0);
  CHECK(dot(vec4{0, 1, 0, 0}, vec4{0, 0, 1, 0}) == 0);
  CHECK(dot(vec4{0, 1, 0, 0}, vec4{0, 0, 0, 1}) == 0);
  CHECK(dot(vec4{1, 0, 0, 0}, vec4{1, 0, 0, 0}) == 1);
  CHECK(dot(vec4{1, 1, 0, 0}, vec4{1, 1, 0, 0}) == 2);
  CHECK(dot(vec4{1, 1, 1, 0}, vec4{1, 1, 1, 0}) == 3);
  CHECK(dot(vec4{1, 1, 1, 1}, vec4{1, 1, 1, 1}) == 4);
  CHECK(dot(vec4{1, 0.5, 0.125, -0.25}, vec4{1, -0.5, 0.125, 0.25}) ==
        1 - 0.25 + 0.015625 - 0.0625);
}

TEST_CASE("mat4 mul") {
  mat4 A = {
      {4, 3, 4, 5},
      {7, 3, 6, 2},
      {6, 5, 5, 1},
      {4, 1, 7, 5},
  };
  mat4 B = {
      {5, 3, 2, 5},
      {9, 6, 3, 8},
      {8, 4, 6, 7},
      {7, 4, 6, 2},
  };
  mat4 C = {
      {73, 39, 83, 58},
      {128, 68, 143, 100},
      {124, 73, 135, 89},
      {100, 65, 96, 59},
  };
  CHECK(A * B == C);
}

TEST_CASE("mat4 inverse") {
  CHECK(mat4::I.inverse() == mat4::I);

  mat4 M = {
      {1, -2, 3, -4},
      {2, -3, 2, -3},
      {4, -3, -5, 1},
      {1, 0, 0, -1},
  };
  // std::cout << "M = \n" << M << "\n";
  mat4 expected = {
      {-1.10526316, 1., -0.26315789, 1.15789474},
      {-0.26315789, -0., -0.15789474, 0.89473684},
      {-0.94736842, 1., -0.36842105, 0.42105263},
      {-1.10526316, 1., -0.26315789, 0.15789474},
  };
  // std::cout << "M⁻¹ = \n" << M.inverse() << "\n";
  CHECK(M.inverse() == approx(expected));
}
