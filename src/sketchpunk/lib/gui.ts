import * as dat from 'dat.gui';

type GuiValue = {
  default: number;
  min: number;
  max: number;
  step?: number;
};

export class Gui<
  V extends Record<string, GuiValue>,
  K extends keyof V & string,
  GV extends Record<K, number>
> {
  values: GV;

  constructor(values: V, onChange?: (values: GV) => void) {
    const gui = new dat.GUI();
    this.values = {} as GV;

    const onChangeWrapper = (): void => {
      onChange && onChange(this.values);
    };

    for (const name in values) {
      const value = values[name];
      // @ts-expect-error cannot derive correct type
      this.values[name] = value.default;
      gui.add(this.values, name, value.min, value.max, value.step).onChange(onChangeWrapper);
    }
  }
}
