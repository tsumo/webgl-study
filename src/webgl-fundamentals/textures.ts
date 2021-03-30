export const createAndSetupTexture = (gl: WebGLRenderingContext): WebGLTexture => {
  const texture = gl.createTexture();
  if (texture === null) {
    throw new Error('Cannot create texture');
  }
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Set parameters to render any size image
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  return texture;
};

// prettier-ignore
export const kernels = {
  normal: [
    0, 0, 0,
    0, 1, 0,
    0, 0, 0,
  ],
  gaussianBlur: [
    0.045, 0.122, 0.045,
    0.122, 0.332, 0.122,
    0.045, 0.122, 0.045,
  ],
  unsharpen: [
    -1, -1, -1,
    -1,  9, -1,
    -1, -1, -1,
  ],
  emboss: [
    -2, -1,  0,
    -1,  1,  1,
     0,  1,  2,
  ],
  edgeDetect: [
    -1, -1, -1,
    -1,  8, -1,
    -1, -1, -1,
  ],
}

export const computeKernelWeight = (kernel: number[]): number => {
  const weight = kernel.reduce((prev, curr) => prev + curr);
  return weight <= 0 ? 1 : weight;
};

export const loadImage = (src: string, onload: VoidFunction): void => {
  const image = new Image();
  image.src = src;
  image.onload = onload;
};
