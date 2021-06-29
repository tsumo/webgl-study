import { mat4 } from 'gl-matrix';
import { Canvas } from '../../lib/canvas';
import { Camera } from '../../lib/camera';
import { Vao } from '../../lib/vao';
import { Transform3d } from '../../lib/transform';
import { Program } from '../../lib/program';
import { Gui } from '../../lib/gui';
import { RenderLoop } from '../../lib/render-loop';
import { createGrid } from '../../primitives/grid/grid';
import { generateSphereData } from '../../primitives/sphere';
import pointsVertexShader from './points-vertex.glsl';
import pointFragmentShader from './points-fragment.glsl';
import facesVertexShader from './faces-vertex.glsl';
import facesFragmentShader from './faces-fragment.glsl';

export const init013UVSphere = (gl: WebGL2RenderingContext): void => {
  const canvas = new Canvas(gl);

  const camera = new Camera(gl, 'orbit', 0.1);
  camera.setTranslation([0, 0, 2], true);
  camera.setRotation([60, 0, 35], true);

  const grid = createGrid(gl);

  let sphere = generateSphereData(12, 12);
  const sphereTransform = new Transform3d();
  sphereTransform.scale = [0.5, 0.5, 0.5];
  let spherePointsVao = new Vao(gl, [sphere.position, sphere.color]);
  const spherePointsProgram = new Program(
    gl,
    pointsVertexShader,
    pointFragmentShader,
    {
      matrix: { type: 'matrix4fv', value: mat4.create() },
      pointSize: { type: 'f', value: 30 },
    },
    ['a_position', 'a_color'],
  );
  let sphereFacesVao = new Vao(gl, [sphere.faces]);
  const sphereFacesProgram = new Program(
    gl,
    facesVertexShader,
    facesFragmentShader,
    { matrix: { type: 'matrix4fv', value: mat4.create() } },
    ['a_position'],
  );

  const gui = new Gui(
    {
      slices: { type: 'float', default: 12, min: 3, max: 64, step: 1 },
      stacks: { type: 'float', default: 12, min: 3, max: 64, step: 1 },
      pointSize: { type: 'float', default: 15, min: 0, max: 50 },
    },
    (values) => {
      sphere = generateSphereData(values.slices, values.stacks);
      spherePointsVao = new Vao(gl, [sphere.position, sphere.color]);
      sphereFacesVao = new Vao(gl, [sphere.faces]);
    },
  );

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);

  new RenderLoop(() => {
    canvas.clear();

    camera.update();

    grid.program.use();
    grid.transform.matrix = mat4.clone(camera.viewProjectionMatrix);
    grid.transform.applyTransforms();
    grid.program.setUniform('matrix', grid.transform.matrix);
    grid.vao.drawLines();

    sphereTransform.matrix = mat4.clone(camera.viewProjectionMatrix);
    sphereTransform.applyTransforms();

    spherePointsProgram.use();
    spherePointsProgram.setUniform('matrix', sphereTransform.matrix);
    spherePointsProgram.setUniform('pointSize', gui.values.pointSize);
    spherePointsVao.drawPoints();

    sphereFacesProgram.use();
    sphereFacesProgram.setUniform('matrix', sphereTransform.matrix);
    sphereFacesVao.drawTriangles();
  });
};
