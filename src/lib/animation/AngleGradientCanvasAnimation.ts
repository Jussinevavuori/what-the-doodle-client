import { Vector2 } from "../vector/Vector2";
import { BaseCanvasAnimation } from "./BaseCanvasAnimation";

export class AngleGradientCanvasAnimation extends BaseCanvasAnimation {
  hue: number;
  hueOffset: number;
  speed: number;
  angle: number;
  angleSpeed: number;
  saturation: number;
  lightness: number;

  constructor(opts: {
    speed: number;
    angle: number;
    angleSpeed: number;
    hueOffset: number;
    saturation: number;
    lightness: number;
  }) {
    super();
    this.hue = 0;
    this.hueOffset = opts.hueOffset;
    this.speed = opts.speed;
    this.angle = opts.angle;
    this.angleSpeed = opts.angleSpeed;
    this.saturation = opts.saturation;
    this.lightness = opts.lightness;
  }

  private getColor(hue: number) {
    return `hsl(${hue}deg, ${this.saturation}%, ${this.lightness}%)`;
  }

  animate(
    deltaMs: number,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    this.hue = (this.hue + this.speed * deltaMs) % 360;

    const p1 = new Vector2(canvas.width / 2, canvas.height / 2);
    const p2 = Vector2.fromAngle(this.angle)
      .mult(canvas.width / 2)
      .add(p1);
    const g = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
    g.addColorStop(0, this.getColor(this.hue));
    g.addColorStop(1, this.getColor(this.hue + this.hueOffset));

    this.angle += this.angleSpeed;

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}
