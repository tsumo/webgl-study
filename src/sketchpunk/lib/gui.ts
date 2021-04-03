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
  guiValues: GV;

  constructor(values: V, onChange: (values: GV) => void) {
    const gui = new dat.GUI();
    this.guiValues = {} as GV;

    const onChangeWrapper = (): void => {
      onChange(this.guiValues);
    };

    for (const name in values) {
      const value = values[name];
      // @ts-expect-error cannot derive correct type
      this.guiValues[name] = value.default;
      gui.add(this.guiValues, name, value.min, value.max, value.step).onChange(onChangeWrapper);
    }
  }
}
