import "./FinalDrawingPicker.scss";
import React from "react";
import cx from "classnames";
import { useFinalDrawingPickerController } from "./useFinalDrawingPickerController";
import { MiniCanvas } from "../MiniCanvas/MiniCanvas";
import { Container } from "../Container/Container";
import { Done } from "@material-ui/icons";

export type FinalDrawingPickerProps = {

};

export function FinalDrawingPicker(props: FinalDrawingPickerProps) {

	const controller = useFinalDrawingPickerController(props)

	return <div className={cx("FinalDrawingPicker")}>

		<Container className="reminder">
			<span>
				{`Your drew`}
			</span>
			<h1>
				{controller.correctTopic}
			</h1>
		</Container>

		<ul>
			{
				controller.lastRounds.map(round => (
					<li key={round.id}>
						<MiniCanvas
							round={round}
							hideGuesser
							clickIcon={<Done />}
							clickLabel={"Select this drawing"}
							disableClick={controller.isDisabled || !!controller.getGuesser(round)}
							onClick={controller.getOnPick(round)}
						/>
					</li>
				))
			}
		</ul>

	</div>

}