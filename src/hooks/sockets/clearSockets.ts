import { useEffect } from "react";
import { RoomSocket } from "../../lib/sockets/RoomSocket";
import { useRoomId } from "../room/useRoomId";

export function useClearSockets() {
  // Clear all sockets except current
  const roomId = useRoomId();
  useEffect(() => {
    RoomSocket.disconnectAndClearAllSockets({
      keepIf: (id) => id === roomId,
    });
  }, [roomId]);
}
