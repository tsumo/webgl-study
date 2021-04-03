import './style.css';
import { init001Points } from './scenes/001-points';
import { init002Vao } from './scenes/002-vao/index';

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

  // init001Points(gl, fpsElement);
  init002Vao(gl, fpsElement);
};

window.addEventListener('load', initApp);
