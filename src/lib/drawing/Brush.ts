import { Color } from "./Color";

export class Brush {
  readonly size: number;
  readonly color: Color;
  readonly type: "brush" | "fill" | "erase";

  readonly grid: Array<Array<boolean>>;

  constructor(options: { size: number; color: Color; type: Brush["type"] }) {
    this.size = options.size;
    this.color = options.color;
    this.type = options.type;
    this.grid = Brush.createGrid(this.size);
  }

  forEachBrushSpot(cb: (offsetX: number, offsetY: number) => void) {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j]) {
          cb(i - this.size + 1, j - this.size + 1);
        }
      }
    }
  }

  static createGrid(size: number): boolean[][] {
    let grid: boolean[][] = [];
    for (let y = -size + 1; y < size; y++) {
      grid.push([]);
      for (let x = -size + 1; x < size; x++) {
        grid[grid.length - 1].push(x * x + y * y < size * size * 0.85);
      }
    }
    return grid;
  }

  static Eraser = (size: number) =>
    new Brush({
      size,
      color: Color.White,
      type: "erase",
    });

  static CanvasClear = new Brush({
    size: -1,
    color: Color.White,
    type: "erase",
  });

  static DefaultBrush = new Brush({
    size: 13,
    color: new Color({ r: 0, g: 0, b: 0, a: 255 }),
    type: "brush",
  });

  static DefaultSizes = [3, 8, 13, 18];

  static DefaultColors = [
    Color.fromHexString("#000000"), // Black
    Color.fromHexString("#ffffff"), // White
    Color.fromHexString("#ff1744"), // Red
    // Color.fromHexString("#b2102f"), // Red (dark)
    Color.fromHexString("#ff80ab"), // Pink
    // Color.fromHexString("#b25977"), // Pink (dark)
    Color.fromHexString("#d500f9"), // Purple
    // Color.fromHexString("#9500ae"), // Purple (dark)
    Color.fromHexString("#651fff"), // Depp purple
    // Color.fromHexString("#4615b2"), // Depp purple (dark)
    // Color.fromHexString("#3d5afe"), // Indigo
    // Color.fromHexString("#2a3eb1"), // Indigo (dark)
    Color.fromHexString("#2979ff"), // Blue
    // Color.fromHexString("#1c54b2"), // Blue (dark)
    // Color.fromHexString("#00b0ff"), // Light blue
    // Color.fromHexString("#007bb2"), // Light blue (dark)
    Color.fromHexString("#00e5ff"), // Cyan
    // Color.fromHexString("#00a0b2"), // Cyan (dark)
    // Color.fromHexString("#1de9b6"), // Teal
    // Color.fromHexString("#14a37f"), // Teal (dark)
    Color.fromHexString("#3da827"), // Green
    Color.fromHexString("#00e676"), // Green
    // Color.fromHexString("#00a152"), // Green (dark)
    // Color.fromHexString("#76ff03"), // Light green
    // Color.fromHexString("#52b202"), // Light green (dark)
    Color.fromHexString("#c6ff00"), // Lime
    // Color.fromHexString("#8ab200"), // Lime (dark)
    Color.fromHexString("#ffea00"), // Yellow
    // Color.fromHexString("#b2a300"), // Yellow (dark)
    // Color.fromHexString("#ffc400"), // Amber
    // Color.fromHexString("#b28900"), // Amber (dark)
    Color.fromHexString("#ff9100"), // Orange
    Color.fromHexString("#77492f"), // Brown
    // Color.fromHexString("#b26500"), // Orange (dark)
    // Color.fromHexString("#ff3d00"), // Deep orange
    // Color.fromHexString("#b22a00"), // Deep orange (dark)
  ];
}
