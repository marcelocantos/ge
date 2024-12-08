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

#include <cmath>

namespace ge {

// vec3 ------------------------------------------------------------------------

struct vec3 {
  float x, y, z;
  bool operator==(const vec3 &) const = default;
  explicit operator bool() const { return x || y || z; }
  vec3 operator-() const { return {-x, -y, -z}; }
  vec3 operator+(const vec3 &v) const { return {x + v.x, y + v.y, z + v.z}; }
  vec3 operator-(const vec3 &v) const { return {x - v.x, y - v.y, z - v.z}; }
  vec3 operator*(float f) const { return {x * f, y * f, z * f}; }
  vec3 operator/(float f) const { return *this * (1 / f); }
  vec3 &operator+=(const vec3 &v) { return *this = *this + v; }
  vec3 &operator-=(const vec3 &v) { return *this = *this - v; }
  vec3 &operator*=(float f) { return *this = *this * f; }
  vec3 &operator/=(float f) { return *this = *this / f; }
  float lensq() const { return x * x + y * y + z * z; }
  float len() const { return sqrt(lensq()); }
  vec3 unit() const {
    float ls = lensq();
    return ls ? vec3((*this) * (1 / sqrt(ls))) : *this;
  }
};

inline vec3 operator*(float f, const vec3 &u) { return u * f; }

inline vec3 cross(const vec3 &u, const vec3 &v) {
  return {
      u.y * v.z - u.z * v.y,
      u.z * v.x - u.x * v.z,
      u.x * v.y - u.y * v.x,
  };
}

inline float dot(const vec3 &u, const vec3 &v) {
  return u.x * v.x + u.y * v.y + u.z * v.z;
}

inline float angle(const vec3 &u, const vec3 &v) {
  return atan2(cross(u, v).len(), dot(u, v));
}

vec3 project(const vec3 &u, const vec3 &v) { return u.unit() * dot(u, v); }

// vec4 ------------------------------------------------------------------------

struct vec4 {
  float x, y, z, w;
  bool operator==(const vec4 &) const = default;
  explicit operator bool() const { return x || y || z || w; }
  vec3 project() const { return vec3{x, y, z} * (1 / w); }
  vec4 operator-() { return {-x, -y, -z, -w}; }
  vec4 operator+(const vec4 &v) const {
    return {x + v.x, y + v.y, z + v.z, w + v.w};
  }
  vec4 operator-(const vec4 &v) const {
    return {x - v.x, y - v.y, z - v.z, w - v.w};
  }
  vec4 operator*(float f) const { return {x * f, y * f, z * f, w * f}; }
  vec4 operator/(float f) const { return *this * (1 / f); }
  vec4 &operator+=(const vec4 &v) { return *this = *this + v; }
  vec4 &operator-=(const vec4 &v) { return *this = *this - v; }
  vec4 &operator*=(float f) { return *this = *this * f; }
};

inline vec4 operator*(float f, const vec4 &v) { return v * f; }

inline float dot(const vec4 &u, const vec4 &v) {
  return u.x * v.x + u.y * v.y + u.z * v.z + u.w * v.w;
}

// mat4 ------------------------------------------------------------------------

struct mat4 {
  vec4 a, b, c, d;

  static mat4 I;

  bool operator==(const mat4 &) const = default;

  std::array<vec4, 4> &data() { return *(std::array<vec4, 4> *)(&a); }
  const std::array<vec4, 4> &data() const {
    return *(std::array<vec4, 4> *)(&a);
  }

  float operator()(int i, int j) const { return (&(&a)[j].x)[i]; }
  float &operator()(int i, int j) { return (&(&a)[j].x)[i]; }

  float det() const {
    float ab = a.z * b.z - a.w * b.w;
    float ac = a.z * c.z - a.w * c.w;
    float ad = a.z * d.z - a.w * d.w;
    float bc = b.z * c.z - b.w * c.w;
    float bd = b.z * d.z - b.w * d.w;
    float cd = c.z * d.z - c.w * d.w;
    return a.x * (b.y * cd - c.y * bd + d.y * bc) -
           b.x * (a.y * cd - c.y * ad + d.y * bc) +
           c.x * (a.y * bd - b.y * ad + d.y * ab) -
           d.x * (a.y * bc - b.y * ac + c.y * ab);
  }

  mat4 transpose() const {
    return {
        {a.x, b.x, c.x, d.x},
        {a.y, b.y, c.y, d.y},
        {a.z, b.z, c.z, d.z},
        {a.w, b.w, c.w, d.w},
    };
  }

