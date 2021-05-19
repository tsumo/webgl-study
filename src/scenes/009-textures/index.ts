import { mat4 } from 'gl-matrix';
import { Camera } from '../../lib/camera';
import { Canvas } from '../../lib/canvas';
import { Program } from '../../lib/program';
import { RenderLoop } from '../../lib/render-loop';
import { Texture } from '../../lib/texture';
import { Vao } from '../../lib/vao';
import { Transform3d } from '../../lib/transform';
import { generateMultiPlaneData, generatePlaneData } from '../../primitives/plane';
import { generateTestTexture } from '../../primitives/textures/test-texture';
import grassVertexShader from './grass-vertex.glsl';
import planeVertexShader from './plane-vertex.glsl';
import fragmentShader from './fragment.glsl';

const generateGrassTexture = (): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const size = 512;
  const half = size / 2;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Cannot get 2d context');
  }
  const xoff = 0;
  const yoff = 0;
  ctx.beginPath();
  ctx.moveTo(74 + xoff, 492 + yoff);
  ctx.bezierCurveTo(73 + xoff, 507 + yoff, 33 + xoff, 368 + yoff, 43 + xoff, 248 + yoff);
  ctx.bezierCurveTo(48 + xoff, 188 + yoff, 212 + xoff, 12 + yoff, 247 + xoff, 10 + yoff);
  ctx.bezierCurveTo(287 + xoff, 8 + yoff, 443 + xoff, 179 + yoff, 448 + xoff, 286 + yoff);
  ctx.bezierCurveTo(454 + xoff, 418 + yoff, 437 + xoff, 482 + yoff, 432 + xoff, 496 + yoff);
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, size);
  gradient.addColorStop(0, '#556d2c');
  gradient.addColorStop(1, '#1e2610');
  ctx.fillStyle = gradient;
  ctx.fill();
  return canvas;
};

export const init009Textures = (gl: WebGL2RenderingContext): void => {
  const canvas = new Canvas(gl);

  const camera = new Camera(gl, 'orbit');
  camera.setTranslation([0, 0, 20], true);
  camera.setRotation([50, 0, 12], true);

  const grassData = generateMultiPlaneData({
    n: 1000,
    translationDeviation: [5, 5, 0],
    rotationInitial: [0, 10, 0],
    rotationDeviation: [10, 10, 180],
    scaleInitial: [0.15, 1, 2],
    scaleDeviation: [0.1, 0, 0.6],
    positioning: 'standing',
  });
  const grassProgram = new Program(
    gl,
    grassVertexShader,
    fragmentShader,
    { matrix: { type: 'matrix4fv', value: mat4.create() } },
    ['a_position', 'a_uv'],
  );
  const grassVao = new Vao(gl, [grassData.position, grassData.uv], grassData.index);
  const grassTransform = new Transform3d();
  const grassTexture = new Texture(gl, generateGrassTexture(), 0);

  const planeData = generatePlaneData();
  const planeProgram = new Program(
    gl,
    planeVertexShader,
    fragmentShader,
    { matrix: { type: 'matrix4fv', value: mat4.create() } },
    ['a_postion', 'a_uv'],
  );
  const planeVao = new Vao(gl, [planeData.position, planeData.uv], planeData.index);
  const planeTransform = new Transform3d();
  planeTransform.scale = [8, 8, 8];
  const planeTexture = new Texture(gl, generateTestTexture(1024), 0);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.depthFunc(gl.LEQUAL);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  new RenderLoop((_delta, time) => {
    canvas.clear();

    camera.update();

    gl.depthMask(true);

    planeProgram.use();
    planeTransform.matrix = mat4.clone(camera.viewProjectionMatrix);
    planeTransform.applyTransforms();
    planeProgram.setUniform('matrix', planeTransform.matrix);
    planeTexture.activate();
    planeVao.drawTriangles();

    gl.depthMask(false);

    grassProgram.use();
    grassTransform.matrix = mat4.clone(camera.viewProjectionMatrix);
    grassTransform.applyTransforms();
    grassProgram.setStandardUniforms(time);
    grassProgram.setUniform('matrix', grassTransform.matrix);
    grassTexture.activate();
    grassVao.drawTriangles();
  });
};
