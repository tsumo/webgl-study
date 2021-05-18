#version 300 es

in vec3 a_position;
in vec2 a_uv;

uniform float u_time;
uniform mat4 u_matrix;

out highp vec2 v_uv;

float rand(float x) {
  return fract(sin(x) * 1.0);
}

void main(void) {
  v_uv = a_uv;
  float offsetX = rand(a_position.x + a_position.y * 3.0 + a_position.z);
  float offsetY = offsetX * 1.7;
  vec4 pos = vec4(
    a_position.x + a_position.z * ((sin(u_time + offsetX) + 1.0) * 0.2),
    a_position.y + a_position.z * ((sin(u_time + offsetY) + 1.0) * 0.2),
    a_position.z,
    1
  );
  gl_Position = u_matrix * pos;
}
