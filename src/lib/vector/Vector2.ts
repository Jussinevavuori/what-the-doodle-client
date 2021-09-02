export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  setMag(mag: number): Vector2 {
    return this.normalize().mult(mag);
  }

  limitMag(mag: number): Vector2 {
    return this.length() > mag ? this.setMag(mag) : this;
  }

  clamp(min: number, max: number) {
    const l = this.length();
    if (l < min) return this.setMag(min);
    if (l > max) return this.setMag(max);
    return this;
  }

  normalize(): Vector2 {
    const d = this.length();
    if (d === 0) return this;
    this.x /= d;
    this.y /= d;
    return this;
  }

  add(that: Vector2): Vector2 {
    this.x += that.x;
    this.y += that.y;
    return this;
  }

  mult(n: number): Vector2 {
    this.x *= n;
    this.y *= n;
    return this;
  }

  static distance(a: Vector2, b: Vector2) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static mult(vec: Vector2, n: number): Vector2 {
    return new Vector2(vec.x * n, vec.y * n);
  }

  static add(...vectors: Vector2[]): Vector2 {
    const x = vectors.reduce((_x, _v) => _x + _v.x, 0);
    const y = vectors.reduce((_y, _v) => _y + _v.y, 0);
    return new Vector2(x, y);
  }

  static nil(): Vector2 {
    return new Vector2(0, 0);
  }

  static fromAngle(angle: number): Vector2 {
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    return new Vector2(x, y);
  }

  static random(xMin: number, xMax: number, yMin: number, yMax: number) {
    const x = Math.random() * (xMax - xMin) + xMin;
    const y = Math.random() * (yMax - yMin) + yMin;
    return new Vector2(x, y);
  }

  static randomUnitVector(): Vector2 {
    return Vector2.fromAngle(2 * Math.PI * Math.random());
  }

  static from(obj: { x: number; y: number }) {
    return new Vector2(obj.x, obj.y);
  }
}
