import { useEffect, useRef } from "react";
import { AngleGradientCanvasAnimation } from "../../lib/animation/AngleGradientCanvasAnimation";
import { CanvasAnimationController } from "../../lib/animation/CanvasAnimationController";
import { AnimatedBackgroundProps } from "./AnimatedBackground";

export function useAnimatedBackgroundController(
  props: AnimatedBackgroundProps
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const controller = new CanvasAnimationController(
        canvasRef.current,
        new AngleGradientCanvasAnimation({
          angle: 0.8,
          angleSpeed: 0.01,
          hueOffset: 60,
          lightness: 85,
          saturation: 80,
          speed: 0.02,
        })
      );
      (window as any).bgcanvas = canvasRef.current;
      return controller.startAnimation();
    }
  }, [canvasRef]);

  return {
    canvasRef,
  };
}
