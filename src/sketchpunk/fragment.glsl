#version 300 es

precision mediump float;

uniform vec4 uPointColor;

out vec4 finalColor;

void main(void) {
  finalColor = uPointColor;
}
