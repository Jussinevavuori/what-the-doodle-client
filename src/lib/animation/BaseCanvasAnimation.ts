export abstract class BaseCanvasAnimation {
  abstract animate(
    deltaMs: number,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ): void;
}
