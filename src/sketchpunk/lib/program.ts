import { assertUnreachable } from '../../utils';
import { Vec4 } from './vec4';

type UniformFloat = {
  readonly type: 'float';
  value: number;
};

type UniformVec4 = {
  readonly type: 'vec4';
  value: Vec4;
};

type Uniform = UniformFloat | UniformVec4;

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
    validate?: boolean,
  ) {
    this.gl = gl;
    const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = this.createProgram(vertexShader, fragmentShader, validate);
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
      case 'float':
        gl.uniform1f(this.locations[name], value as number);
        break;
      case 'vec4':
        gl.uniform4fv(this.locations[name], value as Vec4);
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

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
    validate?: boolean,
  ): WebGLProgram {
    const gl = this.gl;
    const program = gl.createProgram();
    if (program === null) {
      throw new Error('Cannot create program');
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const linksSuccess = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linksSuccess) {
      console.warn(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      throw new Error('Cannot link program');
    }
    if (validate) {
      gl.validateProgram(program);
      const validationSuccess = gl.getProgramParameter(program, gl.VALIDATE_STATUS);
      if (!validationSuccess) {
        console.warn(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        throw new Error('Program validation error');
      }
    }
    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return program;
  }
}
