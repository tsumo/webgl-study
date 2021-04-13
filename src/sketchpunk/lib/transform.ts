import { mat3, mat4, quat, vec2, vec3 } from 'gl-matrix';

// TODO: addTranslation/Rotation/Scale methods
// TODO: automatically calculate up/right vectors
export class Transform2d {
  private translationMatrix = mat3.create();
  private rotationMatrix = mat3.create();
  private scaleMatrix = mat3.create();
  private matrix = mat3.create();

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

export class Transform3d {
  private translationMatrix = mat4.create();
  private rotationQuat = quat.create();
  private rotationMatrix = mat4.create();
  private scaleMatrix = mat4.create();
  private matrix = mat4.create();

  setTranslation(translation: vec3): void {
    mat4.fromTranslation(this.translationMatrix, translation);
  }

  /**
   * @param rotation in degrees
   */
  setRotation(rotation: vec3): void {
    quat.fromEuler(this.rotationQuat, rotation[0], rotation[1], rotation[2]);
    mat4.fromQuat(this.rotationMatrix, this.rotationQuat);
  }

  setScale(scale: vec3): void {
    mat4.fromScaling(this.scaleMatrix, scale);
  }

  reset(): void {
    mat4.identity(this.matrix);
  }

  update(): mat4 {
    mat4.mul(this.matrix, this.matrix, this.translationMatrix);
    mat4.mul(this.matrix, this.matrix, this.rotationMatrix);
    mat4.mul(this.matrix, this.matrix, this.scaleMatrix);
    return this.matrix;
  }
}
