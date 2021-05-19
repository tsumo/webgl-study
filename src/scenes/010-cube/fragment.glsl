#version 300 es

precision mediump float;

in vec3 v_color;
in vec2 v_uv;

uniform float u_mix;
uniform sampler2D u_texture;

out vec4 finalColor;

void main(void) {
  finalColor = mix(vec4(v_color, 1), texture(u_texture, v_uv), u_mix);
}
