import "./RoomHeader.scss";
import cx from "classnames";
import LogoSvg from "../../assets/logo.svg"
import { useRoomHeaderController } from "./useRoomHeaderController";
import { Link } from "react-router-dom";
import { Button, Icon, IconButton } from "@material-ui/core";
import { Type } from "../Type/Type";
import { CountdownTimer } from "../CountdownTimer/CountdownTimer";

export type RoomHeaderProps = {

};

export function RoomHeader(props: RoomHeaderProps) {

	const controller = useRoomHeaderController(props)

	return <nav className={cx("RoomHeader")}>

		<div className="status">
			{
				(() => {
					switch (controller.gameStatus) {
						case "idle": {
							return <Type>
								{"Lobby"}
							</Type>;
						}
						case "choose": {
							return <Type>
								{"Choosing topics"}
							</Type>;
						}
						case "draw": {
							const round = `${controller.currentRound} / ${controller.nRounds}`
							return <>
								<Type>
									{`Drawing round ${round}`}
								</Type>
								<div className="countdown">
									<CountdownTimer
										size={42}
										timeLeft={controller.drawingTimeLeft * 1000}
										totalTime={controller.drawingTime * 1000}
									/>
								</div>
							</>
						}
						case "guess": {
							const round = `${controller.currentRound} / ${controller.nRounds}`
							return <Type>
								{`Guessing round ${round}`}
							</Type>;
						}
						case "final": {
							return <Type>
								{`Finding own`}
							</Type>;
						}
						case "finish": {
							return <Button
								onClick={controller.onReset}
								color="primary"
								variant="contained"
							>
								{"Play again"}
							</Button>
						}
					}
				})()
			}
		</div>

		<div className="center">
			<img src={LogoSvg} alt="Logo" />

		</div>

		<div className="controls">
			<Link to="/">
				<IconButton size="small">
					<Icon children="logout" />
				</IconButton>
			</Link>
		</div>
	</nav>
}