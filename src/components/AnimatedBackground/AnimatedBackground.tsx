import "./AnimatedBackground.scss";
import React from "react";
import cx from "classnames";
import { useAnimatedBackgroundController } from "./useAnimatedBackgroundController";

export type AnimatedBackgroundProps = {

};

export function AnimatedBackground(props: AnimatedBackgroundProps) {

	const controller = useAnimatedBackgroundController(props)

	return <canvas
		className={cx("AnimatedBackground")}
		ref={controller.canvasRef}
	/>

}