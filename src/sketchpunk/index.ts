import './style.css';
import { glMatrix } from 'gl-matrix';
import { init001Point } from './scenes/001-point';
import { init002RenderLoop } from './scenes/002-render-loop';
import { init003Vao } from './scenes/003-vao';
import { init004Lines } from './scenes/004-lines';
import { init005Transformation } from './scenes/005-transformation';

glMatrix.setMatrixArrayType(Array);

// TODO: scene switcher
const initApp = (): void => {
  const fpsElement = document.createElement('div');
  fpsElement.id = 'fps';
  document.body.appendChild(fpsElement);

  const canvasElement = document.createElement('canvas');
  document.body.appendChild(canvasElement);

  const gl = canvasElement.getContext('webgl2');
  if (gl === null) {
    throw new Error('Cannot get webgl context');
  }

  // init001Point(gl);
  // init002RenderLoop(gl);
  // init003Vao(gl);
  // init004Lines(gl);
  init005Transformation(gl);
};

window.addEventListener('load', initApp);
