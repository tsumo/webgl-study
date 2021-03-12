import './style.css';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';
import pupImage from './pup.jpg';

/*
# WebGL program structure

## init
- create shaders
- create programs
- look up locations

## render
- clear viewport and other global state
- for each thing
  - call useProgram
  - for each attrubute
    - call bindBuffer
    - call vertexAttribPointer
    - call enableVertexAttribArray
  - for each uniform
    - call uniformXXX
    - call activeTexture and bindTexture to assign texture units
  - call drawArrays or drawElements
*/

const createShader = (gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader => {
  const shader = gl.createShader(type);
  if (shader === null) {
    throw new Error('Cannot create shader');
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    throw new Error('Cannot compile shader');
  }
  return shader;
};

const createProgram = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram => {
  const program = gl.createProgram();
  if (program === null) {
    throw new Error('Cannot create program');
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
    console.warn(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    throw new Error('Cannot link program');
  }
  return program;
};

const createShadersAndProgram = (
  gl: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
): WebGLProgram => {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  return createProgram(gl, vertexShader, fragmentShader);
};

const resizeCanvas = (gl: WebGLRenderingContext, canvas: HTMLCanvasElement): void => {
  if (canvas.width === canvas.clientWidth && canvas.height === canvas.clientHeight) {
    return;
  }
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, canvas.width, canvas.height);
};

const setRectangle = (
  gl: WebGLRenderingContext,
  x: number,
  y: number,
  width: number,
  height: number,
): void => {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;
  // Copy data into buffer
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW,
  );
};

const loadImage = (): void => {
  const image = new Image();
  image.src = pupImage;
  image.onload = (): void => init(image);
};

const init = (image: HTMLImageElement): void => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  const gl = canvas.getContext('webgl');
  if (gl === null) {
    throw new Error('Cannot get webgl context');
  }

  const program = createShadersAndProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Uniforms stay the same for all vertices/pixels during single draw call
  const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');

  // Attribute is a data from the buffer
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  // Look up where texture coordinates need to go
  const texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord');

  // Buffer for 2d clip space points
  const positionBuffer = gl.createBuffer();

  // Bind sets the current buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // Rectangle with the same size as the image
  setRectangle(gl, 0, 0, image.width, image.height);

  // Provide texture coordinates for rectangle
  const texCoordBuffer = gl.createBuffer();
  // Buffer is a per-vertex GPU data
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]),
    gl.STATIC_DRAW,
  );

  // Create a texture
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set parameters to render any size image
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  // Upload image into the texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  const draw = (): void => {
    resizeCanvas(gl, canvas);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set current program. App can have many programs at the same time
    gl.useProgram(program);

    // Enable buffer data supplying for this attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Get data from ARRAY_BUFFER bind point
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Turn on texCoord atribute
    gl.enableVertexAttribArray(texCoordAttributeLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    // Tell the texCoord attribute how to get data out of texCoordBuffer
    gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Set uniform value for the current program
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  draw();

  window.addEventListener('resize', draw);
};

loadImage();
