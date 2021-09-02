import { useEffect, useMemo } from "react";
import { useStoreState } from "../../store";
import { CardReviewProps } from "./CardReview";

export function useCardReviewController(props: CardReviewProps) {
  const card = props.card;

  const rounds = useStoreState((_) => _.game.rounds);
  const nRounds = useStoreState((_) => _.game.nRounds);
  const players = useStoreState((_) => _.game.players);
  const finalGuesses = useStoreState((_) => _.game.finalGuesses);

  const cardRounds = useMemo(() => {
    return rounds
      .filter((_) => _.cardId === card.id)
      .sort((a, b) => a.roundNumber - b.roundNumber)
      .map((round) => {
        const drawer = players.find((_) => _.id === round.drawerId);
        const guesser = players.find((_) => _.id === round.guesserId);
        const picker =
          round.roundNumber === nRounds - 1
            ? players.find((_) => _.id === finalGuesses[round.cardId])
            : undefined;

        return {
          drawer,
          guesser,
          round,
          picker,
        };
      });
  }, [card, rounds, players, nRounds, finalGuesses]);

  const onClose = props.onClose;
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", listener);
    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [onClose]);

  return {
    cardRounds,
  };
}
