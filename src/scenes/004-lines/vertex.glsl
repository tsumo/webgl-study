#version 300 es

in vec3 a_position;

uniform vec3 u_color[2];

out lowp vec4 color;

void main(void) {
  color = vec4(u_color[ int(a_position.z) ], 1.0);
  gl_Position = vec4(a_position.xy, 0.0, 1.0);
}
