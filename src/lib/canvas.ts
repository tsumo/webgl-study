export class Canvas {
  private readonly gl: WebGL2RenderingContext;
  private canvasObserver: ResizeObserver;

  // TODO: use device pixel ratio flag
  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.canvasObserver = new ResizeObserver(this.updateCanvas.bind(this));
    this.canvasObserver.observe(gl.canvas as HTMLCanvasElement);
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
    this.canvasObserver.disconnect();
  }
}
