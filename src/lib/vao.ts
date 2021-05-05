import { BufferInitInfo, NonEmptyArray } from './types';

export class Vao {
  private readonly gl: WebGL2RenderingContext;

  private readonly vao: WebGLVertexArrayObject | null;

  private readonly count: number;

  private readonly index?: {
    buffer: WebGLBuffer | null;
    count: number;
  };

  constructor(
    gl: WebGL2RenderingContext,
    buffers: NonEmptyArray<BufferInitInfo>,
    index?: number[],
  ) {
    this.gl = gl;
    this.vao = gl.createVertexArray();
    // TODO: is it ok to get count from first (position) buffer?
    this.count = buffers[0].data.length / buffers[0].size;

    gl.bindVertexArray(this.vao);

    buffers.forEach((initInfo, i) => {
      this.initBuffer(initInfo, i);
    });

    if (index) {
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
      const count = index.length;
      this.index = { buffer, count };
    }

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  private initBuffer(init: BufferInitInfo, location: number): void {
    const gl = this.gl;
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    // TODO: investigate whether it's ok to pass number[] to bufferData
    gl.bufferData(gl.ARRAY_BUFFER, init.data as Float32Array, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    const type: GLenum =
      init.type === 'float' ? gl.FLOAT : init.type === 'unsigned-byte' ? gl.UNSIGNED_BYTE : 0;
    const normalized = init.type === 'unsigned-byte' ? init.normalized : false;
    gl.vertexAttribPointer(location, init.size, type, normalized, 0, 0);
  }

  private draw(mode: GLenum): void {
    const gl = this.gl;
    gl.bindVertexArray(this.vao);
    if (this.index) {
      gl.drawElements(mode, this.index.count, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(mode, 0, this.count);
    }
    gl.bindVertexArray(null);
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

  destroy(): void {
    // TODO: unload
  }
}
