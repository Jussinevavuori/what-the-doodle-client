import "./RoomHeader.scss";
import cx from "classnames";
import LogoSvg from "../../assets/logo.svg"
import { useRoomHeaderController } from "./useRoomHeaderController";
import { Link } from "react-router-dom";
import { Button, Icon, IconButton } from "@material-ui/core";
import { Type } from "../Type/Type";

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
							return <Type color="white">
								{"Lobby"}
							</Type>;
						}
						case "choose": {
							return <Type color="white">
								{"Choosing topics"}
							</Type>;
						}
						case "draw": {
							const round = `${controller.currentRound} / ${controller.nRounds}`
							return <Type color="white">
								{`Drawing round ${round}`}
							</Type>
						}
						case "guess": {
							const round = `${controller.currentRound} / ${controller.nRounds}`
							return <Type color="white">
								{`Guessing round ${round}`}
							</Type>;
						}
						case "final": {
							return <Type color="white">
								{`Find `}
								<Type component="span" color="white" variant="bold">
									{controller.originalTopic}
								</Type>
							</Type>;
						}
						case "finish": {
							return <Button
								onClick={controller.onReset}
								color="primary"
								variant="text"
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
					<Icon children="home" />
				</IconButton>
			</Link>
		</div>
	</nav>
}