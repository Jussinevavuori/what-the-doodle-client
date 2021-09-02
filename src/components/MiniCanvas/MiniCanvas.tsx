import "./MiniCanvas.scss";
import React from "react";
import cx from "classnames";
import { useMiniCanvasController } from "./useMiniCanvasController";

export type MiniCanvasProps = {
	round: GameRound;

	hideTitle?: boolean;
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
			<textarea
				value={props.hideTitle ? "???" : props.round.title}
				disabled
			/>
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
				<div className="guesser">
					<span>{controller.guesser.name}</span>
					<img src={controller.guesser.avatarUrl} alt="Avatar" />
				</div>
				<div className="guesserOverlay" />
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