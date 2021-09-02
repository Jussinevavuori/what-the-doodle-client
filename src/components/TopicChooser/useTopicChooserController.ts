import { useCallback, useState } from "react";
import { useRoomSocketContext } from "../../contexts/RoomSocketContext";
import { useStoreState } from "../../store";
import { TopicChooserProps } from "./TopicChooser";

export function useTopicChooserController(props: TopicChooserProps) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const userId = useStoreState((_) => _.game.user).id;
  const currentCard = useStoreState((_) => _.game.currentCard);

  const socket = useRoomSocketContext();

  const handleSubmit = useCallback(
    (topic: string) => {
      socket?.initialChoice({ uid: userId, topic });
      setSubmitted(true);
    },
    [socket, setSubmitted, userId]
  );

  const onSubmitInput = useCallback(() => {
    if (!input.trim()) return;
    handleSubmit(input);
  }, [input, handleSubmit]);

  const onSelectOption = useCallback(
    (option: string) => {
      return () => handleSubmit(option);
    },
    [handleSubmit]
  );

  return {
    chosenTopic: currentCard?.topic,
    submitted,
    onSubmitInput,
    onSelectOption,
    input,
    setInput,
    options: currentCard?.topicOptions ?? [],
  };
}
