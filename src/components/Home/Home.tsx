import "./Home.scss";
import cx from "classnames"
import { Icon, IconButton } from "@material-ui/core";
import { Casino as RandomIcon } from "@material-ui/icons";
import { useHomeController } from "./useHomeController"
import { AnimatedBackground } from "../AnimatedBackground/AnimatedBackground";
import { Container } from "../Container/Container";

export type HomeProps = {

}

export function Home(props: HomeProps) {

	const controller = useHomeController(props)

	return <>
		<AnimatedBackground />

		<div className="Home">
			<main>

				<Container className="playerForm">
					<p>Who are you?</p>

					<div className="avatar">
						<div className="avatarActions">
							<IconButton
								className={cx("gender", "male", {
									selected: controller.avatar.startsWith("male")
								})}
								onClick={controller.onChangeAvatarGender("male")}
							>
								<Icon children="male" />
							</IconButton>
							<IconButton
								className={cx("gender", "female", {
									selected: controller.avatar.startsWith("female")
								})}
								onClick={controller.onChangeAvatarGender("female")}
							>
								<Icon children="female" />
							</IconButton>
							<IconButton
								className="randomize"
								key={controller.avatar}
								onClick={controller.onRandomizeAvatar}
							>
								<RandomIcon />
							</IconButton>
						</div>
						<img alt="Avatar" src={controller.avatarUrl} />
					</div>


					<div className="inputContainer">
						<label>Player name</label>
						<input
							value={controller.name}
							onChange={e => controller.setName(e.target.value.substring(0, 16))}
						/>
					</div>
				</Container>

				<Container className="roomForm">
					<button
						className="newGame"
						onClick={controller.onNewGame}
					>
						{"Create new game"}
					</button>

					<div className="separator">
						Or join an existing game
					</div>

					<form onSubmit={e => { e.preventDefault(); controller.handleSubmit() }}>
						<div className="inputContainer">
							<input
								placeholder="Room name"
								value={controller.roomId}
								onChange={e => controller.setRoomId(e.target.value)}
							/>
						</div>

						<button className="join" type="submit">
							Play
						</button>
					</form>
				</Container>
			</main>
		</div>
	</>
}