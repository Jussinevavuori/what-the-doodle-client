import "./DrawingCountdown.scss";
import React from "react";
import cx from "classnames";
import { useDrawingCountdownController } from "./useDrawingCountdownController";
import { CountdownTimer } from "../CountdownTimer/CountdownTimer";

export type DrawingCountdownProps = {

};

export function DrawingCountdown(props: DrawingCountdownProps) {

	const controller = useDrawingCountdownController(props)

	return <div className={cx("DrawingCountdown")}>
		<CountdownTimer
			size={42}
			timeLeft={controller.drawingTimeLeft * 1000}
			totalTime={controller.drawingTime * 1000}
		/>
	</div>

}