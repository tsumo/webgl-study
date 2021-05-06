export type TickFunction = (delta: number, time: number) => void;

export class RenderLoop {
  private readonly fpsElement: HTMLElement | null;

  private lastTime = performance.now();
  private raf = 0;

  constructor(tick: TickFunction) {
    this.fpsElement = document.getElementById('fps');

    const tickWrapper = (): void => {
      const currentTime = performance.now();
      const delta = (currentTime - this.lastTime) / 1000;
      const fps = Math.floor(1 / delta);
      // TODO: calculate mean fps

      this.lastTime = currentTime;

      if (this.fpsElement) {
        this.fpsElement.innerText = String(fps);
      }

      tick(delta, currentTime / 1000);
      this.raf = window.requestAnimationFrame(tickWrapper);
    };
    tickWrapper();
  }

  destroy(): void {
    window.cancelAnimationFrame(this.raf);
  }
}
