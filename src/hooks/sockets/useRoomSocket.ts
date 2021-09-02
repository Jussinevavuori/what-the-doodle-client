import { useMemo, useRef } from "react";
import { RoomSocket } from "../../lib/sockets/RoomSocket";
import { useRoomId } from "../room/useRoomId";
import { useUser } from "../auth/useUser";

export function useRoomSocket() {
  const roomId = useRoomId();
  const user = useUser();

  // If in a room and game created
  const socketCache = useRef<
    { socket: RoomSocket; uid: string; roomId: string } | undefined
  >(undefined);
  const socket = useMemo(() => {
    // If no room ID or invalid user, do not establish connection
    // and clear cache
    if (!roomId || !user.isValid()) {
      socketCache.current = undefined;
      return;
    }

    // If no socket in socket cache or invalid info, create new
    if (
      !socketCache.current ||
      socketCache.current.uid !== user.id ||
      socketCache.current.roomId !== roomId
    ) {
      socketCache.current = {
        socket: new RoomSocket(roomId),
        uid: user.id,
        roomId,
      };
    }

    // Return socket in cache
    return socketCache.current.socket;
  }, [roomId, user]);

  return socket;
}
