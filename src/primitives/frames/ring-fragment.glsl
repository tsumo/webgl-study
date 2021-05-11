#version 300 es

precision mediump float;

in vec2 v_uv;

uniform float u_width;

out vec4 finalColor;

void main(void) {
  vec2 delta = v_uv - vec2(0.5, 0.5);
  float dist = 0.5 - sqrt(delta.x * delta.x + delta.y * delta.y);
  float a = (dist > u_width || dist < 0.0) ? 0.0 : 1.0;
  finalColor = vec4(0, 0, 0, a);
}
