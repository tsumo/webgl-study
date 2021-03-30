import { m4, M4 } from './m4';
import { deg2Rad } from './../utils';
import { V3 } from './v3';

export class Camera {
  gl: WebGLRenderingContext;
  position: V3 = [0, 0, 0];
  up: V3 = [0, 1, 0];
  lookAt: V3 = [0, 0, 0];
  fov = 80;
  near = 1;
  far = 800;
  matrix: M4 = m4.identity();

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.updateMatrix();
  }

  updateMatrix(): void {
    const projectionMatrix = m4.perspective(
      deg2Rad(this.fov),
      this.gl.canvas.width / this.gl.canvas.height,
      this.near,
      this.far,
    );
    const cameraMatrix = m4.lookAt(this.position, this.lookAt, this.up);
    const viewMatrix = m4.inverse(cameraMatrix);
    this.matrix = m4.multiply(projectionMatrix, viewMatrix);
  }
}
