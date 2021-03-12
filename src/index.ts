import './style.css';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';
import { m3 } from './m3';
import { rand, randDeviate, randInt } from './utils';

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

const setGeometry = (gl: WebGLRenderingContext): void => {
  // Copy data into buffer
  gl.bufferData(
    gl.ARRAY_BUFFER,
    // prettier-ignore
    new Float32Array([
      // left column
      0, 0,
      30, 0,
      0, 150,
      0, 150,
      30, 0,
      30, 150,
      // top rung
      30, 0,
      100, 0,
      30, 30,
      30, 30,
      100, 0,
      100, 30,
      // middle rung
      30, 60,
      67, 60,
      30, 90,
      30, 90,
      67, 60,
      67, 90,
    ]),
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

  // Uniforms stay the same for all vertices/pixels during single draw call
  const colorUniLoc = gl.getUniformLocation(program, 'u_color');
  const resolutionUniLoc = gl.getUniformLocation(program, 'u_resolution');
  const matrixUniLoc = gl.getUniformLocation(program, 'u_matrix');

  // Attribute is a data from the buffer
  const positionAttrLoc = gl.getAttribLocation(program, 'a_position');

  // Buffer for 2d clip space points
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);

  const draw = (): void => {
    resizeCanvas(gl, canvas);

    // Tell webgl how to convert from clip space to pixels
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Set current program. App can have many programs at the same time
    gl.useProgram(program);

    // Enable buffer data supplying for this attribute
    gl.enableVertexAttribArray(positionAttrLoc);

    // Get data from ARRAY_BUFFER bind point
    gl.vertexAttribPointer(positionAttrLoc, 2, gl.FLOAT, false, 0, 0);

    gl.uniform4fv(colorUniLoc, [rand(), rand(), rand(), 1]);
    gl.uniform2f(resolutionUniLoc, canvas.width, canvas.height);

    const translationMatrix = m3.translation(randInt(100) + 150, randInt(100) + 150);
    const rad = (rand(360) * Math.PI) / 180;
    const rotationMatrix = m3.rotation(rad);
    const scaleMatrix = m3.scaling(randDeviate(2), randDeviate(2));
    const matrix = m3.multiply(m3.multiply(translationMatrix, rotationMatrix), scaleMatrix);

    gl.uniformMatrix3fv(matrixUniLoc, false, matrix);

    gl.drawArrays(gl.TRIANGLES, 0, 18);
  };

  draw();
};

init();
