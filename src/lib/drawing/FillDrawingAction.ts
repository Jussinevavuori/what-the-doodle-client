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
    this.origin = origin;
  }

  /**
   * Apply the fill
   */
  apply(opts: DrawingActionApplyOptions) {
    /**
     * @TODO implement filling
     */
    return new Promise<void>((resolve) => {
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
