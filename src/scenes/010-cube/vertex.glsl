#version 300 es

in vec3 a_position;
in vec3 a_color;
in vec2 a_uv;
in vec3 a_normal;

uniform float u_time;
uniform mat4 u_matrix;

out vec3 v_color;
out vec2 v_uv;

vec3 warp(vec3 p) {
  return p + 0.2 * abs(cos(u_time + p.z)) * a_normal;
}

void main(void) {
  gl_Position = u_matrix * vec4(warp(a_position), 1);

  v_color = a_color;
  v_uv = a_uv;
}
