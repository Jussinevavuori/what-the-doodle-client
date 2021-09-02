import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRoomSocketContext } from "../../contexts/RoomSocketContext";
import { CanvasController } from "../../lib/drawing/CanvasController";
import { DrawingActionSerializer } from "../../lib/drawing/DrawingActionSerializer";
import { Picture } from "../../lib/drawing/Picture";
import { useStoreState } from "../../store";
import { GuessingCanvasProps } from "./GuessingCanvas";

export function useGuessingCanvasController(props: GuessingCanvasProps) {
  // Current canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [guess, setGuess] = useState("");

  const currentRound = useStoreState((_) => _.game.currentRound);
  const socket = useRoomSocketContext();

  // Attach and detach controller to canvas and picture
  const picture = useMemo(() => new Picture(Picture.defaultSize), []);
  useEffect(() => {
    if (!currentRound) return;
    const apply = async () => {
      const actions = DrawingActionSerializer.parse(currentRound.picture);
      for (const action of actions) {
        await picture.apply(action);
      }
    };
    apply();
  }, [picture, currentRound]);

  useEffect(() => {
    if (!canvasRef.current || !picture) return;
    const controller = new CanvasController(canvasRef.current);
    return controller.attach(picture, { disableDrawing: true });
  }, [canvasRef, picture]);

  const handleSubmit = useCallback(() => {
    if (socket && currentRound && guess.trim()) {
      socket.guess({ roundId: currentRound.id, guess: guess.trim() });
    }
  }, [socket, currentRound, guess]);

  return {
    currentRound,
    guess,
    setGuess,
    handleSubmit,
    canvasRef,
    width: picture?.width || Picture.defaultSize.width,
    height: picture?.height || Picture.defaultSize.height,
  };
}
