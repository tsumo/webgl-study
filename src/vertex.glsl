attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform vec2 u_resolution;
uniform float u_flipY;

varying vec2 v_texCoord;

void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  // Pass to fragment shader
  // GPU will interpolate this value between points
  v_texCoord = a_texCoord;

  // Multiplication to flip y coordinate
  gl_Position = vec4(clipSpace * vec2(1, u_flipY), 0, 1);
}