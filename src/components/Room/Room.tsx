import "./Room.scss";
import { useRoomController } from "./useRoomController"
import { BrushSelector } from "../BrushSelector/BrushSelector";
import { DrawingCanvas } from "../DrawingCanvas/DrawingCanvas";
import { Lobby } from "../Lobby/Lobby";
import { RoomHeader } from "../RoomHeader/RoomHeader";
import { GuessingCanvas } from "../GuessingCanvas/GuessingCanvas";
import { RoomHooksRoot } from "../RoomHooksRoot/RoomHooksRoot";
import { PlayerBottomList } from "../PlayerBottomList/PlayerBottomList";
import { AnimatedBackground } from "../AnimatedBackground/AnimatedBackground";
import { FinalDrawingPicker } from "../FinalDrawingPicker/FinalDrawingPicker";
import { FinalReview } from "../FinalReview/FinalReview";
import { TopicChooser } from "../TopicChooser/TopicChooser";
import { DrawingCountdown } from "../DrawingCountdown/DrawingCountdown";

export type RoomProps = {

}

export function Room(props: RoomProps) {
	const controller = useRoomController(props)

	return <>
		<RoomHooksRoot />
		<AnimatedBackground />
		<div className="Room">

			<nav>
				<RoomHeader />
			</nav>

			<div className="playerList">
				<PlayerBottomList />
			</div>

			<main className={controller.gameStatus}>
				{
					(() => {
						switch (controller.gameStatus) {

							case "idle":
								return <>
									<Lobby />
								</>

							case "choose":
								return <>
									<div className="overlay">
										<TopicChooser />
									</div>
									<div className="canvasContainer choose">
										<div className="brushSelector">
											<BrushSelector locked />
										</div>
										<div className="canvas">
											<DrawingCanvas />
										</div>
									</div>
								</>

							case "draw":
								return <>
									<div className="canvasContainer draw">
										<div className="brushSelector">
											<BrushSelector />
										</div>
										<div className="canvas">
											<DrawingCanvas />
										</div>
									</div>
									<div className="countdown">
										<DrawingCountdown />
									</div>
								</>

							case "guess":
								return <>
									<div className="canvasContainer guess">
										<div className="brushSelector">
											<BrushSelector locked />
										</div>
										<div className="canvas">
											<GuessingCanvas />
										</div>
									</div>
								</>

							case "final":
								return <>
									<FinalDrawingPicker />
								</>

							case "finish":
								return <>
									<FinalReview />
								</>
						}
					})()
				}
			</main>
		</div>
	</>
}