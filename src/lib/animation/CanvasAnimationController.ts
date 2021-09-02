import { BaseCanvasAnimation } from "./BaseCanvasAnimation";

export class CanvasAnimationController {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  animation: BaseCanvasAnimation;

  constructor(canvas: HTMLCanvasElement, animation: BaseCanvasAnimation) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext("2d")!;
    this.animation = animation;

    (window as any).bgctx = this.ctx;
  }

  startAnimation() {
    let isAnimated = true;

    let t1 = new Date().getTime();

    const loop = () => {
      if (!isAnimated) return;
      let t2 = new Date().getTime();
      let deltaMs = t2 - t1;
      t1 = t2;
      this.animation.animate(deltaMs, this.ctx, this.canvas);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    return () => {
      isAnimated = false;
    };
  }
}
