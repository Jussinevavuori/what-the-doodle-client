import "./CountdownTimer.scss";
import cx from "classnames";
import { useCountdownTimerController } from "./useCountdownTimerController";
import { PercentageCircle, PercentageCircleProps } from "../PercentageCircle/PercentageCircle";

export type CountdownTimerProps = {
	/**
	 * Amount of time left in ms (should be between 0 and totalTime)
	 */
	timeLeft: number;

	/**
	 * Total time in ms (should be greater than zero)
	 */
	totalTime: number;
} & Omit<PercentageCircleProps, "percentage">;

export function CountdownTimer(props: CountdownTimerProps) {

	const controller = useCountdownTimerController(props)

	return <PercentageCircle
		id={controller.id}
		className={cx("CountdownTimer")}
		percentage={controller.percentage}
		filledColor={controller.filledColor}
		unfilledColor={controller.unfilledColor}
		label={`${Math.floor(controller.msLeft / 1000)}`}
		{...props}
	/>

}