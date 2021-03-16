import * as dat from 'dat.gui';
import './style.css';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';
import { m4 } from './m4';
import { deg2Rad } from './utils';
import { V3 } from './v3';

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
      // left column front
        0,   0,  0,
        0, 150,  0,
       30,   0,  0,
        0, 150,  0,
       30, 150,  0,
       30,   0,  0,
      // top rung front
       30,   0,  0,
       30,  30,  0,
      100,   0,  0,
       30,  30,  0,
      100,  30,  0,
      100,   0,  0,
      // middle rung front
       30,  60,  0,
       30,  90,  0,
       67,  60,  0,
       30,  90,  0,
       67,  90,  0,
       67,  60,  0,
      // left column back
        0,   0,  30,
       30,   0,  30,
        0, 150,  30,
        0, 150,  30,
       30,   0,  30,
       30, 150,  30,
      // top rung back
       30,   0,  30,
      100,   0,  30,
       30,  30,  30,
       30,  30,  30,
      100,   0,  30,
      100,  30,  30,
      // middle rung back
       30,  60,  30,
       67,  60,  30,
       30,  90,  30,
       30,  90,  30,
       67,  60,  30,
       67,  90,  30,
      // top
        0,   0,   0,
      100,   0,   0,
      100,   0,  30,
        0,   0,   0,
      100,   0,  30,
        0,   0,  30,
      // top rung right
      100,   0,   0,
      100,  30,   0,
      100,  30,  30,
      100,   0,   0,
      100,  30,  30,
      100,   0,  30,
      // under top rung
      30,   30,   0,
      30,   30,  30,
      100,  30,  30,
      30,   30,   0,
      100,  30,  30,
      100,  30,   0,
      // between top rung and middle
      30,   30,   0,
      30,   60,  30,
      30,   30,  30,
      30,   30,   0,
      30,   60,   0,
      30,   60,  30,
      // top of middle rung
      30,   60,   0,
      67,   60,  30,
      30,   60,  30,
      30,   60,   0,
      67,   60,   0,
      67,   60,  30,
      // right of middle rung
      67,   60,   0,
      67,   90,  30,
      67,   60,  30,
      67,   60,   0,
      67,   90,   0,
      67,   90,  30,
      // bottom of middle rung.
      30,   90,   0,
      30,   90,  30,
      67,   90,  30,
      30,   90,   0,
      67,   90,  30,
      67,   90,   0,
      // right of bottom
      30,   90,   0,
      30,  150,  30,
      30,   90,  30,
      30,   90,   0,
      30,  150,   0,
      30,  150,  30,
      // bottom
      0,   150,   0,
      0,   150,  30,
      30,  150,  30,
      0,   150,   0,
      30,  150,  30,
      30,  150,   0,
      // left side
      0,   0,   0,
      0,   0,  30,
      0, 150,  30,
      0,   0,   0,
      0, 150,  30,
      0, 150,   0,
    ]),
    gl.STATIC_DRAW,
  );
};

const setColors = (gl: WebGLRenderingContext): void => {
  // prettier-ignore
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([
    // left column front
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    // top rung front
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    // middle rung front
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    200,  70, 120,
    // left column back
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    // top rung back
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    // middle rung back
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    80, 70, 200,
    // top
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    70, 200, 210,
    // top rung right
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    200, 200, 70,
    // under top rung
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    210, 100, 70,
    // between top rung and middle
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    210, 160, 70,
    // top of middle rung
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    70, 180, 210,
    // right of middle rung
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    100, 70, 210,
    // bottom of middle rung.
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    76, 210, 100,
    // right of bottom
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    140, 210, 80,
    // bottom
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    90, 130, 110,
    // left side
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
    160, 160, 220,
  ]), gl.STATIC_DRAW);
};

const init = (): void => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  const gl = canvas.getContext('webgl');
  if (gl === null) {
    throw new Error('Cannot get webgl context');
  }

  const guiValues = {
    fov: 80,
    near: 1,
    far: 1000,
    cameraAngle: 0,
    numFs: 5,
  };
  const guiControllers: dat.GUIController[] = [];
  const gui = new dat.GUI();
  const fullRotation = Math.PI * 2;
  guiControllers.push(gui.add(guiValues, 'fov', 0, 180, 0.01));
  guiControllers.push(gui.add(guiValues, 'near', 1, 500, 0.01));
  guiControllers.push(gui.add(guiValues, 'far', 1, 1000, 0.01));
  guiControllers.push(gui.add(guiValues, 'cameraAngle', 0, fullRotation, 0.01));
  guiControllers.push(gui.add(guiValues, 'numFs', 1, 16));

  const program = createShadersAndProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Uniforms stay the same for all vertices/pixels during single draw call
  const matrixUniLoc = gl.getUniformLocation(program, 'u_matrix');

  // Attribute is a data from the buffer
  const positionAttrLoc = gl.getAttribLocation(program, 'a_position');
  const colorAttrLoc = gl.getAttribLocation(program, 'a_color');

  // Buffer for 2d clip space points
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);

  // Colors buffer
  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setColors(gl);

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  const draw = (): void => {
    resizeCanvas(gl, canvas);

    // Tell webgl how to convert from clip space to pixels
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set current program. App can have many programs at the same time
    gl.useProgram(program);

    // Enable buffer data supplying for this attribute
    gl.enableVertexAttribArray(positionAttrLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Get data from ARRAY_BUFFER bind point
    gl.vertexAttribPointer(positionAttrLoc, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colorAttrLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorAttrLoc, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    const projectionMatrix = m4.perspective(
      deg2Rad(guiValues.fov),
      canvas.width / canvas.height,
      guiValues.near,
      guiValues.far,
    );

    const radius = 200;
    // Position of first f
    const fPosition: V3 = [radius, 0, 0];

    // Find camera matrix for current angle
    let cameraMatrix = m4.yRotation(guiValues.cameraAngle);
    cameraMatrix = m4.translate(cameraMatrix, 0, 0, radius * 2);

    // Extract camera position from matrix
    const cameraPosition: V3 = [cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]];

    // Camera orientation
    const up: V3 = [0, 1, 0];

    // Compute final camera matrix
    cameraMatrix = m4.lookAt(cameraPosition, fPosition, up);

    // Make view matrix from camera matrix
    const viewMatrix = m4.inverse(cameraMatrix);

    const viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    for (let i = 0; i < guiValues.numFs; ++i) {
      const angle = (i * Math.PI * 2) / guiValues.numFs;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const matrix = m4.translate(viewProjectionMatrix, x, 0, y);

      gl.uniformMatrix4fv(matrixUniLoc, false, matrix);

      gl.drawArrays(gl.TRIANGLES, 0, 16 * 6);
    }
  };

  draw();

  guiControllers.forEach((c) => c.onChange(draw));
};

init();
