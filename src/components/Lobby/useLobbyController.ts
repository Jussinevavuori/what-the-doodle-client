import { useCallback, useMemo } from "react";
import { useRoomSocketContext } from "../../contexts/RoomSocketContext";
import { useRoomId } from "../../hooks/room/useRoomId";
import { clamp } from "../../lib/functions/clamp";
import { useStoreState } from "../../store";
import { LobbyProps } from "./Lobby";

export function useLobbyController(props: LobbyProps) {
  const roomId = useRoomId();
  const players = useStoreState((_) => _.game.players);
  const maxPlayers = useStoreState((_) => _.game.maxPlayers);

  const socket = useRoomSocketContext();
  const handleGameStart = useCallback(() => {
    socket?.startGame();
  }, [socket]);

  const drawingTime = useStoreState((_) => _.game.drawingTime);
  const adjustDrawingTime = useCallback(
    (adjustment: number) => {
      return () => {
        socket?.setDrawingTime(clamp(drawingTime + adjustment, 5, 120));
      };
    },
    [drawingTime, socket]
  );

  const roomUrl = useMemo(() => {
    return `${window.location.href.split("#")[0].split("?")[0]}`;
  }, []);

  const copy = useCallback((id: string) => {
    return () => {
      const elem = document.getElementById(id) as HTMLInputElement;
      if (elem && "select" in elem && "setSelectionRange" in elem) {
        elem.select();
        elem.setSelectionRange(0, 99999);
        if (navigator.clipboard && "writeText" in navigator.clipboard) {
          navigator.clipboard.writeText(elem.value);
        }
      }
    };
  }, []);

  return {
    roomId,
    roomUrl,
    players,
    maxPlayers,
    handleGameStart,
    drawingTime,
    adjustDrawingTime,
    copy,
  };
}
