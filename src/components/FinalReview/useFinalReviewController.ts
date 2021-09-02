import { useCallback, useMemo, useState } from "react";
import { useStoreState } from "../../store";
import { FinalReviewProps } from "./FinalReview";

export function useFinalReviewController(props: FinalReviewProps) {
  const [reviewingCard, setReviewingCard] = useState<GameCard | undefined>();

  const cards = useStoreState((_) => _.game.cards);
  const rounds = useStoreState((_) => _.game.rounds);
  const nRounds = useStoreState((_) => _.game.nRounds);

  const lastRounds = useMemo(
    () => rounds.filter((_) => _.roundNumber === nRounds - 1),
    [rounds, nRounds]
  );

  const onClose = useCallback(() => {
    setReviewingCard(undefined);
  }, [setReviewingCard]);

  const getOnClick = useCallback(
    (round: GameRound) => {
      return () => {
        const card = cards.find((_) => _.id === round.cardId);
        setReviewingCard(card);
      };
    },
    [cards, setReviewingCard]
  );

  return { reviewingCard, lastRounds, getOnClick, onClose };
}
