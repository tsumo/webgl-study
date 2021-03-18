export class Buffer {
  private gl: WebGLRenderingContext;
  private size: number;
  private type: GLenum;
  private normalize: boolean;
  private location: number;
  private buffer: WebGLBuffer | null;

  constructor(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    name: string,
    size: number,
    type: GLenum,
    normalize: boolean,
    data: BufferSource,
  ) {
    this.gl = gl;
    this.size = size;
    this.type = type;
    this.normalize = normalize;
    this.location = gl.getAttribLocation(program, name);
    this.buffer = gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
  }

  load(): void {
    this.gl.enableVertexAttribArray(this.location);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.vertexAttribPointer(this.location, this.size, this.type, this.normalize, 0, 0);
  }
}
