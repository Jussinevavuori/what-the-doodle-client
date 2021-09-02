import { useEffect, useRef } from "react";
import { useStoreState } from "../../store";

export function useOnStatusChange(callback: (status: GameStatus) => void) {
  const latestStatus = useRef<GameStatus>("idle");
  const currentStatus = useStoreState((_) => _.game.gameStatus);

  useEffect(() => {
    if (latestStatus.current === currentStatus) {
      return;
    }

    latestStatus.current = currentStatus;
    callback(currentStatus);
  }, [currentStatus, callback]);
}
