import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useHistory } from "react-router";
import { RoomSocket } from "../../lib/sockets/RoomSocket";

export function useSocketErrors() {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  useEffect(() => {
    return RoomSocket.errors.subscribe((error) => {
      console.log(error);

      if (error.redirectPath) {
        history.push(error.redirectPath);
      }

      enqueueSnackbar(error.message, {
        variant: "error",
      });
    });
  }, [enqueueSnackbar, history]);
}
