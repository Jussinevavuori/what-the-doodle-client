import "./TopicChooser.scss";
import React from "react";
import { useTopicChooserController } from "./useTopicChooserController";
import { Type } from "../Type/Type";
import { Container } from "../Container/Container";
import { Button, Icon, TextField } from "@material-ui/core";

export type TopicChooserProps = {

};

export function TopicChooser(props: TopicChooserProps) {

	const controller = useTopicChooserController(props)

	return <Container className="TopicChooser">
		{
			controller.chosenTopic
				? <>
					<div className="waiting">
						<Type>{"Your first drawing topic is:"}</Type>
						<Type size="lg">{controller.chosenTopic}</Type>
						<Type color="gray-600">{"Waiting for other players to choose..."}</Type>
					</div>
				</>
				: <>
					<header>
						<Type variant="bold">
							{"Choose your first topic to draw"}
						</Type>
						<Type color="gray-700" size="sm">
							{"Either choose a random premade topic or cope up with a topic "}
							{"of your own."}
						</Type>
					</header>
					<ul>
						{
							controller.options.map((op, i) => (
								<button
									key={i}
									onClick={controller.onSelectOption(op)}
								>
									<i>
										<Icon className="checked">{"check_circle"}</Icon>
										<Icon className="base">{"radio_button_unchecked"}</Icon>
									</i>
									<Type
										color="white"
										variant="bold"
									>
										{op}
									</Type>
								</button>
							))
						}
					</ul>


					<form
						onSubmit={e => { e.preventDefault(); controller.onSubmitInput(); }}
					>
						<TextField
							variant="filled"
							color="primary"
							label="Custom title"
							fullWidth
							value={controller.input}
							onChange={e => controller.setInput(e.target.value)}
						/>
						<Button
							type="submit"
							color="primary"
							variant="contained"
							disabled={!controller.input.trim()}
						>
							{"Valitse"}
						</Button>
					</form>
				</>
		}
	</Container>
}