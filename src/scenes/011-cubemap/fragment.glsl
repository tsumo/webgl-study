#version 300 es

precision highp float;

in vec4 v_position;

uniform samplerCube u_texture;
uniform mat4 u_matrixInv;

out vec4 finalColor;

void main(void) {
  vec4 t = u_matrixInv * v_position;
  finalColor = texture(u_texture, normalize(t.xyz / t.w));
}
