import './style.css';
import { glMatrix } from 'gl-matrix';
import { init001Point } from './scenes/001-point';
import { init002RenderLoop } from './scenes/002-render-loop';
import { init003Vao } from './scenes/003-vao';
import { init004Lines } from './scenes/004-lines';
import { init005Transformation } from './scenes/005-transformation';
import { init006Camera } from './scenes/006-camera';

glMatrix.setMatrixArrayType(Array);

const num2Scene: Record<number, (gl: WebGL2RenderingContext) => void> = {
  1: init001Point,
  2: init002RenderLoop,
  3: init003Vao,
  4: init004Lines,
  5: init005Transformation,
  6: init006Camera,
};

const initApp = (): void => {
  const searchParams = new URLSearchParams(window.location.search);
  const sceneNumber = Number(searchParams.get('scene'));
  if (!(sceneNumber in num2Scene)) {
    const keys = Object.keys(num2Scene);
    searchParams.set('scene', keys[keys.length - 1]);
    window.location.search = searchParams.toString();
    return;
  }

  const prevSceneElement = document.createElement('button');
  prevSceneElement.innerText = '<';
  prevSceneElement.onclick = (): void => {
    searchParams.set('scene', String(sceneNumber - 1));
    window.location.search = searchParams.toString();
    return;
  };
  const nextSceneElement = document.createElement('button');
  nextSceneElement.onclick = (): void => {
    searchParams.set('scene', String(sceneNumber + 1));
    window.location.search = searchParams.toString();
    return;
  };
  nextSceneElement.innerText = '>';
  const sceneSwitcherContainer = document.createElement('div');
  sceneSwitcherContainer.id = 'switcher';
  if (!(sceneNumber - 1 in num2Scene)) {
    prevSceneElement.disabled = true;
  }
  if (!(sceneNumber + 1 in num2Scene)) {
    nextSceneElement.disabled = true;
  }
  sceneSwitcherContainer.appendChild(prevSceneElement);
  sceneSwitcherContainer.appendChild(nextSceneElement);
  document.body.appendChild(sceneSwitcherContainer);

  const fpsElement = document.createElement('div');
  fpsElement.id = 'fps';
  document.body.appendChild(fpsElement);

  const canvasElement = document.createElement('canvas');
  document.body.appendChild(canvasElement);

  const gl = canvasElement.getContext('webgl2');
  if (gl === null) {
    throw new Error('Cannot get webgl context');
  }

  num2Scene[sceneNumber](gl);
};

window.addEventListener('load', initApp);
