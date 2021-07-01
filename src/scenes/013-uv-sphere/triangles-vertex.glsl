#version 300 es

in vec3 a_position;

uniform mat4 u_matrix;

out vec3 v_color;

void main(void) {
  gl_Position = u_matrix * vec4(a_position, 1);
  v_color = (a_position + 1.0) / 2.0;
}
