import { assertUnreachable } from '../../utils';
import { standardAttributes } from './constants';

type UniformF = { readonly type: 'f'; value: number };
type Uniform3f = { readonly type: '3f'; value: Vec3 };
type Uniform3fv = { readonly type: '3fv'; value: number[] };
type Uniform4f = { readonly type: '4f'; value: Vec4 };
type Uniform4fv = { readonly type: '4fv'; value: number[] };

type Uniform = UniformF | Uniform3f | Uniform3fv | Uniform4f | Uniform4fv;

export class Program<
  U extends Record<string, Uniform>,
  L extends Record<keyof U, WebGLUniformLocation | null>
> {
  private readonly gl: WebGL2RenderingContext;
  readonly program: WebGLProgram;
  private readonly uniforms: U;
  private readonly locations: L;

  constructor(
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    uniforms: U,
  ) {
    this.gl = gl;
    const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = this.createProgram(vertexShader, fragmentShader);
    this.program = program;
    // TODO: validate default values
    this.uniforms = uniforms;
    const locations: L = {} as L;
    for (const key in uniforms) {
      // @ts-expect-error cannot derive correct key type
      locations[key] = gl.getUniformLocation(program, key);
    }
    this.locations = locations;
  }

  use(): void {
    this.gl.useProgram(this.program);
  }

  setUniform<K extends keyof U>(name: K, value: U[K]['value']): void {
    const gl = this.gl;
    // TODO: validate new value
    const uniform: Uniform = this.uniforms[name];
    switch (uniform.type) {
      case 'f':
        gl.uniform1f(this.locations[name], value as number);
        break;
      case '3f':
      case '3fv':
        gl.uniform3fv(this.locations[name], value as number[]);
        break;
      case '4f':
      case '4fv':
        gl.uniform4fv(this.locations[name], value as number[]);
        break;
      default:
        assertUnreachable(uniform);
    }
  }

  private createShader(type: GLenum, source: string): WebGLShader {
    const gl = this.gl;
    const shader = gl.createShader(type);
    if (shader === null) {
      throw new Error('Cannot create shader');
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      console.warn(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      throw new Error('Cannot compile shader');
    }
    return shader;
  }

  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    const gl = this.gl;
    const program = gl.createProgram();
    if (program === null) {
      throw new Error('Cannot create program');
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.bindAttribLocation(
      program,
      standardAttributes.position.location,
      standardAttributes.position.name,
    );
    gl.bindAttribLocation(
      program,
      standardAttributes.normal.location,
      standardAttributes.normal.name,
    );
    gl.bindAttribLocation(program, standardAttributes.uv.location, standardAttributes.uv.name);

    gl.linkProgram(program);
    const linksSuccess = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linksSuccess) {
      console.warn(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      throw new Error('Cannot link program');
    }

    gl.validateProgram(program);
    const validationSuccess = gl.getProgramParameter(program, gl.VALIDATE_STATUS);
    if (!validationSuccess) {
      console.warn(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      throw new Error('Program validation error');
    }

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return program;
  }

  destroy(): void {
    const gl = this.gl;
    if (gl.getParameter(gl.CURRENT_PROGRAM) === this.program) {
      this.gl.useProgram(null);
    }
    gl.deleteProgram(this.program);
  }
}
