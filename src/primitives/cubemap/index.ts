import { mat4 } from 'gl-matrix';
import { Program } from '../../lib/program';
import { Vao } from '../../lib/vao';
import { Camera } from '../../lib/camera';
import { createTextureCubemap, TextureCubemap } from '../../lib/texture';
import { deg2rad } from '../../utils';
import imgRight from '../../assets/interstellar-cubemap/right.jpg';
import imgLeft from '../../assets/interstellar-cubemap/left.jpg';
import imgTop from '../../assets/interstellar-cubemap/top.jpg';
import imgBottom from '../../assets/interstellar-cubemap/bottom.jpg';
import imgBack from '../../assets/interstellar-cubemap/back.jpg';
import imgFront from '../../assets/interstellar-cubemap/front.jpg';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

class Cubemap {
  private viewMatrixTransitionless = mat4.create();
  private viewProjection = mat4.create();
  private viewProjectionInv = mat4.create();

  private vao: Vao;
  private program;
  private texture: TextureCubemap;

  constructor(gl: WebGL2RenderingContext, texture: TextureCubemap) {
    const planeData = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
    this.vao = new Vao(gl, [{ type: 'float', data: planeData, size: 2 }]);
    const program = new Program(
      gl,
      vertexShader,
      fragmentShader,
      { matrixInv: { type: 'matrix4fv', value: mat4.create() } },
      ['a_position'],
    );
    this.program = program;
    this.texture = texture;
  }

  draw(camera: Camera) {
    mat4.copy(this.viewMatrixTransitionless, camera.viewMatrix);
    this.viewMatrixTransitionless[12] = 0;
    this.viewMatrixTransitionless[13] = 0;
    this.viewMatrixTransitionless[14] = 0;
    mat4.rotateX(this.viewMatrixTransitionless, this.viewMatrixTransitionless, deg2rad(90));
    mat4.mul(this.viewProjection, camera.projectionMatrix, this.viewMatrixTransitionless);
    mat4.invert(this.viewProjectionInv, this.viewProjection);

    this.program.use();
    this.program.setUniform('matrixInv', this.viewProjectionInv);
    this.texture.activate();
    this.vao.drawTriangles();
    this.texture.deactivate();
  }
}

export const createCubemap = async (gl: WebGL2RenderingContext): Promise<Cubemap> => {
  const textureCubemap = await createTextureCubemap(
    gl,
    [imgRight, imgLeft, imgTop, imgBottom, imgBack, imgFront],
    0,
  );
  return new Cubemap(gl, textureCubemap);
};
