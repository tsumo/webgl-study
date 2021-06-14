import { mat4 } from 'gl-matrix';
import { Camera } from '../../lib/camera';
import { Canvas } from '../../lib/canvas';
import { RenderLoop } from '../../lib/render-loop';
import { createCubemap } from '../../primitives/cubemap';
import { createGrid } from '../../primitives/grid/grid';

/**
 * Screen-space single plane cubemap.
 */
export const init011Cubemap = async (gl: WebGL2RenderingContext): Promise<void> => {
  const canvas = new Canvas(gl);

  const camera = new Camera(gl, 'orbit');
  camera.setTranslation([0, 0, 3], true);
  camera.setRotation([80, 0, 12], true);

  const grid = createGrid(gl);

  const cubemap = await createCubemap(gl);

  gl.enable(gl.DEPTH_TEST);

  new RenderLoop(() => {
    canvas.clear();

    camera.update();

    grid.program.use();
    grid.transform.matrix = mat4.clone(camera.viewProjectionMatrix);
    grid.transform.applyTransforms();
    grid.program.setUniform('matrix', grid.transform.matrix);
    grid.vao.drawLines();

    cubemap.draw(camera);
  });
};
