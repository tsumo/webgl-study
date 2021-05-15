import { mat4 } from 'gl-matrix';
import { Camera } from '../../lib/camera';
import { Canvas } from '../../lib/canvas';
import { RenderLoop } from '../../lib/render-loop';
import { createGrid } from '../../primitives/grid/grid';
import {
  createMultiRingFrame,
  createQuadFrame,
  createRingFrame,
} from '../../primitives/frames/frames';
import { mapRange } from '../../utils';

export const init008Transparency = (gl: WebGL2RenderingContext): void => {
  const canvas = new Canvas(gl);

  const grid = createGrid(gl);
  grid.transform.scale = [10, 10, 10];

  const quadFrame = createQuadFrame(gl);
  quadFrame.transform.rotation = [90, 0, 0];

  const ringFrame = createRingFrame(gl);
  ringFrame.transform.rotation = [90, 0, 0];

  const multiRingFrame = createMultiRingFrame(gl, {
    n: 10,
    translationDeviation: [6, 6, 6],
    rotationInitial: [0, 0, 0],
    rotationDeviation: [360, 360, 360],
    scaleInitial: [0.5, 0.5, 0.5],
    scaleDeviation: [0.3, 0.3, 0.3],
  });

  const camera = new Camera(gl, 'orbit');
  camera.setTranslation([0, 0, 15], true);
  camera.setRotation([70, 0, 12], true);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.depthFunc(gl.LEQUAL);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  new RenderLoop((delta, time) => {
    const width = mapRange(-1, 1, 0.2, 0.7, Math.sin(time));

    canvas.clear();

    camera.update();

    gl.depthMask(true);

    grid.program.use();
    grid.transform.matrix = mat4.clone(camera.viewProjectionMatrix);
    grid.transform.applyTransforms();
    grid.program.setUniform('matrix', grid.transform.matrix);
    grid.vao.drawLines();

    gl.depthMask(false);

    multiRingFrame.program.use();
    multiRingFrame.transform.matrix = mat4.clone(camera.viewProjectionMatrix);
    multiRingFrame.transform.applyTransforms();
    multiRingFrame.program.setUniform('matrix', multiRingFrame.transform.matrix);
    multiRingFrame.program.setUniform('width', width);
    multiRingFrame.vao.drawTriangles();

    for (let y = 4; y >= -4; y -= 2) {
      if (y % 4 === 0) {
        ringFrame.program.use();
        ringFrame.transform.matrix = mat4.clone(camera.viewProjectionMatrix);
        ringFrame.transform.translation = [0, y, 0];
        ringFrame.transform.rotation[1] += delta * 30;
        ringFrame.transform.applyTransforms();
        ringFrame.program.setUniform('matrix', ringFrame.transform.matrix);
        ringFrame.program.setUniform('width', width);
        ringFrame.vao.drawTriangles();
      } else {
        quadFrame.program.use();
        quadFrame.transform.matrix = mat4.clone(camera.viewProjectionMatrix);
        quadFrame.transform.translation = [0, y, 0];
        quadFrame.transform.rotation[1] += delta * 30;
        quadFrame.transform.applyTransforms();
        quadFrame.program.setUniform('matrix', quadFrame.transform.matrix);
        quadFrame.program.setUniform('width', width);
        quadFrame.vao.drawTriangles();
      }
    }
  });
};
