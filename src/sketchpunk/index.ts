import './style.css';
import { init001Point } from './scenes/001-point';
import { init002RenderLoop } from './scenes/002-render-loop';
import { init003Vao } from './scenes/003-vao/index';

// TODO: scene switcher
const initApp = (): void => {
  const fpsElement = document.createElement('div');
  fpsElement.classList.add('fps');
  document.body.appendChild(fpsElement);

  const canvasElement = document.createElement('canvas');
  document.body.appendChild(canvasElement);

  const gl = canvasElement.getContext('webgl2');
  if (gl === null) {
    throw new Error('Cannot get webgl context');
  }

  // init001Point(gl, fpsElement);
  // init002RenderLoop(gl, fpsElement);
  init003Vao(gl, fpsElement);
};

window.addEventListener('load', initApp);
