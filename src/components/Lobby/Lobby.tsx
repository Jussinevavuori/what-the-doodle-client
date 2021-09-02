import "./Lobby.scss";
import React from "react"
import { useLobbyController } from "./useLobbyController"
import { Icon, IconButton } from "@material-ui/core";
import { Add as AddIcon, Remove as RemoveIcon } from "@material-ui/icons";
import { Container } from "../Container/Container";

export type LobbyProps = {

}

export function Lobby(props: LobbyProps) {

	const controller = useLobbyController(props)

	return <div className="Lobby">
		<Container className="main">
			<p className="players">
				<span>
					{`Players`}
				</span>
				<span>
					{`${controller.players.length} / ${controller.maxPlayers}`}
				</span>
			</p>

			<ul>
				{
					controller.players.sort((a, b) => a.id.localeCompare(b.id)).map(p => (
						<li key={p.id}>
							<span className="avatar">
								<img alt="Avatar" src={p.avatarUrl} />
							</span>
							<span>{p.name}</span>
						</li>
					))
				}
			</ul>

			<button className="start" onClick={controller.handleGameStart}>
				Start game
			</button>

			<div className="invite">
				<p>Invite players</p>
				<label>
					Copy the room ID
				</label>
				<div className="copyValue">
					<input
						id="Lobby--room-id-input"
						value={controller.roomId}
						disabled
					/>
					<IconButton
						onClick={controller.copy("Lobby--room-id-input")}
					>
						<Icon children="content_copy" />
					</IconButton>
				</div>
				<label>
					Copy the room invite URL
				</label>
				<div className="copyValue">
					<input
						disabled
						id="Lobby--room-url-input"
						value={controller.roomUrl}
					/>
					<IconButton
						onClick={controller.copy("Lobby--room-url-input")}
					>
						<Icon children="content_copy" />
					</IconButton>
				</div>
			</div>

			<div className="settings">
				<div className="drawingTime">
					<label>
						Drawing time
					</label>
					<div className="control">
						<IconButton
							size="small"
							onClick={controller.adjustDrawingTime(-5)}
						>
							<RemoveIcon />
						</IconButton>
						<span>
							{controller.drawingTime} seconds
						</span>
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