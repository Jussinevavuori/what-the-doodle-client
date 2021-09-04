import { useStoreState } from "../../store";

export function useGameStatus() {
  return useStoreState((_) => _.game.gameStatus);
}
