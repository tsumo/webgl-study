export class Program {
  private readonly gl: WebGL2RenderingContext;
  readonly program: WebGLProgram;

  constructor(
    gl: WebGL2RenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
    validate?: boolean,
  ) {
    this.gl = gl;
    const vertexShader = this.createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    this.program = this.createProgram(vertexShader, fragmentShader, validate);
  }

  use(): void {
    this.gl.useProgram(this.program);
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
