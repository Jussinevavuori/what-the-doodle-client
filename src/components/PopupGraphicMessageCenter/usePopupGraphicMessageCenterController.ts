import { useEffect, useState } from "react";
import {
  PopupGraphicMessageContent,
  popupGraphicMessages,
} from "../../hooks/utils/usePopupGraphicMessage";
import { PopupGraphicMessageCenterProps } from "./PopupGraphicMessageCenter";

export function usePopupGraphicMessageCenterController(
  props: PopupGraphicMessageCenterProps
) {
  const [messages, setMessages] = useState<PopupGraphicMessageContent[]>([]);

  useEffect(() => {
    let timeout: number;
    const unsubscribe = popupGraphicMessages.subscribe((msg) => {
      setMessages((c) => c.concat(msg));
      timeout = window.setTimeout(() => {
        setMessages((c) => c.filter((_) => _.id !== msg.id));
      }, msg.timeout);
    });
    return () => {
      window.clearTimeout(timeout);
      unsubscribe();
    };
  }, [setMessages]);

  return {
    messages,
  };
}
