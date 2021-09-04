import "./MiniCanvas.scss";
import React from "react";
import cx from "classnames";
import { useMiniCanvasController } from "./useMiniCanvasController";
import { Type } from "../Type/Type";
import { PlayerAvatar } from "../PlayerAvatar/PlayerAvatar";

export type MiniCanvasProps = {
	round: GameRound;

	hideTopic?: boolean;
	hideGuesser?: boolean;

	clickLabel?: string;
	clickIcon?: React.ReactNode;
	onClick?(): void;
	disableClick?: boolean;
};

export function MiniCanvas(props: MiniCanvasProps) {

	const controller = useMiniCanvasController(props)

	return <div className={cx("MiniCanvas")}>
		<header>
			<Type
				className="topic"
				color="white"
				size="lg"
			>
				{props.hideTopic ? "???" : props.round.topic}
			</Type>
		</header>
		<canvas
			style={{ aspectRatio: `${controller.width}/${controller.height}` }}
			width={controller.width}
			height={controller.height}
			ref={controller.canvasRef}
		/>
		{
			// Show guesser
			controller.guesser && !props.hideGuesser &&
			<>
				<div className="guesserOverlay" />
				<div className="guesser">
					<PlayerAvatar player={controller.guesser} />
				</div>
			</>
		}
		{
			// Action
			!!props.onClick && !!props.clickLabel && !props.disableClick &&
			<button
				className="select"
				onClick={props.onClick}
			>
				<span>
					{props.clickLabel}
				</span>
				{props.clickIcon}
			</button>
		}
	</div>

}