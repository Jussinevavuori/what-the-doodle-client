import { PubSubChannel } from "../pubsub/PubSub";
import { Brush } from "./Brush";
import { Color } from "./Color";

export class Picture {
  /**
   * Width and height
   */
  readonly width: number;
  readonly height: number;

  /**
   * Amount of values in pixels.
   */
  private readonly n: number;

  /**
   * Array of size `width * height * 4` where each sequence of four numbers
   * corresponds to a
   */
  readonly pixels: Uint8ClampedArray;

  /**
   * On action channel for listening on events
   */
  public onActionChannel: PubSubChannel<DrawingAction>;

  public hasChanged: boolean;

  constructor(options: { width: number; height: number }) {
    this.width = options.width;
    this.height = options.height;
    this.onActionChannel = new PubSubChannel<DrawingAction>();
    this.hasChanged = true;

    // Paint the picture white by default by setting each value to 255.
    this.n = this.width * this.height * 4;
    this.pixels = new Uint8ClampedArray(this.n);
  }

  /**
   * Default picture size
   */
  static defaultSize = { width: 720, height: 420 };

  /**
   * Check that a pixel is within bounds
   */
  isPixelWithinBounds(x: number, y: number): boolean {
    const _x = Math.floor(x);
    const _y = Math.floor(y);
    return !(_x < 0 || _y < 0 || _x >= this.width || _y >= this.height);
  }

  /**
   * Get starting index `i` for a pixel at (x, y) such that the rgba values
   * for that pixel are located between `i` and `i + 3`.
   */
  static getPixelArrayIndex(x: number, y: number, width: number) {
    const i = 4 * (Math.floor(x) + Math.floor(y) * width);
    return i - (i % 4);
  }

  /**
   * Get starting index `i` for a pixel at (x, y) such that the rgba values
   * for that pixel are located between `i` and `i + 3`.
   */
  private getPixelArrayIndex(x: number, y: number): number {
    return Picture.getPixelArrayIndex(x, y, this.width);
  }

  /**
   * Helper method to get the value of a pixel as a raw array of four bytes
   */
  getPixel(x: number, y: number): Uint8ClampedArray {
    const colors = new Uint8ClampedArray(4);

    if (!this.isPixelWithinBounds(x, y)) {
      return colors;
    }

    const i = this.getPixelArrayIndex(x, y);
    for (let j = 0; j < 4; j++) {
      colors[j] = this.pixels[i + j];
    }
    return colors;
  }

  /**
   * Helper method to get pixel color as color object
   */
  getPixelColor(x: number, y: number): Color {
    if (!this.isPixelWithinBounds(x, y)) return Color.Invalid;
    return Color.fromUint8ClampedArray(this.getPixel(x, y));
  }

  /**
   * Helper method to set the value of a pixel according to a color object
   */
  setPixel(x: number, y: number, color: Color): void {
    if (!this.isPixelWithinBounds(x, y)) {
      return;
    }

    this.hasChanged = true;

    const i = this.getPixelArrayIndex(x, y);
    this.pixels[i + 0] = color.r;
    this.pixels[i + 1] = color.g;
    this.pixels[i + 2] = color.b;
    this.pixels[i + 3] = color.a;
  }

  /**
   * Paint a spot with a brush
   */
  paint(x: number, y: number, brush: Brush) {
    brush.forEachBrushSpot((dx, dy) => {
      this.setPixel(x + dx, y + dy, brush.color);
    });
  }

  /**
   * Fill the picture with a function
   */
  fill(getColor: (x: number, y: number) => Color) {
    this.hasChanged = true;
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.setPixel(i, j, getColor(i / this.width, j / this.height));
      }
    }
  }

  /**
   * Clear is filling the picture with white
   */
  clear() {
    this.fill(() => Color.White);
  }

  /**
   * Set pixel data directly
   */
  setData(pixels: Uint8ClampedArray) {
    this.hasChanged = true;
    if (pixels.length === this.pixels.length) {
      this.pixels.set(pixels);
    } else {
      throw new Error("Invalid image data size");
    }
    return this;
  }

  /**
   * Apply a drawing action
   */
  async apply(
    action: DrawingAction,
    opts: {
      preventPublish?: boolean;
      preventAnimation?: boolean;
    } = {}
  ): Promise<void> {
    // Publish action unless prevented
    if (!opts.preventPublish) {
      this.onActionChannel.publish(action);
    }

    // Apply the action
    await action.apply({
      picture: this,
      preventAnimation: !!opts.preventAnimation,
    });
  }

  drawToConsole() {
    let str = "";
    for (let y = 0; y < this.width; y += 10) {
      for (let x = 0; x < this.height; x += 10) {
        const shade = ["█", "▓", "▒", "░", " "];
        const max = 10 * 10 * 255 * 3;
        let sum = 0;
        for (let dx = 0; dx < 10; dx++) {
          for (let dy = 0; dy < 10; dy++) {
            const px = this.getPixel(x + dx, y + dy);
            sum += (px[0] + px[1] + px[2]) * (px[3] / 255);
          }
        }
        str += shade[Math.floor(sum / ((max + 1) / 5))];
      }
      str += "\n";
    }
    console.log(str);
  }
}
