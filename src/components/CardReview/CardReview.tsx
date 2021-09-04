import "./CardReview.scss";
import React from "react";
import cx from "classnames";
import { useCardReviewController } from "./useCardReviewController";
import { MiniCanvas } from "../MiniCanvas/MiniCanvas";
import { Container } from "../Container/Container";
import { Close } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { Type } from "../Type/Type";
import { PlayerAvatar } from "../PlayerAvatar/PlayerAvatar";

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
				controller.cardRounds.map(round => (
					<li key={round.round.id}>

						<div className="drawer">
							{
								round.drawer &&
								<Container className="content">
									<PlayerAvatar
										player={round.drawer}
										hideNametag
										size={48}
									/>
									<div>
										<Type align="left">
											{`${round.drawer.name} drew:`}
										</Type>
										<Type align="left" variant="bold">
											{round.round.topic}
										</Type>
									</div>
								</Container>
							}
						</div>

						<div className="guesser">
							{
								round.picker
									? <Container className="content">
										<PlayerAvatar
											player={round.picker}
											hideNametag
											size={48}
										/>
										<div>
											<Type align="left">
												{`${round.picker.name} picked this`}
											</Type>
										</div>
									</Container>
									: round.guesser
										? <Container className="content">
											<PlayerAvatar
												player={round.guesser}
												hideNametag
												size={48}
											/>
											<div>
												<Type align="left">
													{`${round.guesser.name} guessed:`}
												</Type>
												<Type variant="bold" align="left">
													{round.round.guess}
												</Type>
											</div>
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

					</li >
				))
			}
		</ul >

	</div >

}