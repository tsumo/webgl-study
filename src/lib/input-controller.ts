type KeyboardListener = (e: KeyboardEvent) => void;
type MouseListener = (e: MouseEvent) => void;
type WheelListener = (e: WheelEvent) => void;

type Listeners = Partial<{
  keyDown: KeyboardListener;
  keyUp: KeyboardListener;
  mouseMove: MouseListener;
  wheel: WheelListener;
}>;

export class InputController {
  private canvas: HTMLCanvasElement | OffscreenCanvas;
  private listeners: Listeners;

  private mouseCapture = false;
  private boundKeyDownListener?: KeyboardListener;
  private boundKeyUpListener?: KeyboardListener;
  private boundMouseDownListener?: VoidFunction;
  private boundMouseUpListener?: VoidFunction;
  private boundMouseMoveListener?: MouseListener;
  private boundWheelListener?: WheelListener;

  paused = false;

  constructor(gl: WebGL2RenderingContext, listeners: Listeners) {
    this.canvas = gl.canvas;
    this.listeners = listeners;
    if (listeners.keyDown) {
      this.boundKeyDownListener = this.keyDownListener.bind(this);
      document.addEventListener('keydown', this.boundKeyDownListener);
    }
    if (listeners.keyUp) {
      this.boundKeyUpListener = this.keyUpListener.bind(this);
      document.addEventListener('keyup', this.boundKeyUpListener);
    }
    if (listeners.mouseMove) {
      this.boundMouseDownListener = this.mouseDownListener.bind(this);
      this.canvas.addEventListener('mousedown', this.boundMouseDownListener);
      this.boundMouseUpListener = this.mouseUpListener.bind(this);
      document.addEventListener('mouseup', this.boundMouseUpListener);
      this.boundMouseMoveListener = this.mouseMoveListener.bind(this);
      document.addEventListener('mousemove', this.boundMouseMoveListener);
    }
    if (listeners.wheel) {
      this.boundWheelListener = this.wheelListener.bind(this);
      // @ts-expect-error cannot detect WheelEvent
      this.canvas.addEventListener('wheel', this.boundWheelListener);
    }
  }

  private keyDownListener(e: KeyboardEvent): void {
    if (this.paused) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.listeners.keyDown!(e);
  }

  private keyUpListener(e: KeyboardEvent): void {
    if (this.paused) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.listeners.keyUp!(e);
  }

  private mouseDownListener(): void {
    this.mouseCapture = true;
  }
  private mouseUpListener(): void {
    this.mouseCapture = false;
  }

  private mouseMoveListener(e: MouseEvent): void {
    if (!this.mouseCapture || this.paused) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.listeners.mouseMove!(e);
  }

  private wheelListener(e: WheelEvent): void {
    if (this.paused) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.listeners.wheel!(e);
  }

  destroy(): void {
    if (this.boundKeyDownListener) {
      document.removeEventListener('keydown', this.boundKeyDownListener);
    }
    if (this.boundKeyUpListener) {
      document.removeEventListener('keyup', this.boundKeyUpListener);
    }
    if (this.boundMouseDownListener) {
      this.canvas.removeEventListener('mousedown', this.boundMouseDownListener);
    }
    if (this.boundMouseUpListener) {
      document.removeEventListener('mouseup', this.boundMouseUpListener);
    }
    if (this.boundMouseMoveListener) {
      document.removeEventListener('mousemove', this.boundMouseMoveListener);
    }
    if (this.boundWheelListener) {
      // @ts-expect-error cannot detect WheelEvent
      this.canvas.removeEventListener('wheel', this.boundWheelListener);
    }
  }
}
