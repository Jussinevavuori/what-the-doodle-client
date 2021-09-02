import { useEffect, useMemo, useRef } from "react";
import { useRoomSocketContext } from "../../contexts/RoomSocketContext";
import { useBrush } from "../../hooks/game/useBrush";
import { CanvasController } from "../../lib/drawing/CanvasController";
import { Picture } from "../../lib/drawing/Picture";
import { useStoreState } from "../../store";
import { DrawingCanvasProps } from "./DrawingCanvas";

export function useDrawingCanvasController(props: DrawingCanvasProps) {
  // Current canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controllerRef = useRef<CanvasController | null>(null);

  const [brush] = useBrush();

  const currentRound = useStoreState((_) => _.game.currentRound);
  const socket = useRoomSocketContext();

  // Attach and detach controller to canvas and picture
  const picture = useMemo(() => new Picture(Picture.defaultSize), []);
  useEffect(() => {
    if (!canvasRef.current || !picture) return;
    controllerRef.current = new CanvasController(canvasRef.current);
    return controllerRef.current.attach(picture);
  }, [canvasRef, controllerRef, picture]);

  // Update brush to controller ref
  useEffect(() => {
    controllerRef.current?.setBrush(brush);
  }, [controllerRef, brush]);

  // Broadcast drawing
  useEffect(() => {
    if (picture && socket) {
      return socket.connectPicture(picture);
    }
  }, [picture, socket]);

  return {
    currentRound,
    canvasRef,
    width: picture?.width || Picture.defaultSize.width,
    height: picture?.height || Picture.defaultSize.height,
  };
}
