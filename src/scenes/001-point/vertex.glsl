#version 300 es

in vec2 a_position;

void main(void) {
  gl_PointSize = 50.0;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
