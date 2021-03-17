import * as dat from 'dat.gui';
import './style.css';
import vertexShaderSource from './vertex.glsl';
import fragmentShaderSource from './fragment.glsl';
import { Scene } from './scene';

/*
# WebGL program structure

## init
- create shaders
- create programs
- look up locations

## render
- clear viewport and other global state
- for each thing
  - call useProgram
  - for each attrubute
    - call bindBuffer
    - call vertexAttribPointer
    - call enableVertexAttribArray
  - for each uniform
    - call uniformXXX
    - call activeTexture and bindTexture to assign texture units
  - call drawArrays or drawElements
*/

const init = (): void => {
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);

  const gl = canvas.getContext('webgl');
  if (gl === null) {
    throw new Error('Cannot get webgl context');
  }

  const scene = new Scene(gl, vertexShaderSource, fragmentShaderSource);

  const guiValues = {
    cameraX: 0,
    cameraY: 0,
    cameraZ: 0,
    fov: 80,
  };
  const gui = new dat.GUI();
  gui.add(guiValues, 'cameraX', -100, 100, 0.01).onChange((value) => {
    scene.camera.position[0] = value;
    scene.render();
  });
  gui.add(guiValues, 'cameraY', -100, 100, 0.01).onChange((value) => {
    scene.camera.position[1] = value;
    scene.render();
  });
  gui.add(guiValues, 'cameraZ', -100, 100, 0.01).onChange((value) => {
    scene.camera.position[2] = value;
    scene.render();
  });
  gui.add(guiValues, 'fov', 0, 180, 0.01).onChange((value) => {
    scene.camera.fov = value;
    scene.render();
  });

  scene.render();
};

init();
