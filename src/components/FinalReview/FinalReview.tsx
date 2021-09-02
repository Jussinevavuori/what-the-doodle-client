import "./FinalReview.scss";
import React from "react";
import cx from "classnames";
import { useFinalReviewController } from "./useFinalReviewController";
import { MiniCanvas } from "../MiniCanvas/MiniCanvas";
import { CardReview } from "../CardReview/CardReview";

export type FinalReviewProps = {

};

export function FinalReview(props: FinalReviewProps) {

	const controller = useFinalReviewController(props)

	return <div
		className={cx("FinalReview")}
		style={controller.reviewingCard ? { overflowY: "hidden", maxHeight: "100vh" } : {}}
	>
		{
			controller.reviewingCard &&
			<CardReview
				card={controller.reviewingCard}
				onClose={controller.onClose}
			/>
		}
		<ul>
			{
				controller.lastRounds.map(round => (
					<li key={round.id}>
						<MiniCanvas
							round={round}
							onClick={controller.getOnClick(round)}
							clickLabel={"View card"}
						/>
					</li>
				))
			}
		</ul>
	</div>

}