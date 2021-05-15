import { mat4 } from 'gl-matrix';
import { Program } from '../../lib/program';
import { Vao } from '../../lib/vao';
import { Transform3d } from '../../lib/transform';
import { generateMultiPlaneData, generatePlaneData, MultiPlaneOptions } from '../plane';
import vertexShader from './vertex.glsl';
import quadFragmentShader from './quad-fragment.glsl';
import ringFragmentShader from './ring-fragment.glsl';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createQuadFrame = (gl: WebGL2RenderingContext) => {
  const program = new Program(
    gl,
    vertexShader,
    quadFragmentShader,
    { matrix: { type: 'matrix4fv', value: mat4.create() }, width: { type: 'f', value: 0.1 } },
    ['a_position', 'a_uv'],
  );
  const data = generatePlaneData();
  const vao = new Vao(gl, [data.position, data.uv], data.index);
  const transform = new Transform3d();
  return { program, vao, transform };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createRingFrame = (gl: WebGL2RenderingContext) => {
  const program = new Program(
    gl,
    vertexShader,
    ringFragmentShader,
    { matrix: { type: 'matrix4fv', value: mat4.create() }, width: { type: 'f', value: 0.1 } },
    ['a_position', 'a_uv'],
  );
  const data = generatePlaneData();
  const vao = new Vao(gl, [data.position, data.uv], data.index);
  const transform = new Transform3d();
  return { program, vao, transform };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createMultiRingFrame = (gl: WebGL2RenderingContext, options: MultiPlaneOptions) => {
  const program = new Program(
    gl,
    vertexShader,
    ringFragmentShader,
    { matrix: { type: 'matrix4fv', value: mat4.create() }, width: { type: 'f', value: 0.1 } },
    ['a_position', 'a_uv'],
  );
  const data = generateMultiPlaneData(options);
  const vao = new Vao(gl, [data.position, data.uv], data.index);
  const transform = new Transform3d();
  return { program, vao, transform };
};
