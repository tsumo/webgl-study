import * as dat from 'dat.gui';
import { vec2 } from 'gl-matrix';
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
  default: [number, number];
  min: number;
  max: number;
  step?: number;
};

type Value = ValueFloat | ValueVec2;

type InToOut<T extends Value> = T['type'] extends 'float'
  ? number
  : T['type'] extends 'vec2'
  ? vec2
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
          const vec = vec2.create();
          // @ts-expect-error cannot derive correct type
          vec[0] = value.default[0];
          // @ts-expect-error cannot derive correct type
          vec[1] = value.default[1];
          // @ts-expect-error cannot derive correct type
          this.values[name] = vec;
          gui
            .add(vec, (0 as unknown) as string, value.min, value.max, value.step)
            .name(`${name}-x`)
            .onChange(onChangeWrapper);
          gui
            .add(vec, (1 as unknown) as string, value.min, value.max, value.step)
            .name(`${name}-y`)
            .onChange(onChangeWrapper);
          break;
        default:
          assertUnreachable(value.type);
      }
    }
  }
}
