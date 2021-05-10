import { mat4, vec3 } from 'gl-matrix';
import { Camera } from '../../lib/camera';
import { Canvas } from '../../lib/canvas';
import { RenderLoop } from '../../lib/render-loop';
import { createGrid } from '../../primitives/grid/grid';
import { createAxes } from '../../primitives/axes/axes';
import { createF3d } from '../../primitives/f3d/f3d';

/** Look-at constraint for 3d transforms */
export const init007LookAt = (gl: WebGL2RenderingContext): void => {
  const canvas = new Canvas(gl);

  const grid = createGrid(gl);
  grid.transform.scale = [10, 10, 10];

  const axes = createAxes(gl);

  const f3d = createF3d(gl);
  f3d.transform.scale = [0.01, 0.01, 0.01];
  f3d.transform.lookAt = [0, 0, 0];

  const camera = new Camera(gl, 'orbit');
  camera.setTranslation([0, 0, 15]);

  gl.enable(gl.DEPTH_TEST);

  new RenderLoop((delta, time) => {
    const t = time * 0.5;
    const lookAt: vec3 = [Math.cos(t) * 2.5, Math.sin(t) * 2.5, Math.sin(t) * 2.5];

    canvas.clear();

    camera.update();

    grid.program.use();
    grid.transform.matrix = mat4.clone(camera.viewProjectionMatrix);
    grid.transform.applyTransforms();
    grid.program.setUniform('matrix', grid.transform.matrix);
    grid.vao.drawLines();

    f3d.program.use();
    f3d.transform.matrix = mat4.clone(camera.viewProjectionMatrix);
    f3d.transform.translation = lookAt;
    f3d.transform.applyTransforms();
    f3d.program.setUniform('matrix', f3d.transform.matrix);
    f3d.vao.drawTriangles();

    axes.program.use();
    for (let x = -5; x <= 5; x++) {
      for (let y = -5; y <= 5; y++) {
        axes.transform.resetTransforms();
        axes.transform.translation = [x, y, 0];
        axes.transform.lookAt = lookAt;
        axes.transform.matrix = mat4.clone(camera.viewProjectionMatrix);
        axes.transform.applyTransforms();
        axes.program.setUniform('matrix', axes.transform.matrix);
        axes.vao.drawLines();
      }
    }
  });
};
