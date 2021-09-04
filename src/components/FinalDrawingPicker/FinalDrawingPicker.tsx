import "./FinalDrawingPicker.scss";
import cx from "classnames";
import { useFinalDrawingPickerController } from "./useFinalDrawingPickerController";
import { MiniCanvas } from "../MiniCanvas/MiniCanvas";
import { Done } from "@material-ui/icons";

export type FinalDrawingPickerProps = {

};

export function FinalDrawingPicker(props: FinalDrawingPickerProps) {

	const controller = useFinalDrawingPickerController(props)

	return <div className={cx("FinalDrawingPicker")}>
		<ul>
			{
				controller.lastRounds.map(round => (
					<li key={round.id}>
						<MiniCanvas
							round={round}
							hideTopic
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