import { useRef, useEffect, useMemo } from "react";
import { CanvasController } from "../../lib/drawing/CanvasController";
import { DrawingActionSerializer } from "../../lib/drawing/DrawingActionSerializer";
import { Picture } from "../../lib/drawing/Picture";
import { useStoreState } from "../../store";
import { MiniCanvasProps } from "./MiniCanvas";

export function useMiniCanvasController(props: MiniCanvasProps) {
  const round = props.round;

  // Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Draw picture
  const picture = useMemo(() => new Picture(Picture.defaultSize), []);
  useEffect(() => {
    const apply = async () => {
      const actions = DrawingActionSerializer.parse(round.picture);
      for (const action of actions) {
        await picture.apply(action);
      }
    };
    apply();
  }, [picture, round]);

  // Attach picture to canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const controller = new CanvasController(canvasRef.current);
    return controller.attach(picture, { disableDrawing: true });
  }, [canvasRef, picture]);

  // Get user who has selected this canvas
  const players = useStoreState((_) => _.game.players);
  const finalGuesses = useStoreState((_) => _.game.finalGuesses);

  const guesser = useMemo(() => {
    const id = finalGuesses[round.cardId];
    return players.find((_) => _.id === id);
  }, [finalGuesses, players, round]);

  return {
    canvasRef,
    guesser,
    width: picture.width,
    height: picture.height,
  };
}
