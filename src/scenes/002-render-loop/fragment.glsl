#version 300 es

precision mediump float;

uniform vec4 u_pointColor;

out vec4 finalColor;

void main(void) {
  finalColor = u_pointColor;
}
