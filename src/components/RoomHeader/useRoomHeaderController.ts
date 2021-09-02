import { useCallback } from "react";
import { useRoomSocketContext } from "../../contexts/RoomSocketContext";
import { useRoomId } from "../../hooks/room/useRoomId";
import { useStoreState } from "../../store";
import { RoomHeaderProps } from "./RoomHeader";

export function useRoomHeaderController(props: RoomHeaderProps) {
  const roomId = useRoomId();

  const drawingTime = useStoreState((_) => _.game.drawingTime);
  const drawingTimeLeft = useStoreState((_) => _.game.drawingTimeLeft);

  const user = useStoreState((_) => _.game.user);
  const gameStatus = useStoreState((_) => _.game.gameStatus);
  const nRounds = useStoreState((_) => _.game.nRounds);
  const currentRound = useStoreState((_) => _.game.currentRoundIndex) + 1;

  const socket = useRoomSocketContext();
  const onReset = useCallback(() => {
    socket?.resetGame();
  }, [socket]);

  return {
    username: user.name,
    roomId,
    gameStatus: gameStatus as GameStatus,
    nRounds,
    currentRound,
    drawingTime,
    drawingTimeLeft,
    onReset,
  };
}
