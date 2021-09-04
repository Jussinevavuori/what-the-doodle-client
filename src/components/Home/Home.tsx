import "./Home.scss";
import cx from "classnames"
import LogoSvg from "../../assets/logo.svg"
import { Button, Icon, IconButton, TextField, Tooltip } from "@material-ui/core";
import { Casino as RandomIcon } from "@material-ui/icons";
import { useHomeController } from "./useHomeController"
import { AnimatedBackground } from "../AnimatedBackground/AnimatedBackground";
import { Container } from "../Container/Container";
import { Type } from "../Type/Type";
import { PlayerAvatar } from "../PlayerAvatar/PlayerAvatar";

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

				<Container className="formContainer playerForm">
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

						<PlayerAvatar
							player={controller.player}
							size={100}
							hideNametag
						/>
					</div>

					<TextField
						size="small"
						label="Your name"
						variant="outlined"
						fullWidth
						id="Home--user-name-input"
						value={controller.name}
						onChange={e => controller.setName(e.target.value.substring(0, 16))}
					/>
				</Container>

				<Container className="formContainer roomForm">
					<Button
						color="primary"
						onClick={controller.onNewGame}
						variant={!controller.roomId.trim() ? "contained" : "outlined"}
						fullWidth
					>
						{"Create new game"}
					</Button>

					<Type color="gray-600" size="sm" className="separator">
						{"Or join an existing game"}
					</Type>

					<form onSubmit={e => { e.preventDefault(); controller.handleSubmit() }}>

						<TextField
							size="small"
							label="Room name"
							variant="outlined"
							fullWidth
							value={controller.roomId}
							onChange={e => controller.setRoomId(e.target.value)}
						/>

						<Button
							type="submit"
							variant={controller.roomId.trim() ? "contained" : "outlined"}
							color="primary"
							fullWidth
						>
							{"Play"}
						</Button>
					</form>
				</Container>
			</main>

			<footer>
				<div className="credits">
					<a
						href="https://www.jussinevavuori.com/"
						target="_blank"
						rel="noreferrer noopener"
					>
						<Type component="span" color="gray-700" size="sm">
							{"© Jussi Nevavuori 2021"}
						</Type>
					</a>
					<a
						href="https://github.com/Jussinevavuori/what-the-doodle-client"
						target="_blank"
						rel="noreferrer noopener"
					>
						<Type component="span" color="gray-700" size="sm">
							{"GitHub"}
						</Type>
					</a>
				</div>
			</footer>
		</div>
	</>
}