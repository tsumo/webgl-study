import { Scene } from './scene';

const init = (): void => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  const gl = canvas.getContext('webgl2');
  if (gl === null) {
    throw new Error('Cannot get webgl context');
  }

  new Scene(gl);
};

init();
