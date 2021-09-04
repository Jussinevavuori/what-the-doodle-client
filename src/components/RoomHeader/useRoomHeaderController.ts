import { useCallback, useMemo } from "react";
import { useRoomSocketContext } from "../../contexts/RoomSocketContext";
import { useRoomId } from "../../hooks/room/useRoomId";
import { useStoreState } from "../../store";
import { RoomHeaderProps } from "./RoomHeader";

export function useRoomHeaderController(props: RoomHeaderProps) {
  const roomId = useRoomId();

  const rounds = useStoreState((_) => _.game.rounds);
  const user = useStoreState((_) => _.game.user);
  const gameStatus = useStoreState((_) => _.game.gameStatus);
  const nRounds = useStoreState((_) => _.game.nRounds);
  const currentRound = useStoreState((_) => _.game.currentRoundIndex) + 1;

  const socket = useRoomSocketContext();
  const onReset = useCallback(() => {
    socket?.resetGame();
  }, [socket]);

  const originalTopic = useMemo(() => {
    const r = rounds.find((_) => _.roundNumber === 0 && _.drawerId === user.id);
    return r?.topic ?? "";
  }, [rounds, user]);

  return {
    originalTopic,
    username: user.name,
    roomId,
    gameStatus: gameStatus as GameStatus,
    nRounds,
    currentRound,
    onReset,
  };
}
