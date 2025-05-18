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

#define PICOBENCH_IMPLEMENT_WITH_MAIN
#include "picobench.hpp"

#include "math.hpp"

using namespace ge;

static void mat_mul(picobench::state &s) {
  mat4 M = {
      {1, -2, 3, -4},
      {2, -3, 2, -3},
      {4, -3, -5, 1},
      {1, 0, 0, -1},
  };
  for (auto _ : s) {
    M *= M;
    s.set_result(M.a.x);
  }
}
PICOBENCH(mat_mul);

static void mat_inv(picobench::state &s) {
  mat4 M = {
      {1, -2, 3, -4},
      {2, -3, 2, -3},
      {4, -3, -5, 1},
      {1, 0, 0, -1},
  };
  for (auto _ : s) {
    M.inverse();
    M.a.x *= 0.999;
  }
}
PICOBENCH(mat_inv);

static void vec3_angle(picobench::state &s) {
  vec3 a = {1, 0, 0}, b = {1, 2, 0};
  float f = 0;
  for (auto _ : s) {
    f += angle(a, b);
    a.x++;
  }
  s.set_result(f);
}
PICOBENCH(vec3_angle);
