import { useEffect, useRef } from "react";
import { CanvasAnimationController } from "../../lib/animation/CanvasAnimationController";
import { PopupBackgroundCanvasAnimation } from "../../lib/animation/PopupBackgroundCanvasAnimation";
import { PopupGraphicMessageProps } from "./PopupGraphicMessage";

export function usePopupGraphicMessageController(
  props: PopupGraphicMessageProps
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const controller = new CanvasAnimationController(
        canvasRef.current,
        new PopupBackgroundCanvasAnimation({})
      );
      (window as any).bgcanvas = canvasRef.current;
      return controller.startAnimation();
    }
  }, [canvasRef]);

  return {
    canvasRef,
  };
}
