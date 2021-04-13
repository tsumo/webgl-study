import * as dat from 'dat.gui';
import { vec2, vec3 } from 'gl-matrix';
import { assertUnreachable } from '../../utils';

type ValueFloat = {
  type: 'float';
  default: number;
  min: number;
  max: number;
  step?: number;
};

type ValueVec2 = {
  type: 'vec2';
  default: vec2;
  min: number;
  max: number;
  step?: number;
};

type ValueVec3 = {
  type: 'vec3';
  default: vec3;
  min: number;
  max: number;
  step?: number;
};

type Value = ValueFloat | ValueVec2 | ValueVec3;

type InToOut<T extends Value> = T['type'] extends 'float'
  ? number
  : T['type'] extends 'vec2'
  ? vec2
  : T['type'] extends 'vec3'
  ? vec3
  : never;

type OutValues<T extends Record<string, Value>> = {
  [K in keyof T]: InToOut<T[K]>;
};

export class Gui<IN extends Record<string, Value>, OUT extends OutValues<IN>> {
  values: OUT;

  constructor(values: IN, onChange?: (values: OUT) => void) {
    const gui = new dat.GUI();
    this.values = {} as OUT;

    const onChangeWrapper = (): void => {
      onChange && onChange(this.values);
    };

    for (const name in values) {
      const value = values[name];
      switch (value.type) {
        case 'float':
          // @ts-expect-error cannot derive correct type
          this.values[name] = value.default;
          gui.add(this.values, name, value.min, value.max, value.step).onChange(onChangeWrapper);
          break;
        case 'vec2':
          // @ts-expect-error cannot derive correct type
          const v2 = vec2.fromValues(value.default[0], value.default[1]);
          // @ts-expect-error cannot derive correct type
          this.values[name] = v2;
          gui
            .add(v2, (0 as unknown) as string, value.min, value.max, value.step)
            .name(`${name}-x`)
            .onChange(onChangeWrapper);
          gui
            .add(v2, (1 as unknown) as string, value.min, value.max, value.step)
            .name(`${name}-y`)
            .onChange(onChangeWrapper);
          break;
        case 'vec3':
          // @ts-expect-error cannot derive correct type
          const v3 = vec3.fromValues(value.default[0], value.default[1], value.default[2]);
          // @ts-expect-error cannot derive correct type
          this.values[name] = v3;
          gui
            .add(v3, (0 as unknown) as string, value.min, value.max, value.step)
            .name(`${name}-x`)
            .onChange(onChangeWrapper);
          gui
            .add(v3, (1 as unknown) as string, value.min, value.max, value.step)
            .name(`${name}-y`)
            .onChange(onChangeWrapper);
          gui
            .add(v3, (2 as unknown) as string, value.min, value.max, value.step)
            .name(`${name}-z`)
            .onChange(onChangeWrapper);
          break;
        default:
          assertUnreachable(value.type);
      }
    }
  }
}
