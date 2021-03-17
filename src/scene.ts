import { Attribute } from './attribute';
import { Camera } from './camera';
import { m4 } from './m4';
import { primitives } from './primitives';
import { Uniform } from './uniform';

const createShader = (gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader => {
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
};

const createProgram = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram => {
  const program = gl.createProgram();
  if (program === null) {
    throw new Error('Cannot create program');
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    console.warn(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    throw new Error('Cannot link program');
  }
  return program;
};

const createShadersAndProgram = (
  gl: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
): WebGLProgram => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  return createProgram(gl, vertexShader, fragmentShader);
};

export class Scene {
  gl: WebGLRenderingContext;
  private canvasObserver: ResizeObserver;
  program: WebGLProgram;
  camera: Camera;
  uniform: Uniform;
  attributes: Attribute[] = [];

  constructor(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
    this.gl = gl;
    this.canvasObserver = new ResizeObserver(this.updateCanvas.bind(this));
    const program = createShadersAndProgram(gl, vertexShaderSource, fragmentShaderSource);
    this.program = program;
    this.camera = new Camera(gl);
    this.uniform = new Uniform(gl, program, 'u_matrix');
    this.attributes.push(
      new Attribute(gl, program, 'a_position', 3, gl.FLOAT, false, primitives.f.vert),
    );
    this.attributes.push(
      new Attribute(gl, program, 'a_color', 3, this.gl.UNSIGNED_BYTE, true, primitives.f.mat),
    );
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.useProgram(program);
  }

  render(): void {
    const gl = this.gl;

    this.updateCanvas();

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.camera.updateMatrix();

    this.attributes.forEach((attr) => attr.load());

    const matrix = m4.translate(this.camera.matrix, 0, 0, 100);

    this.uniform.set(matrix);

    gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
  }

  updateCanvas(): void {
    const c = this.gl.canvas as HTMLCanvasElement;
    const rect = c.getBoundingClientRect();
    if (c.width === rect.width && c.height === rect.width) {
      return;
    }
    c.width = rect.width;
    c.height = rect.height;
    this.gl.viewport(0, 0, c.width, c.height);
  }

  destroy(): void {
    this.canvasObserver.disconnect();
  }
}
