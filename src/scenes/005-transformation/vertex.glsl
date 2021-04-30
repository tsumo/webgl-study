#version 300 es

in vec2 a_position;

uniform vec2 u_resolution;
uniform mat3 u_matrix;

void main(void) {
  float ratio = u_resolution.x / u_resolution.y;

  vec2 ratioCorrectedPosition = vec2(a_position.x, a_position.y * ratio);

  vec2 transformedPosition = (u_matrix * vec3(a_position, 1)).xy;

  gl_Position = vec4(transformedPosition, 0.0, 1.0);
}
