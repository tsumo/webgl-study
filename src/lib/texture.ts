import { times } from '../utils';

type Slot = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export class Texture {
  private readonly gl: WebGL2RenderingContext;
  private readonly texture: WebGLTexture | null;
  private readonly slot: number;

  constructor(gl: WebGL2RenderingContext, source: TexImageSource, slot: Slot) {
    this.gl = gl;
    this.texture = gl.createTexture();
    this.slot = gl.TEXTURE0 + slot;
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

export class TextureCubemap {
  private readonly gl: WebGLRenderingContext;
  private readonly texture: WebGLTexture | null;
  private readonly slot: number;

  constructor(gl: WebGL2RenderingContext, sources: TexImageSource[], slot: Slot) {
    this.gl = gl;
    this.texture = gl.createTexture();
    this.slot = gl.TEXTURE0 + slot;
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
    // Sides order:
    // TEXTURE_CUBE_MAP_POSITIVE_X - right
    // TEXTURE_CUBE_MAP_NEGATIVE_X - left
    // TEXTURE_CUBE_MAP_POSITIVE_Y - top
    // TEXTURE_CUBE_MAP_NEGATIVE_Y - bottom
    // TEXTURE_CUBE_MAP_POSITIVE_Z - back
    // TEXTURE_CUBE_MAP_NEGATIVE_Z - front
    times(6, (i) => {
      gl.texImage2D(
        gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        sources[i],
      );
    });
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
  }

  activate(): void {
    this.gl.activeTexture(this.slot);
    this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture);
  }

  deactivate(): void {
    this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
  }
}

const loadTexture = (src: string): Promise<HTMLImageElement> => {
  const image = new Image();
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
};

export const createTexture = async (
  gl: WebGL2RenderingContext,
  src: string,
  slot: Slot,
): Promise<Texture> => {
  const source = await loadTexture(src);
  return new Texture(gl, source, slot);
};

export const createTextureCubemap = async (
  gl: WebGL2RenderingContext,
  srcs: string[],
  slot: Slot,
): Promise<TextureCubemap> => {
  const sources = await Promise.all(srcs.map((src) => loadTexture(src)));
  return new TextureCubemap(gl, sources, slot);
};
