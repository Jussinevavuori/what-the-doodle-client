export class Color {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;

  constructor(options: { r: number; g: number; b: number; a?: number }) {
    this.r = options.r;
    this.g = options.g;
    this.b = options.b;
    this.a = options.a ?? 255;
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
  toHexString() {
    return (
      "#" +
      this.r.toString(16).padStart(2, "0") +
      this.g.toString(16).padStart(2, "0") +
      this.b.toString(16).padStart(2, "0") +
      this.a.toString(16).padStart(2, "0")
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
}
