import { Brush } from "./Brush";
import { DrawDrawingAction } from "./DrawDrawingAction";
import { FillDrawingAction } from "./FillDrawingAction";

/**
 * A fill drawing action represents filling a continuous area of a
 * color with the specified color
 */
export class ClearDrawingAction implements IDrawingAction {
  type: "CLEAR";
  source: DrawingActionSource;

  /**
   * Brush that was used to fill (color)
   */
  brush: Brush;

  constructor(source: DrawingActionSource, brush: Brush) {
    this.type = "CLEAR";
    this.source = source;
    this.brush = brush;
  }

  /**
   * Apply the fill
   */
  apply(opts: DrawingActionApplyOptions) {
    return new Promise<void>((resolve) => {
      opts.picture.clear();
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
    return false;
  }

  isClearAction(): this is ClearDrawingAction {
    return true;
  }
}
