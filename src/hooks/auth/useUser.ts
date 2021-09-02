import { useStoreState } from "../../store";

export function useUser() {
  return useStoreState((_) => _.game.user);
}
