import "./RoomHeader.scss";
import React from "react";
import cx from "classnames";
import { useRoomHeaderController } from "./useRoomHeaderController";
import { Link } from "react-router-dom";
import { Icon, IconButton } from "@material-ui/core";

export type RoomHeaderProps = {

};

export function RoomHeader(props: RoomHeaderProps) {

	const controller = useRoomHeaderController(props)

	return <nav className={cx("RoomHeader")}>

		<div className="status">
			{
				(() => {
					switch (controller.gameStatus) {
						case "idle":
							return "Lobby";
						case "choose":
							return "Choosing topics";
						case "draw":
							const timeLeft = `${controller.drawingTimeLeft} / ${controller.drawingTime}`
							return `Drawing - Time left ${timeLeft}`
						case "final":
							return `Finding own`;
						case "finish":
							return "Finished";
						case "guess":
							return "Guessing";
					}
				})()
			}
		</div>

		<div className="center">
			{
				(controller.gameStatus === "draw" || controller.gameStatus === "guess") &&
				<span>
					{`Round ${controller.currentRound} / ${controller.nRounds}`}
				</span>
			}
			{
				controller.gameStatus === "finish" &&
				<button onClick={controller.onReset}>
					Play again
				</button>
			}
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