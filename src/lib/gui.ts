import Tweakpane from 'tweakpane';
import { vec2, vec3 } from 'gl-matrix';
import { assertUnreachable } from '../utils';
import { NonEmptyArray } from './types';

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

type ValueSelect = {
  type: 'select';
  options: NonEmptyArray<string>;
  onChange?: (option: string) => void;
};

type ValueFunctions = {
  type: 'functions';
  functions: Record<string, VoidFunction>;
};

type Value = ValueFloat | ValueVec2 | ValueVec3 | ValueSelect | ValueFunctions;

type InToOut<T extends Value> = T['type'] extends 'float'
  ? number
  : T['type'] extends 'vec2'
  ? vec2
  : T['type'] extends 'vec3'
  ? vec3
  : T['type'] extends 'select'
  ? string
  : T['type'] extends 'functions'
  ? never
  : never;

type OutValues<T extends Record<string, Value>> = {
  [K in keyof T]: InToOut<T[K]>;
};

export class Gui<IN extends Record<string, Value>, OUT extends OutValues<IN>> {
  values: OUT;

  constructor(values: IN) {
    const pane = new Tweakpane({ title: 'Parameters' });
    this.values = {} as OUT;

    for (const name in values) {
      const value: Value = values[name];
      switch (value.type) {
        case 'float':
          // @ts-expect-error cannot derive correct type
          this.values[name] = value.default;
          pane.addInput(this.values, name, { min: value.min, max: value.max, step: value.step });
          break;
        case 'vec2':
          const v2: vec2 = [value.default[0], value.default[1]];
          // @ts-expect-error cannot derive correct type
          this.values[name] = v2;
          const v2Obj = { [name]: { x: value.default[0], y: value.default[1] } };
          pane
            .addInput(v2Obj, name, {
              x: { min: value.min, max: value.max, step: value.step },
              y: { min: value.min, max: value.max, step: value.step, inverted: true },
            })
            .on('change', (e) => {
              v2[0] = e.value.x;
              v2[1] = e.value.y;
            });
          break;
        case 'vec3':
          const v3: vec3 = [value.default[0], value.default[1], value.default[2]];
          // @ts-expect-error cannot derive correct type
          this.values[name] = v3;
          const v3Obj = {
            [name]: { x: value.default[0], y: value.default[1], z: value.default[2] },
          };
          pane
            .addInput(v3Obj, name, {
              x: { min: value.min, max: value.max },
              y: { min: value.min, max: value.max },
              z: { min: value.min, max: value.max },
            })
            .on('change', (e) => {
              v3[0] = e.value.x;
              v3[1] = e.value.y;
              v3[2] = e.value.z;
            });
          break;
        case 'select':
          // @ts-expect-error cannot derive correct type
          this.values[name] = value.options[0];
          const options: Record<string, string> = {};
          value.options.forEach((option) => (options[option] = option));
          pane
            .addInput(this.values, name, { options })
            .on('change', (e) => value.onChange && value.onChange(e.value as string));
          break;
        case 'functions':
          Object.keys(value.functions).forEach((key) =>
            pane.addButton({ title: key }).on('click', () => value.functions[key]()),
          );
          break;
        default:
          assertUnreachable(value);
      }
    }
  }
}
