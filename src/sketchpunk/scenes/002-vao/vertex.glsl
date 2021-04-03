#version 300 es

in vec3 a_position;

uniform float uAngle;

void main(void) {
  gl_PointSize = 10.0 + sin(uAngle * 5.0) * 5.0;
  gl_Position = vec4(
    cos(uAngle) * 0.8 + a_position.x,
    sin(uAngle) * 0.8 + a_position.y,
    a_position.z,
    1.0
  );
}
