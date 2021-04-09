type BufferInitInfo = { data: number[] | Float32Array; size: number };

type BufferLiveInfo = {
  buffer: WebGLBuffer | null;
  size: number;
  count: number;
};

export class Vao {
  private readonly gl: WebGL2RenderingContext;

  private readonly vao: WebGLVertexArrayObject | null;

  private buffers: BufferLiveInfo[] = [];

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
    const count = init.data.length / init.size;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(init.data), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, init.size, gl.FLOAT, false, 0, 0);
    this.buffers.push({ buffer, size: init.size, count });
  }

  private draw(mode: GLenum): void {
    const gl = this.gl;
    gl.bindVertexArray(this.vao);
    if (this.index) {
      gl.drawElements(mode, this.index.count, gl.UNSIGNED_SHORT, 0);
    } else {
      // TODO: is it ok to get count from first (position) buffer?
      gl.drawArrays(mode, 0, this.buffers[0].count);
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
