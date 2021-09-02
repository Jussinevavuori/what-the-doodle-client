import * as DEVICE from "react-device-detect";
import { Brush } from "./Brush";
import { DrawDrawingAction } from "./DrawDrawingAction";
import { FillDrawingAction } from "./FillDrawingAction";
import { Picture } from "./Picture";

export class CanvasController {
  canvas: HTMLCanvasElement;

  // Current picture if attached
  private picture?: Picture;

  // Current stroke
  private stroke?: DrawDrawingAction;

  // Current brush
  private brush: Brush;

  constructor(canvas: HTMLCanvasElement, brush: Brush = Brush.DefaultBrush) {
    this.canvas = canvas;
    this.brush = brush;
  }

  /**
   * Start new stroke from x, y
   */
  private penDown(x: number, y: number) {
    if (!this.picture) return;

    switch (this.brush.type) {
      case "erase":
      case "brush": {
        this.stroke = new DrawDrawingAction("local", this.brush);
        this.stroke.addCoordinate(x, y);
        this.picture.apply(this.stroke, { preventPublish: true });
        break;
      }
      case "fill": {
        this.picture.apply(
          new FillDrawingAction("local", this.brush, { x, y })
        );
        break;
      }
    }
  }

  /**
   * Next point in current stroke at x, y
   */
  private penMove(x: number, y: number) {
    if (!this.stroke || !this.picture) return;

    switch (this.brush.type) {
      case "erase":
      case "brush": {
        // Split when over 50 coordinates set in order to show line faster to
        // others
        this.stroke.addCoordinate(x, y);
        // if (this.stroke.coordinates.length > 20) {
        //   this.picture.apply(this.stroke);
        //   this.stroke = new DrawDrawingAction("local", this.brush);
        // }
        this.picture.apply(this.stroke, { preventPublish: true });
        break;
      }
      case "fill": {
        // No-op
        break;
      }
    }
  }

  /**
   * End current stroke at x, y
   */
  private penUp(x: number, y: number) {
    if (!this.stroke || !this.picture) return;

    switch (this.brush.type) {
      case "erase":
      case "brush": {
        this.stroke.addCoordinate(x, y);
        this.picture.apply(this.stroke);
        this.stroke = undefined;
        break;
      }
      case "fill": {
        // No-op
        break;
      }
    }
  }

  /**
   * Set new brush
   */
  public setBrush(brush: Brush) {
    this.brush = brush;
  }

  /**
   * Initializes event listeners
   */
  public attach(
    picture: Picture,
    opts: {
      disableDrawing?: boolean;
    } = {}
  ) {
    this.picture = picture;

    var isMouseDown = false;

    /**
     * Render loop: start rendering picture
     */
    const render = () => {
      if (picture.hasChanged) {
        CanvasController.drawPicture(picture, this.canvas);
        picture.hasChanged = false;
      }
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    // When disabling drawing, skip all listeners
    if (opts.disableDrawing) {
      return () => {};
    }

    // When mouse is moving and status is drawing, paint the pixel
    const onPointerMove = (ev: MouseEvent | TouchEvent) => {
      const { x, y } = CanvasController.getCoords(this.canvas, picture, ev);
      this.penMove(x, y);
    };

    // When mouse is pressed down, start render loop and set status to drawing
    const onPointerDown = (ev: MouseEvent | TouchEvent) => {
      const { x, y } = CanvasController.getCoords(this.canvas, picture, ev);
      this.penDown(x, y);
      isMouseDown = true;
    };

    // When mouse is released,
    const onPointerUp = (ev: MouseEvent | TouchEvent) => {
      const { x, y } = CanvasController.getCoords(this.canvas, picture, ev);
      this.penUp(x, y);
      isMouseDown = false;
    };

    // When mouse leaves, automatically end current line
    const onPointerLeave = (ev: MouseEvent) => {
      const { x, y } = CanvasController.getCoords(this.canvas, picture, ev);
      this.penUp(x, y);
    };

    // When mouse re-enters and still held down, start new line
    const onPointerEnter = (ev: MouseEvent) => {
      const { x, y } = CanvasController.getCoords(this.canvas, picture, ev);
      if (isMouseDown) {
        this.penDown(x, y);
      }
    };

    // Attach listeners
    // this.canvas.addEventListener("mousemove", onMove);
    this.canvas.addEventListener("mousemove", onPointerMove);
    this.canvas.addEventListener("touchmove", onPointerMove);
    this.canvas.addEventListener("pointermove", onPointerMove);
    this.canvas.addEventListener("pointerdown", onPointerDown);
    this.canvas.addEventListener("pointerup", onPointerUp);
    if (DEVICE.isDesktop) {
      this.canvas.addEventListener("pointerleave", onPointerLeave);
      this.canvas.addEventListener("pointerenter", onPointerEnter);
      document.documentElement.addEventListener("pointerup", onPointerUp);
    }

    // Return a detach function
    return () => {
      this.canvas.removeEventListener("mousemove", onPointerMove);
      this.canvas.removeEventListener("touchmove", onPointerMove);
      this.canvas.removeEventListener("pointermove", onPointerMove);
      this.canvas.removeEventListener("pointerdown", onPointerDown);
      this.canvas.removeEventListener("pointerup", onPointerLeave);
      if (DEVICE.isDesktop) {
        this.canvas.removeEventListener("pointerleave", onPointerEnter);
        this.canvas.removeEventListener("pointerenter", onPointerUp);
        document.documentElement.removeEventListener("pointerup", onPointerUp);
      }
      this.picture = undefined;
      this.stroke = undefined;
    };
  }

  /**
   * Map coordinates from a mouse event to coordinates on the picture
   *
   * @param canvas  Canvas element which was interacted with
   * @param picture Picture which is being drawn on
   * @param clientX Client X click position
   * @param clientY CLient Y click position
   * @returns Object of shape { x, y } containing the mapped coordinates in the
   * 					picture's coordinate space
   */
  static getCoords(
    canvas: HTMLCanvasElement,
    picture: Picture,
    ev: MouseEvent | TouchEvent
  ) {
    const rect = canvas.getBoundingClientRect();
    const clientX = "clientX" in ev ? ev.clientX : ev.touches[0].clientX;
    const clientY = "clientY" in ev ? ev.clientY : ev.touches[0].clientY;
    const x = (picture.width * (clientX - rect.left)) / rect.width;
    const y = (picture.height * (clientY - rect.top)) / rect.height;
    return { x, y };
  }

  /**
   * Draws a specified picture onto the specified canvas
   */
  static drawPicture(picture: Picture, canvas: HTMLCanvasElement) {
    // Get context
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    // Create an image data and scale the image to fit the canvas
    const imageData = new ImageData(
      picture.pixels,
      picture.width,
      picture.height
    );

    // Draw the scaled image onto the canvas
    ctx.putImageData(imageData, 0, 0);
  }
}
