import { Program } from './program';

type AnyProgram = Program<any, any>;

export class Buffer {
  private readonly gl: WebGL2RenderingContext;
  private readonly name: string;
  private data: Float32Array;
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
    dynamic = false,
  ) {
    this.gl = gl;
    this.name = name;
    this.data = new Float32Array(data);
    this.size = size;
    this.count = data.length / this.size;
    this.location = gl.getAttribLocation(program.program, name);
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.data, dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
  }

  prepare(): void {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.location);
    gl.vertexAttribPointer(this.location, this.size, gl.FLOAT, false, 0, 0);
  }

  draw(): void {
    this.gl.drawArrays(this.gl.POINTS, 0, this.count);
  }

  swapProgram(program: AnyProgram): void {
    this.location = this.gl.getAttribLocation(program.program, this.name);
  }
}
