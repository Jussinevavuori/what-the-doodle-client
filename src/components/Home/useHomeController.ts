import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useUser } from "../../hooks/auth/useUser";
import { generateRoomName } from "../../lib/functions/generateRoomName";
import { getRandomString } from "../../lib/functions/getRandomString";
import { Routes } from "../../routes";
import { useStoreActions } from "../../store";
import { HomeProps } from "./Home";
import { useSnackbar } from "notistack";
import { readQueryParam } from "../../lib/url/readQueryParam";
import { focusElement } from "../../lib/dom/focusElement";

export function useHomeController(props: HomeProps) {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const user = useUser();
  const setUserName = useStoreActions((_) => _.game.setUserName);
  const setAvatar = useStoreActions((_) => _.game.setUserAvatar);
  const resetGameState = useStoreActions((_) => _.game.resetState);

  // Reset game state when returning home
  useEffect(() => {
    resetGameState();
  }, [resetGameState]);

  // Input states
  const [roomIdInput, setRoomIdInput] = useState(
    () => readQueryParam("fromRoomId") ?? ""
  );

  // If inputting room input which is an URL (we decide it is an URL if it
  // contains "/r/" we only parse the last path segment if one exists)
  useEffect(() => {
    if (roomIdInput.includes("/r/")) {
      const parts = roomIdInput.split("/");
      const last = parts[parts.length - 1];
      if (last) {
        setRoomIdInput(last);
      }
    }
  }, [roomIdInput, setRoomIdInput]);

  const onChangeAvatarGender = useCallback(
    (target: "male" | "female") => {
      return () => {
        const [, seed] = user.avatar.split("/");
        setAvatar(`${target}/${seed}`);
      };
    },
    [user, setAvatar]
  );

  const onRandomizeAvatar = useCallback(() => {
    const [gender] = user.avatar.split("/");
    setAvatar(`${gender}/${getRandomString(16)}`);
  }, [user, setAvatar]);

  // Redirect to room when submitted
  const handleSubmit = useCallback(() => {
    // No room ID given
    if (!roomIdInput.trim()) {
      enqueueSnackbar("Enter a room name", {
        variant: "info",
      });
      return;
    }

    // No name given (auto-focus name input)
    if (!user.name.trim()) {
      enqueueSnackbar("Enter a name", {
        variant: "info",
      });
      focusElement({ query: "#Home--user-name-input" });
      return;
    }

    // Go to room
    history.push(Routes.room.createPath({ roomId: roomIdInput.trim() }));
  }, [roomIdInput, enqueueSnackbar, user, history]);

  const onNewGame = useCallback(() => {
    // No name given
    if (!user.name.trim()) {
      enqueueSnackbar("Enter a name", {
        variant: "info",
      });
      focusElement({ query: "#Home--user-name-input" });
      return;
    }

    const roomId = generateRoomName();
    history.push(Routes.room.createPath({ roomId }));
  }, [enqueueSnackbar, user, history]);

  return {
    player: user,
    avatar: user.avatar,
    onChangeAvatarGender,
    onRandomizeAvatar,
    onNewGame,
    roomId: roomIdInput,
    setRoomId: setRoomIdInput,
    name: user.name,
    setName: setUserName,
    handleSubmit,
  };
}
