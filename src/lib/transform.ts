import { mat3, mat4, quat, vec2, vec3, vec4 } from 'gl-matrix';
import { deg2rad } from '../utils';

// TODO: addTranslation/Rotation/Scale methods
// TODO: automatically calculate up/right vectors
export class Transform2d {
  private translationMatrix = mat3.create();
  private rotationMatrix = mat3.create();
  private scaleMatrix = mat3.create();
  matrix = mat3.create();

  setTranslation(translation: vec2): void {
    mat3.fromTranslation(this.translationMatrix, translation);
  }

  setRotation(rotation: number): void {
    mat3.fromRotation(this.rotationMatrix, rotation);
  }

  setScale(scale: vec2): void {
    mat3.fromScaling(this.scaleMatrix, scale);
  }

  reset(): void {
    mat3.identity(this.matrix);
  }

  update(): mat3 {
    mat3.mul(this.matrix, this.matrix, this.translationMatrix);
    mat3.mul(this.matrix, this.matrix, this.rotationMatrix);
    mat3.mul(this.matrix, this.matrix, this.scaleMatrix);
    return this.matrix;
  }
}

const identityQuat = quat.create();
const zeroVector: vec3 = [0, 0, 0];
const upVector: vec3 = [0, 1, 0];

export class Transform3d {
  translation = vec3.create();
  rotation = vec3.create();
  scale = vec3.fromValues(1, 1, 1);

  private lookAtMatrix: mat4 | undefined;

  private rotationQuatTemp = quat.create();
  private matrixTemp = mat4.create();

  matrix = mat4.create();
  direction = {
    right: vec4.fromValues(1, 0, 0, 0),
    up: vec4.fromValues(0, 1, 0, 0),
    forward: vec4.fromValues(0, 0, 1, 0),
  };

  /** When set transform will ignore its rotation */
  setLookAt(value: vec3 | undefined): void {
    if (value) {
      this.lookAtMatrix = mat4.create();
      mat4.targetTo(this.lookAtMatrix, this.translation, value, upVector);
    } else {
      this.lookAtMatrix = undefined;
    }
  }

  resetTransforms(): void {
    vec3.zero(this.translation);
    vec3.zero(this.rotation);
    vec3.set(this.scale, 1, 1, 1);
  }

  resetMatrix(): void {
    mat4.identity(this.matrix);
    vec4.set(this.direction.right, 1, 0, 0, 0);
    vec4.set(this.direction.up, 0, 1, 0, 0);
    vec4.set(this.direction.forward, 0, 0, 1, 0);
  }

  applyTransforms(): mat4 {
    if (this.lookAtMatrix) {
      mat4.mul(this.matrix, this.matrix, this.lookAtMatrix);
      mat4.fromRotationTranslationScale(this.matrixTemp, identityQuat, zeroVector, this.scale);
    } else {
      // TODO: use quat.fromEuler(order = xyz) when gl-matrix releases new version
      quat.rotateX(this.rotationQuatTemp, identityQuat, deg2rad(this.rotation[0]));
      quat.rotateY(this.rotationQuatTemp, this.rotationQuatTemp, deg2rad(this.rotation[1]));
      quat.rotateZ(this.rotationQuatTemp, this.rotationQuatTemp, deg2rad(this.rotation[2]));
      mat4.fromRotationTranslationScale(
        this.matrixTemp,
        this.rotationQuatTemp,
        this.translation,
        this.scale,
      );
    }
    mat4.mul(this.matrix, this.matrix, this.matrixTemp);
    vec4.transformMat4(this.direction.right, [1, 0, 0, 0], this.matrix);
    vec4.transformMat4(this.direction.up, [0, 1, 0, 0], this.matrix);
    vec4.transformMat4(this.direction.forward, [0, 0, 1, 0], this.matrix);
    return this.matrix;
  }

  applyTransformsRotationFirst(): mat4 {
    mat4.rotateX(this.matrix, this.matrix, deg2rad(this.rotation[0]));
    mat4.rotateY(this.matrix, this.matrix, deg2rad(this.rotation[1]));
    mat4.rotateZ(this.matrix, this.matrix, deg2rad(this.rotation[2]));
    mat4.translate(this.matrix, this.matrix, this.translation);
    mat4.scale(this.matrix, this.matrix, this.scale);
    vec4.transformMat4(this.direction.right, [1, 0, 0, 0], this.matrix);
    vec4.transformMat4(this.direction.up, [0, 1, 0, 0], this.matrix);
    vec4.transformMat4(this.direction.forward, [0, 0, 1, 0], this.matrix);
    return this.matrix;
  }
}
