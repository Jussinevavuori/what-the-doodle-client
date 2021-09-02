import { useStoreState } from "../../store";

export function usePlayers() {
  return useStoreState((_) => _.game.players);
}
