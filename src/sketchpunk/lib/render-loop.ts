export type TickFunction = (delta: number, fps: number) => void;

export class RenderLoop {
  private lastTime = performance.now();
  private raf = 0;

  constructor(tick: TickFunction) {
    const tickWrapper = (): void => {
      const currentTime = performance.now();
      const delta = (currentTime - this.lastTime) / 1000;
      const fps = Math.floor(1 / delta);
      // TODO: calculate mean fps

      this.lastTime = currentTime;

      tick(delta, fps);
      this.raf = window.requestAnimationFrame(tickWrapper);
    };
    tickWrapper();
  }

  destroy(): void {
    window.cancelAnimationFrame(this.raf);
  }
}
