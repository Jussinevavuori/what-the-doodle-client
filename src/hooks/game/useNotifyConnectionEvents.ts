import { useSnackbar } from "notistack";
import { useEffect, useRef } from "react";
import { User } from "../../lib/auth/User";
import { unique } from "../../lib/functions/unique";
import { RoomSocket } from "../../lib/sockets/RoomSocket";
import { useUser } from "../auth/useUser";
import { useRoomId } from "../room/useRoomId";
import { usePlayers } from "./usePlayers";

export function useNotifyConnectionEvents() {
  const { enqueueSnackbar } = useSnackbar();
  const user = useUser();
  const currentPlayers = usePlayers();
  const prevPlayers = useRef<User[]>([]);
  const roomId = useRoomId();

  // Display notifications about when other players join, leave,
  // lose connection or reconnect
  useEffect(() => {
    // Only display in a room
    if (!roomId) return;

    // Get all players (previous AND current)
    const players = unique(
      currentPlayers.concat(prevPlayers.current),
      (a, b) => a.id === b.id
    );

    for (const player of players) {
      // Do not display self
      if (player.id === user.id) {
        continue;
      }

      // Find instance of player in current and prev
      const current = currentPlayers.find((_) => _.id === player.id);
      const prev = prevPlayers.current.find((_) => _.id === player.id);

      // Player left
      if (!current && prev) {
        enqueueSnackbar(`${player.name} left`, { variant: "info" });
        continue;
      }

      // Player joined (last condition prevents from displaying
      // every player when joining a lobby)
      if (!prev && current && prevPlayers.current.length > 0) {
        enqueueSnackbar(`${player.name} joined`, { variant: "info" });
        continue;
      }

      // Player disconnected
      if (prev && current && prev.isOnline && !current.isOnline) {
        enqueueSnackbar(`${player.name} lost connection`, {
          variant: "warning",
        });
        continue;
      }

      // Player reconnected
      if (prev && current && !prev.isOnline && current.isOnline) {
        enqueueSnackbar(`${player.name} reconnected`, { variant: "success" });
        continue;
      }
    }

    // Update previous players
    prevPlayers.current = currentPlayers;
  }, [currentPlayers, prevPlayers, enqueueSnackbar, user, roomId]);

  // Notify on self losing connection or reconnecting
  useEffect(() => {
    // Only display in a room
    if (!roomId) return;

    return RoomSocket.connectionEvents.subscribe((eventType) => {
      switch (eventType) {
        case "reconnected":
          enqueueSnackbar("Succesfully reconnected", {
            variant: "success",
          });
          break;
        case "disconnected":
          enqueueSnackbar("Lost connection, attempting to reconnect...", {
            variant: "error",
          });
          break;
      }
    });
  }, [enqueueSnackbar, roomId]);
}
