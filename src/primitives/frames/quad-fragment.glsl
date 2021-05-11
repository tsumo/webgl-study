#version 300 es

precision mediump float;

in vec2 v_uv;

uniform float u_width;

out vec4 finalColor;

void main(void) {
  float w = u_width / 2.0;
  float wi = 1.0 - w;
  float c = (v_uv.x <= w || v_uv.x >= wi || v_uv.y <= w || v_uv.y >= wi) ? 0.0 : 1.0;
  finalColor = vec4(c, c, c, 1.0 - c);
}
