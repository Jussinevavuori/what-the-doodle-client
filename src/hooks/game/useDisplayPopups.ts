import { useCallback } from "react";
import { usePopupGraphicMessage } from "../utils/usePopupGraphicMessage";
import { useOnStatusChange } from "./useOnStatusChange";

export function useDisplayPopups() {
  const displayPopup = usePopupGraphicMessage();

  const onStatusChange = useCallback(
    (newStatus: GameStatus) => {
      switch (newStatus) {
        case "guess":
          displayPopup("Time to guess!");
          break;
        case "draw":
          displayPopup("Start drawing!");
          break;
        case "final":
          displayPopup("Find your own!");
          break;
        default:
          break;
      }
    },
    [displayPopup]
  );

  useOnStatusChange(onStatusChange);
}
