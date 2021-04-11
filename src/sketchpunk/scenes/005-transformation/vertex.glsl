#version 300 es

in vec2 a_position;

uniform vec2 uResolution;
uniform mat3 uMatrix;

void main(void) {
  float ratio = uResolution.x / uResolution.y;

  vec2 ratioCorrectedPosition = vec2(a_position.x, a_position.y * ratio);

  vec2 transformedPosition = (uMatrix * vec3(a_position, 1)).xy;

  gl_Position = vec4(transformedPosition, 0.0, 1.0);
}
