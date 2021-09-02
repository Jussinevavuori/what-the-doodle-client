import { useCallback, useMemo } from "react";
import { useRoomSocketContext } from "../../contexts/RoomSocketContext";
import { useUser } from "../../hooks/auth/useUser";
import { usePopupGraphicMessage } from "../../hooks/utils/usePopupGraphicMessage";
import { useStoreState } from "../../store";
import { FinalDrawingPickerProps } from "./FinalDrawingPicker";

export function useFinalDrawingPickerController(
  props: FinalDrawingPickerProps
) {
  const user = useUser();
  const socket = useRoomSocketContext();
  const displayPopup = usePopupGraphicMessage();
  const rounds = useStoreState((_) => _.game.rounds);
  const nRounds = useStoreState((_) => _.game.nRounds);
  const players = useStoreState((_) => _.game.players);
  const finalGuesses = useStoreState((_) => _.game.finalGuesses);

  // List all last rounds
  const lastRounds = useMemo(
    () => rounds.filter((_) => _.roundNumber === nRounds - 1),
    [rounds, nRounds]
  );

  // Get correct topic to display
  const correctTopic = useMemo(() => {
    return (
      rounds.find((_) => _.roundNumber === 0 && _.drawerId === user.id)
        ?.topic ?? ""
    );
  }, [rounds, user]);

  // Get user who has selected this canvas
  const getGuesser = useCallback(
    (round: GameRound) => {
      const id = finalGuesses[round.cardId];
      return players.find((_) => _.id === id);
    },
    [finalGuesses, players]
  );

  // Disabled when user has guessed
  const isDisabled = useMemo(() => {
    return Object.values(finalGuesses).includes(user.id);
  }, [finalGuesses, user]);

  // Get ID of correct card
  const correctCardId = useMemo(() => {
    return rounds.find((round) => {
      return round.roundNumber === 0 && round.drawerId === user.id;
    })?.cardId;
  }, [rounds, user]);

  // Handle guess
  const getOnPick = useCallback(
    (round: GameRound) => {
      // If guesser already exists or user
      // has already guessed, return empty function
      if (getGuesser(round) || isDisabled) {
        return () => {};
      }

      return () => {
        socket?.finalChoice({ uid: user.id, cardId: round.cardId });

        if (round.cardId === correctCardId) {
          displayPopup("Correct!");
        } else {
          displayPopup("Wrong...");
        }
      };
    },
    [socket, user, correctCardId, displayPopup, isDisabled, getGuesser]
  );

  return {
    isDisabled,
    correctTopic,
    lastRounds,
    getGuesser,
    getOnPick,
  };
}
