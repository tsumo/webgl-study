#version 300 es

in vec4 a_position;

out vec4 v_position;

void main(void) {
  v_position = a_position;
  gl_Position = a_position;
  // TODO: figure out why 1.0 doesn't work here ;_;
  gl_Position.z = 0.999999;
}
