import "./GuessingCanvas.scss";
import cx from "classnames";
import { useGuessingCanvasController } from "./useGuessingCanvasController";
import { Button, TextField } from "@material-ui/core";
import { Type } from "../Type/Type";

export type GuessingCanvasProps = {

};

export function GuessingCanvas(props: GuessingCanvasProps) {

	const controller = useGuessingCanvasController(props)

	return <div className={cx("GuessingCanvas")}>
		<header>
			{
				controller.currentRound?.guess
					? <Type
						className="topic"
						color="white"
						size="lg"
					>
						{controller.currentRound?.guess}
					</Type>
					: <form onSubmit={controller.handleSubmit}>
						<TextField
							autoFocus
							className="input"
							placeholder="Type your guess here"
							variant="outlined"
							fullWidth
							value={controller.guess}
							onChange={e => controller.setGuess(e.target.value)}
						/>
						<Button
							className="submit"
							variant="outlined"
							type="submit"
							disabled={!controller.guess.trim()}
						>
							{"Guess"}
						</Button>
					</form>
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