import { v4 as uuid } from "uuid";
import { useCallback } from "react";
import { PubSubChannel } from "../../lib/pubsub/PubSub";

export type PopupGraphicMessageContent = {
  message: string;
  timestamp: number;
  timeout: number;
  id: string;
};

export const popupGraphicMessages =
  new PubSubChannel<PopupGraphicMessageContent>();

(window as any).popup = (message: string, timeout: number = 10000) => {
  const id = uuid();
  const timestamp = new Date().getTime();
  popupGraphicMessages.publish({
    id,
    timestamp,
    message,
    timeout,
  });
};

export function usePopupGraphicMessage() {
  return useCallback((message: string, options: { timeout?: number } = {}) => {
    const id = uuid();
    const timestamp = new Date().getTime();

    popupGraphicMessages.publish({
      id,
      timestamp,
      message,
      timeout: options.timeout ?? 1100,
    });
  }, []);
}
