import { M4 } from './m4';
import { Program } from './program';

export class Uniform {
  private gl: WebGLRenderingContext;
  private location: WebGLUniformLocation | null;

  constructor(gl: WebGLRenderingContext, program: Program, name: string) {
    this.gl = gl;
    this.location = gl.getUniformLocation(program.program, name);
  }

  set(value: M4): void {
    this.gl.uniformMatrix4fv(this.location, false, value);
  }
}
