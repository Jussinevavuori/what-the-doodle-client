import "./TitleChooser.scss";
import React from "react";
import cx from "classnames";
import { useTitleChooserController } from "./useTitleChooserController";
import { IconButton } from "@material-ui/core";
import { Done as DoneIcon } from "@material-ui/icons";

export type TitleChooserProps = {

};

export function TitleChooser(props: TitleChooserProps) {

	const controller = useTitleChooserController(props)

	return <div className={cx("TitleChooser")}>
		<main>
			{
				controller.chosenTitle
					? <>
						<div className="loading">
							<p>You are drawing:</p>
							<h1>{controller.chosenTitle}</h1>
							<span>Waiting for other players to choose...</span>
						</div>
					</>
					: <>
						<p>Choose an option</p>
						<ul>
							{
								controller.options.map((op, i) => (
									<li key={i}>
										<span>
											{op}
										</span>
										<IconButton
											onClick={controller.onSelectOption(op)}
										>
											<DoneIcon />
										</IconButton>
									</li>
								))
							}
						</ul>


						<ul>
							<li>
								<form
									onSubmit={e => { e.preventDefault(); controller.onSubmitInput(); }}
								>
									<textarea
										placeholder="Or come up with your own"
										rows={5}
										value={controller.input}
										onChange={e => controller.setInput(e.target.value)}
									/>
									<IconButton
										type="submit"
										disabled={!controller.input.trim()}
									>
										<DoneIcon />
									</IconButton>
								</form>
							</li>
						</ul>
					</>
			}
		</main>
	</div>
}