#version 300 es

in vec3 a_position;
in vec2 a_uv;

uniform mat4 u_matrix;

out highp vec2 v_uv;

void main(void) {
  v_uv = a_uv;
  gl_Position = u_matrix * vec4(a_position, 1);
}
