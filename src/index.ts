import './style.css';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';
import { rand, randInt } from './utils';

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
  if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
    return;
  }
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
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

const init = (): void => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  const gl = canvas.getContext('webgl');
  if (gl === null) {
    throw new Error('Cannot get webgl context');
  }
  const program = createShadersAndProgram(gl, vertexShaderSource, fragmentShaderSource);
  // Attribute is a data from the buffer
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  // Uniforms stay the same for all vertices/pixels during single draw call
  const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
  const colorUniformLocation = gl.getUniformLocation(program, 'u_color');
  // Buffer is a per-vertex GPU data
  const positionBuffer = gl.createBuffer();
  const draw = (): void => {
    resizeCanvas(gl, canvas);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Set current program. App can have many programs at the same time
    gl.useProgram(program);
    // Set uniform value for the current program
    gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);
    // Enable buffer data supplying for this attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
    // Bind sets the default buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Get data from ARRAY_BUFFER bind point
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    for (let i = 0; i < 50; i++) {
      setRectangle(gl, randInt(300), randInt(300), randInt(300), randInt(300));
      gl.uniform4f(colorUniformLocation, rand(), rand(), rand(), 1);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  };
  draw();
  window.addEventListener('resize', draw);
};

init();
