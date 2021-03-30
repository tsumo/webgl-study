import * as dat from 'dat.gui';
import { Scene } from './scene';

const init = (): void => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  const gl = canvas.getContext('webgl2');
  if (gl === null) {
    throw new Error('Cannot get webgl context');
  }

  const scene = new Scene(gl);

  const guiValues = {
    pointSize: 50,
  };
  const gui = new dat.GUI();
  const onChange = (): void => {
    scene.pointSize = guiValues.pointSize;
  };
  gui.add(guiValues, 'pointSize', 0, 300, 0.01).onChange(onChange);
};

window.addEventListener('load', init);
