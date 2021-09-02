import { Vector2 } from "../vector/Vector2";

function randomizePercentage(center: number, perc: number) {
  return center + (Math.random() - 0.5) * 2 * perc * center;
}

class ColorBlob {
  width: number;
  height: number;
  pos: Vector2;
  vel: Vector2;
  speed: number;
  radius: number;
  turningForce: number;
  hueSpeed: number;
  hue: number;
  saturation: number;
  lightness: number;

  constructor(
    width: number,
    height: number,
    radius: number,
    speed: number,
    turningForce: number,
    saturation: number,
    lightness: number,
    hueSpeed: number,
    initialHueOffset: number,
    hueRange: number
  ) {
    this.width = width;
    this.height = height;
    this.radius = randomizePercentage(radius, 0.2);
    this.speed = randomizePercentage(speed, 0.1);
    this.turningForce = randomizePercentage(turningForce, 0.1);
    this.pos = Vector2.random(0, width, 0, height);
    this.vel = Vector2.randomUnitVector().setMag(this.speed);
    this.hue = (initialHueOffset + Math.random() * hueRange) % 360;
    this.saturation = saturation;
    this.lightness = lightness;
    this.hueSpeed = hueSpeed;
  }

  animate(
    deltaMs: number,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    const turn = Vector2.randomUnitVector().mult(this.turningForce);
    this.vel.add(turn).limitMag(this.speed);
    this.pos.add(Vector2.mult(this.vel, deltaMs / 100));
    this.hue += this.hueSpeed;

    ctx.fillStyle = `hsl(${this.hue % 360}deg,${this.saturation}%,${
      this.lightness
    }%)`;
    ctx.beginPath();
    ctx.ellipse(
      this.pos.x,
      this.pos.y,
      this.radius,
      this.radius,
      0,
      0,
      2 * Math.PI
    );
    ctx.fill();

    if (this.pos.x < this.radius * -2) {
      this.pos.x = this.width + this.radius * 2;
    } else if (this.pos.x > this.width + this.radius * 2) {
      this.pos.x = this.radius * -2;
    }

    if (this.pos.y < this.radius * -2) {
      this.pos.y = this.height + this.radius * 2;
    } else if (this.pos.y > this.height + this.radius * 2) {
      this.pos.y = this.radius * -2;
    }
  }
}

export class ColorBlobCanvasAnimation {
  blobs: ColorBlob[];
  blur: number;
  n: number;

  constructor(opts: {
    width: number;
    height: number;
    speed: number;
    nBlobs: number;
    radius: number;
    turningForce: number;
    blur: number;
    saturation: number;
    lightness: number;
    hueSpeed: number;
    initialHueOffset: number;
    hueRange: number;
  }) {
    this.n = 0;
    this.blur = opts.blur;
    this.blobs = [];
    for (let i = 0; i < opts.nBlobs; i++) {
      this.blobs.push(
        new ColorBlob(
          opts.width,
          opts.height,
          opts.radius,
          opts.speed,
          opts.turningForce,
          opts.saturation,
          opts.lightness,
          opts.hueSpeed,
          opts.initialHueOffset,
          opts.hueRange
        )
      );
    }
  }

  animate(
    deltaMs: number,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    // On first animation blur canvas and animate blobs
    // multiple times
    if (this.n === 0) {
      canvas.style.filter = `blur(${this.blur}px)`;
      for (let i = 0; i < 500; i++) {
        this.blobs.forEach((blob) => blob.animate(deltaMs, ctx, canvas));
      }
    }
    this.n++;
    this.blobs.forEach((blob) => blob.animate(deltaMs, ctx, canvas));
  }
}
