import { useMemo } from "react";
import { useStoreState } from "../../store";
import { PlayerBottomListProps } from "./PlayerBottomList";

export function usePlayerBottomListController(props: PlayerBottomListProps) {
  const players = useStoreState((_) => _.game.players);

  const myPlayer = useStoreState((_) => _.game.user);

  const otherPlayers = useMemo(
    () =>
      players
        .filter((_) => _.id !== myPlayer.id)
        .sort((a, b) => {
          return a.id.localeCompare(b.id);
        }),
    [myPlayer, players]
  );

  return {
    myPlayer,
    otherPlayers,
  };
}
