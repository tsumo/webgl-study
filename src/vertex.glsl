attribute vec2 a_position;

uniform vec2 u_resolution;
uniform mat3 u_matrix;

void main() {
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;

  vec2 zeroToOne = position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  // Multiplication to flip y coordinate
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}