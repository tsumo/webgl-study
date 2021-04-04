import { Canvas } from '../../lib/canvas';
import { Program } from '../../lib/program';
import { Vao } from '../../lib/vao';
import { RenderLoop } from '../../lib/render-loop';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';

export const init003Vao = (gl: WebGL2RenderingContext, fpsElement: HTMLDivElement): void => {
  const canvas = new Canvas(gl);

  const program = new Program(
    gl,
    vertexShaderSource,
    fragmentShaderSource,
    { uAngle: { type: 'float', value: 0 } },
    true,
  );

  const vaoWithoutIndex = new Vao(
    gl,
    {
      // prettier-ignore
      data: [
        -0.1,  0.1,
         0.1,  0.1,
        -0.1, -0.1,
         0.1, -0.1,
      ],
      size: 2,
    },
    { data: [] },
    { data: [] },
    undefined,
  );

  const vaoWithIndex = new Vao(
    gl,
    {
      // prettier-ignore
      data: [
            0,     0, // 0
        -0.05,   0.1, // 1
         -0.1,  0.05, // 2
         0.05,   0.1, // 3
          0.1,  0.05, // 4
         -0.1, -0.05, // 5
        -0.05,  -0.1, // 6
          0.1, -0.05, // 7
         0.05,  -0.1, // 8
      ],
      size: 2,
    },
    { data: [] },
    { data: [] },
    [0, 1, 2, 0, 3, 4, 0, 5, 6, 0, 7, 8],
  );

  let angle = 0;

  new RenderLoop((delta, fps) => {
    angle = (angle + delta * 0.5) % (Math.PI * 2);

    fpsElement.innerText = String(fps);

    canvas.clear();
    program.use();
    program.setUniform('uAngle', angle);
    vaoWithIndex.drawTriangles();
    vaoWithoutIndex.drawPoints();
  });
};
