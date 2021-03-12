attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;

void main() {
  vec2 scaledPosition = a_position * u_scale;

  vec2 rotated_position = vec2(
    scaledPosition.x * u_rotation.y + scaledPosition.y * u_rotation.x,
    scaledPosition.y * u_rotation.y - scaledPosition.x * u_rotation.x
  );

  vec2 position = rotated_position + u_translation;

  vec2 zeroToOne = position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  // Multiplication to flip y coordinate
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}