import './style.css';
import { init001Points } from './scenes/001-points';

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

  init001Points(gl, fpsElement);
};

window.addEventListener('load', initApp);
