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

			<main>
				{
					(() => {
						switch (controller.gameStatus) {

							case "idle":
								return <>
									<Lobby />
								</>

							case "choose":
								return <>
									<TopicChooser />
								</>

							case "draw":
								return <>
									<div className="draw">
										<div className="brushSelector">
											<BrushSelector />
										</div>
										<div className="canvas">
											<DrawingCanvas />
										</div>
									</div>
								</>

							case "guess":
								return <>
									<div className="guess">
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