  mat4 inverse() const;
  mat4 pow(int i) const;
};

inline mat4 mat4::I = {
    {1, 0, 0, 0},
    {0, 1, 0, 0},
    {0, 0, 1, 0},
    {0, 0, 0, 1},
};

inline mat4 operator+(const mat4 &m, const mat4 &n) {
  return {m.a + n.a, m.b + n.b, m.c + n.c, m.d + n.d};
}

inline mat4 operator-(const mat4 &m, const mat4 &n) {
  return {m.a - n.a, m.b - n.b, m.c - n.c, m.d - n.d};
}

inline mat4 operator*(const mat4 &m, float f) {
  return {m.a * f, m.b * f, m.c * f, m.d * f};
}

inline vec4 operator*(const vec4 &n, const mat4 &m) {
  return {dot(n, m.a), dot(n, m.b), dot(n, m.c), dot(n, m.d)};
}

inline mat4 operator*(const mat4 &m, const mat4 &n) {
  auto t = m.transpose();
  return {n.a * t, n.b * t, n.c * t, n.d * t};
}

inline mat4 &operator+=(mat4 &m, const mat4 &n) { return m = m + n; }
inline mat4 &operator-=(mat4 &m, const mat4 &n) { return m = m - n; }
inline mat4 &operator*=(mat4 &m, const mat4 &n) { return m = m * n; }
inline mat4 &operator*=(mat4 &m, float f) { return m = m * f; }

inline mat4 mat4::pow(int i) const {
  if (i < 0) {
    return pow(-i).inverse();
  } else if (i == 0) {
    return I;
  } else if (i == 1) {
    return *this;
  } else if (i % 2 == 0) {
    mat4 M = pow(i / 2);
    return M * M;
  } else {
    return *this * pow(i - 1);
  }
}

namespace detail {

// LUdcmp solves Ax = b and related functions via LU decomposition.
// Adapted from numerical recipes 3ed.
struct LUdcmp {
  mat4 *lu;
  int indx[4]; // Stores the permutation as bits (2 per index).

  vec4 solve(const vec4 &b) const;
  mat4 solve(const mat4 &b) const;
};

inline LUdcmp ludcmp(mat4 &lu) {
  LUdcmp d = {&lu};
  float vv[4];                  // vv stores the implicit scaling of each row.
  for (int i = 0; i < 4; i++) { // Get implicit scaling information.
    float best =
        std::max({abs(lu(i, 0)), abs(lu(i, 1)), abs(lu(i, 2)), abs(lu(i, 3))});
    if (best == 0) {
      throw("all zeros");
    }
    vv[i] = 1 / best; // Save the scaling.
  }
  for (int k = 0; k < 4; k++) { // This is the outermost kij loop.
    float best = 0; // Initialize for the search for largest pivot element.
    int besti = k;
    for (int i = k; i < 4; i++) {
      if (float t = vv[i] * abs(lu(i, k)); t > best) { // best pivot so far?
        best = t;
        besti = i;
      }
    }
    if (besti != k) { // Do we need to interchange rows?
      for (int j = 0; j < 4; j++) {
        std::swap(lu(besti, j), lu(k, j));
      }
      std::swap(vv[besti], vv[k]); // Also interchange the scale factor.
    }
    d.indx[k] = besti;
    if (lu(k, k) == 0) {
      // If the pivot element is zero, the matrix is singular (at least to the
      // precision of the algorithm). For some applications on singular
      // matrices, it is desirable to substitute TINY for zero.
      lu(k, k) = std::numeric_limits<float>::min();
    }
    for (int i = k + 1; i < 4; i++) {
      float t = lu(i, k) /= lu(k, k);
      // Divide by the pivot element.
      for (int j = k + 1; j < 4; j++) { // reduce remaining submatrix.
        lu(i, j) -= t * lu(k, j);
      }
    }
  }

  return d;
}

inline vec4 LUdcmp::solve(const vec4 &b) const {
  vec4 v = b;
  float *x = &v.x;
  int ii = 0;
  for (int i = 0; i < 4; i++) {
    int ip = indx[i];
    float sum = x[ip];
    x[ip] = x[i];
    if (ii != 0) {
      for (int j = ii - 1; j < i; j++) {
        sum -= (*lu)(i, j) * x[j];
      }
    } else if (sum != 0) {
      ii = i + 1;
    }
    x[i] = sum;
  }
  for (int i = 4; i--;) {
    float sum = x[i];
    for (int j = i + 1; j < 4; j++) {
      sum -= (*lu)(i, j) * x[j];
    }
    x[i] = sum / (*lu)(i, i);
  }
  return v;
}

inline mat4 LUdcmp::solve(const mat4 &m) const {
  mat4 x;
  for (int i = 0; i < 4; i++) {
    x.data()[i] = solve(m.data()[i]);
  }
  return x;
}

} // namespace detail

inline mat4 mat4::inverse() const {
  mat4 lu = *this;
  return detail::ludcmp(lu).solve(I);
}

} // namespace ge
