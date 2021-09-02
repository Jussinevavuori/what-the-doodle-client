import { distance } from "../functions/distance";
import { lerp } from "../functions/lerp";
import { Brush } from "./Brush";
import { ClearDrawingAction } from "./ClearDrawingAction";
import { FillDrawingAction } from "./FillDrawingAction";

/**
 * The DRAW drawing action represents a brush stroke or a single
 * brush point.
 */
export class DrawDrawingAction implements IDrawingAction {
  type: "DRAW";
  source: DrawingActionSource;

  /**
   * Brush which was used for the draw stroke
   */
  brush: Brush;

  /**
   * All coordinates of the draw stroke
   */
  coordinates: Point[];

  constructor(source: DrawingActionSource, brush: Brush) {
    this.type = "DRAW";
    this.source = source;
    this.brush = brush;
    this.coordinates = [];
  }

  /**
   * Add a coordinate pair to the stroke
   */
  addCoordinate(x: number, y: number) {
    const _x = Math.floor(x);
    const _y = Math.floor(y);
    const prev = this.coordinates[this.coordinates.length - 1];
    // Draw only if different point than last
    if (!prev || prev.x !== _x || prev.y !== _y) {
      this.coordinates.push({ x: _x, y: _y });
    }
    return this;
  }

  /**
   * Add multiple pairs of coordinates as array of points
   */
  addCoordinates(coordinates: Point[]) {
    for (const pair of coordinates) {
      this.addCoordinate(pair.x, pair.y);
    }
    return this;
  }

  /**
   * Apply the stroke
   */
  apply(opts: DrawingActionApplyOptions) {
    return new Promise<void>((resolve) => {
      // If no coordinates, do nothing
      if (this.coordinates.length === 0) {
        resolve();
        return;
      }

      // Draw first point
      let last = this.coordinates[0];
      opts.picture.paint(last.x, last.y, this.brush);

      // Index of next point to draw to
      let i = 1;

      // Helper function to draw next point
      const draw = (drawPoints: number = 1) => {
        // Draw `drawPoints` next points
        for (let p = 0; p < drawPoints; p++) {
          // Do not operate when index over bounds
          if (i >= this.coordinates.length) return;

          // Get next point
          const next = this.coordinates[i];

          // Paint multiple spots along the line from p0 to p1 depending
          // on their distance and the brush size
          const dist = distance(last.x, last.y, next.x, next.y);
          for (let d = 0; d <= dist; d += this.brush.size * 0.5) {
            const t = dist === 0 ? 1 : d / dist;
            const x = lerp(last.x, next.x, t);
            const y = lerp(last.y, next.y, t);
            opts.picture.paint(x, y, this.brush);
          }

          // Keep loop going
          last = next;
          i++;
        }

        // Return boolean for whether there exists more points to draw
        return i < this.coordinates.length;
      };

      // Animate with requestAnimation when source is server,
      // resolve when animation complete
      if (this.isServerAction() && !opts.preventAnimation) {
        const loop = () => (draw(10) ? requestAnimationFrame(loop) : resolve());
        loop();
      } else {
        // Default loop when local action: draw all points directly
        // and immediately reslve
        while (draw()) {}
        resolve();
      }
    });
  }

  isLocalAction() {
    return this.source === "local";
  }

  isServerAction() {
    return this.source === "server";
  }

  isDrawAction(): this is DrawDrawingAction {
    return true;
  }

  isFillAction(): this is FillDrawingAction {
    return false;
  }

  isClearAction(): this is ClearDrawingAction {
    return false;
  }
}
