import { useEffect, useMemo, useState } from "react";
import { Color } from "../../lib/drawing/Color";
import { clamp } from "../../lib/functions/clamp";
import { CountdownTimerProps } from "./CountdownTimer";
import { v4 as uuid } from "uuid";
import { Angle } from "../../lib/geometry/Angle";
import { PercentageCircleDefaultSize } from "../PercentageCircle/usePercentageCircleController";
import { SvgPath } from "../../lib/svg/SvgPath";

export function useCountdownTimerController(props: CountdownTimerProps) {
  const [percentage, setPercentage] = useState(0);
  const [msLeft, setMsLeft] = useState(0);

  // Generate a unique ID to use for this component. This is used to access
  // the svg path elements with the document.querySelector function. (This is
  // a non-react way of doing this, however as the solution for fluid animation
  // is a sort-of dumb spaghetti solution anyways, I'm gonna let it slide. The
  // proper way to do this would include either using refs and ref props or
  // completely revamping the idea and using an animation library if that is
  // even possible.)
  const id = useMemo(() => `CountdownTimer--${uuid()}`, []);

  const { timeLeft, totalTime, size } = props;
  useEffect(() => {
    // Total ms
    const totalMs = clamp(totalTime, 1, Infinity);

    // Keep track of how many ms is currently left. Start at `timeLeft`
    // when component is rendered
    let currentMsLeft = clamp(timeLeft, 0, totalMs);

    // Update percentage text and percentage every second in order to
    // keep text and percentage in sync and updating even if the component
    // is not updated. The currentMsLeft variable is incremented by the
    // quickInterval interval and should not be incremented here.
    const secondInterval = setInterval(() => {
      const _percentage = (100 * currentMsLeft) / totalMs;
      setPercentage(_percentage);
      setMsLeft(currentMsLeft);
    }, 1000);

    // Manually update PercentageCircle's active path every 50 ms to create
    // appearance of a fluid, decreasing countdown instead of a jerky one.
    // Also avoids re-renders this way
    const quickInterval = setInterval(() => {
      currentMsLeft -= 50;
      const _percentage = (100 * currentMsLeft) / totalMs;
      const path = document.querySelector(`#${id} path.active`);
      if (path) {
        path.setAttribute(
          "d",
          SvgPath.describePartialCirclePath({
            radius:
              0.5 * (Math.max(0, size ?? 0) || PercentageCircleDefaultSize),
            offsetAngle: new Angle(0, "percentages"),
            sweepAngle: new Angle(_percentage, "percentages"),
            strokeWidth: 4,
          })
        );
      }
    }, 50);

    return () => {
      clearInterval(secondInterval);
      clearInterval(quickInterval);
    };
  }, [timeLeft, totalTime, setPercentage, setMsLeft, id, size]);

  // Lerp filled color from green 600 to red 600 as percentage decreases
  const filledColor = useMemo(() => {
    return Color.lerpHsla(
      Color.fromHexString("#129a7c"), // Green 600
      Color.fromHexString("#d22d58"), // Red 600
      1 - percentage / 100
    );
  }, [percentage]);

  // Lerp unfilled color from green 600 to red 600 as percentage decreases
  const unfilledColor = useMemo(() => {
    return Color.lerpHsla(
      Color.fromHexString("#7fe5b6"), // Green 300
      Color.fromHexString("#f79b96"), // Red 300
      1 - percentage / 100
    );
  }, [percentage]);

  return {
    percentage,
    msLeft,
    filledColor,
    unfilledColor,
    id,
  };
}
