import { mat4 } from 'gl-matrix';
import { Canvas } from '../../lib/canvas';
import { Camera } from '../../lib/camera';
import { Vao } from '../../lib/vao';
import { Transform3d } from '../../lib/transform';
import { Program } from '../../lib/program';
import { Gui } from '../../lib/gui';
import { RenderLoop } from '../../lib/render-loop';
import { generateSphereData } from '../../primitives/sphere';
import { triangleDataToLineData } from '../../utils';
import trianglesVertexShader from './triangles-vertex.glsl';
import trianglesFragmentShader from './triangles-fragment.glsl';
import linesVertexShader from './lines-vertex.glsl';
import linesFragmentShader from './lines-fragment.glsl';

export const init013UVSphere = (gl: WebGL2RenderingContext): void => {
  const canvas = new Canvas(gl);

  const camera = new Camera(gl, 'orbit', 0.1);
  camera.setTranslation([0, 0, 2], true);
  camera.setRotation([60, 0, 35], true);

  let sphere = generateSphereData(12, 12);
  const sphereTransform = new Transform3d();
  sphereTransform.scale = [0.5, 0.5, 0.5];
  let sphereTrianglesVao = new Vao(gl, [sphere.position]);
  let sphereLinesVao = new Vao(gl, [
    { ...sphere.position, data: triangleDataToLineData(sphere.position.data) },
  ]);
  const sphereTrianglesProgram = new Program(
    gl,
    trianglesVertexShader,
    trianglesFragmentShader,
    { matrix: { type: 'matrix4fv', value: mat4.create() } },
    ['a_position'],
  );
  const sphereLinesProgram = new Program(
    gl,
    linesVertexShader,
    linesFragmentShader,
    { matrix: { type: 'matrix4fv', value: mat4.create() } },
    ['a_position'],
  );

  const gui = new Gui(
    {
      slices: { type: 'float', default: 12, min: 3, max: 32, step: 1 },
      stacks: { type: 'float', default: 12, min: 3, max: 32, step: 1 },
      triangles: { type: 'boolean', default: true },
      lines: { type: 'boolean', default: true },
    },
    (values) => {
      sphere = generateSphereData(values.slices, values.stacks);
      sphereTrianglesVao = new Vao(gl, [sphere.position]);
      sphereLinesVao = new Vao(gl, [
        { type: 'float', data: triangleDataToLineData(sphere.position.data), size: 3 },
      ]);
    },
  );

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  new RenderLoop(() => {
    canvas.clear();

    camera.update();

    sphereTransform.matrix = mat4.clone(camera.viewProjectionMatrix);
    sphereTransform.applyTransforms();

    sphereTrianglesProgram.use();
    sphereTrianglesProgram.setUniform('matrix', sphereTransform.matrix);
    gui.values.triangles && sphereTrianglesVao.drawTriangles();

    sphereLinesProgram.use();
    sphereLinesProgram.setUniform('matrix', sphereTransform.matrix);
    gui.values.lines && sphereLinesVao.drawLines();
  });
};
