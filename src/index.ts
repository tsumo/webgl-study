import './style.css';
import { glMatrix } from 'gl-matrix';
import { init001Point } from './scenes/001-point';
import { init002RenderLoop } from './scenes/002-render-loop';
import { init003Vao } from './scenes/003-vao';
import { init004Lines } from './scenes/004-lines';
import { init005Transformation } from './scenes/005-transformation';
import { init006Camera } from './scenes/006-camera';
import { init007LookAt } from './scenes/007-look-at';
import { init008Transparency } from './scenes/008-transparency';
import { init009Textures } from './scenes/009-textures';
import { init010Cube } from './scenes/010-cube';

glMatrix.setMatrixArrayType(Array);

const num2Scene: Record<number, { name: string; init: (gl: WebGL2RenderingContext) => void }> = {
  1: { name: 'point', init: init001Point },
  2: { name: 'render loop', init: init002RenderLoop },
  3: { name: 'vao', init: init003Vao },
  4: { name: 'lines', init: init004Lines },
  5: { name: 'transformation', init: init005Transformation },
  6: { name: 'camera', init: init006Camera },
  7: { name: 'look at', init: init007LookAt },
  8: { name: 'transparency', init: init008Transparency },
  9: { name: 'textures', init: init009Textures },
  10: { name: 'cube', init: init010Cube },
};

const constructSceneSwitcher = (searchParams: URLSearchParams, sceneNumber: number): void => {
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
  const sceneSelectElement = document.createElement('select');
  Object.entries(num2Scene).forEach(([num, { name }]) => {
    const optionElement = document.createElement('option');
    optionElement.value = num;
    optionElement.innerText = `${num}-${name}`;
    if (Number(num) === sceneNumber) {
      optionElement.selected = true;
    }
    sceneSelectElement.appendChild(optionElement);
  });
  sceneSelectElement.onchange = (e: Event) => {
    searchParams.set('scene', (e.target as HTMLSelectElement).value);
    window.location.search = searchParams.toString();
  };
  const sceneSwitcherContainer = document.createElement('div');
  sceneSwitcherContainer.id = 'switcher';
  if (!(sceneNumber - 1 in num2Scene)) {
    prevSceneElement.disabled = true;
  }
  if (!(sceneNumber + 1 in num2Scene)) {
    nextSceneElement.disabled = true;
  }
  sceneSwitcherContainer.appendChild(prevSceneElement);
  sceneSwitcherContainer.appendChild(sceneSelectElement);
  sceneSwitcherContainer.appendChild(nextSceneElement);
  document.body.appendChild(sceneSwitcherContainer);
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

  constructSceneSwitcher(searchParams, sceneNumber);

  const canvasElement = document.createElement('canvas');
  canvasElement.id = 'canvas';
  document.body.appendChild(canvasElement);

  const gl = canvasElement.getContext('webgl2');
  if (gl === null) {
    throw new Error('Cannot get webgl context');
  }

  num2Scene[sceneNumber].init(gl);
};

window.addEventListener('load', initApp);
