import "./CardReview.scss";
import React from "react";
import cx from "classnames";
import { useCardReviewController } from "./useCardReviewController";
import { MiniCanvas } from "../MiniCanvas/MiniCanvas";
import { Container } from "../Container/Container";
import { Close } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

export type CardReviewProps = {
	card: GameCard;
	onClose(): void;
};

export function CardReview(props: CardReviewProps) {

	const controller = useCardReviewController(props)

	return <div className={cx("CardReview")}>

		<IconButton className="close" onClick={props.onClose}>
			<Close />
		</IconButton>

		<ul>
			{
				controller.cardRounds.map(round => <li key={round.round.id}>

					<div className="drawer">
						{
							round.drawer && <>
								<Container className="content">
									<img src={round.drawer?.avatarUrl} alt="Avatar" />
									<p>
										<span className="name">{round.drawer.name}</span>
										<span className="verb">{" drew:"}</span>
										<span className="title">{round.round.topic}</span>
									</p>
								</Container>
							</>
						}
					</div>

					<div className="guesser">
						{
							round.picker
								? <Container className="content">
									<img src={round.picker.avatarUrl} alt="Avatar" />
									<p>
										<span className="name">{round.picker.name}</span>
										<span className="verb">{` picked this.`}</span>
									</p>
								</Container>
								: round.guesser
									? <Container className="content">
										<img src={round.guesser.avatarUrl} alt="Avatar" />
										<p>
											<span className="name">{round.guesser.name}</span>
											<span className="verb">{` guessed `}</span>
											<span className="title">{round.round.guess}</span>
										</p>
									</Container>
									: null
						}
					</div>

					<div className="card">
						<MiniCanvas
							hideGuesser
							round={round.round}
						/>
					</div>

				</li>)
			}
		</ul>

	</div>

}