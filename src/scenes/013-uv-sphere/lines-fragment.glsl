#version 300 es

precision mediump float;

in vec3 v_color;

out vec4 finalColor;

void main(void) {
  finalColor = vec4(
    1.0 - v_color.r,
    1.0 - v_color.g,
    1.0 - v_color.b,
    1
  );
}
