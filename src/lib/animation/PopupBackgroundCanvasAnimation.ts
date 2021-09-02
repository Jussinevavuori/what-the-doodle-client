import { Vector2 } from "../vector/Vector2";
import { BaseCanvasAnimation } from "./BaseCanvasAnimation";

export class PopupBackgroundCanvasAnimation extends BaseCanvasAnimation {
  bursts: Array<{
    pos: Vector2;
    vel: Vector2;
    size: number;
    hue: number;
  }>;
  points: Array<{
    pos: Vector2;
    vel: Vector2;
  }>;
  pointDragCoefficient: number;
  burstDragCoefficient: number;
  radius: number;
  t: number;

  constructor(opts: {}) {
    super();
    this.t = 0;
    this.pointDragCoefficient = 0.95;
    this.burstDragCoefficient = 0.93;
    this.radius = 20;
    this.points = [];

    const PI = Math.PI;
    let angle = 0;
    while (angle < 2 * PI) {
      this.points.push({
        pos: Vector2.nil(),
        vel: Vector2.fromAngle(angle).mult(
          0.7 *
            (1 + Math.abs(0.3 * Math.cos(angle))) *
            (this.points.length % 2 === 0
              ? Math.random() * 0.05 + 0.3
              : Math.random() * 0.05 + 0.5)
        ),
      });
      angle += PI / 16 + (Math.random() * PI) / 16;
    }

    this.bursts = [];
    for (let i = 0; i < 50; i++) {
      this.bursts.push({
        pos: Vector2.nil(),
        vel: Vector2.randomUnitVector().mult(Math.random() * 0.5 + 0.3),
        size: Math.random() * 20 + 10,
        hue: (Math.random() * 60 + 330) % 360,
      });
    }
  }

  animate(
    deltaMs: number,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    const w = canvas.width;
    const h = canvas.height;

    this.t += deltaMs;

    // Accelerate bursts once at the specified duration
    const accAt = 400;
    const accLen = 80;
    if (this.t > accAt && this.t < accAt + accLen) {
      this.bursts.forEach((b) => b.vel.mult(1.4));
    }

    // Start by clearing
    ctx.clearRect(0, 0, w, h);

    const hsla = (h: number, s: number, l: number, a: number) => {
      return `hsla(${h}deg, ${s}%, ${l}%, ${a})`;
    };

    // Draw bursts
    for (let i = 0; i < this.bursts.length; i++) {
      const burst = this.bursts[i];
      burst.vel.mult(this.burstDragCoefficient).clamp(0.03, Infinity);
      burst.pos.add(Vector2.mult(burst.vel, deltaMs));
      const x = burst.pos.x + w / 2;
      const y = burst.pos.y + h / 2;
      var radgrad = ctx.createRadialGradient(x, y, 0, x, y, burst.size);
      const c = (o: number) => hsla(burst.hue, 100, 75, o);
      radgrad.addColorStop(0, c(0.35));
      radgrad.addColorStop(1, c(0));
      ctx.beginPath();
      ctx.fillStyle = radgrad;
      ctx.ellipse(x, y, burst.size, burst.size, 0, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw shape
    ctx.beginPath();
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      point.vel.mult(this.pointDragCoefficient);
      point.pos.add(Vector2.mult(point.vel, deltaMs));
      const x = point.pos.x + w / 2;
      const y = point.pos.y + h / 2;
      ctx.lineTo(x, y);
    }

    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 100);
    grad.addColorStop(1, hsla(340, 80, 50, 1));
    grad.addColorStop(0, hsla(10, 90, 30, 1));
    ctx.fillStyle = grad;
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 20;
    ctx.stroke();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 10;
    ctx.stroke();
  }
}
