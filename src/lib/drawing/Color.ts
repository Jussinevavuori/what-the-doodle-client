import { clamp } from "../functions/clamp";
import { lerp } from "../functions/lerp";
import { mapValue } from "../functions/mapValue";

export class Color {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;

  readonly h: number;
  readonly s: number;
  readonly l: number;

  constructor(options: { r: number; g: number; b: number; a?: number }) {
    this.r = Math.floor(options.r);
    this.g = Math.floor(options.g);
    this.b = Math.floor(options.b);
    this.a = Math.floor(options.a ?? 255);

    // Convert to hsl
    const _r = this.r / 255;
    const _g = this.g / 255;
    const _b = this.b / 255;
    const _c_max = Math.max(_r, _g, _b);
    const _c_min = Math.min(_r, _g, _b);
    const _d = _c_max - _c_min;
    this.h = (() => {
      if (_d === 0) return 0;
      else if (_c_max === _r) return 60 * (((_g - _b) / _d) % 6);
      else if (_c_max === _g) return 60 * ((_b - _r) / _d + 2);
      else return 60 * ((_r - _g) / _d + 4);
    })();
    this.l = (_c_max + _c_min) / 2;
    this.s = _d === 0 ? 0 : _d / (1 - Math.abs(2 * this.l - 1));
  }

  /**
   * Generate color from HSLA
   */
  static fromHsla(h: number, s: number, l: number, alpha: number = 100) {
    const _h = h < 0 ? 360 + (h % 360) : h % 360;
    const _s = clamp(s % 1, 0, 1);
    const _l = clamp(l % 1, 0, 1);
    const c = (1 - Math.abs(2 * _l - 1)) * _s;
    const x = c * (1 - Math.abs(((_h / 60) % 2) - 1));
    const m = _l - c / 2;
    const a = mapValue(alpha, 0, 100, 0, 255);
    const _rgb = (() => {
      if (_h < 60) {
        return [c, x, 0];
      } else if (_h < 120) {
        return [x, c, 0];
      } else if (_h < 180) {
        return [0, c, x];
      } else if (_h < 240) {
        return [0, x, c];
      } else if (_h < 300) {
        return [x, 0, c];
      } else {
        return [c, 0, x];
      }
    })();
    return new Color({
      r: 255 * (_rgb[0] + m),
      g: 255 * (_rgb[1] + m),
      b: 255 * (_rgb[2] + m),
      a,
    });
  }

  /**
   * Parse color from uint8 where the bit structure is `rrggbbaa`
   */
  static fromUint8(color: number) {
    return new Color({
      r: (color & 0xff000000) >>> 24,
      g: (color & 0x00ff0000) >>> 16,
      b: (color & 0x0000ff00) >>> 8,
      a: (color & 0x000000ff) >>> 0,
    });
  }

  /**
   * Constructor to conccert a Uint8ClampedArray (r,g,b,a?) into a color object.
   * If Uint8ClampedArray has invalid length (not 3 or 4), return invalid color
   * object. If alpha value not provided (length is 3), 255 is used as default
   * value.
   */
  static fromUint8ClampedArray(arr: Uint8ClampedArray) {
    if (arr.length === 3 || arr.length === 4) {
      return new Color({ r: arr[0], g: arr[1], b: arr[2], a: arr[3] ?? 255 });
    } else {
      return Color.Invalid;
    }
  }

  /**
   * Parse color from hex string
   */
  static fromHexString(hex: string) {
    const _h = hex.replace("#", "");
    return new Color({
      r: parseInt(_h.substring(0, 2), 16),
      g: parseInt(_h.substring(2, 4), 16),
      b: parseInt(_h.substring(4, 6), 16),
      a: _h.length < 8 ? 255 : parseInt(_h.substring(6, 8), 16),
    });
  }

  /**
   * Color to uint8 such that the bit structure is `rrggbbaa`
   */
  toUint8() {
    return (
      ((this.r & 0xff) << 24) |
      ((this.g & 0xff) << 18) |
      ((this.b & 0xff) << 8) |
      ((this.a & 0xff) << 0)
    );
  }

  /**
   * Color as hex string
   */
  toHexString(opts: { omitAlpha?: boolean } = {}) {
    return (
      "#" +
      this.r.toString(16).padStart(2, "0") +
      this.g.toString(16).padStart(2, "0") +
      this.b.toString(16).padStart(2, "0") +
      (opts.omitAlpha ? "" : this.a.toString(16).padStart(2, "0"))
    );
  }

  /**
   * Function to check if two colors are equal.
   */
  equals(that: Color) {
    return (
      this.r === that.r &&
      this.g === that.g &&
      this.b === that.b &&
      this.a === that.a
    );
  }

  /**
   * Ensure this color is valid (all values are integers between
   * 0 and 255).
   */
  isValid() {
    const _isValid = (n: number) =>
      Number.isSafeInteger(n) && n >= 0 && n <= 255;
    return [this.r, this.g, this.b, this.a].every((_) => _isValid(_));
  }

  /**
   * Invalid coor
   */
  static Invalid = new Color({ r: -1, g: -1, b: -1, a: -1 });

  /**
   * White default color
   */
  static White = new Color({ r: 255, g: 255, b: 255, a: 255 });

  /**
   * Black default color
   */
  static Black = new Color({ r: 0, g: 0, b: 0, a: 255 });

  /**
   * Lerps two colors
   */
  static lerp(a: Color, b: Color, t: number) {
    return new Color({
      r: lerp(a.r, b.r, t),
      g: lerp(a.g, b.g, t),
      b: lerp(a.b, b.b, t),
      a: lerp(a.a, b.a, t),
    });
  }

  /**
   * Lerps two colors in hsla values
   */
  static lerpHsla(a: Color, b: Color, t: number) {
    const targetHue =
      Math.abs(a.h - b.h) < Math.abs(a.h - (-360 + b.h)) ? b.h : -360 + b.h;
    return Color.fromHsla(
      lerp(a.h, targetHue, t),
      lerp(a.s, b.s, t),
      lerp(a.l, b.l, t),
      lerp(a.a, b.a, t)
    );
  }
}

(window as any).Color = Color;
