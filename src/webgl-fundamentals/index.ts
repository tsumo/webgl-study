import * as dat from 'dat.gui';
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
    cameraX: 200,
    cameraY: 200,
    cameraZ: 200,
    fov: 80,
  };
  const gui = new dat.GUI();
  const onChange = (): void => {
    scene.camera.position[0] = guiValues.cameraX;
    scene.camera.position[1] = guiValues.cameraY;
    scene.camera.position[2] = guiValues.cameraZ;
    scene.camera.fov = guiValues.fov;
  };
  onChange();
  gui.add(guiValues, 'cameraX', -300, 300, 0.01).onChange(onChange);
  gui.add(guiValues, 'cameraY', -300, 300, 0.01).onChange(onChange);
  gui.add(guiValues, 'cameraZ', -300, 300, 0.01).onChange(onChange);
  gui.add(guiValues, 'fov', 0, 180, 0.01).onChange(onChange);

  scene.startRenderLoop();
};

init();
