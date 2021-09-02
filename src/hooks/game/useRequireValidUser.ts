import { useEffect } from "react";
import { useHistory } from "react-router";
import { Routes } from "../../routes";
import { useUser } from "../auth/useUser";
import { useRoomId } from "../room/useRoomId";

export function useRequireValidUser() {
  const history = useHistory();
  const user = useUser();
  const roomId = useRoomId();
  useEffect(() => {
    if (!user.isValid() && roomId) {
      history.push(
        Routes.home.createPath({}, { query: { fromRoomId: roomId } })
      );
    }
  }, [user, history, roomId]);
}
