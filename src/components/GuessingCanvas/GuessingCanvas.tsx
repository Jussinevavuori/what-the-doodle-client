import "./GuessingCanvas.scss";
import React from "react";
import cx from "classnames";
import { useGuessingCanvasController } from "./useGuessingCanvasController";
import { Done as DoneIcon } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

export type GuessingCanvasProps = {

};

export function GuessingCanvas(props: GuessingCanvasProps) {

	const controller = useGuessingCanvasController(props)

	return <div className={cx("GuessingCanvas")}>
		<header>
			{
				controller.currentRound?.guess
					? <>
						<textarea
							value={controller.currentRound?.guess}
							disabled
						/>
					</>
					: <>
						<textarea
							placeholder="Type your guess here"
							rows={2}
							value={controller.guess}
							onChange={e => controller.setGuess(e.target.value)}
						/>
						<IconButton
							disabled={!controller.guess.trim()}
							onClick={controller.handleSubmit}
						>
							<DoneIcon />
						</IconButton>
					</>
			}
		</header>
		<canvas
			style={{ aspectRatio: `${controller.width}/${controller.height}` }}
			width={controller.width}
			height={controller.height}
			ref={controller.canvasRef}
		/>
	</div>

}