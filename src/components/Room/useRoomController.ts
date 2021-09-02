import { useCallback } from "react";
import { useRoomSocketContext } from "../../contexts/RoomSocketContext";
import { useRoomId } from "../../hooks/room/useRoomId";
import { useStoreState } from "../../store";
import { RoomProps } from "./Room";

export function useRoomController(props: RoomProps) {
  const gameStatus = useStoreState((_) => _.game.gameStatus);
  const roomId = useRoomId();

  const socket = useRoomSocketContext();
  const onReset = useCallback(() => {
    socket?.resetGame();
  }, [socket]);

  return {
    onReset,
    roomId,
    gameStatus,
  };
}
