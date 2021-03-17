import { M4 } from './m4';

export class Uniform {
  private gl: WebGLRenderingContext;
  private location: WebGLUniformLocation | null;

  constructor(gl: WebGLRenderingContext, program: WebGLProgram, name: string) {
    this.gl = gl;
    this.location = gl.getUniformLocation(program, name);
  }

  set(value: M4): void {
    this.gl.uniformMatrix4fv(this.location, false, value);
  }
}
