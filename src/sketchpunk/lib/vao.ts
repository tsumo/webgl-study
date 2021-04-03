import { globalAttributes } from './constants';

export class Vao {
  private readonly gl: WebGL2RenderingContext;

  private readonly vao: WebGLVertexArrayObject | null;

  private readonly vertBuffer: WebGLBuffer | null;
  private readonly vertSize: number = 3;
  private readonly vertCount: number;

  private readonly normBuffer: WebGLBuffer | null;
  private readonly normSize: number = 3;

  private readonly uvBuffer: WebGLBuffer | null;
  private readonly uvSize: number = 2;

  private readonly index?: {
    buffer: WebGLBuffer | null;
    count: number;
  };

  private readonly mode: GLenum;

  constructor(
    gl: WebGL2RenderingContext,
    vert: { data: number[]; size?: number },
    norm: { data: number[]; size?: number },
    uv: { data: number[]; size?: number },
    index?: number[],
    mode: GLenum = gl.TRIANGLES,
  ) {
    this.gl = gl;
    this.vao = gl.createVertexArray();
    this.mode = mode;

    gl.bindVertexArray(this.vao);

    this.vertBuffer = gl.createBuffer();
    vert.size && (this.vertSize = vert.size);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vert.data), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(globalAttributes.position.location);
    gl.vertexAttribPointer(
      globalAttributes.position.location,
      this.vertSize,
      gl.FLOAT,
      false,
      0,
      0,
    );
    this.vertCount = vert.data.length / this.vertSize;

    this.normBuffer = gl.createBuffer();
    norm.size && (this.normSize = norm.size);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(norm.data), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(globalAttributes.normal.location);
    gl.vertexAttribPointer(globalAttributes.normal.location, this.normSize, gl.FLOAT, false, 0, 0);

    this.uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv.data), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(globalAttributes.uv.location);
    gl.vertexAttribPointer(globalAttributes.uv.location, this.uvSize, gl.FLOAT, false, 0, 0);

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

  draw(): void {
    const gl = this.gl;
    gl.bindVertexArray(this.vao);
    if (this.index) {
      gl.drawElements(this.mode, this.index.count, gl.UNSIGNED_SHORT, 0);
    } else {
      gl.drawArrays(this.mode, 0, this.vertCount);
    }
    gl.bindVertexArray(null);
  }

  destroy(): void {
    // TODO: unload
  }
}
