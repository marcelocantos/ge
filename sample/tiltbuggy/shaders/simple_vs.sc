$input a_position, a_color0
$output v_color

#include <bgfx_shader.sh>

void main() {
    // a_position is vec3 (z=0 from the vertex layout). The vec4(vec3,1.0)
    // construction compiles cleanly on all profiles; vec4(vec2, float,
    // float) triggers a glsl-optimizer bug in bgfx's shaderc `-p 300_es`
    // that NaN-clips every vertex on Android GLES.
    gl_Position = mul(u_modelViewProj, vec4(a_position, 1.0));
    v_color = a_color0;
}
