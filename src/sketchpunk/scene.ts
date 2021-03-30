import { Program } from './program';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';

export class Scene {
  private readonly gl: WebGL2RenderingContext;
  private readonly program: Program;
  private canvasObserver: ResizeObserver;
  private raf = 0;

  pointSize = 50;

  private readonly positionAttrLoc: number;
  private readonly pointSizeUniLoc: WebGLUniformLocation | null;
  private readonly vertsBuffer: WebGLBuffer | null;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.program = new Program(gl, vertexShaderSource, fragmentShaderSource, true);
    this.canvasObserver = new ResizeObserver(this.updateCanvas.bind(this));
    this.canvasObserver.observe(gl.canvas as HTMLCanvasElement);

    this.program.use();
    this.positionAttrLoc = gl.getAttribLocation(this.program.program, 'a_position');
    this.pointSizeUniLoc = gl.getUniformLocation(this.program.program, 'uPointSize');
    const verts = new Float32Array([0, 0, 0]);
    this.vertsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    const tick = (): void => {
      this.render();
      this.raf = window.requestAnimationFrame(tick);
    };
    tick();
  }

  render(): void {
    const gl = this.gl;

    gl.uniform1f(this.pointSizeUniLoc, this.pointSize);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertsBuffer);
    gl.enableVertexAttribArray(this.positionAttrLoc);
    gl.vertexAttribPointer(this.positionAttrLoc, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, 1);
  }

  clear(): void {
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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
    window.cancelAnimationFrame(this.raf);
    this.canvasObserver.disconnect();
  }
}
