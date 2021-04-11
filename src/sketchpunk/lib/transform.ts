import { mat3, vec2 } from 'gl-matrix';

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
