import { Brush } from "./Brush";
import { ClearDrawingAction } from "./ClearDrawingAction";
import { DrawDrawingAction } from "./DrawDrawingAction";

/**
 * A fill drawing action represents filling a continuous area of a
 * color with the specified color
 */
export class FillDrawingAction implements IDrawingAction {
  type: "FILL";
  source: DrawingActionSource;

  /**
   * Brush that was used to fill (color)
   */
  brush: Brush;

  /**
   * Position of fill origin
   */
  origin: Point;

  constructor(source: DrawingActionSource, brush: Brush, origin: Point) {
    this.type = "FILL";
    this.source = source;
    this.brush = brush;
    this.origin = {
      x: Math.floor(origin.x),
      y: Math.floor(origin.y),
    };
  }

  /**
   * Apply the fill
   */
  apply(opts: DrawingActionApplyOptions) {
    // Shortcut for picture
    const p = opts.picture;

    return new Promise<void>((resolve) => {
      // Get color at clickpoint
      const originalColor = opts.picture.getPixelColor(
        this.origin.x,
        this.origin.y
      );

      // If for some reason an invalid color is returned (for example origin
      // is out of bounds), do nothing
      if (!originalColor.isValid) {
        return resolve();
      }

      // Stringify point for visited set purposes
      const s = (p: Point) => `${p.x};${p.y}`;

      // Breadth-first search of all cells to fill
      const visited = new Set<string>(s(this.origin));
      const queue: Point[] = [this.origin];

      const neighbors = [
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 0, dy: 1 },
        { dx: 0, dy: -1 },
      ];

      // Run N iterations of bfs
      const bfs = (n: number) => {
        for (let i = 0; i < n; i++) {
          if (queue.length <= 0) break;

          // Get next point and remove it from queue and color
          const { x, y } = queue.shift()!;
          p.setPixel(x, y, this.brush.color);

          // Enqueue each neighbor and mark them as visited
          for (const neighbor of neighbors) {
            if (
              p.isPixelWithinBounds(x + neighbor.dx, y + neighbor.dy) &&
              p
                .getPixelColor(x + neighbor.dx, y + neighbor.dy)
                .equals(originalColor) &&
              !visited.has(s({ x: x + neighbor.dx, y: y + neighbor.dy }))
            ) {
              queue.push({ x: x + neighbor.dx, y: y + neighbor.dy });
              visited.add(s({ x: x + neighbor.dx, y: y + neighbor.dy }));
            }
          }
        }
        return queue.length > 0;
      };

      if (!opts.preventAnimation && !this.isServerAction()) {
        const loop = () =>
          bfs(10000) ? requestAnimationFrame(loop) : resolve();
        loop();
      } else {
        while (bfs(1)) {}
        resolve();
      }
      resolve();
    });
  }

  isLocalAction() {
    return this.source === "local";
  }

  isServerAction() {
    return this.source === "server";
  }

  isDrawAction(): this is DrawDrawingAction {
    return false;
  }

  isFillAction(): this is FillDrawingAction {
    return true;
  }

  isClearAction(): this is ClearDrawingAction {
    return false;
  }
}
