import { Buffer } from './buffer';
import { Camera } from './camera';
import { m4 } from './m4';
import { primitives } from './primitives';
import { Program } from './program';
import { Uniform } from './uniform';

export class Scene {
  gl: WebGLRenderingContext;
  private canvasObserver: ResizeObserver;
  program: WebGLProgram;
  camera: Camera;
  uniform: Uniform;
  buffers: Buffer[] = [];

  constructor(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
    this.gl = gl;
    this.canvasObserver = new ResizeObserver(this.updateCanvas.bind(this));
    const program = new Program(gl, vertexShaderSource, fragmentShaderSource);
    this.program = program;
    this.camera = new Camera(gl);
    this.uniform = new Uniform(gl, program, 'u_matrix');
    this.buffers.push(new Buffer(gl, program, 'a_position', 3, gl.FLOAT, false, primitives.f.vert));
    this.buffers.push(
      new Buffer(gl, program, 'a_color', 3, this.gl.UNSIGNED_BYTE, true, primitives.f.mat),
    );
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    program.use();
  }

  render(): void {
    const gl = this.gl;

    this.updateCanvas();

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.camera.updateMatrix();

    this.buffers.forEach((buffer) => buffer.load());

    const matrix = m4.translate(this.camera.matrix, 0, 0, 0);

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
