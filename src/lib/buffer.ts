import { Program } from './program';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProgram = Program<any, any>;

// TODO: use BufferInitInfo type
export class Buffer {
  private readonly gl: WebGL2RenderingContext;
  private readonly name: string;
  private readonly size: number;
  private readonly count: number;
  private location: number;
  private readonly buffer: WebGLBuffer | null;

  constructor(
    gl: WebGL2RenderingContext,
    name: string,
    data: number[],
    size: number,
    program: AnyProgram,
  ) {
    this.gl = gl;
    this.name = name;
    this.size = size;
    this.count = data.length / this.size;
    this.location = gl.getAttribLocation(program.program, name);
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  }

  prepare(): void {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.location);
    gl.vertexAttribPointer(this.location, this.size, gl.FLOAT, false, 0, 0);
  }

  private draw(mode: GLenum): void {
    this.gl.drawArrays(mode, 0, this.count);
  }

  drawPoints(): void {
    this.draw(this.gl.POINTS);
  }

  drawLines(): void {
    this.draw(this.gl.LINES);
  }

  drawTriangles(): void {
    this.draw(this.gl.TRIANGLES);
  }

  swapProgram(program: AnyProgram): void {
    this.location = this.gl.getAttribLocation(program.program, this.name);
  }

  destroy(): void {
    // TODO: unload
  }
}
