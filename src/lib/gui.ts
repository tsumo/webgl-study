import * as dat from 'dat.gui';
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
    const gui = new dat.GUI();
    this.values = {} as OUT;

    for (const name in values) {
      const value: Value = values[name];
      switch (value.type) {
        case 'float':
          // @ts-expect-error cannot derive correct type
          this.values[name] = value.default;
          gui.add(this.values, name, value.min, value.max, value.step);
          break;
        case 'vec2':
          const v2 = vec2.fromValues(value.default[0], value.default[1]);
          // @ts-expect-error cannot derive correct type
          this.values[name] = v2;
          const v2folder = gui.addFolder(name);
          v2folder.open();
          v2folder.add(v2, '0', value.min, value.max, value.step).name('x');
          v2folder.add(v2, '1', value.min, value.max, value.step).name('y');
          break;
        case 'vec3':
          const v3 = vec3.fromValues(value.default[0], value.default[1], value.default[2]);
          // @ts-expect-error cannot derive correct type
          this.values[name] = v3;
          const v3folder = gui.addFolder(name);
          v3folder.open();
          v3folder.add(v3, '0', value.min, value.max, value.step).name('x');
          v3folder.add(v3, '1', value.min, value.max, value.step).name('y');
          v3folder.add(v3, '2', value.min, value.max, value.step).name('z');
          break;
        case 'select':
          // @ts-expect-error cannot derive correct type
          this.values[name] = value.options[0];
          const controller = gui.add(this.values, name, value.options);
          if (value.onChange) {
            controller.onChange(value.onChange);
          }
          break;
        case 'functions':
          Object.keys(value.functions).map((key) => gui.add(value.functions, key));
          break;
        default:
          assertUnreachable(value);
      }
    }
  }
}
