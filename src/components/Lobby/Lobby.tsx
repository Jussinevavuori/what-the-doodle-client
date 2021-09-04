import "./Lobby.scss";
import { useLobbyController } from "./useLobbyController"
import { Button, Icon, IconButton } from "@material-ui/core";
import { Add as AddIcon, Remove as RemoveIcon } from "@material-ui/icons";
import { Container } from "../Container/Container";
import { Type } from "../Type/Type";
import { PlayerAvatar } from "../PlayerAvatar/PlayerAvatar";

export type LobbyProps = {

}

export function Lobby(props: LobbyProps) {

	const controller = useLobbyController(props)

	return <div className="Lobby">
		<Container className="main">
			<div className="players">
				<Type component="span">
					{`Players`}
				</Type>
				<Type component="span">
					{`${controller.players.length} / ${controller.maxPlayers}`}
				</Type>
			</div>

			<ul>
				{
					controller.players.sort((a, b) => a.id.localeCompare(b.id)).map(p => (
						<li key={p.id}>
							<PlayerAvatar player={p} hideNametag size={48} />
							<Type>{p.name}</Type>
						</li>
					))
				}
			</ul>

			<Button
				variant="contained"
				color="primary"
				onClick={controller.handleGameStart}
				fullWidth
			>
				{"Start game"}
			</Button>

			{
				controller.players.length < 4 &&
				<Type color="yellow-700" size="sm">
					{"A minimum of 4 players is recommended for the game"}
				</Type>
			}

			<div className="invite">
				<Type>
					{"Invite players"}
				</Type>
				<Type className="label" size="sm" color="gray-700">
					{"Copy the room name"}
				</Type>
				<div className="copyValue">
					<input
						id="Lobby--room-id"
						value={controller.roomId}
						disabled
					/>
					<IconButton onClick={controller.copy("Lobby--room-id")}>
						<Icon children="content_copy" />
					</IconButton>
				</div>
				<Type className="label" size="sm" color="gray-700">
					{"Copy the room invite link"}
				</Type>
				<div className="copyValue">
					<input
						disabled
						id="Lobby--room-url"
						value={controller.roomUrl}
					/>
					<IconButton onClick={controller.copy("Lobby--room-url")}>
						<Icon children="content_copy" />
					</IconButton>
				</div>
			</div>

			<div className="settings">
				<div className="drawingTime">
					<Type className="label" size="sm">
						{"Drawing time"}
					</Type>
					<div className="control">
						<IconButton
							size="small"
							onClick={controller.adjustDrawingTime(-5)}
						>
							<RemoveIcon />
						</IconButton>
						<Type component="span">
							{`${controller.drawingTime} seconds`}
						</Type>
						<IconButton
							size="small"
							onClick={controller.adjustDrawingTime(+5)}
						>
							<AddIcon />
						</IconButton>
					</div>
				</div>
			</div>
		</Container>
	</div>
}