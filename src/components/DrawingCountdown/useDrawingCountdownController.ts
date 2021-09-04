import { useStoreState } from "../../store";
import { DrawingCountdownProps } from "./DrawingCountdown";

export function useDrawingCountdownController(props: DrawingCountdownProps) {
  const drawingTime = useStoreState((_) => _.game.drawingTime);
  const drawingTimeLeft = useStoreState((_) => _.game.drawingTimeLeft);

  return {
    drawingTime,
    drawingTimeLeft,
  };
}
