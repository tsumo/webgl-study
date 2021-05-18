type Slot = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export class Texture {
  private readonly gl: WebGL2RenderingContext;
  private readonly slot: number;
  private readonly texture: WebGLTexture | null;

  constructor(gl: WebGL2RenderingContext, source: TexImageSource, slot: Slot) {
    this.gl = gl;
    this.slot = gl.TEXTURE0 + slot;
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  activate(): void {
    this.gl.activeTexture(this.slot);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }

  deactivate(): void {
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }
}
