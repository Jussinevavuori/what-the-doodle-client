import { BaseCanvasAnimation } from "./BaseCanvasAnimation";

export class HueRotateCanvasAnimation extends BaseCanvasAnimation {
  hue: number;
  speed: number;

  constructor(speed: number) {
    super();
    this.hue = 0;
    this.speed = speed;
  }

  animate(
    deltaMs: number,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    this.hue = (this.hue + this.speed * deltaMs) % 360;
    ctx.fillStyle = `hsl(${this.hue}, 30%, 90%)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}
