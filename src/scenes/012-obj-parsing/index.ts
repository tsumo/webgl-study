import { mat4 } from 'gl-matrix';
import { Canvas } from '../../lib/canvas';
import { Camera } from '../../lib/camera';
import { Vao } from '../../lib/vao';
import { Transform3d } from '../../lib/transform';
import { Program } from '../../lib/program';
import { createTexture, Texture } from '../../lib/texture';
import { Gui } from '../../lib/gui';
import { RenderLoop } from '../../lib/render-loop';
import { createGrid } from '../../primitives/grid/grid';
import { parseObj } from '../../lib/parser-obj';
import { generateTestTexture } from '../../primitives/textures/test-texture';
import { fetchTextFile } from '../../utils';
import chairObj from './chair.obj';
import pirateGirlObj from './pirate_girl.obj';
import pirateGirlJpg from './pirate_girl.jpg';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

export const init012ObjParsing = async (gl: WebGL2RenderingContext): Promise<void> => {
  const canvas = new Canvas(gl);

  const gui = new Gui({ obj: { type: 'select', options: ['chair', 'pirate girl'] } });

  const camera = new Camera(gl, 'orbit');
  camera.setTranslation([0, 0, 13], true);
  camera.setRotation([60, 0, 135], true);

  const grid = createGrid(gl);
  grid.transform.translation = [0, 0, -3];
  grid.transform.scale = [10, 10, 10];

  const chair = await fetchTextFile(chairObj);
  const chairData = parseObj(chair);
  const chairVao = new Vao(gl, [chairData.position, chairData.uv]);
  const chairTransform = new Transform3d();
  chairTransform.translation = [0, 0, -3];
  const chairProgram = new Program(
    gl,
    vertexShader,
    fragmentShader,
    { matrix: { type: 'matrix4fv', value: mat4.create() } },
    ['a_position', 'a_uv'],
  );
  const chairTexture = new Texture(gl, generateTestTexture(2048), 0);

  const pirate = await fetchTextFile(pirateGirlObj);
  const pirateData = parseObj(pirate);
  const pirateVao = new Vao(gl, [pirateData.position, pirateData.uv]);
  const pirateTransform = new Transform3d();
  pirateTransform.translation = [0, 0, -3];
  pirateTransform.rotation = [0, 0, -90];
  pirateTransform.scale = [1.8, 1.8, 1.8];
  const pirateProgram = new Program(
    gl,
    vertexShader,
    fragmentShader,
    { matrix: { type: 'matrix4fv', value: mat4.create() } },
    ['a_position', 'a_uv'],
  );
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const pirateTexture = await createTexture(gl, pirateGirlJpg, 0);

  gl.enable(gl.DEPTH_TEST);

  new RenderLoop(() => {
    canvas.clear();

    camera.update();

    grid.program.use();
    grid.transform.matrix = mat4.clone(camera.viewProjectionMatrix);
    grid.transform.applyTransforms();
    grid.program.setUniform('matrix', grid.transform.matrix);
    grid.vao.drawLines();

    if (gui.values.obj === 'chair') {
      chairProgram.use();
      chairTransform.matrix = mat4.clone(camera.viewProjectionMatrix);
      chairTransform.applyTransforms();
      chairProgram.setUniform('matrix', chairTransform.matrix);
      chairTexture.activate();
      chairVao.drawTriangles();
    }

    if (gui.values.obj === 'pirate girl') {
      pirateProgram.use();
      pirateTransform.matrix = mat4.clone(camera.viewProjectionMatrix);
      pirateTransform.applyTransforms();
      pirateProgram.setUniform('matrix', pirateTransform.matrix);
      pirateTexture.activate();
      pirateVao.drawTriangles();
    }
  });
};
