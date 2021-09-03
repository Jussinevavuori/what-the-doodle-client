import "./Home.scss";
import cx from "classnames"
import LogoSvg from "../../assets/logo.svg"
import { Button, Icon, IconButton, Tooltip } from "@material-ui/core";
import { Casino as RandomIcon } from "@material-ui/icons";
import { useHomeController } from "./useHomeController"
import { AnimatedBackground } from "../AnimatedBackground/AnimatedBackground";
import { Container } from "../Container/Container";
import { Type } from "../Type/Type";

export type HomeProps = {

}

export function Home(props: HomeProps) {

	const controller = useHomeController(props)

	return <>
		<AnimatedBackground />

		<div className="Home">

			<div className="logo">
				<img src={LogoSvg} alt="Logo" />
			</div>
			<main>

				<Container className="playerForm">
					<Type>
						{"Who are you?"}
					</Type>

					<div className="avatar">
						<div className="avatarActions">
							<Tooltip title="Male">
								<IconButton
									className={cx("gender", "male", {
										selected: controller.avatar.startsWith("male")
									})}
									onClick={controller.onChangeAvatarGender("male")}
								>
									<Icon children="male" />
								</IconButton>
							</Tooltip>
							<Tooltip title="Female">
								<IconButton
									className={cx("gender", "female", {
										selected: controller.avatar.startsWith("female")
									})}
									onClick={controller.onChangeAvatarGender("female")}
								>
									<Icon children="female" />
								</IconButton>
							</Tooltip>
							<Tooltip title="Randomize avatar">
								<IconButton
									className="randomize"
									key={controller.avatar}
									onClick={controller.onRandomizeAvatar}
								>
									<RandomIcon />
								</IconButton>
							</Tooltip>
						</div>
						<img alt="Avatar" src={controller.avatarUrl} />
					</div>


					<div className="inputContainer">
						<Type component="label">Player name</Type>
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

						<Button
							className="join"
							type="submit"
							variant="outlined"
						>
							Play
						</Button>
					</form>
				</Container>
			</main>
		</div>
	</>
}