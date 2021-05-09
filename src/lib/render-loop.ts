import * as Stats from 'stats.js';

export type TickFunction = (delta: number, time: number) => void;

export class RenderLoop {
  private lastTime = performance.now();
  private raf = 0;

  constructor(tick: TickFunction) {
    const stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.dom);

    const tickWrapper = (): void => {
      stats.begin();

      const currentTime = performance.now();
      const delta = (currentTime - this.lastTime) / 1000;

      this.lastTime = currentTime;

      tick(delta, currentTime / 1000);

      stats.end();

      this.raf = window.requestAnimationFrame(tickWrapper);
    };
    tickWrapper();
  }

  destroy(): void {
    window.cancelAnimationFrame(this.raf);
  }
}
